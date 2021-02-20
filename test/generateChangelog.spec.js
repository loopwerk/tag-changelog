/* eslint-env node, mocha */

const assert = require("assert");
const generateChangelog = require("../src/generateChangelog");

describe("generateChangelog", () => {
  it("should create a changelog", () => {
    const commitObjects = [
      { subject: "Subject 1", type: "feat" },
      { subject: "Subject 2", type: "feat" },
      { subject: "Subject 3", type: "fix" },
      { subject: "Subject 4", type: "feat" },
      { subject: "Subject 5", type: "fix" },
    ];

    const expectedChanges = `
## New Features
- Subject 1
- Subject 2
- Subject 4

## Bugfixes
- Subject 3
- Subject 5
`;

    const expectedChangelog = `# 0.0.1 - 2021-02-20

## New Features
- Subject 1
- Subject 2
- Subject 4

## Bugfixes
- Subject 3
- Subject 5


`;

    const result = generateChangelog("0.0.1", commitObjects, []);
    assert.strictEqual(result.changes, expectedChanges);
    assert.strictEqual(result.changelog, expectedChangelog);
  });
});
