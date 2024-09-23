import { render } from "@/tests/test-utils";

import LoginForm from "./LoginForm";

describe("LoginForm", () => {
  it("should render", () => {
    render(<LoginForm onSuccessSubmit={() => {}} />);
  });
});
