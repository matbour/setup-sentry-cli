module.exports = {
  'commit-msg': 'pnpm standard-commithook',
  'pre-commit': 'pnpm build && git add dist && pnpm lint-staged',
};
