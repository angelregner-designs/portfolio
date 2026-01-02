# Git Workflow

## Protected Branches
- `main`, `staging`, `develop` are protected
- Before making changes, check current branch with `git branch --show-current`
- If on a protected branch, create a feature branch first: `git checkout -b feature/<name>`
- Never commit directly to protected branches

## Deployment
- Staging: PR from `develop` → `staging` (no direct push)
