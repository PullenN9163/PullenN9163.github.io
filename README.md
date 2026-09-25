# Nasir Pullen — Portfolio

Personal portfolio site, served as a static site from GitHub Pages at
**https://PullenN9163.github.io**

Built on the [Noxfolio](https://themeforest.net/) Envato template, converted from its original
Laravel/Blade form to plain static HTML (GitHub Pages cannot execute PHP).

## Structure

```
index.html                  Home — hero, about, what I do, experience, skills, featured projects, contact
about.html                  Full background: bio, experience detail, education, complete skill set
projects.html               All nine projects
projects/*.html             One case-study page per project
404.html                    Not-found page
assets/
  css/style.css             Template stylesheet (unmodified)
  css/custom.css            My additions — cards, timeline, skills, code blocks, contact
  js/                       Template scripts (jQuery, Bootstrap, WOW, Slick, Isotope)
  images/projects/          Project screenshots
.nojekyll                   Tells Pages to serve files as-is, no Jekyll processing
```

There is **no build step**. The `.html` files are the site — edit them directly and push.

## Adding a project

Two files:

1. Copy an existing page in `projects/` and edit the content.
2. Add a matching card to the grid in `projects.html` (and `index.html` if it should be featured).

Card markup:

```html
<div class="col-xl-4 col-md-6">
    <div class="project-card wow fadeInUp delay-0-2s">
        <a href="projects/my-project.html" class="project-card-media">
            <img src="assets/images/projects/my-project.png" alt="My Project">
        </a>
        <div class="project-card-body">
            <span class="sub-title">Category</span>
            <h4><a href="projects/my-project.html">My Project</a></h4>
            <p>One-line summary.</p>
            <div class="tech-tags"><span>Python</span><span>PostgreSQL</span></div>
            <a href="projects/my-project.html" class="read-more">View case study <i class="far fa-angle-right"></i></a>
        </div>
    </div>
</div>
```

Paths inside `projects/` are one level down, so they use `../assets/...`.

## Local preview

```bash
python -m http.server 8777
```

Then open http://127.0.0.1:8777. Opening the files directly with `file://` will work but is less
representative of how Pages serves them.

## Still to do

- **Profile photo.** The current image is a generated placeholder (`assets/images/projects/profile-placeholder.svg`).
  The photo on the Notion page is a watermarked Prestige Portraits proof and cannot be published.
  Drop in a licensed photo and update the two `<img>` references in `index.html` and `about.html`.
- **Resume PDF.** Export the Word resume to `assets/Nasir_Pullen_Resume.pdf` and link it from the hero
  if you want a download button.
- **Custom domain.** Add a `CNAME` file containing the domain, and point a DNS `CNAME` record at
  `PullenN9163.github.io`.

## Content sources

Copy is drawn from the resume, the "Meet Nas!" Notion page, and the GitHub profile. The Notion page
remains the fuller narrative version; this site is the public, structured one.
