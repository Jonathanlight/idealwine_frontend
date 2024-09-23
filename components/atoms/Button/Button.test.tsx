import { render } from "@/tests/test-utils";

import Button from "./Button";

describe("Button", () => {
  it("should render", () => {
    render(<Button variant="primaryBlack">I am a button!</Button>);
  });
});
