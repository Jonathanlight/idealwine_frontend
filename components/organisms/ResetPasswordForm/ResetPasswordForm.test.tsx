import { render } from "@/tests/test-utils";

import ResetPasswordForm from "./ResetPasswordForm";
describe("ResetPasswordForm", () => {
  it("should render", () => {
    render(
      <ResetPasswordForm
        onSuccessSubmit={() => {}}
        emailToRestorePassword={""}
        usernameToRestorePassword={""}
        passwordResetToken={""}
      />,
    );
  });
});
