/* eslint-env node, mocha */

const assert = require("assert");
const groupByType = require("../src/groupByType");

describe("groupByType", () => {
  it("should group and sort commits by type", () => {
    const commits = [
      { subject: "Subject 0", type: "other" },
      { subject: "Subject 1", type: "feat" },
      { subject: "Subject 2", type: "nonexisting" },
      { subject: "Subject 3", type: "feat" },
      { subject: "Subject 4", type: "fix" },
      { subject: "Subject 5", type: "fix" },
    ];

    const expected = [
      {
        type: "feat",
        commits: [
          { subject: "Subject 1", type: "feat" },
          { subject: "Subject 3", type: "feat" },
        ],
      },
      {
        type: "fix",
        commits: [
          { subject: "Subject 4", type: "fix" },
          { subject: "Subject 5", type: "fix" },
        ],
      },
      { type: "other", commits: [{ subject: "Subject 0", type: "other" }] },
      { type: "nonexisting", commits: [{ subject: "Subject 2", type: "nonexisting" }] },
    ];

    const result = groupByType(commits);
    assert.deepStrictEqual(result, expected);
  });

  it("should test failure too", () => {
    const commits = [
      { subject: "Subject 0", type: "other" },
      { subject: "Subject 1", type: "feat" },
    ];

    const notExpected = [
      { type: "other", commits: [{ subject: "Subject 0", type: "other" }] },
      {
        type: "feat",
        commits: [{ subject: "Subject 1", type: "feat" }],
      },
    ];

    const expected = [
      {
        type: "feat",
        commits: [{ subject: "Subject 1", type: "feat" }],
      },
      { type: "other", commits: [{ subject: "Subject 0", type: "other" }] },
    ];

    const result = groupByType(commits);
    assert.notDeepStrictEqual(result, notExpected);
    assert.deepStrictEqual(result, expected);
  });
});
