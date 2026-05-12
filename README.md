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
