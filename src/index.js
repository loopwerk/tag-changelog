const { context, getOctokit } = require("@actions/github");
const { info, getInput, setOutput, setFailed } = require("@actions/core");
const { compareVersions, validate } = require("compare-versions");

const parseCommitMessage = require("./parseCommitMessage");
const generateChangelog = require("./generateChangelog");
const DEFAULT_CONFIG = require("./defaultConfig");

const {
  repo: { owner, repo },
} = context;

function getConfig(path) {
  if (path) {
    let workspace = process.env.GITHUB_WORKSPACE;
    if (process.env.ACT) {
      // Otherwise testing this in ACT doesn't work
      workspace += "/tag-changelog";
    }

    const userConfig = require(`${workspace}/${path}`);

    // Merge default config with user config
    return Object.assign({}, DEFAULT_CONFIG, userConfig);
  }

  return DEFAULT_CONFIG;
}

async function run() {
  const token = getInput("token", { required: true });
  const octokit = getOctokit(token);

  const configFile = getInput("config_file", { required: false });
  const config = getConfig(configFile);
  const excludeTypesString = getInput("exclude_types", { required: false }) || "";

  if (excludeTypesString) {
    config.excludeTypes = excludeTypesString.split(",");
  }

  // Find the two most recent tags
  const { data: tags } = await octokit.rest.repos.listTags({
    owner,
    repo,
    per_page: 10,
  });

  const validSortedTags = tags
    .filter((t) => validate(t.name))
    .sort((a, b) => {
      return compareVersions(a.name, b.name);
    })
    .reverse();

  // if there is only one tag, then create a changelog from the first commit
  let base = null;
  let head = null;
  if (validSortedTags.length > 1) {
    base = validSortedTags[1].commit.sha;
    head = validSortedTags[0].commit.sha;
  } else if (validSortedTags.length === 1) {
    const { data: commits } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      per_page: 1,
    });
    const firstCommit = commits[0];
    base = firstCommit.sha;
    head = validSortedTags[0].commit.sha;
  } else {
    setFailed("Couldn't find previous tag");
    return;
  }

  // Find the commits between two tags
  const result = await octokit.rest.repos.compareCommits({
    owner,
    repo,
    base: base,
    head: head,
  });

  const fetchUserFunc = async function (pullNumber) {
    const pr = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: pullNumber,
    });

    return {
      username: pr.data.user.login,
      userUrl: pr.data.user.html_url,
    };
  };

  // Parse every commit, getting the type, turning PR numbers into links, etc
  const commitObjects = await Promise.all(
    result.data.commits
      .map(async (commit) => {
        const commitObj = await parseCommitMessage(commit.commit.message, `https://github.com/${owner}/${repo}`, fetchUserFunc);
        commitObj.sha = commit.sha;
        commitObj.url = commit.html_url;
        commitObj.author = commit.author;
        return commitObj;
      })
      .filter((m) => m !== false)
  );

  // And generate the changelog
  if (commitObjects.length === 0) {
    setOutput("changelog", "");
    setOutput("changes", "");
    return;
  }

  const log = generateChangelog(validSortedTags[0].name, commitObjects, config);

  info(log.changelog);
  setOutput("changelog", log.changelog);
  setOutput("changes", log.changes);
}

run();
