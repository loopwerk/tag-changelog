import { context, getOctokit } from "@actions/github";
import { info, getInput, setOutput, setFailed } from "@actions/core";
import { parseCommitMessage, groupByType, translateType } from "./parseCommitMessage";

const {
  repo: { owner, repo },
} = context;

async function run() {
  const token = getInput("token");
  const octokit = getOctokit(token);

  // Find the two most recent tags
  const { data: tags } = await octokit.repos.listTags({
    owner,
    repo,
    per_page: 2,
  });

  if (tags.length !== 2) {
    setFailed("Couldn't find previous tag");
    return;
  }

  // Find the commits between two two tags
  const result = await octokit.repos.compareCommits({
    owner,
    repo,
    base: tags[1].commit.sha,
    head: tags[0].commit.sha,
  });

  // Parse every commit, getting the type, turning PR numbers into links, etc
  let commitObjects = result.data.commits
    .map(commit => {
      return parseCommitMessage(commit.commit.message, `https://github.com/${owner}/${repo}`);
    })
    .filter(m => m !== false);

  // And generate the changelog
  if (commitObjects.length == 0) {
    setOutput("changelog", "");
    setOutput("changes", "");
    return;
  }

  const commitsByType = groupByType(commitObjects);
  const excludeString = getInput("exclude") || "";
  const excludeTypes = excludeString.split(",");
  let changes = "";

  Object.keys(commitsByType)
    .filter(type => { 
      return !excludeTypes.includes(type)
    })
    .forEach(key => {
      let commits = commitsByType[key];

      let niceType = translateType(key);
      changes += `\n## ${niceType}\n`;

      commits.forEach(commit => {
        changes += `- ${commit.subject}\n`;
      });
    });

  const now = new Date();
  const changelog = `# ${tags[0].name} - ${now.toISOString().substr(0, 10)}\n` + changes;

  info(changelog);
  setOutput("changelog", changelog);
  setOutput("changes", changes);
}

run();
