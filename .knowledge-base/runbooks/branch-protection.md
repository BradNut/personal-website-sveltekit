# Branch protection, dependency alerts and code scanning

Applies to `master` and `development`. The settings live in GitHub, not in git, so this file is the record and the
way to reproduce them. Everything here needs repository admin rights.

## Model

A solo maintainer merges their own pull requests, so the CI checks are the gate, not a reviewer. Both branches
require a pull request and the checks below to pass, **administrators included**, with 0 required approvals. To add a
reviewer later, set `required_approving_review_count` to 1 and re-run the command below.

## Required checks

Matched by job name, so renaming a job in a workflow silently removes it from the gate. Update this list and the
branch rules together.

| Job name | Workflow | Branch |
| --- | --- | --- |
| `Lint (Biome)` | `ci.yml` | both |
| `Dependency audit (production)` | `ci.yml` | both |
| `Typecheck (svelte-check)` | `ci.yml` | both |
| `Unit tests (Vitest)` | `ci.yml` | both |
| `E2E (chromium)` | `ci.yml` | `development` |
| `E2E (all browsers)` | `ci.yml` | `master` |
| `CodeQL (javascript-typescript)` | `codeql.yml` | both |
| `CodeQL (actions)` | `codeql.yml` | both |

The E2E job is named after its scope: PRs into `development` run Chromium only, PRs into `master` run every browser,
so each branch requires a different E2E context. Fallow is advisory (`fail-on-issues: false`) and not required.
`ci.yml` has no `paths-ignore` on `pull_request`: a required check that never runs would leave a docs-only PR
unmergeable.

## Apply

Run after the workflows have merged and each job has run once (GitHub only accepts a required check it has seen).
`PUT` replaces the whole protection object, so this is the complete desired state.

```sh
for branch in master development; do
  if [ "$branch" = master ]; then e2e='E2E (all browsers)'; else e2e='E2E (chromium)'; fi
  gh api -X PUT "repos/BradNut/personal-website-sveltekit/branches/$branch/protection" --input - <<JSON
{
  "required_status_checks": {
    "strict": false,
    "contexts": [
      "Lint (Biome)",
      "Dependency audit (production)",
      "Typecheck (svelte-check)",
      "Unit tests (Vitest)",
      "$e2e",
      "CodeQL (javascript-typescript)",
      "CodeQL (actions)"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 0,
    "dismiss_stale_reviews": true
  },
  "restrictions": null
}
JSON
done
```

Verify:

```sh
for branch in master development; do
  gh api "repos/BradNut/personal-website-sveltekit/branches/$branch/protection" \
    --jq '{checks: .required_status_checks.contexts, approvals: .required_pull_request_reviews.required_approving_review_count, admins: .enforce_admins.enabled}'
done
```

## Dependabot

In Settings → Code security, turn on **Dependabot alerts** and **Dependabot security updates**. `.github/dependabot.yml`
sets the npm entry to `target-branch: development` with `open-pull-requests-limit: 0`, so only security updates open
PRs and they land on `development`. The github-actions entry keeps the SHA pins current with a weekly grouped PR.
Default code-scanning setup stays **off**: `codeql.yml` replaces it.

## Pinned references

`pnpm check:pinned-refs` (CI lint job and pre-commit) fails on an action not pinned to a full commit SHA with a
`# vX.Y.Z` comment, and on a compose or Dockerfile image that is untagged, `latest` or major-only. Bump a pinned image
by editing its tag in `docker-compose.yaml`.

## Production advisories

`pnpm audit --prod --audit-level=high` runs in CI and fails on any high or critical advisory. Prefer a fix (a bump or
an `overrides` entry in `pnpm-workspace.yaml`) over ignoring it. If a high is judged not exploitable here, record it in
`auditConfig.ignoreGhsas` with a comment giving the reason. At the time of writing `pnpm audit --prod` reports no
known vulnerabilities.
