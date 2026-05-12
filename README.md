# Secure Admin With Original Modal

This version keeps the original in-page admin modal design.

## Behavior

- Admin code is not hardcoded in index.html.
- The Admin button checks /api/login.
- The password is stored only in a JavaScript variable while the modal is open.
- Closing the admin modal clears the login, so the next Admin click asks again.
- Saving sends the password to /api/updateResources for backend validation.

## Vercel Environment Variables

ADMIN_PASSWORD=your_admin_code_here
GITHUB_TOKEN=your_github_token_here
GITHUB_OWNER=JohnStyleZ
GITHUB_REPO=ProbationResourcesPage
GITHUB_BRANCH=main
GITHUB_JSON_PATH=resources.json

Redeploy after changing environment variables.
