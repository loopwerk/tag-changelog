/* eslint-env node, mocha */

const assert = require("assert");
const groupByType = require("../src/groupByType");

describe("groupByType", () => {
  it("should group commits by type", () => {
    const commits = [
      { subject: "Subject 1", type: "feat" },
      { subject: "Subject 2", type: "feat" },
      { subject: "Subject 3", type: "fix" },
      { subject: "Subject 4", type: "feat" },
      { subject: "Subject 5", type: "fix" },
    ];

    const expected = {
      feat: [
        {
          subject: "Subject 1",
          type: "feat",
        },
        {
          subject: "Subject 2",
          type: "feat",
        },
        {
          subject: "Subject 4",
          type: "feat",
        },
      ],
      fix: [
        {
          subject: "Subject 3",
          type: "fix",
        },
        {
          subject: "Subject 5",
          type: "fix",
        },
      ],
    };

    const result = groupByType(commits);
    assert.notStrictEqual(result, expected);
  });
});
