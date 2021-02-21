/* eslint-env node, mocha */

const assert = require("assert");
const { translateType } = require("../src/translateType");

describe("translateType", () => {
  it("should translate a type", () => {
    const result = translateType("feat");
    assert.strictEqual(result, "New Features");
  });

  it("should translate a missing type", () => {
    const result = translateType("missing");
    assert.strictEqual(result, "Missing");
  });
});
