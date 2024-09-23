import { NextSeo } from "next-seo";

import ChatbotOrLogin from "@/components/organisms/ChatbotOrLogin";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

const ChatPage = () => {
  const { t } = useTranslation("chatbot");

  return (
    <div>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />
      <ChatbotOrLogin />
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default ChatPage;
