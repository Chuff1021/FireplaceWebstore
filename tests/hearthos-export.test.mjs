import test from "node:test";
import assert from "node:assert/strict";
import { validExportToken } from "../src/lib/hearthos-export.ts";

test("export requires an explicit strong server credential", () => {
  const secret = "synthetic-test-secret-not-a-real-key-12345";
  assert.equal(validExportToken(`Bearer ${secret}`, secret), true);
  assert.equal(validExportToken(null, secret), false);
  assert.equal(validExportToken(`Bearer ${secret}`, undefined), false);
  assert.equal(validExportToken(`Bearer ${secret}`, "short"), false);
  assert.equal(validExportToken("Bearer wrong", secret), false);
  assert.equal(validExportToken(`bearer ${secret}`, secret), false);
  assert.equal(validExportToken(`Bearer ${secret} `, secret), false);
});
