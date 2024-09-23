import { render } from "@/tests/test-utils";

import SignupForm from "./SignupForm";

describe("SignupForm", () => {
  it("should render", () => {
    render(<SignupForm onSuccessSubmit={() => {}} />);
  });
});
