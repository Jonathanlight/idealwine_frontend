import { render } from "@/tests/test-utils";

import ForgotPasswordForm from "./ForgotPasswordForm";

describe("ForgotPasswordForm", () => {
  it("should render", () => {
    render(<ForgotPasswordForm onSuccessSubmit={() => {}} />);
  });
});
