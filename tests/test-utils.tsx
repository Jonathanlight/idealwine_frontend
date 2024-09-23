import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, RenderOptions } from "@testing-library/react";
import { PropsWithChildren, ReactElement } from "react";

afterEach(() => {
  cleanup();
});

const queryClient = new QueryClient();

const AllTheProviders = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

// https://testing-library.com/docs/react-testing-library/setup/#custom-render
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export { customRender as render };
