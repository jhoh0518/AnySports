# Git Commit Convention

- On the main branch, use the application version from `package.json` as the commit subject only when that version is new compared with the last version-named commit (for example, `v0.2.0`).
- For commits on side branches, or when the application version has not changed, use a concise conventional subject such as `feat: add team filters` or `fix: handle offline cache`.
- Every commit must include a body that summarizes the user-visible and technical changes in clear bullet points.
- Before committing, inspect staged changes and avoid including credentials, tokens, or generated secrets.
