import { passwordPattern, usernamePattern } from "@/utils/fieldValidators";

describe("username pattern", () => {
  it("should respect username pattern", () => {
    expect(usernamePattern.test("toto")).toBe(true);
    expect(usernamePattern.test("toto123456")).toBe(true);
    expect(usernamePattern.test("=àsssss")).toBe(false);
    expect(usernamePattern.test("toto@toto.com")).toBe(false);
  });
});

describe("password pattern", () => {
  it("should match a password with at least 12 characters, one letter and one number", () => {
    expect(passwordPattern.test("test1234567890")).toBe(true);
    expect(passwordPattern.test("test1234")).toBe(false);
    expect(passwordPattern.test("testtesttesttest")).toBe(false);
    expect(passwordPattern.test("123456789123456789")).toBe(false);
    expect(passwordPattern.test("é§!a123456789/*")).toBe(true);
  });
});
