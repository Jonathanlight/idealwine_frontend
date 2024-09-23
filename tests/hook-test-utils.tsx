import { renderHook, RenderOptions } from "@testing-library/react";
import { PropsWithChildren } from "react";

const AllTheProviders = ({ children }: PropsWithChildren) => <>{children}</>;

// https://testing-library.com/docs/react-testing-library/setup/#custom-render
const customRender = (hook: () => unknown, options?: Omit<RenderOptions, "wrapper">) =>
  renderHook(hook, { wrapper: AllTheProviders, ...options });

export { customRender as renderHookWithProviders };
