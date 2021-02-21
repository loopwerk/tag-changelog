/* eslint-env node, mocha */

const assert = require("assert");
const { translateType, DEFAULT_TYPES } = require("../src/translateType");

describe("translateType", () => {
  it("should translate a type", () => {
    const result = translateType("feat", DEFAULT_TYPES);
    assert.strictEqual(result, "New Features");
  });

  it("should translate a missing type", () => {
    const result = translateType("missing", DEFAULT_TYPES);
    assert.strictEqual(result, "Missing");
  });
});
