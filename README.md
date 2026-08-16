# flyskyway.com

The Skyway Aviation marketing site. Static HTML, CSS, and JavaScript with no
build step and no dependencies.

Skyway sells exclusively through aviation brokers, so the site has no contact
form, phone number, or email address anywhere. Every call to action points to
**CALL YOUR BROKER**. Please keep it that way.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | The entire site (single page) |
| `styles.css` | All styling, including the 404 page |
| `script.js` | Mobile menu and scroll reveals |
| `404.html` | Not-found page |
| `assets/` | Logo, icons, share image |
| `CNAME` | Custom domain for GitHub Pages |
| `.github/workflows/deploy.yml` | Publishes `main` to GitHub Pages |

## Run it locally

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

## How it deploys

Every push to `main` runs the deploy workflow, which publishes the repository
root to GitHub Pages. There is nothing to build.

## Going live on flyskyway.com

The domain currently serves a WordPress site at GoDaddy, so this is a cutover.
Three steps, in order.

### 1. Merge to `main`

The workflow only runs on `main`. Merging triggers the first deploy.

### 2. Check GitHub Pages

The workflow enables Pages itself on the first run and picks up the custom
domain from `CNAME`. Afterwards, confirm in **Settings → Pages** that the
source is **GitHub Actions** and the custom domain is `flyskyway.com`, then
tick **Enforce HTTPS** once the certificate is issued (this can take a few
minutes).

If the first run fails because it could not enable Pages, set **Source** to
**GitHub Actions** manually and re-run the workflow.

### 3. Point DNS at GitHub

DNS is managed at GoDaddy (`ns69/ns70.domaincontrol.com`). In the DNS panel,
replace the existing `A` record for `@` with these four:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

The `www` record is already a `CNAME` to `flyskyway.com`, so it needs no change
and will redirect to the apex automatically.

> **Do not delete anything else.** The domain carries live `MX` and `TXT`
> records for email and for Microsoft, Google, Slack, and Apple domain
> verification. Removing them will break company email and those integrations.
> Only the apex `A` record changes.

Propagation is usually quick but can take up to a few hours. Verify with:

```bash
dig +short A flyskyway.com
curl -sI https://flyskyway.com | head -1
```

### Before you cut over

The existing WordPress site is replaced by this one, so first confirm nothing
still in use lives on it — landing pages, tracking scripts, or files linked
from elsewhere. Keep a backup of the WordPress site until the new site has been
live for a while, and cancel the old hosting only after that.

## Alternatives

Any static host works, since the site is plain files. On Vercel, Netlify, or
Cloudflare Pages, connect the repo, set the output directory to the repository
root, add `flyskyway.com` as a custom domain, and follow that provider's DNS
instructions instead of step 3.

## Editing content

Text lives directly in `index.html`. The things most likely to change:

- **Service area** — the coverage list in the `#network` section.
- **AOG coverage** — the terms in the `#aog` section, currently *up to 50% of
  the trip total toward a recovery option*.
- **Fleet** — the aircraft and specs in the `#fleet` section.

### Fleet photos

`assets/fleet/` currently holds Creative Commons photos of each type from
Wikimedia Commons, credited beneath the fleet list. They are stock images of
the aircraft *type*, not Skyway aircraft.

Replacing them with photos of your own tails would be a clear improvement. To
swap one in, crop it to 16:9, save it over the matching file in
`assets/fleet/`, and delete that aircraft's entry from the photo credit line at
the bottom of the fleet section. Once all three are your own, remove the credit
paragraph entirely.

The published performance figures come from Textron, Bombardier, and industry
spec sheets, and are manufacturer maximums. Seating counts are shown as ranges
because configuration varies by tail — worth checking against your actual
aircraft.

The coverage map is a pre-generated Albers projection of the service area,
stored as an SVG symbol near the top of `index.html` and reused in both the
hero and coverage sections.
