/* eslint-env node, mocha */

const assert = require("assert");
const generateChangelog = require("../src/generateChangelog");
const DEFAULT_CONFIG = require("../src/defaultConfig");

describe("generateChangelog", () => {
  it("should create a changelog", () => {
    const commitObjects = [
      { subject: "Subject 1", type: "fix", notes: [] },
      { subject: "Subject 2", type: "feat", notes: [] },
      { subject: "Subject 3", type: "feat", notes: [] },
      { subject: "Subject 4", type: "fix", notes: [] },
      { subject: "Subject 5", type: "feat", notes: [] },
      { subject: "Subject 6", type: "other", notes: [] },
    ];

    const dateString = new Date().toISOString().substr(0, 10);

    const expectedChanges = `## New Features
- Subject 2
- Subject 3
- Subject 5

## Bugfixes
- Subject 1
- Subject 4`;

    const expectedChangelog = `# 0.0.1 - ${dateString}

## New Features
- Subject 2
- Subject 3
- Subject 5

## Bugfixes
- Subject 1
- Subject 4

`;

    const config = DEFAULT_CONFIG;
    config.excludeTypes = ["other"];

    const result = generateChangelog("0.0.1", commitObjects, config);
    assert.strictEqual(result.changes, expectedChanges);
    assert.strictEqual(result.changelog, expectedChangelog);
  });

  it("should create a changelog with breaking changes", () => {
    const commitObjects = [
      {
        subject: "Fix",
        type: "fix",
        notes: [{ title: "BREAKING CHANGE", text: "This is a breaking change!" }],
        sha: "bcb8767bc22bc7d4ab47a4fffd4ef435de581054",
        url: "https://github.com/loopwerk/tag-changelog/commit/bcb8767bc22bc7d4ab47a4fffd4ef435de581054",
      },
      {
        subject: "Feature",
        type: "feat",
        notes: [{ title: "BREAKING CHANGE", text: "This is another breaking change!" }],
        sha: "bcb8767bc22bc7d4ab47a4fffd4ef435de581054",
        url: "https://github.com/loopwerk/tag-changelog/commit/bcb8767bc22bc7d4ab47a4fffd4ef435de581054",
      },
    ];

    const expectedChanges = `## New Features
- Feature

## Bugfixes
- Fix

## BREAKING CHANGES
- due to [bcb876](https://github.com/loopwerk/tag-changelog/commit/bcb8767bc22bc7d4ab47a4fffd4ef435de581054): Feature

This is another breaking change!

- due to [bcb876](https://github.com/loopwerk/tag-changelog/commit/bcb8767bc22bc7d4ab47a4fffd4ef435de581054): Fix

This is a breaking change!`;

    const result = generateChangelog("0.0.1", commitObjects, DEFAULT_CONFIG);
    assert.strictEqual(result.changes, expectedChanges);
  });

  it("should create a changelog with scopes", () => {
    const commitObjects = [
      { subject: "Subject 1", type: "fix", notes: [], scope: "scope" },
      { subject: "Subject 2", type: "feat", notes: [], scope: "scope" },
      { subject: "Subject 3", type: "feat", notes: [] },
      { subject: "Subject 4", type: "fix", notes: [] },
    ];

    const expectedChanges = `## New Features
- **scope:** Subject 2
- Subject 3

## Bugfixes
- **scope:** Subject 1
- Subject 4`;

    const result = generateChangelog("0.0.1", commitObjects, DEFAULT_CONFIG);
    assert.strictEqual(result.changes, expectedChanges);
  });
});
