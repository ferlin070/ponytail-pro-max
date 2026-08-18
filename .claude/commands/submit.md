# /submit — Final pre-submission checklist

Run ALL checks before submitting to a competition.

## Steps

1. Run typecheck: `npm run typecheck`
2. Run tests: `npm test`
3. Run build: `npm run build`
4. Run size check: `npm run size`
5. Check git status for uncommitted changes
6. Verify latest commit is pushed: `git log --oneline -3`
7. Verify axe DevTools: 0 accessibility violations (mental check)
8. Verify keyboard navigation: Tab through entire app

## If ANY check fails
- STOP. Fix the issue. Re-run from step 1.
- NEVER submit with failing checks — it scores zero.

## If ALL pass
- Confirm: "✅ All checks passed. Ready to submit."
- Push if not yet pushed: `git push origin main`
