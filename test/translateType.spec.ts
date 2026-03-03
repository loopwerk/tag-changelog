import assert from "assert";
import translateType from "../src/translateType";
import DEFAULT_CONFIG from "../src/defaultConfig";

describe("translateType", () => {
  it("should translate a type", () => {
    const result = translateType("feat", DEFAULT_CONFIG.types);
    assert.strictEqual(result, "New Features");
  });

  it("should translate a missing type", () => {
    const result = translateType("missing", DEFAULT_CONFIG.types);
    assert.strictEqual(result, "Missing");
  });
});
