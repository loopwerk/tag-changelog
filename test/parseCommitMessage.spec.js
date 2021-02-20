/* eslint-env node, mocha */

const assert = require("assert");
const parseCommitMessage = require("../src/parseCommitMessage");

describe("parseCommitMessage", () => {
  it("should parse a basic feat", () => {
    const result = parseCommitMessage("feat: This is a feature");

    assert.strictEqual(result.subject, "This is a feature");
    assert.strictEqual(result.type, "feat");
  });

  it("should parse a basic feat with multiple lines", () => {
    const result = parseCommitMessage("feat: This is a feature\n\nBody");

    assert.strictEqual(result.subject, "This is a feature");
    assert.strictEqual(result.type, "feat");
  });

  it("should parse basic feat with a PR number", () => {
    const result = parseCommitMessage("feat: This is a feature [#1]", "https://github.com/loopwerk/tag-changelog");

    assert.strictEqual(result.subject, "This is a feature [[#1](https://github.com/loopwerk/tag-changelog/pull/1)]");
    assert.strictEqual(result.type, "feat");
  });

  it("should parse a basic fix", () => {
    const result = parseCommitMessage("fix: This is a fix");

    assert.strictEqual(result.subject, "This is a fix");
    assert.strictEqual(result.type, "fix");
  });

  it("should parse a breaking change fix", () => {
    const result = parseCommitMessage("fix!: This is a fix");

    assert.strictEqual(result.subject, "This is a fix");
    assert.strictEqual(result.type, "fix");
    assert.notStrictEqual(result.notes, [{ text: "This is a fix", title: "BREAKING CHANGE" }]);
  });

  it("should parse a missing type", () => {
    const result = parseCommitMessage("This is a commit");

    assert.strictEqual(result.subject, "This is a commit");
    assert.strictEqual(result.type, "other");
  });

  it("should parse a missing type with multiple lines", () => {
    const result = parseCommitMessage("This is a commit\n\nBody");

    assert.strictEqual(result.subject, "This is a commit");
    assert.strictEqual(result.type, "other");
  });

  it("should parse a missing type with a PR number", () => {
    const result = parseCommitMessage("This is a commit [#1]", "https://github.com/loopwerk/tag-changelog");

    assert.strictEqual(result.subject, "This is a commit [[#1](https://github.com/loopwerk/tag-changelog/pull/1)]");
    assert.strictEqual(result.type, "other");
  });
});
