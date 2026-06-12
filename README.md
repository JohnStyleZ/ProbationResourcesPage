# Alameda County Probation Resource Hub

A public-facing resource directory website for Alameda County Probation and community partners. The site displays youth, family, reentry, behavioral health, education, housing, employment, and community-based resources from a JSON data file.

This package is stakeholder-ready. Documentation uses placeholders for all deployment credentials and does not include personal GitHub usernames, emails, passwords, tokens, or Vercel account information.

## What This Site Does

- Displays resource cards from `resources.json`
- Supports search and category filtering
- Provides multiple display layouts
- Includes a Smart Match wizard to help users find resources
- Includes an admin panel for editing resources
- Saves admin changes back to GitHub through Vercel serverless API routes
- Includes responsive mobile styling
- Includes accessibility support and an accessibility toolbar

## Project Structure

```text
/
├── index.html              # Main website and admin UI
├── styles.css              # Site styling and responsive layout rules
├── resources.json          # Resource data source
├── translations.js         # Translation-related support file
├── assets/
│   └── ACPD_Logo_Color.png # Logo image
├── api/
│   ├── login.js            # Admin password verification
│   ├── resources.js        # Reads resources.json from GitHub
│   └── updateResources.js  # Writes updated resources.json to GitHub
├── README.md
├── SETUP.md
└── OFFLINE_WIKI.html
```

## Architecture

```text
User Browser
   |
   | loads index.html, styles.css, resources.json fallback
   v
Vercel Static Site
   |
   | /api/resources reads latest resources.json
   | /api/login checks admin password
   | /api/updateResources writes JSON updates
   v
GitHub Repository
   |
   v
resources.json
```

## Required Vercel Environment Variables

| Variable | Required | Example Value | Purpose |
|---|---:|---|---|
| `ADMIN_PASSWORD` | Yes | `<admin_password>` | Password used by the admin login modal |
| `GITHUB_TOKEN` | Yes | `<github_personal_access_token>` | GitHub token with contents read/write permission |
| `GITHUB_OWNER` | Yes | `<github_owner_or_org>` | GitHub username or organization that owns the repository |
| `GITHUB_REPO` | Yes | `<repository_name>` | Repository containing `resources.json` |
| `GITHUB_BRANCH` | Recommended | `main` | Branch where `resources.json` is stored |
| `GITHUB_JSON_PATH` | Recommended | `resources.json` | Path to the data file inside the repository |

Never commit real passwords, tokens, or account-specific values to GitHub. Store them only in Vercel Environment Variables.

## Hidden Admin Access

The visible Admin button is intentionally hidden from public users. The admin login modal can still be opened using these methods:

| Method | How to Open |
|---|---|
| Desktop keyboard | Press `Ctrl + Shift + A` |
| URL trigger | Open the site with `?admin=1` |
| Mobile / touch | Tap or click the lower-right corner five times within three seconds |

After the trigger is used, the normal admin login appears. The password is still verified by the backend through `ADMIN_PASSWORD`.

## Main Features

### Public Resource Directory

Users can browse, search, and filter resource listings. Each resource can include name, category, description, age range, contact details, address, tags, source, and a website URL.

### Smart Match

The Smart Match wizard asks users a set of guided questions and recommends matching resources based on the resource data.

### Multiple Layout Views

The site includes several presentation layouts, including card, list, accordion, detail/split-style, and table/grid-style views. Mobile styling has been adjusted so non-card layouts no longer force horizontal page scrolling.

### Admin Panel

Admins can add, edit, delete, import, export, and save resources. Changes are written to GitHub through the backend API instead of exposing GitHub credentials in the browser.

### Accessibility

The site includes skip-link behavior, focus-visible outlines, stronger color contrast overrides, reduced-motion support, and an accessibility toolbar.

## Data Source

The site stores resource records in `resources.json`. The browser can load a local fallback, while the deployed site can fetch the latest version through `/api/resources`.

## Security Notes

- Do not place `GITHUB_TOKEN` inside `index.html`, `styles.css`, `resources.json`, or client-side JavaScript.
- Do not hard-code the admin password in the browser.
- Keep GitHub token permissions limited to the repository and contents access required by this project.
- Rotate the token if it is ever exposed.
- Use Vercel Environment Variables for all deployment secrets.

## Recommended Handoff Checklist

- [ ] Confirm the site loads on desktop and mobile
- [ ] Confirm search and filters work
- [ ] Confirm all display layouts work on mobile
- [ ] Confirm hidden admin triggers work
- [ ] Confirm admin login works
- [ ] Confirm saving updates `resources.json` in GitHub
- [ ] Confirm no real credentials are committed to the repository
- [ ] Confirm README, SETUP, and OFFLINE_WIKI contain placeholder values only
