import { context, getOctokit } from "@actions/github";
import { info, getInput, setOutput, setFailed } from "@actions/core";
import { compareVersions, validate } from "compare-versions";
import parseCommitMessage from "./parseCommitMessage";
import generateChangelog from "./generateChangelog";
import DEFAULT_CONFIG from "./defaultConfig";
import type { Config } from "./types";

const {
  repo: { owner, repo },
} = context;

async function getConfig(path: string): Promise<Config> {
  if (path) {
    let workspace = process.env.GITHUB_WORKSPACE;
    if (process.env.ACT) {
      // Otherwise testing this in ACT doesn't work
      workspace += "/tag-changelog";
    }

    const userConfig = (await import(`${workspace}/${path}`)).default;

    // Merge default config with user config
    return Object.assign({}, DEFAULT_CONFIG, userConfig);
  }

  return { ...DEFAULT_CONFIG };
}

async function run() {
  const token = getInput("token", { required: true });
  const octokit = getOctokit(token);

  const configFile = getInput("config_file", { required: false });
  const config = await getConfig(configFile);
  const excludeTypesString = getInput("exclude_types", { required: false });
  const includeCommitBody = getInput("include_commit_body", { required: false });

  if (excludeTypesString) {
    config.excludeTypes = excludeTypesString.split(",");
  }

  if (includeCommitBody) {
    config.includeCommitBody = includeCommitBody === "true";
  }

  // Find the two most recent tags
  // Using https://octokit.github.io/rest.js/v19#pagination
  const tags = await octokit.paginate("GET /repos/{owner}/{repo}/tags", { owner, repo });

  const validSortedTags = tags
    .filter(t => validate(t.name))
    .sort((a, b) => {
      return compareVersions(a.name, b.name);
    })
    .reverse();

  // if there is only one tag, then create a changelog from the first commit
  let base: string;
  let head: string;
  if (validSortedTags.length > 1) {
    base = validSortedTags[1].commit.sha;
    head = validSortedTags[0].commit.sha;
  } else if (validSortedTags.length === 1) {
    head = validSortedTags[0].commit.sha;
    const commits = await octokit.paginate("GET /repos/{owner}/{repo}/commits", {
      owner,
      repo,
      sha: head,
    });
    base = commits[commits.length - 1].sha;
  } else {
    setFailed("Couldn't find previous tag");
    return;
  }

  // Find the commits between two tags
  const result = await octokit.rest.repos.compareCommits({
    owner,
    repo,
    base,
    head,
  });

  const fetchUserFunc = async function (pullNumber: string) {
    const pr = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: Number(pullNumber),
    });

    return {
      username: pr.data.user?.login ?? "ghost",
      userUrl: pr.data.user?.html_url ?? "https://github.com/ghost",
    };
  };

  // Parse every commit, getting the type, turning PR numbers into links, etc
  const commitObjects = await Promise.all(
    result.data.commits.map(async commit => {
      const commitObj = await parseCommitMessage(commit.commit.message, `https://github.com/${owner}/${repo}`, fetchUserFunc);
      commitObj.sha = commit.sha;
      commitObj.url = commit.html_url;
      commitObj.author = commit.author;
      return commitObj;
    })
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

run().catch(e => setFailed(e instanceof Error ? e.message : String(e)));
