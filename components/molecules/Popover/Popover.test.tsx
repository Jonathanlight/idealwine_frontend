import { render } from "@/tests/test-utils";

import Popover from "./Popover";

describe("Dropdown", () => {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  it("should render", () => {
    render(<Popover open={false} onOpenChange={() => {}} />);
  });
});
