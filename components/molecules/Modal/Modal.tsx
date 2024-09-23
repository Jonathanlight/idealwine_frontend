import * as Dialog from "@radix-ui/react-dialog";

import BaseDialog from "@/components/atoms/BaseDialog/BaseDialog";

type Props = {
  className?: string;
  onClose?: () => void;
} & Dialog.DialogProps;

const Modal = ({ ...props }: Props): JSX.Element => {
  return <BaseDialog {...props} variant="modal" />;
};

export default Modal;
