# Portfolio Data & Cloud Platform Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reframe Nasir Pullen's static portfolio around shipped Microsoft Fabric, Azure platform, backend, and automation work while updating ScentIQ and adding verified GitHub repository actions.

**Architecture:** Preserve the current no-build static HTML/CSS/JavaScript site and its existing Noxfolio-derived components. Add a small standard-library Python regression suite that validates content invariants, repository mappings, external-link safety, and local asset integrity; then update the shared portfolio narrative and two flagship case studies in independently reviewable tasks.

**Tech Stack:** Static HTML5, existing Bootstrap/custom CSS, existing JavaScript enhancements, Python 3 standard-library `unittest`

**Spec:** `docs/superpowers/specs/2026-10-23-portfolio-cloud-platform-refresh-design.md`

## Global Constraints

- Keep the site deployable directly by GitHub Pages with no build step or new runtime dependency.
- Preserve every existing page URL and navigation path.
- Keep Nasir's official title as Data Analyst; position him as building toward data/cloud platform engineering without claiming a title he does not hold.
- Treat all named Fabric DataHub components as live: Lakehouse, pipelines, notebooks, dataflows, semantic models, Power BI reporting, and the published Fabric app.
- Treat all named NetaCAP Azure services as configured except Azure OpenAI; omit Azure OpenAI from the shipped-service list or label it in progress.
- Keep NetaCAP at capability level: no private topology, resource names, endpoints, business data, screenshots, or standalone case-study page.
- Show Monday.com task-coordinator agents in text only. Do not add agent screenshots.
- Do not invent quantitative impact metrics.
- Use the ScentIQ repository at `https://github.com/PullenN9163/scentiq` as the source of truth.
- Render GitHub actions only for the three verified repositories in the spec; never render disabled or guessed repository buttons.
- Because source-quality Make.com image files are not present in the workspace, implement the automation section as text and structured visual cards; do not fabricate screenshots.

## Review Focus

- Relative links from root pages versus `projects/` pages must resolve to the same local assets and destinations; Task 1's recursive-link test covers both depths.
- External repository actions must open safely and map only to the intended project; Task 2 pins all three URLs and `target`/`rel` attributes.
- Career copy must distinguish shipped services from in-progress Azure OpenAI and must not imply NetaCAP is public; Task 3 asserts the public/private and shipped/in-progress language.
- DataHub screenshots describe the prior operational application while Fabric copy describes the live rebuild; Task 4 asserts both labels appear together.
- ScentIQ must not retain the obsolete preview claim after live feature copy is added; Task 5 asserts required live capabilities and rejects the old wording.

---

### Task 1: Static Portfolio Validation Harness

**Files:**
- Create: `tests/test_portfolio.py`
- Reference: all `*.html` files and local `assets/` paths

**Interfaces:**
- Consumes: the repository root as `Path(__file__).resolve().parents[1]`
- Produces: `python -m unittest discover -s tests -v` as the shared validation command for later tasks

- [ ] **Step 1: Write the local-link and asset integrity tests**

Create `PortfolioIntegrityTests` using `html.parser.HTMLParser` and `pathlib`. Add `test_internal_links_and_assets_resolve` to collect `href` and `src` values from every HTML file, ignore `http(s)`, `mailto:`, `tel:`, fragments, and query strings, resolve each path relative to its document, and assert the target exists. Add `test_all_images_have_nonempty_alt_text` for every `<img>` element.

- [ ] **Step 2: Run the harness against the untouched site**

Run: `python -m unittest discover -s tests -v`

Expected: PASS. If an existing defect is exposed, document it in the task review and fix only if it is required for a trustworthy baseline.

- [ ] **Step 3: Add reusable HTML assertion helpers**

Add helpers `html(path: str) -> str`, `anchors(path: str) -> list[dict[str, str]]`, and `assert_external_action(path: str, url: str, label: str) -> None`. The last helper must assert the exact URL, visible/accessible label, `target="_blank"`, and a `rel` value containing `noopener`.

- [ ] **Step 4: Re-run the baseline suite**

Run: `python -m unittest discover -s tests -v`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tests/test_portfolio.py
git commit -m "test: add static portfolio integrity checks"
```

### Task 2: Verified GitHub Repository Actions

**Files:**
- Modify: `index.html`
- Modify: `projects.html`
- Modify: `projects/scentiq.html`
- Modify: `projects/dragon-insight.html`
- Modify: `projects/youtube-viral-prediction.html`
- Modify: `assets/css/custom.css`
- Test: `tests/test_portfolio.py`

**Interfaces:**
- Consumes: `assert_external_action` from Task 1
- Produces: reusable `.project-actions` and `.repo-link` presentation classes and three exact repository mappings

- [ ] **Step 1: Add failing repository-action tests**

Add `RepositoryActionTests` asserting:

- ScentIQ links to `https://github.com/PullenN9163/scentiq` from `index.html`, `projects.html`, and `projects/scentiq.html`.
- Dragon Insight links to `https://github.com/PullenN9163/senior_design` from `projects.html` and `projects/dragon-insight.html`.
- YouTube Viral Video Prediction links to `https://github.com/PullenN9163/Youtube-Trending-Data-Analysis` from `projects.html` and `projects/youtube-viral-prediction.html`.
- Each action is labeled “View GitHub repository,” uses `target="_blank"`, and includes `rel="noopener"`.
- No other case-study page contains a `.repo-link` action.

- [ ] **Step 2: Confirm the tests fail for missing actions**

Run: `python -m unittest tests.test_portfolio.RepositoryActionTests -v`

Expected: FAIL because the exact repository actions are absent from one or more required pages.

- [ ] **Step 3: Add the exact repository actions**

Place a GitHub action beside the existing “View case study” action on matching cards and in the project-details sidebar on matching case studies. Use existing Font Awesome GitHub icon support, keep “View GitHub repository” available as visible or screen-reader text, and do not add actions to unmatched projects.

- [ ] **Step 4: Style paired project actions**

Add narrowly scoped `.project-actions` and `.repo-link` rules to `assets/css/custom.css`; keep actions wrapping on narrow cards, preserve existing accent/focus behavior, and avoid changing the global `.read-more` contract.

- [ ] **Step 5: Run focused and full validation**

Run: `python -m unittest tests.test_portfolio.RepositoryActionTests -v && python -m unittest discover -s tests -v`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add index.html projects.html projects/scentiq.html projects/dragon-insight.html projects/youtube-viral-prediction.html assets/css/custom.css tests/test_portfolio.py
git commit -m "feat: link public project repositories"
```

### Task 3: Homepage and About Positioning

**Files:**
- Modify: `index.html`
- Modify: `about.html`
- Modify: `assets/css/custom.css`
- Test: `tests/test_portfolio.py`

**Interfaces:**
- Consumes: existing hero, service-card, timeline, skill-group, and project-card markup; `.project-actions` from Task 2
- Produces: `.proof-strip`, `.proof-item`, `.status-label`, and `.automation-card` presentation patterns

- [ ] **Step 1: Add failing positioning and privacy tests**

Add `CareerPositioningTests` asserting:

- `index.html` contains “Data analyst building data and cloud platforms on Azure,” “Microsoft Fabric,” “NetaCAP,” “Make.com,” and “task-coordinator agents.”
- `about.html` contains “infrastructure and backend engineer,” “private internal asset-management platform,” and the configured NetaCAP service categories from the spec.
- Both pages distinguish Azure OpenAI as “in progress” if mentioned in the NetaCAP context.
- Neither page contains a NetaCAP repository link or project-page link; no URL containing `netacap` appears; and the NetaCAP experience block contains no `<img>` element.
- The homepage retains a contact action and projects action.

- [ ] **Step 2: Confirm the new narrative tests fail**

Run: `python -m unittest tests.test_portfolio.CareerPositioningTests -v`

Expected: FAIL on missing Fabric, NetaCAP, and automation language.

- [ ] **Step 3: Rewrite the homepage hierarchy**

Update metadata, hero, proof strip, About summary, six capability cards, Neta Scientific timeline summary, skill groups, featured-work ordering, automation section, contact copy, and footer descriptor. Use these capability groups: Data Platforms, Azure Infrastructure, Backend Engineering, Analytics & BI, Workflow Automation, and Applied AI. Keep DataHub first and ScentIQ second in featured work; retain one analytics project as the third public example and present NetaCAP as a private experience card linking to `about.html#resume`.

- [ ] **Step 4: Rewrite the About evidence and skill groups**

Keep “Data Analyst” as the role title. Add the NetaCAP responsibility and public-safe service list; group skills as Microsoft Fabric & Analytics, Azure Platform & Infrastructure, Backend & Data Engineering, Automation & Agents, Applied AI, and Delivery & Operations. Include Make.com, Monday task-coordinator agents, custom GPTs, and Copilot Studio without invented metrics.

- [ ] **Step 5: Add focused visual components**

Implement proof-strip, status-label, private-experience, and text-only automation-card styles in `assets/css/custom.css`. Reuse existing variables and grids, add visible `:focus-visible` treatment, wrap at tablet/mobile widths, and include no new image assets.

- [ ] **Step 6: Run focused and full validation**

Run: `python -m unittest tests.test_portfolio.CareerPositioningTests -v && python -m unittest discover -s tests -v`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add index.html about.html assets/css/custom.css tests/test_portfolio.py
git commit -m "feat: lead portfolio with data and Azure platform work"
```

### Task 4: Fabric DataHub Case Study and Project Listing

**Files:**
- Modify: `projects/catalog-team-data-hub.html`
- Modify: `projects.html`
- Modify: `index.html`
- Test: `tests/test_portfolio.py`

**Interfaces:**
- Consumes: status-label styles from Task 3
- Produces: accurate current-state Fabric case-study copy and legacy screenshot captions

- [ ] **Step 1: Add failing Fabric evidence tests**

Add `DataHubCaseStudyTests` asserting the case study contains “Microsoft Fabric,” “Lakehouse,” “pipelines,” “notebooks,” “dataflows,” “semantic models,” “Power BI,” and “Fabric app”; contains a clear “live” status; and labels the existing Python/PostgreSQL screenshots as the prior operational application. Assert the root project cards describe the Fabric rebuild and do not advertise a public repository.

- [ ] **Step 2: Confirm the Fabric tests fail**

Run: `python -m unittest tests.test_portfolio.DataHubCaseStudyTests -v`

Expected: FAIL because the case study currently describes only the earlier Python/PostgreSQL platform.

- [ ] **Step 3: Rewrite the DataHub case study**

Describe the journey from spreadsheet workflows, through the earlier operational application, to the live Fabric implementation. Cover Lakehouse storage, repeatable pipeline ingestion, notebook/dataflow transformation, semantic models, Power BI reporting, and the published Fabric app. Keep outcomes qualitative and update the Built With tags and metadata.

- [ ] **Step 4: Relabel the existing gallery**

Add an introductory gallery label and update captions/alt text so every existing application screenshot is clearly historical/legacy evidence rather than a Fabric UI screenshot. Do not create or imply Fabric screenshots.

- [ ] **Step 5: Update DataHub cards**

Align the `index.html` and `projects.html` card summaries, category, status label, and tags with the live Fabric implementation.

- [ ] **Step 6: Run focused and full validation**

Run: `python -m unittest tests.test_portfolio.DataHubCaseStudyTests -v && python -m unittest discover -s tests -v`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add projects/catalog-team-data-hub.html projects.html index.html tests/test_portfolio.py
git commit -m "feat: document live Fabric DataHub platform"
```

### Task 5: Current ScentIQ Case Study

**Files:**
- Modify: `projects/scentiq.html`
- Modify: `projects.html`
- Modify: `index.html`
- Test: `tests/test_portfolio.py`

**Interfaces:**
- Consumes: current public ScentIQ repository documentation and status-label/repository-action components from Tasks 2–3
- Produces: current ScentIQ feature, architecture, infrastructure, and operations narrative

- [ ] **Step 1: Re-verify the ScentIQ source of truth**

Read the current ScentIQ README, `docs/architecture/`, `docs/runbooks/`, `infra/`, and recent commit summary immediately before editing. Record any difference from the approved design in the task review and follow repository evidence over stale portfolio copy.

- [ ] **Step 2: Add failing ScentIQ currency tests**

Add `ScentIQCaseStudyTests` asserting the case study contains Open-Meteo, Google and Outlook calendars, persisted daily/weekly planning, recommendation scoring/feedback, goal-aware layering, custom fragrance images, Azure OpenAI grounded advice, deterministic fallback, managed identity, Bicep, OIDC, migration jobs, observability, and recovery/rollback language. Assert it identifies notification delivery as future work and does not contain “all deliberately labelled as previews” or state that live weather, calendar connections, scoring, and model calls are future milestones.

- [ ] **Step 3: Confirm the currency tests fail**

Run: `python -m unittest tests.test_portfolio.ScentIQCaseStudyTests -v`

Expected: FAIL on live features still described as previews.

- [ ] **Step 4: Rewrite the ScentIQ narrative**

Replace the preview section with implemented feature and intelligence sections. Retain the concise architecture and ownership model, expand the Azure/operations section with the services and practices evidenced by the repository, keep notification delivery future-facing, and update metadata, status, tags, image captions, and alt text only where the current screenshots support the wording.

- [ ] **Step 5: Update ScentIQ cards**

Refresh ScentIQ summaries and tags in `index.html` and `projects.html` to emphasize live planning/intelligence and production-minded Azure infrastructure while keeping the repository action from Task 2.

- [ ] **Step 6: Run focused and full validation**

Run: `python -m unittest tests.test_portfolio.ScentIQCaseStudyTests -v && python -m unittest discover -s tests -v`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add projects/scentiq.html projects.html index.html tests/test_portfolio.py
git commit -m "feat: bring ScentIQ case study up to date"
```

### Task 6: Responsive, Accessibility, and Release Verification

**Files:**
- Modify if defects are found: `assets/css/custom.css`
- Modify if defects are found: HTML files changed in Tasks 2–5
- Test: `tests/test_portfolio.py`

**Interfaces:**
- Consumes: the completed static site and shared validation suite
- Produces: release-ready GitHub Pages content with documented verification evidence

- [ ] **Step 1: Add final semantic and metadata assertions**

Add `ReleaseReadinessTests` asserting every changed page has a nonempty unique `<title>`, meta description, one `<h1>`, safe external `_blank` links, and no duplicate element IDs. Assert Monday agent terminology appears without an associated agent image and the three public repository mappings remain exact.

- [ ] **Step 2: Run the complete automated suite**

Run: `python -m unittest discover -s tests -v`

Expected: PASS with zero failures or errors.

- [ ] **Step 3: Serve the site locally**

Run: `python -m http.server 8777`

Expected: the homepage, About, Projects, DataHub, ScentIQ, Dragon Insight, and YouTube pages return HTTP 200 from `http://127.0.0.1:8777/`.

- [ ] **Step 4: Perform browser checks**

At 1440px, 768px, and 390px widths, verify hero/proof layout, menu, capability cards, repository actions, status labels, automation cards, galleries, and project navigation. Verify keyboard traversal and visible focus, no horizontal overflow, useful image alt text, reduced-motion behavior, and no new console errors.

- [ ] **Step 5: Validate outbound actions**

Open each rendered GitHub action and confirm it lands on the intended public repository. Check contact, LinkedIn, internal navigation, breadcrumbs, and project previous/next links.

- [ ] **Step 6: Run final repository checks**

Run: `git diff --check && python -m unittest discover -s tests -v && git status --short`

Expected: no whitespace errors; all tests pass; only intentional files remain modified.

- [ ] **Step 7: Commit any verification fixes**

```bash
git add assets/css/custom.css index.html about.html projects.html projects/*.html tests/test_portfolio.py
git commit -m "fix: polish portfolio accessibility and responsive layout"
```

Skip this commit when verification produces no fixes.
