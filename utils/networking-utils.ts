export const isClientStatusCodeError = (statusCode: number) => {
  const statusCodePattern = /^[4][0-9]{2}$/; // Expression régulière pour correspondre à 4XX

  return statusCodePattern.test(statusCode.toString());
};

export interface ErrorWithNormalizableErrorCode {
  response: {
    data: {
      errorCode: string;
    };
  };
}
