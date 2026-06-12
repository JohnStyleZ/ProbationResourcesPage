# Setup Guide: Alameda County Probation Resource Hub

This guide explains how to deploy and maintain the Resource Hub using GitHub and Vercel.

The instructions intentionally use placeholder values. Replace placeholders with your own organization, repository, and deployment settings inside Vercel only.

## 1. Requirements

You need:

- A GitHub repository for this project
- A Vercel account connected to that repository
- Permission to create GitHub fine-grained personal access tokens or an organization-approved equivalent
- Permission to add Vercel Environment Variables

## 2. Upload the Project to GitHub

1. Create a new GitHub repository.
2. Upload the project files:

```text
index.html
styles.css
resources.json
translations.js
assets/
api/
README.md
SETUP.md
OFFLINE_WIKI.html
```

3. Confirm `resources.json` is in the repository.
4. Confirm the `api` folder contains:

```text
api/login.js
api/resources.js
api/updateResources.js
```

## 3. Create a GitHub Token

Create a GitHub token that can read and write the repository contents.

Recommended token scope:

```text
Repository access: selected repository only
Contents: Read and Write
Metadata: Read
```

Copy the token once. Do not paste it into the source code.

## 4. Connect the Repository to Vercel

1. Go to Vercel.
2. Create a new project.
3. Import the GitHub repository.
4. Keep the project as a static frontend with serverless API routes.
5. Deploy once after adding the environment variables below.

## 5. Add Vercel Environment Variables

In Vercel, open the project settings and add these environment variables.

| Name | Value |
|---|---|
| `ADMIN_PASSWORD` | `<admin_password>` |
| `GITHUB_TOKEN` | `<github_personal_access_token>` |
| `GITHUB_OWNER` | `<github_owner_or_org>` |
| `GITHUB_REPO` | `<repository_name>` |
| `GITHUB_BRANCH` | `main` |
| `GITHUB_JSON_PATH` | `resources.json` |

Example format:

```env
ADMIN_PASSWORD=<admin_password>
GITHUB_TOKEN=<github_personal_access_token>
GITHUB_OWNER=<github_owner_or_org>
GITHUB_REPO=<repository_name>
GITHUB_BRANCH=main
GITHUB_JSON_PATH=resources.json
```

Important: do not put real values in this file before sharing it.

## 6. Redeploy After Setting Environment Variables

After saving environment variables:

1. Go to Vercel Deployments.
2. Redeploy the latest deployment.
3. Wait for deployment to complete.
4. Open the live site.

## 7. Test the Public Site

Check the following:

- Homepage loads correctly
- Search works
- Category filters work
- Layout buttons work
- Smart Match opens and returns results
- Mobile view does not scroll sideways
- Footer and header display correctly

## 8. Open the Hidden Admin Panel

The public Admin button is hidden. Use one of these triggers:

### Desktop

```text
Ctrl + Shift + A
```

### URL

```text
https://your-domain.com/?admin=1
```

### Mobile / Touch

```text
Tap the lower-right corner five times within three seconds.
```

After the trigger, enter the admin password stored in `ADMIN_PASSWORD`.

## 9. Test Admin Save

1. Open the hidden admin panel.
2. Log in with the admin password.
3. Make a small test edit to a resource.
4. Click save.
5. Confirm the update appears in GitHub inside `resources.json`.
6. Refresh the deployed site and confirm the update still appears.

## 10. Resource JSON Format

Each resource record should generally follow this structure:

```json
{
  "name": "Example Resource Name",
  "category": "Education",
  "description": "Short public-facing description.",
  "ages": "Youth / Families",
  "contact": "Phone or email",
  "address": "Street address or service area",
  "url": "https://example.org",
  "tags": ["tag one", "tag two"],
  "source": "Community Partner"
}
```

Keep records consistent so search, filters, layouts, and Smart Match continue to work.

## 11. Troubleshooting

### Admin login says password is not configured

Check that `ADMIN_PASSWORD` exists in Vercel and redeploy the site.

### Resources do not load from GitHub

Check:

- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH`
- `GITHUB_JSON_PATH`
- `GITHUB_TOKEN`

Also confirm the token has repository contents permission.

### Save fails in the admin panel

Check:

- Token has contents read/write permission
- Token has not expired
- Repository name is correct
- Branch name is correct
- `resources.json` path is correct
- Vercel was redeployed after env changes

### Changes save but disappear after refresh

This usually means the browser is showing cached local data or the API is not reading the same GitHub file that the admin API is writing to. Confirm both `/api/resources` and `/api/updateResources` use the same environment variables.

### Mobile layout scrolls sideways

Check recent custom CSS changes, especially fixed widths, wide tables, long unwrapped text, and inline styles. The provided stylesheet includes mobile overrides for alternate layouts.

## 12. Safe Maintenance Workflow

Recommended update process:

1. Export or back up `resources.json`.
2. Make resource edits through the admin panel.
3. Save changes.
4. Verify GitHub updated.
5. Verify the live site updated.
6. Keep a copy of the previous JSON if major edits were made.

## 13. Backup and Recovery

Because `resources.json` is stored in GitHub, previous versions can be recovered from Git commit history.

To recover:

1. Open the repository on GitHub.
2. Open `resources.json`.
3. View file history.
4. Restore a previous version if needed.
5. Redeploy or refresh the live site.

## 14. Security Checklist

- [ ] No token in source code
- [ ] No password in source code
- [ ] No personal GitHub username in documentation
- [ ] No personal email in documentation
- [ ] Vercel env vars configured
- [ ] GitHub token limited to the correct repository
- [ ] Token expiration tracked
- [ ] Admin password shared only with authorized staff
