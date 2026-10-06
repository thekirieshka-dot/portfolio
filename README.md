# Web design portfolio

Six hand-built websites — static HTML/CSS/JS, no build step, no dependencies to install.
Each one is shown with one page or more: from a single-screen landing to a full multi-page site.
GSAP, ScrollTrigger, SplitText, Lenis and all fonts are included in `assets/`, so it works offline.

| Project | Type |
|---|---|
| Meridian | Watch brand, scroll-driven product story, atelier, service, journal |
| Sightline | AI analytics SaaS: product demo, pricing, security, customers, changelog |
| KAIRO | Black-and-white film studio: films with case-study pages, studio, journal |
| Linea | Architecture studio: projects, studio, materials index, journal |
| SOLA | Skincare store with a working bag, ingredients, journal, about |
| Even | Aesthetic dental clinic: treatments, booking flow, team, first visit, results |

## Publish on GitHub Pages
1. Create a repository (e.g. `portfolio`) and upload **the contents of this folder** (the files must be in the repository root, next to `index.html`).
2. Repository → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
3. After a minute the site is live at `https://<your-username>.github.io/<repository>/`.
   For a root address use a repository named `<your-username>.github.io`.

All paths are relative, so it works under any sub-folder or custom domain.

## Add your name (optional)
Open `assets/config.js` and put your name between the quotes. It appears in the header and footer of the home page. There are no contact buttons or links anywhere.

## Run locally
Open `index.html` directly, or serve the folder: `python3 -m http.server 8000` and visit http://localhost:8000.

## Notes
- The six brands are fictional and the projects are concept work; the home page labels them as such. Don't present them as real client projects.
- Forms and the shop checkout are demonstrations: nothing is sent anywhere. Booking calendars use real dates but no real availability.
- The sites show no live data: no clocks, no visitor location, no "open now" or status badges. Opening hours are fixed text.
- Photography is from Unsplash (free licence) — see `CREDITS.md` / `credits.html`.
- Fonts (Google Fonts via Fontsource) are under the SIL Open Font License; GSAP is used under the GreenSock standard licence.
