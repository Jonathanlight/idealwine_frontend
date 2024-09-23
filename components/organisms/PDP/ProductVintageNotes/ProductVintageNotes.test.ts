import { parseNoteValue } from "@/utils/productVintageNotesUtils";

describe("parseNoteValue", () => {
  it.each([
    [100, "100"],
    [100, "azefi100"],
    [97, "97-100"],
    [97, "(97-100)"],
    [18, "18.5"],
    [18, "18,5"],
    [null, "très bien"],
  ])("should return value %s for string %s", (expectedValue, inputString) => {
    const value = parseNoteValue(inputString);

    expect(value).toEqual(expectedValue);
  });
});
