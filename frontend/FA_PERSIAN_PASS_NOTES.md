# Aramti — Persian UI Pass

This pass is intentionally scoped to the Persian/RTL experience. It does not redesign the mobile/responsive system and does not change the English copy/layout.

Main changes:
- Completed missing Persian locale keys to prevent English fallback in About, Contact and Portfolio.
- Kept ABOUT / CONTACT / PORTFOLIO background words in English as visual branding.
- Stabilized Persian accent-title ordering with explicit RTL inline title groups.
- Corrected Persian Home title accents: Technology, Services, Why, Customers and Innovation.
- Cleaned Persian Home copy, CTA copy, map/review copy and service descriptions.
- Preserved the working LTR scroll rail for Highlights while keeping Persian card copy RTL.
- Improved Persian Why Us stats ordering and CTA arrow direction.
- Reworked About Persian layout overrides so text/illustration rows match the intended RTL composition.
- Added complete Persian About achievements and Years/Timeline copy to remove English fallbacks.
- Kept Team members generic in Persian where the mock data does not provide verified names/roles.
- Kept Portfolio filters logical in Persian by showing only categories that currently have portfolio data.
- Completed all Persian Portfolio filter labels and project copy.
- Completed Persian Contact subtitle/form copy and kept the extended service options requested for the project.
- Kept Contact location text as Iran, Hamadan while linking to coordinates 34.7830127, 48.5053756.
- Corrected Footer email/phone hrefs to use the shared siteContact source.

Validation performed:
- All JS/JSX files parsed successfully with the TypeScript compiler in no-emit mode.
- All locale JSON files parse successfully.
- index.css, rtl.css and mobile.css parse successfully with tinycss2.
- All English locale keys have Persian equivalents.
- A full Vite build could not be executed in this Linux environment because the uploaded node_modules contains Windows Rollup native dependencies. This is an environment/dependency mismatch, not a source parse error.
