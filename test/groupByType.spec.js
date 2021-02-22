/* eslint-env node, mocha */

const assert = require("assert");
const groupByType = require("../src/groupByType");
const DEFAULT_CONFIG = require("../src/defaultConfig");

describe("groupByType", () => {
  it("should group and sort commits by type", () => {
    const commits = [
      { subject: "Subject 0", type: "other", notes: [] },
      { subject: "Subject 1", type: "feat", notes: [] },
      { subject: "Subject 2", type: "nonexisting", notes: [] },
      { subject: "Subject 3", type: "feat", notes: [] },
      { subject: "Subject 4", type: "fix", notes: [] },
      { subject: "Subject 5", type: "fix", notes: [] },
    ];

    const expected = [
      {
        type: "feat",
        commits: [
          { subject: "Subject 1", type: "feat", notes: [] },
          { subject: "Subject 3", type: "feat", notes: [] },
        ],
      },
      {
        type: "fix",
        commits: [
          { subject: "Subject 4", type: "fix", notes: [] },
          { subject: "Subject 5", type: "fix", notes: [] },
        ],
      },
      {
        type: "other",
        commits: [{ subject: "Subject 0", type: "other", notes: [] }],
      },
      {
        type: "nonexisting",
        commits: [{ subject: "Subject 2", type: "nonexisting", notes: [] }],
      },
    ];

    const result = groupByType(commits, DEFAULT_CONFIG.types);
    assert.deepStrictEqual(result, expected);
  });

  it("should test failure too", () => {
    const commits = [
      { subject: "Subject 0", type: "other", notes: [] },
      { subject: "Subject 1", type: "feat", notes: [] },
    ];

    const notExpected = [
      {
        type: "other",
        commits: [{ subject: "Subject 0", type: "other", notes: [] }],
      },
      {
        type: "feat",
        commits: [{ subject: "Subject 1", type: "feat", notes: [] }],
      },
    ];

    const expected = [
      {
        type: "feat",
        commits: [{ subject: "Subject 1", type: "feat", notes: [] }],
      },
      {
        type: "other",
        commits: [{ subject: "Subject 0", type: "other", notes: [] }],
      },
    ];

    const result = groupByType(commits, DEFAULT_CONFIG.types);
    assert.notDeepStrictEqual(result, notExpected);
    assert.deepStrictEqual(result, expected);
  });
});
