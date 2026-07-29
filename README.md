# Portfolio Site

A static portfolio for paintings and 3D work. No build step, no backend — plain HTML/CSS/JS.

## Structure

```
index.html          Home — intro + links into the two galleries
paintings/          Paintings gallery
3d-work/             3D work gallery
about.html          Bio / artist statement
contact.html        Links to find you (email, Instagram, ArtStation, etc.)
css/style.css       All styling
js/main.js          Mobile nav, lightbox, footer year
images/             Placeholder images — replace these with your own work
```

## Before you launch

1. **Replace every placeholder image** in `images/paintings/` and `images/3d-work/` with your own photos/renders. Keep the same filenames or update the `src` in the matching HTML file.
2. **Update the text**: your name (currently "Ari Kovac"), the bio on `about.html`, artwork titles/mediums/years in the gallery captions, and every link + email address on `contact.html`.
3. **Replace `yourdomain.com`** in `robots.txt` and the `mailto:` links with your real domain/email.
4. Optionally compress images before uploading (see Performance below) — large photos will slow the site down.

## Publishing with GitHub Pages + your domain

1. Push this folder to your GitHub repo (root of the repo, or a `docs/` folder — either works, just set it in step 2).
2. In the repo: **Settings → Pages** → set the source branch/folder → save.
3. In **Settings → Pages → Custom domain**, enter your domain and save. GitHub will create a `CNAME` file in your repo automatically — don't delete it.
4. At your domain registrar, point DNS to GitHub Pages:
   - For an apex domain (`yourdomain.com`): four `A` records pointing to GitHub's IPs (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`).
   - For a `www` subdomain: a `CNAME` record pointing to `yourusername.github.io`.
5. Once DNS propagates (can take a few hours), go back to **Settings → Pages** and check **Enforce HTTPS**.

## Security checklist

- [ ] **Enforce HTTPS** is checked in GitHub Pages settings (step 5 above) — this is the main thing that makes the site "safe" for visitors.
- [ ] No API keys, passwords, or personal documents anywhere in the repo — this is a public repo by default on GitHub Pages, so anything committed is visible to anyone.
- [ ] If you ever add a contact form, use a third-party handler (Formspree, Web3Forms) instead of your own backend — keeps you from managing servers or databases at all.
- [ ] Enable **DNSSEC** at your domain registrar if it's offered.
- [ ] Consider adding a **CAA record** at your DNS provider limiting certificate issuance to Let's Encrypt (`letsencrypt.org`), which is what GitHub Pages uses.
- [ ] Keep any real, high-resolution source files (originals, PSD/Blend files) out of the repo/images folder — only export the compressed web versions you're comfortable with people right-clicking and saving.
- [ ] Turn on two-factor authentication on your GitHub account, since it now controls a live public domain.

## Performance (optional but recommended)

- Export gallery images at roughly 1200–1600px on the long edge, JPEG quality ~80 — full-res camera/render exports will make the site slow.
- Keep file sizes under ~400KB per image where possible.
