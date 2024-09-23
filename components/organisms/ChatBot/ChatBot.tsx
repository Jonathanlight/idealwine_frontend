import DOMPurify from "isomorphic-dompurify";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Button from "@/components/atoms/Button";
import { useChatChatBotDTOCollection } from "@/networking/sylius-api-client/chat-bot-dt-o/chat-bot-dt-o";
import { useTranslation } from "@/utils/next-utils";
import { CHATBOT_HISTORY } from "@/utils/sessionStorageKeys";

import styles from "./ChatBot.module.scss";

interface ChatResponse {
  message: string;
  author: string;
}

const OpenAIChatbot = () => {
  const { t } = useTranslation("chatbot");
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<{ message: string; author: string }[]>([]);
  const [threadId, setThreadId] = useState<string>();
  const [error, setError] = useState<string>("");
  const { mutateAsync: sendPrompt, isLoading } = useChatChatBotDTOCollection();

  useEffect(() => {
    const savedResponses = sessionStorage.getItem(CHATBOT_HISTORY);
    if (savedResponses !== null) {
      try {
        const parsedResponses = JSON.parse(savedResponses) as ChatResponse[];
        setResponse(parsedResponses);
      } catch (err) {
        toast.error<string>(t("chatbot.error"));
      }
    }
  }, [error, t]);

  const saveResponse = (newResponses: { message: string; author: string }[]) => {
    setResponse(newResponses);

    sessionStorage.setItem(CHATBOT_HISTORY, JSON.stringify(newResponses));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    setPrompt("");
    event.preventDefault();
    if (prompt.trim() === "") return;
    setError("");

    try {
      saveResponse([...response, { message: prompt, author: "user" }]);
      const resData = await sendPrompt({ data: { threadId, message: prompt } });
      const containsHref = /<a\s+href=/.test(resData.message ?? "");
      saveResponse([
        ...response,
        { message: prompt, author: "user" },
        { message: resData.message ?? "", author: "bot" },
      ]);
      setThreadId(containsHref ? resData.threadId : undefined);
    } catch (err) {
      toast.error<string>(t("chatbot.error"));
    }
  };

  const handlePrompt = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  };

  const clearChat = () => {
    saveResponse([]);
    setThreadId(undefined);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>{t("h1")}</h1>
      <h2 className={styles.h2}>{t("h2")}</h2>

      {error !== "" && <div>{error}</div>}

      <div className={styles.response}>
        {response.length === 0 ? (
          <p className={styles.bot}>
            <span> {t("welcome")}</span>
          </p>
        ) : (
          <>
            {response.map((res, index) => (
              <p
                className={res.author === "bot" ? styles.bot : styles.user}
                key={index}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(res.message) }}
              ></p>
            ))}
            {isLoading && <p>{t("writing")}</p>}
          </>
        )}
      </div>
      {!isLoading && (
        <div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formcontainer}>
              <div className={styles.formgroup}>
                <input
                  type="text"
                  id="prompt"
                  placeholder={t("placeholder")}
                  value={prompt}
                  onChange={handlePrompt}
                />
              </div>
              <Button variant="primaryGolden">{t("send")}</Button>
            </div>
          </form>

          {response.length !== 0 && (
            <Button variant="secondaryWhite" className={styles.btn} onClick={clearChat}>
              {t("clear")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default OpenAIChatbot;
