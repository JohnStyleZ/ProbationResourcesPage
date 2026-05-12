# Probation Resources Page

This version keeps the original one-page Resource Hub UI and uses GitHub as the JSON data store.

## Files

- `index.html` - full website and built-in admin panel
- `resources.json` - resource database
- `api/updateResources.js` - Vercel backend function that updates `resources.json` in GitHub

## Vercel Environment Variables

Add these in Vercel Project Settings → Environment Variables:

```txt
GITHUB_TOKEN=github_pat_your_token_here
GITHUB_OWNER=JohnStyleZ
GITHUB_REPO=ProbationResourcesPage
GITHUB_BRANCH=main
```

Optional:

```txt
GITHUB_JSON_PATH=resources.json
```

The GitHub token needs repository Contents permission: Read and Write.

## How it works

1. The website loads data from:

```txt
https://raw.githubusercontent.com/JohnStyleZ/ProbationResourcesPage/refs/heads/main/resources.json
```

2. The Admin button opens the built-in admin panel.
3. Save or Delete sends the full updated resource array to `/api/updateResources`.
4. The backend function commits the updated `resources.json` back to GitHub.

## Admin code

The current admin code inside `index.html` is:

```txt
FUTURE2025
```

You can change it by editing:

```js
const ADMIN_CODE = 'FUTURE2025';
```
