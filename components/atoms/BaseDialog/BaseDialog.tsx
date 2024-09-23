import { faClose } from "@fortawesome/pro-light-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Dialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import { useEffect, useRef } from "react";

import styles from "./BaseDialog.module.scss";

type Props = {
  className?: string;
  variant?: "modal" | "drawer";
  onClose?: () => void;
} & Dialog.DialogProps;

const BaseDialog = ({
  className,
  onClose,
  children,
  variant = "modal",
  ...props
}: Props): JSX.Element => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ("virtualKeyboard" in navigator) {
      // @ts-expect-error https://developer.chrome.com/docs/web-platform/virtual-keyboard/
      navigator.virtualKeyboard.overlaysContent = props.open ?? false;
    } else {
      // less performant fallback for browsers that don't support virtualKeyboard
      const resizeCallback = () => {
        window.requestAnimationFrame(() => {
          if (overlayRef.current && window.visualViewport) {
            overlayRef.current.style.height = `${window.visualViewport.height}px`;
          }
        });
      };

      const scrollCallback = () => {
        window.requestAnimationFrame(() => {
          if (overlayRef.current && window.visualViewport) {
            overlayRef.current.style.top = `${window.visualViewport.offsetTop}px`;
          }
        });
      };

      resizeCallback();
      scrollCallback();

      window.visualViewport?.addEventListener("resize", resizeCallback);
      window.visualViewport?.addEventListener("scroll", scrollCallback);

      return () => {
        window.visualViewport?.removeEventListener("resize", resizeCallback);
        window.visualViewport?.removeEventListener("scroll", scrollCallback);
      };
    }
  }, [props.open]);

  return (
    <Dialog.Root {...props}>
      <Dialog.Portal>
        <Dialog.Overlay
          ref={overlayRef}
          className={clsx(styles.dialogOverlay, variant === "drawer" && styles.drawerOverlay)}
        >
          <Dialog.Content
            className={clsx(
              styles.dialogContent,
              variant === "drawer" && styles.contentDrawer,
              className,
            )}
          >
            {onClose && (
              <Dialog.Close asChild>
                <button className={styles.closeButton} onClick={onClose}>
                  <FontAwesomeIcon icon={faClose} size="lg" />
                </button>
              </Dialog.Close>
            )}
            {children}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default BaseDialog;
