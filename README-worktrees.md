## Worktrees

- I used the following command to create a branch called "experiment/understand" based on the branch "main" and put it in the location "../worktrees/experiment/understand".

```bash
git worktree add -b experiment/understand ../worktrees/experiment/understand main
```

- To actually use the branch in VSCode I had to navigate to ../worktrees/experiment/understand and open another instance of VSCode.

- I later changed the name of the worktree and branch to feat/tls and the location from /worktrees/experiment/understand to /worktrees/feat/tls
