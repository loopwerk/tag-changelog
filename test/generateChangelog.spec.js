/* eslint-env node, mocha */

const assert = require("assert");
const generateChangelog = require("../src/generateChangelog");
const DEFAULT_CONFIG = require("../src/defaultConfig");

describe("generateChangelog", () => {
  it("should create a changelog", () => {
    const commitObjects = [
      { subject: "Subject 1", type: "fix" },
      { subject: "Subject 2", type: "feat" },
      { subject: "Subject 3", type: "feat" },
      { subject: "Subject 4", type: "fix" },
      { subject: "Subject 5", type: "feat" },
      { subject: "Subject 6", type: "other" },
    ];

    const dateString = new Date().toISOString().substr(0, 10);

    const expectedChanges = `
## New Features
- Subject 2
- Subject 3
- Subject 5

## Bugfixes
- Subject 1
- Subject 4
`;

    const expectedChangelog = `# 0.0.1 - ${dateString}

## New Features
- Subject 2
- Subject 3
- Subject 5

## Bugfixes
- Subject 1
- Subject 4


`;

    const result = generateChangelog("0.0.1", commitObjects, ["other"], DEFAULT_CONFIG.types);
    assert.strictEqual(result.changes, expectedChanges);
    assert.strictEqual(result.changelog, expectedChangelog);
  });
});
