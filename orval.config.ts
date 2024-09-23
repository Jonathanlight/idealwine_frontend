// eslint-disable-next-line import/no-anonymous-default-export
export default {
  backend: {
    output: {
      mode: "tags-split",
      target: "networking/sylius-api-client",
      clean: true,
      client: "react-query",
      prettier: true,
      override: {
        mutator: {
          path: "./networking/mutator/custom-client-instance.ts",
          name: "customInstance",
        },
      },
    },
    input: {},
  },
};
