from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import unittest


ROOT = Path(__file__).resolve().parents[1]


class DocumentParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.references: list[tuple[str, str]] = []
        self.images: list[dict[str, str]] = []
        self.anchor_stack: list[dict[str, object]] = []
        self.anchors: list[dict[str, str]] = []

    def handle_starttag(
        self, tag: str, attrs: list[tuple[str, str | None]]
    ) -> None:
        attributes = {key: value or "" for key, value in attrs}
        if tag == "a":
            self.references.append(("href", attributes.get("href", "")))
            self.anchor_stack.append({"attrs": attributes, "text": []})
        elif tag in {"img", "script"}:
            self.references.append(("src", attributes.get("src", "")))
        elif tag == "link":
            self.references.append(("href", attributes.get("href", "")))

        if tag == "img":
            self.images.append(attributes)

    def handle_data(self, data: str) -> None:
        if self.anchor_stack:
            text = self.anchor_stack[-1]["text"]
            assert isinstance(text, list)
            text.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag != "a" or not self.anchor_stack:
            return
        anchor = self.anchor_stack.pop()
        attrs = anchor["attrs"]
        text = anchor["text"]
        assert isinstance(attrs, dict)
        assert isinstance(text, list)
        attrs["text"] = " ".join("".join(text).split())
        self.anchors.append(attrs)


def parse_document(path: Path) -> DocumentParser:
    parser = DocumentParser()
    parser.feed(path.read_text(encoding="utf-8"))
    return parser


class PortfolioTestCase(unittest.TestCase):
    def html(self, path: str) -> str:
        return (ROOT / path).read_text(encoding="utf-8")

    def anchors(self, path: str) -> list[dict[str, str]]:
        return parse_document(ROOT / path).anchors

    def assert_external_action(self, path: str, url: str, label: str) -> None:
        matches = [anchor for anchor in self.anchors(path) if anchor.get("href") == url]
        self.assertEqual(len(matches), 1, f"Expected one {url} action in {path}")
        anchor = matches[0]
        accessible_text = " ".join(
            value for value in (anchor.get("text", ""), anchor.get("aria-label", "")) if value
        )
        self.assertIn(label, accessible_text)
        self.assertEqual(anchor.get("target"), "_blank")
        self.assertIn("noopener", anchor.get("rel", "").split())


class PortfolioIntegrityTests(PortfolioTestCase):
    def test_internal_links_and_assets_resolve(self) -> None:
        missing: list[str] = []
        for document in ROOT.rglob("*.html"):
            if ".git" in document.parts:
                continue
            for attribute, raw_reference in parse_document(document).references:
                reference = raw_reference.strip()
                if not reference or reference.startswith(("#", "mailto:", "tel:")):
                    continue
                parsed = urlsplit(reference)
                if parsed.scheme or parsed.netloc:
                    continue
                relative_path = unquote(parsed.path)
                if not relative_path:
                    continue
                target = ROOT / relative_path.lstrip("/") if relative_path.startswith("/") else document.parent / relative_path
                if not target.resolve().exists():
                    missing.append(
                        f"{document.relative_to(ROOT)}: {attribute}={reference!r}"
                    )
        self.assertEqual(missing, [], "Missing local references:\n" + "\n".join(missing))

    def test_all_images_have_nonempty_alt_text(self) -> None:
        missing_alt: list[str] = []
        for document in ROOT.rglob("*.html"):
            if ".git" in document.parts:
                continue
            for image in parse_document(document).images:
                if not image.get("alt", "").strip():
                    missing_alt.append(
                        f"{document.relative_to(ROOT)}: {image.get('src', '<missing src>')}"
                    )
        self.assertEqual(missing_alt, [], "Images missing alt text:\n" + "\n".join(missing_alt))


if __name__ == "__main__":
    unittest.main()
