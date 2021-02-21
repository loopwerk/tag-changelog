/* eslint-env node, mocha */

const assert = require("assert");
const parseCommitMessage = require("../src/parseCommitMessage");

const fetchUserFunc = async function (pullNumber) {
  return {
    username: "kevinrenskers",
    userUrl: "https://github.com/kevinrenskers",
  };
};

describe("parseCommitMessage", () => {
  it("should parse a basic feat", async () => {
    const result = await parseCommitMessage("feat: This is a feature");

    assert.strictEqual(result.subject, "This is a feature");
    assert.strictEqual(result.type, "feat");
  });

  it("should parse a basic feat with multiple lines", async () => {
    const result = await parseCommitMessage("feat: This is a feature\n\nBody");

    assert.strictEqual(result.subject, "This is a feature");
    assert.strictEqual(result.type, "feat");
  });

  it("should parse basic feat with a PR number", async () => {
    const result = await parseCommitMessage("feat: This is a feature [#1]", "https://github.com/loopwerk/tag-changelog", fetchUserFunc);

    assert.strictEqual(result.subject, "This is a feature [[#1](https://github.com/loopwerk/tag-changelog/pull/1) by [kevinrenskers](https://github.com/kevinrenskers)]");
    assert.strictEqual(result.type, "feat");
  });

  it("should parse a basic fix", async () => {
    const result = await parseCommitMessage("fix: This is a fix");

    assert.strictEqual(result.subject, "This is a fix");
    assert.strictEqual(result.type, "fix");
  });

  it("should parse a breaking change fix", async () => {
    const result = await parseCommitMessage("fix!: This is a fix");

    assert.strictEqual(result.subject, "This is a fix");
    assert.strictEqual(result.type, "fix");
    assert.notStrictEqual(result.notes, [{ text: "This is a fix", title: "BREAKING CHANGE" }]);
  });

  it("should parse a missing type", async () => {
    const result = await parseCommitMessage("This is a commit");

    assert.strictEqual(result.subject, "This is a commit");
    assert.strictEqual(result.type, "other");
  });

  it("should parse a missing type with multiple lines", async () => {
    const result = await parseCommitMessage("This is a commit\n\nBody");

    assert.strictEqual(result.subject, "This is a commit");
    assert.strictEqual(result.type, "other");
  });

  it("should parse a missing type with a PR number", async () => {
    const result = await parseCommitMessage("This is a commit [#1]", "https://github.com/loopwerk/tag-changelog", fetchUserFunc);

    assert.strictEqual(result.subject, "This is a commit [[#1](https://github.com/loopwerk/tag-changelog/pull/1) by [kevinrenskers](https://github.com/kevinrenskers)]");
    assert.strictEqual(result.type, "other");
  });
});
