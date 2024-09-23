import { isClientStatusCodeError } from "./networking-utils";

describe("isClientStatusCodeError", () => {
  it.each([
    [400, true],
    [401, true],
    [404, true],
    [422, true],
    [450, true],
    [500, false],
    [200, false],
  ])("should return %s result for status code %s", (statusCode, expected) => {
    const result = isClientStatusCodeError(statusCode);
    expect(result).toBe(expected);
  });
});
