# Gabija Malina portfolio

Static HTML, CSS and JavaScript, published using GitHub Pages at https://gabijamalina.com/. Porkbun manages the domain.

## Local preview

From this folder run `python -m http.server 8765 --bind 127.0.0.1`, then visit http://127.0.0.1:8765/.

## Publish

Upload the site contents to the root of the existing GitHub Pages publishing source. Include CNAME, .nojekyll, robots.txt, sitemap.xml, css/, js/, images/, paintings/, 3d-work/ and lt/. Preserve the existing repository and Pages publishing settings. Do not upload work/ scratch files. Wait for the Pages deployment to finish before checking live URLs.

The CNAME must remain `gabijamalina.com`. The preferred URLs are https://gabijamalina.com/, /paintings/, /3d-work/, /momentukininke.html, /about.html and /contact.html. The index.html variants can remain accessible with canonical tags; internal English links use the preferred directory URLs.

## Sitemap maintenance

When adding or renaming images, update sitemap.xml to use files that exist and are displayed on their page. Update lastmod only after a meaningful page change. Do not include 404 pages, backups or unfinished translation pages. English pages and the existing Lithuanian exhibition remain in the current sitemap. Other Lithuanian content is outside the current English editing scope.

## Search Console after publishing

Submit https://gabijamalina.com/sitemap.xml. Inspect https://gabijamalina.com/ and important preferred HTTPS pages, use Test Live URL, then Request Indexing if needed. The HTTP and www variants should redirect to the preferred HTTPS host. Their "Page with redirect" status is expected; do not remove correct redirects to make that category disappear.

## Domain setup

Verified on 3 October 2026: the apex has GitHub Pages' four A records, and www is a CNAME to gabija-malina.github.io. HTTPS works. HTTP and www requests return 301 to https://gabijamalina.com/. No DNS change was needed.
