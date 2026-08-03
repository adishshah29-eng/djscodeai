# DJS CodeAI — To-Do

## SEO Phase 2 — you own the accounts, I can't do these

- [ ] **Google Search Console** — add property `djscodeai.in`, verify (DNS TXT or HTML meta tag — paste the code and I'll add the meta tag), then submit `https://www.djscodeai.in/sitemap.xml`. Single most important step; without it Google is guessing at the site.
- [ ] **Bing Webmaster Tools** — import from Search Console (one click).
- [ ] **Cross-link socials back to the site** — Instagram bio, LinkedIn company page "Website" field, GitHub org description. Same brand name everywhere so Google associates them with the domain.
- [ ] **Deploy to `https://www.djscodeai.in`** — none of the SEO work helps until the site is live on the real domain. Once deployed, hit `/sitemap.xml` and `/robots.txt` to confirm they load.

## Launch blockers (functional / content, not polish)

- [ ] **Team photos** — all 17 members currently render as initials. Provide real headshots to fix the biggest visible gap on the page.
- [ ] **Wire the contact form to something real** — right now it fakes a "Sent!" toast and drops the message. Options: Formspree endpoint (~5 min setup if you create the account), Resend/SMTP via a route handler, or replace with a mailto button.
- [ ] **Real project copy + links** — 4 of 6 projects have descriptions I plausibly guessed from the live site. Need real one-liners and GitHub URLs for each.

## Nice-to-have polish

- [ ] Test the mobile hero on an actual phone (~375px) and confirm the model + text + CTAs all read well.
- [ ] Add a themed 404 page.
- [ ] Team card hover polish (desaturated → color photo reveal) — only meaningful once team photos exist.
- [ ] Optional: per-team-member and per-project pages (`/team/[slug]`, `/projects/[slug]`) so Google indexes many more pages and owns more SERP real estate. More work; only worth it if content will be kept updated.
- [ ] Optional: a blog / news section — every event recap and project write-up becomes an indexable page (long-game for domain authority).
- [ ] Optional: revisit the stacked-panel scroll effect, done properly this time (desktop-only, no opacity trick).

## Reference

- Canonical domain: `https://www.djscodeai.in`
- Live site sitemap: `https://www.djscodeai.in/sitemap.xml`
- Live site OG image: `https://www.djscodeai.in/opengraph-image`
