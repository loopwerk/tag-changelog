const github = require('@actions/github');
const context = github.context;
console.log(process.env);
console.log(context.repo);

// async function run() {
//   const token = core.getInput('token');
//   const octokit = github.getOctokit(token);

//   const { data: pullRequest } = await octokit.pulls.get({
//     owner: 'octokit',
//     repo: 'rest.js',
//     pull_number: 123,
//     mediaType: {
//       format: 'diff'
//     }
//   });

//   console.log(pullRequest);
// }

// run();