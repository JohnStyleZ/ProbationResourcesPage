# Probation Resources Page

This version keeps the original admin modal and all original admin features:

- Resource table
- Search
- Add Resource
- Edit Resource
- Delete Resource
- Full edit form
- Risk factor checkboxes
- Population checkboxes
- Reload JSON
- Save to GitHub

The only admin change is security:

- The admin access code is no longer hardcoded in index.html.
- /api/login checks ADMIN_PASSWORD from Vercel.
- /api/updateResources also checks ADMIN_PASSWORD before writing to GitHub.
- Closing the admin modal clears the login, so Admin asks for the code again next time.

## Vercel Environment Variables

ADMIN_PASSWORD=your_admin_code_here
GITHUB_TOKEN=your_github_token_here
GITHUB_OWNER=JohnStyleZ
GITHUB_REPO=ProbationResourcesPage
GITHUB_BRANCH=main
GITHUB_JSON_PATH=resources.json

Redeploy after changing environment variables.


## Language Toggle

This version adds an English / Spanish / Chinese language toggle.

Files added:

- translations.js

The selected language is saved in localStorage.

Resource cards support translated JSON fields:

{
  "title": {
    "en": "Youth Mental Health Support",
    "es": "Apoyo de Salud Mental Juvenil",
    "zh": "青少年心理健康支援"
  },
  "desc": {
    "en": "Free counseling and crisis intervention.",
    "es": "Consejería gratuita e intervención en crisis.",
    "zh": "免費心理輔導與危機支援。"
  }
}

Old string-based title and desc values still work.


## Full Page Language Toggle

This version uses Google Website Translate so the language buttons translate the full visible page, including resource cards loaded from resources.json.

Behavior:

- EN clears translation and reloads English.
- ES translates the whole page to Spanish.
- 中文 translates the whole page to Traditional Chinese.
- The selected language is saved in localStorage.
- Page reload after selecting a language is intentional because the translation layer needs to process the full DOM.

Note:

The browser must be online and able to load Google's translate script.


## Bulk Excel Import / Export

The admin panel now includes:

- Export Excel
- Import Excel
- Find Duplicates

Duplicate detection checks:

- Same title + source
- Same title + address
- Same title + contact
- Same link

During import, possible duplicate rows are skipped before saving to GitHub.

Excel columns:

id, title, cat, catL, icon, th, ages, ageMin, ageMax, genders,
riskFactors, populations, urgency, zipcodes, desc, tags, contact,
addr, avail, link, src, srcL

Use `|` to separate multiple values in genders, riskFactors, populations, and tags.


## Auto Icon Assignment During Excel Import

If the `icon` column is empty during Excel import, the admin panel now assigns an icon automatically.

It checks category, category label, title, description, tags, risk factors, and populations.

Examples:
- mental health / counseling → 🧠
- housing / shelter → 🏠
- workforce / jobs → 💼
- education / school → 🎓
- legal / court / probation → ⚖️
- crisis / emergency → 🚨
- family / parenting → 👨‍👩‍👧
- youth / mentoring → 🌱

Fallback icon: 📌


## Accessibility Toolbar

A lightweight custom accessibility toolbar was added.

Features:

- High Contrast
- Large Text
- Reduce Motion
- Readable Font
- Underline Links
- Reset Accessibility

Preferences are saved in localStorage.

This toolbar is an enhancement and does not replace WCAG compliance work.


## Resource Display Layout Options

The admin panel now includes a Public Resource Display Layout selector.

Available layouts:

1. Original Card View
2. Compact List View
3. Expandable Accordion
4. Split Panel Directory
5. Data Grid

The selected layout is saved in localStorage and controls how the public resource results display.

There is also a small public layout toggle near the resource count for quick preview/testing.


## Layout Update

The previous Split Panel layout was changed because showing all resources in a left sidebar was not ideal for a large resource directory.

It is now a Detail + Results List layout:

- One selected resource is featured at the top
- Matching resources appear below in a compact list
- No full left-side resource sidebar


## Layout Full-Width Fix

Non-card layouts now force the browse grid container into full-width block mode.

This fixes the issue where List, Accordion, Detail, and Grid layouts appeared as a narrow column on the left because they were being placed inside the original card grid.


## Layout Persistence in JSON

The selected public display layout is now saved into `resources.json` as:

{
  "settings": {
    "displayLayout": "list"
  },
  "resources": [...]
}

The frontend remains backward compatible with the old array-only JSON format.

## Smart Match Layout Support

Smart Match results now use the same selected resource layout as Browse All:

- Original Card View
- Compact List View
- Expandable Accordion
- Detail + Results List
- Data Grid
