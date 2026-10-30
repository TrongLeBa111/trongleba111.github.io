# Lê Bá Trọng — Portfolio

> **Data goes in. Insights come out.**
> Live: <https://trongleba111.github.io/>

Personal portfolio of **Lê Bá Trọng**, Business Information Management student at UEL – VNU-HCM (GPA 8.34/10, Digital Business & AI).
Open to data, analytics, AI and business-analysis internships and entry-level roles in Ho Chi Minh City.

## Why this site is different: one portfolio, six "tracks"

Recruiters hire for different roles, so the whole page re-tunes itself to the role they care about.
Pick **DA · DE · BA · AI Eng · Marketing · E-commerce** in the navbar and the site will:

- re-rank the project cards (cards glide to their new position),
- swap the "lens" text on every project and the About intro,
- highlight matching skills and the matching **Mission Results** cards,
- morph the accent color and "decode" the headline verb (Insights → Pipelines → Solutions…),
- point the hero **DOWNLOAD_CV** button at the CV written for that role.

### Send a tailored link to each employer

The URL remembers the track and can greet the company by name:

| Application | Link |
| --- | --- |
| Boston Consulting Group — Business Analyst Intern | `https://trongleba111.github.io/?track=BA&for=BCG` |
| Ogilvy One — Digital & Experience Intern | `https://trongleba111.github.io/?track=MKT&for=Ogilvy%20One` |
| Silicon Stack — IT Business Analyst Intern | `https://trongleba111.github.io/?track=BA&for=Silicon%20Stack` |
| PHS — Business Analyst Intern (Company Secretariat) | `https://trongleba111.github.io/?track=BA&for=PHS` |
| Data Engineering roles | `https://trongleba111.github.io/?track=DE` |

`?track=` accepts `DA`, `DE`, `BA`, `AI`, `MKT`, `ECO`. `?for=` accepts letters, digits, spaces, `&`, `.` and `-` (max 28 characters) and is shown in the hero tag as `// FOR: <NAME>`.
Clicking a track pill also rewrites the address bar, so you can copy the link straight from the browser.

## Features

| Area | What it does |
| --- | --- |
| Boot screen | 1.5-second terminal intro, once per browser session. Click or press any key to skip. Skipped for deep links (`#projects`) and reduced-motion visitors. |
| Scroll progress | Thin bar at the top, tinted with the current track color. |
| Ambient background | Light canvas "data network" that reacts to the cursor and takes the track color. Pauses when the tab is hidden, fewer nodes on phones. |
| Section transitions | Divider lines grow outward and the label types itself (`[ ACCESSING DOSSIER ]`). Grids of cards and chips enter with a stagger. |
| Hero | Rotating gradient ring, 3D tilt of the avatar, count-up numbers (650k+, 99k+, 0.738, 8.34). |
| Cards | Cursor spotlight on project and impact cards. |
| Mission Results | Six headline numbers with one-line proof, the 30-second version for recruiters. Cards light up for the active track. |
| Contact | One-click **COPY** for the email (mail clients are often not configured), CV for every track plus extra role CVs (Automation & Reporting, E-commerce, Business & E-commerce Project, Supply Chain, Business Analysis), floating **OPEN FOR HIRE** pill after the hero. |
| Link previews | Open Graph / Twitter card with `og-image.png` (1200×630), canonical URL, favicon and `schema.org/Person` JSON-LD so searches for "Lê Bá Trọng" show a clean card. |
| Accessibility | `prefers-reduced-motion` turns every animation, the boot screen and the canvas off and never hides content. Decorative layers are `aria-hidden`. |

## Project structure

```
.
├── index.html            # content + base styles + track logic (original, single file)
├── assets/
│   ├── fx.css            # animation layer (loaded after index.html styles)
│   └── fx.js             # animation layer; tune the CONFIG block at the top
├── image/
│   ├── avt.jpg
│   └── CV/{DA,DE,BA,AI,MKT}/…pdf     # one CV per track
├── avt.jpg               # used by the share card / JSON-LD
├── og-image.png          # 1200×630 social preview
└── README.md
```

## Customizing

- **Turn an effect off:** edit `CONFIG` at the top of `assets/fx.js` (`boot`, `particles`, `tilt`, `spotlight`, `scramble`, `countUp`, `flip`, `hirePill` are all booleans).
- **Boot text:** `CONFIG.bootLines` in `assets/fx.js`.
- **Add or change a headline number:** edit the `.impact-card` blocks in `index.html` (section `#impact`). `data-tracks` decides which tracks light the card.
- **Map a track to a different CV:** edit `CV_MAP` in `assets/fx.js`.
- **Add a project:** copy a `.project-card`, set `data-rank-da / de / ba / ai / mkt / eco` (1 = shown first and marked "Prominent" for that track) and add one `.project-angle` per track.
- **Colors:** track colors are the `[data-track="…"]` variables near the top of `index.html`.

## Run locally

No build step.

```bash
python -m http.server 8000
# open http://localhost:8000
```

Deploy = push to `main`; GitHub Pages serves it.

## Checklist: things that raise the hit rate and only you can add

- [ ] A 60–90 second intro video (or an audio intro) near the hero. Recruiters remember a voice.
- [ ] One short quote from a mentor or lecturer (ShopBack practicum, Dongtay Promotion, UEL) under **Field Work**.
- [ ] One case study per top project: problem → approach → result → what you would do next. Link it from the card.
- [ ] A live demo link on every project that has one (THỔ Studio already has one).
- [ ] The same photo, tagline and handle on LinkedIn, GitHub and this site. The share card uses the same look, so use `og-image.png` as the LinkedIn banner base.
- [ ] Pin your 4–6 best repos on GitHub and give each a README with a screenshot and the headline number.

## Consistency to keep (recruiters cross-check)

- GPA, graduation date, GitHub handle and LinkedIn URL should be identical on the site and on every CV.
- The hero says "Available from December 2026 (full-time)". Make sure it matches the start dates you give in applications.

## Credits

Design and code by Lê Bá Trọng. Fonts: Space Grotesk and Space Mono (Google Fonts).
