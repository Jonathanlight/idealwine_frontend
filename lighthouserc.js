module.exports = {
  ci: {
    collect: {
      settings: {
        extraHeaders: JSON.stringify({
          authorization: process.env.AUTH_HEADER,
        }),
      },
    },
  },
};
