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


class RepositoryActionTests(PortfolioTestCase):
    REPOSITORIES = {
        "projects/scentiq.html": "https://github.com/PullenN9163/scentiq",
        "projects/dragon-insight.html": "https://github.com/PullenN9163/senior_design",
        "projects/youtube-viral-prediction.html": "https://github.com/PullenN9163/Youtube-Trending-Data-Analysis",
    }

    def test_verified_repository_actions_appear_on_project_cards(self) -> None:
        self.assert_external_action(
            "index.html",
            self.REPOSITORIES["projects/scentiq.html"],
            "View GitHub repository",
        )
        for url in self.REPOSITORIES.values():
            self.assert_external_action("projects.html", url, "View GitHub repository")

    def test_verified_repository_actions_appear_on_case_studies(self) -> None:
        for page, url in self.REPOSITORIES.items():
            self.assert_external_action(page, url, "View GitHub repository")

    def test_unmatched_case_studies_have_no_repository_action(self) -> None:
        unmatched = {
            "projects/catalog-team-data-hub.html",
            "projects/drexel-personality-system.html",
            "projects/ebay-fragrance-analysis.html",
            "projects/enterprise-network-config.html",
            "projects/ics-data-pipeline.html",
            "projects/nba-player-dashboard.html",
        }
        for page in unmatched:
            repo_links = [
                anchor
                for anchor in self.anchors(page)
                if "repo-link" in anchor.get("class", "").split()
            ]
            self.assertEqual(repo_links, [], f"Unexpected repository action in {page}")


class CareerPositioningTests(PortfolioTestCase):
    def test_homepage_leads_with_data_cloud_and_automation_evidence(self) -> None:
        homepage = self.html("index.html")
        for phrase in (
            "Data analyst building data and cloud platforms on Azure",
            "Microsoft Fabric",
            "NetaCAP",
            "Make.com",
            "task-coordinator agents",
        ):
            self.assertIn(phrase, homepage)
        self.assertIn('href="projects.html"', homepage)
        self.assertIn('href="#contact"', homepage)

    def test_about_describes_private_netacap_responsibility_and_services(self) -> None:
        about = self.html("about.html")
        for phrase in (
            "infrastructure and backend engineer",
            "private internal asset-management platform",
            "API Management",
            "Container Apps",
            "Container App Jobs",
            "PostgreSQL Flexible Server",
            "Service Bus",
            "Azure Functions",
            "Static Web Apps",
            "Key Vault",
            "managed identities",
            "Application Insights",
            "Log Analytics",
        ):
            self.assertIn(phrase, about)

    def test_netacap_remains_private_and_has_no_visual_or_external_target(self) -> None:
        for page in ("index.html", "about.html"):
            parser = parse_document(ROOT / page)
            self.assertFalse(
                any("netacap" in anchor.get("href", "").lower() for anchor in parser.anchors),
                f"NetaCAP must not have an external or project link in {page}",
            )
            self.assertFalse(
                any("netacap" in image.get("src", "").lower() for image in parser.images),
                f"NetaCAP must not have an image in {page}",
            )


class DataHubCaseStudyTests(PortfolioTestCase):
    def test_case_study_documents_live_fabric_platform(self) -> None:
        case_study = self.html("projects/catalog-team-data-hub.html")
        for phrase in (
            "Microsoft Fabric",
            "Lakehouse",
            "pipelines",
            "notebooks",
            "dataflows",
            "semantic models",
            "Power BI",
            "Fabric app",
            "status-live",
        ):
            self.assertIn(phrase, case_study)

    def test_gallery_identifies_prior_operational_application(self) -> None:
        case_study = self.html("projects/catalog-team-data-hub.html").lower()
        self.assertIn("prior operational application", case_study)
        self.assertIn("legacy application gallery", case_study)

    def test_project_cards_describe_fabric_without_repository_action(self) -> None:
        for page in ("index.html", "projects.html"):
            document = self.html(page)
            self.assertIn("Microsoft Fabric", document)
            self.assertFalse(
                any(
                    "datahub" in anchor.get("href", "").lower()
                    and anchor.get("href", "").startswith("http")
                    for anchor in self.anchors(page)
                )
            )


class ScentIQCaseStudyTests(PortfolioTestCase):
    def test_case_study_documents_current_intelligence_features(self) -> None:
        case_study = self.html("projects/scentiq.html")
        for phrase in (
            "Open-Meteo",
            "Google",
            "Outlook",
            "daily and weekly planning",
            "recommendation scoring",
            "wear feedback",
            "goal-aware",
            "custom fragrance images",
            "Azure OpenAI",
            "grounded",
            "deterministic fallback",
        ):
            self.assertIn(phrase, case_study)

    def test_case_study_documents_azure_delivery_and_operations(self) -> None:
        case_study = self.html("projects/scentiq.html")
        for phrase in (
            "managed identity",
            "Bicep",
            "OIDC",
            "migration job",
            "Application Insights",
            "Log Analytics",
            "rollback",
            "recovery",
        ):
            self.assertIn(phrase, case_study)

    def test_case_study_removes_stale_preview_claims(self) -> None:
        case_study = self.html("projects/scentiq.html")
        self.assertIn("Notification delivery remains future work", case_study)
        self.assertNotIn("all deliberately labelled as previews", case_study)
        self.assertNotIn(
            "Live weather and calendar connections, recommendation scoring, and language-model agent calls are the next milestones",
            case_study,
        )


if __name__ == "__main__":
    unittest.main()
