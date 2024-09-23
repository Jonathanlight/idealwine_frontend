import { isAxiosError } from "axios";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import { customAxiosInstance } from "@/networking/mutator/custom-client-instance";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

const useFileDownload = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const downloadFile = useCallback(
    async (fileUrl: string) => {
      setLoading(true);
      let url: string | null = null;

      try {
        const { data, headers } = await customAxiosInstance(
          { url: fileUrl },
          { responseType: "blob" },
        );

        const contentType = headers["content-type"] as string | undefined;
        const contentDisposition = headers["content-disposition"] as string | undefined;

        const blob = new Blob([data as BlobPart], { type: contentType });

        const link = document.createElement("a");
        url = URL.createObjectURL(blob);
        link.href = URL.createObjectURL(blob);
        link.download = contentDisposition?.split("filename=")[1] ?? "";
        link.click();
      } catch (err) {
        if (isAxiosError(err)) toast.error<string>(t("common:common.errorOccurred"));
      } finally {
        if (isNotNullNorUndefined(url)) URL.revokeObjectURL(url);
        setLoading(false);
      }
    },
    [t],
  );

  return { downloadFile, loading };
};

export default useFileDownload;
