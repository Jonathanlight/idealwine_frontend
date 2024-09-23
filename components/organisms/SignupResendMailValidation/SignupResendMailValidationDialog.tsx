import * as Dialog from "@radix-ui/react-dialog";

import Button from "@/components/atoms/Button/Button";
import Modal from "@/components/molecules/Modal";
import { useShopResendVerificationEmailCustomVerifyCustomerAccountCollection } from "@/networking/sylius-api-client/verify-customer-account/verify-customer-account";
import { useTranslation } from "@/utils/next-utils";

import styles from "./SignupResendMailValidationDialog.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  emailToBeValidated: string;
  setIsEmailSentModalOpen: (open: boolean) => void;
};

const SignupResendMailValidationDialog = ({
  open,
  setOpen,
  emailToBeValidated: email,
  setIsEmailSentModalOpen,
}: Props): JSX.Element => {
  const { t } = useTranslation("common");

  const { mutateAsync, isLoading } =
    useShopResendVerificationEmailCustomVerifyCustomerAccountCollection();

  const onClick = async () => {
    try {
      await mutateAsync({ data: { email } });
      setOpen(false);
      setIsEmailSentModalOpen(true);
    } catch (error) {
      // An error occurred
    }
  };

  return (
    <Modal open={open} onOpenChange={setOpen} onClose={() => setOpen(false)}>
      <Dialog.Title className={styles.dialogTitle}>{t("login.confirmYourAccount")}</Dialog.Title>
      <Dialog.Content className={styles.dialogContent}>
        {t("login.signupResendMailValidation")}
        <strong> {email} </strong>
      </Dialog.Content>
      <div className={styles.buttonContainer}>
        <Button variant="primaryBlack" onClick={onClick} isLoading={isLoading}>
          {t("login.signupResendMail")}
        </Button>
      </div>
    </Modal>
  );
};

export default SignupResendMailValidationDialog;
