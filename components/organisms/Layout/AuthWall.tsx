import { useRouter } from "next/router";
import { PropsWithChildren, useEffect } from "react";

import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { isPagePrivate, useSendRefreshTokenRequest } from "@/networking/mutator/axios-hooks";
import { isNullOrUndefined } from "@/utils/ts-utils";

type Props = PropsWithChildren;

const AuthWall = ({ children }: Props) => {
  const { asPath } = useRouter();
  const { user } = useAuthenticatedUserContext();
  const { sendRefreshTokenRequest } = useSendRefreshTokenRequest();
  const isPrivate = isPagePrivate(asPath);

  // "user === undefined" means that we know that the user is not logged in
  // "user === null" means that we don't know if the user is logged in or not (first render)
  // if the user is null, we don't want to try to refresh the token immediately, but we want to hide the private section to avoid blink

  const mustLogIn = isPrivate && user === undefined;
  const hidePrivatePage = isPrivate && isNullOrUndefined(user);

  useEffect(() => {
    const tryToRefreshToken = async () => {
      try {
        await sendRefreshTokenRequest();
      } catch (e) {
        // an error occurred, do nothing, the user will be redirected to the login page
      }
    };

    if (mustLogIn) void tryToRefreshToken();
  }, [mustLogIn, sendRefreshTokenRequest]);

  return hidePrivatePage ? null : <>{children}</>;
};

export default AuthWall;
