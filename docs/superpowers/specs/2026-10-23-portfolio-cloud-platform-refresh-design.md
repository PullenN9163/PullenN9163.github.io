# Portfolio Data & Cloud Platform Refresh — Design

## Intent

Refresh Nasir Pullen's GitHub Pages portfolio so a hiring manager sees a credible progression from data analysis into data and cloud platform engineering. The portfolio should lead with shipped evidence: the Microsoft Fabric rebuild of the Catalog Team DataHub, the Azure-hosted ScentIQ application, backend and infrastructure ownership for the private NetaCAP platform, and workflow automation built with Make.com and Monday.com.

The primary audience is recruiters and engineering hiring managers evaluating early-career data platform, cloud platform, and Azure-oriented candidates. The site should remain understandable to non-specialists while giving technical reviewers enough concrete architecture and operational detail to trust the claims.

## Goals, Non-goals, and Constraints

### Goals

- Position Nasir as a data analyst already building production-minded data and cloud platforms, without implying a job title he does not hold.
- Make Microsoft Fabric and Azure visible above the fold and support every major skill claim with a project or professional responsibility.
- Update ScentIQ to reflect its implemented weather, calendar, planning, recommendation, layering, image, and grounded-advisor capabilities.
- Describe NetaCAP's shipped Azure and backend work accurately while protecting private product details.
- Show Make.com task coordination and Monday.com agent work as useful business automation rather than a disconnected tool list.
- Give visitors a direct GitHub repository action for every displayed project with a verified public source repository.
- Preserve a fast, accessible, responsive static site that GitHub Pages can serve without a build step.

### Non-goals

- Do not rebuild the site in React, Next.js, or another framework.
- Do not create a public NetaCAP case study, architecture diagram, repository link, or product screenshot.
- Do not publish resource names, topology details, endpoints, subscription information, business data, or other private NetaCAP implementation details.
- Do not show screenshots of the Monday.com task-coordinator agents.
- Do not claim Azure OpenAI is configured for NetaCAP; describe it only as an in-progress integration if it adds value.
- Do not replace or remove the older portfolio projects; reduce their homepage prominence while retaining the complete projects archive.

## Approaches Considered

1. **Evidence-led hybrid (selected).** Lead with a data/cloud positioning statement, prove it with the Fabric DataHub and ScentIQ, then reinforce breadth through private-platform experience and automation. This best balances career narrative, technical proof, and recruiter scanability.
2. **Project-led.** Let DataHub and ScentIQ carry nearly all of the story. This is visually clean but understates substantial NetaCAP and automation experience.
3. **Capability-led.** Organize the site around skill domains and nest projects beneath them. This shows breadth but risks reading like a résumé and weakens the case-study storytelling already present.

## Experience and Content Design

### Homepage hierarchy

1. **Hero:** Use a truthful positioning line such as “Data analyst building data and cloud platforms on Azure.” The supporting copy should connect operational data problems to governed analytics, backend services, automation, and observable Azure infrastructure. Primary CTA remains project work; secondary CTA points to contact or the full background.
2. **Proof strip:** Replace generic counters with concise evidence, for example “Microsoft Fabric platform,” “Azure application infrastructure,” and “900K+ row catalog workloads.” Avoid unverifiable time-saved or productivity numbers.
3. **Core capabilities:** Reframe the six service cards around Data Platforms, Azure Infrastructure, Backend Engineering, Analytics & BI, Workflow Automation, and Applied AI. Keep descriptions outcome-led and name only tools supported by the work described below.
4. **Featured work:** Prioritize the Fabric DataHub and ScentIQ as the first two cards. Keep one analytics project as proof of the data-analysis foundation. Add a compact private-platform experience card for NetaCAP that links to About rather than creating a case study.
5. **Automation in practice:** Add a concise section explaining Make.com scenarios for task creation and task assignment for team leads, plus a text-only mention of Monday.com task-coordinator agents. Use at most two legible Make.com workflow images if source-quality files are available; do not use Monday agent imagery.
6. **Career narrative and contact:** Update the experience summary and CTA to target data platform, cloud platform, backend, and Azure opportunities.

### Catalog Team DataHub case study

- Present the current Microsoft Fabric implementation as live: Lakehouse storage, pipelines, notebooks, dataflows, semantic models, Power BI reporting, and a published Fabric app.
- Explain the progression from spreadsheet-heavy catalog operations and the earlier Python/PostgreSQL application into a governed Fabric analytics platform.
- Separate current Fabric capabilities from earlier screenshots so images are not misrepresented. Label legacy application screenshots as the prior operational system unless current Fabric screenshots are provided.
- Describe business outcomes qualitatively—centralized ingestion, repeatable transformations, governed models, and team-facing reporting—without inventing adoption or time-saved metrics.

### ScentIQ case study

- Use the public repository at `https://github.com/PullenN9163/scentiq`—especially its README, architecture documents, runbooks, infrastructure modules, and current application code—as the implementation source of truth.
- Replace the obsolete “preview” section with the current implemented state from the repository.
- Describe the Next.js/FastAPI/PostgreSQL architecture, authenticated ownership model, explicit migrations, OpenAPI contract checks, and private API boundary.
- Add the live intelligence capabilities: Open-Meteo forecast, Google/Outlook calendar context, persisted daily and weekly wear planning, recommendation scoring and feedback, goal-aware layering stacks, custom fragrance images, and streamed tool-grounded advice through Azure OpenAI with deterministic fallback.
- Expand the Azure proof: Container Apps, Container Registry, PostgreSQL Flexible Server, Key Vault, Blob Storage, managed identity, Bicep, GitHub Actions OIDC, Application Insights, Log Analytics/alerting, migration jobs, smoke tests, and rollback/recovery practices.
- Keep notification delivery explicitly future work. Use existing screenshots only where their captions remain accurate; refresh screenshots later only if an authenticated, non-sensitive capture path is available.

### NetaCAP experience treatment

- Keep the official Neta Scientific role title accurate, then add a clearly worded responsibility: infrastructure and backend engineer for NetaCAP, a private internal asset-management platform.
- State that the deployed platform uses API Management, Container Apps and Container App Jobs, Container Registry, PostgreSQL Flexible Server, Service Bus, Functions, Static Web Apps, Storage, Key Vault, and managed identities.
- Describe operational ownership through Application Insights, Log Analytics, action groups, and log-search alerts for readiness, database failures, latency, and server errors.
- Describe backend contributions at the capability level: governed API access, containerized services, asynchronous processing, persistence, secretless resource access, deployment infrastructure, and observability. Do not infer or expose request flows or internal topology.
- List Azure AI Language as configured. Either omit Azure OpenAI from NetaCAP or label it “integration in progress”; never group it with deployed services.

### Skills and About pages

- Replace the current long tag wall with grouped, evidence-linked categories: Microsoft Fabric & Analytics, Azure Platform & Infrastructure, Backend & Data Engineering, Automation & Agents, Applied AI, and Delivery & Operations.
- Add Fabric, Lakehouse, pipelines, notebooks, dataflows, semantic models, Power BI apps, API Management, Container Apps/Jobs, Service Bus, Functions, Static Web Apps, managed identities, Key Vault, Azure Monitor/Application Insights, Log Analytics, Bicep, and GitHub Actions OIDC.
- Add Make.com, Monday.com workflow automation, Monday task-coordinator agents, custom GPTs, and Copilot Studio. Avoid claiming production impact that has not been quantified.
- Keep certifications and foundational analytics/database skills visible but subordinate to the evidence-led skill groups.

### Public repository actions

- Add a clearly labeled “View GitHub repository” action to every project card and case-study page that has a verified matching public repository. Open external repositories in a new tab with `rel="noopener"`, an accessible label, and a GitHub icon where the existing icon set supports it.
- Use these verified mappings: ScentIQ → `https://github.com/PullenN9163/scentiq`; Dragon Insight → `https://github.com/PullenN9163/senior_design`; YouTube Viral Video Prediction → `https://github.com/PullenN9163/Youtube-Trending-Data-Analysis`.
- Do not render disabled, placeholder, profile-level, or guessed repository buttons for the DataHub, Drexel Personality System, eBay analysis, enterprise network, ICS pipeline, or NBA dashboard.
- Do not add Satisfactory Manager as a new portfolio project as part of this refresh; it is a public repository but has no current case study and is outside the requested existing-project link update.

## Visual and Interaction Design

- Preserve the existing dark Noxfolio-derived identity, typography, navigation, animation system, and static HTML architecture.
- Improve hierarchy with a cloud/data accent treatment, compact proof cards, clearer section labels, and consistent architecture/skill badges rather than a wholesale visual rewrite.
- Add small “Live,” “Private,” or “In progress” status labels where they prevent ambiguity.
- Optimize images with descriptive filenames, useful alt text, lazy loading below the fold, and responsive sizing. Workflow screenshots must be cropped to remove excess whitespace and must not expose board names, people, IDs, or private data.
- Maintain keyboard navigation, visible focus states, semantic headings, reduced-motion behavior, mobile layouts, and sufficient color contrast.
- Update page metadata and social descriptions to match the new data/cloud positioning.

## Implementation Boundaries

- Continue editing plain HTML/CSS/JavaScript with no new runtime dependencies or build system.
- Update shared language consistently across the homepage, About, Projects listing, DataHub case study, ScentIQ case study, footer, and metadata.
- Add only narrowly scoped CSS components for proof cards, status labels, and automation presentation; reuse existing grid and card patterns.
- Store any approved Make.com images under `assets/images/automation/`. If source image files are unavailable, ship the automation section without screenshots rather than fabricating them.
- Preserve all existing URLs and navigation so external links remain valid.
- Keep repository mappings explicit in the HTML; do not add client-side repository discovery or GitHub API calls.

## Validation and Acceptance Criteria

- A recruiter can identify the target direction, strongest Fabric project, strongest Azure project, and current professional role within the first homepage screen and first featured-project row.
- DataHub copy clearly says the named Fabric components are live and distinguishes them from the legacy system shown in older images.
- ScentIQ no longer labels implemented capabilities as previews and matches the current repository documentation.
- NetaCAP appears only as private professional experience; no private resource names or topology details appear anywhere.
- Azure OpenAI is not represented as deployed for NetaCAP.
- Monday agents are text-only; Make.com imagery, if included, is readable, redacted, and accessible.
- Every page remains usable at desktop, tablet, and narrow mobile widths; navigation, links, animations, focus states, and reduced-motion behavior work.
- HTML has no broken internal links or missing local assets, and a local HTTP preview produces no console errors attributable to the changes.
- Every rendered GitHub repository button resolves to the verified project repository, and projects without a verified public repository render no repository action.
- Metadata, visible headings, captions, and skill lists use consistent terminology.

## Decisions and Assumptions

- Selected positioning: data/cloud platform bridge rather than claiming a pure cloud-platform title.
- Selected structure: evidence-led hybrid focused redesign.
- Fabric DataHub components listed by the user are all live, including the published Fabric app.
- All named NetaCAP resources are configured except Azure OpenAI.
- NetaCAP may be named publicly, but product details remain private and it receives no standalone project page.
- No quantitative automation outcome will be stated until a verified metric is supplied.
- Existing ScentIQ repository documentation is the source of truth for implemented capabilities.
