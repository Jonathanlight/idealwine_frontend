import * as Dialog from "@radix-ui/react-dialog";

import BaseDialog from "@/components/atoms/BaseDialog/BaseDialog";

type Props = {
  className?: string;
  onClose?: () => void;
} & Dialog.DialogProps;

const Drawer = ({ ...props }: Props): JSX.Element => {
  return <BaseDialog {...props} variant="drawer" />;
};

export default Drawer;
