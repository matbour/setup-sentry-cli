const tasks = commands => commands.join(' && ');

module.exports = {
  hooks: {
    'pre-commit': tasks(['npm run build', 'git add dist/']),
  },
};
