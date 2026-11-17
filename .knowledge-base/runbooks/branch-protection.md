# Branch protection, dependency alerts and code scanning

Applies to `master` and `development`. The settings live in GitHub, not in git, so this file is the record and the
way to reproduce them. Everything here needs repository admin rights.

## Model

CI checks are the gate on both branches. Administrators are **not** enforced, because the release flow fast-forwards
`development` to `master` with a direct push after each `development` → `master` PR merges, and that commit's checks
never ran under the `development` check names.

- `master`: pull request required with 1 approval (dismissed when stale), conversations must be resolved, required
  checks below. The admin merges their own PRs by bypassing.
- `development`: no pull request requirement, required checks below.
- Both: no force pushes, no deletions.

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

GitHub only lists a check in its UI picker once it has run, but the API accepts any context name. `PUT` replaces the
whole protection object, so these are the complete desired states.

```sh
R=repos/BradNut/personal-website-sveltekit/branches
checks='"Lint (Biome)","Dependency audit (production)","Typecheck (svelte-check)","Unit tests (Vitest)","CodeQL (javascript-typescript)","CodeQL (actions)"'

gh api -X PUT "$R/master/protection" --input - <<JSON
{
  "required_status_checks": {"strict": false, "contexts": [$checks, "E2E (all browsers)"]},
  "enforce_admins": false,
  "required_pull_request_reviews": {"required_approving_review_count": 1, "dismiss_stale_reviews": true},
  "restrictions": null,
  "required_conversation_resolution": true,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON

gh api -X PUT "$R/development/protection" --input - <<JSON
{
  "required_status_checks": {"strict": false, "contexts": [$checks, "E2E (chromium)"]},
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
```

Verify:

```sh
for branch in master development; do
  gh api "repos/BradNut/personal-website-sveltekit/branches/$branch/protection" \
    --jq '{checks: .required_status_checks.contexts, approvals: .required_pull_request_reviews.required_approving_review_count, admins: .enforce_admins.enabled, conversations: .required_conversation_resolution.enabled}'
done
```

## Dependabot

**Dependabot alerts** and **Dependabot security updates** are on (Settings → Code security, or `gh api -X PUT repos/BradNut/personal-website-sveltekit/vulnerability-alerts` and `.../automated-security-fixes`). `.github/dependabot.yml`
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
`auditConfig.ignoreGhsas` with a comment giving the reason. Currently ignored:

| GHSA | Package | Why it's not exploitable | Remove when |
|---|---|---|---|
| `GHSA-fc5q-39xc-vjpf` | picomatch <=4.0.7 (ReDoS) | Reached only through vite (build tooling); the built server never imports it and no code compiles untrusted globs | picomatch ships a patched release |
