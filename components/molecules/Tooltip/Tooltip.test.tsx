import { render } from "@/tests/test-utils";

import TooltipCustom from "./Tooltip";

describe("TooltipCustom", () => {
  it("should render", () => {
    render(
      <TooltipCustom trigger={<button>Hover me!</button>}>
        <span>Tooltip content</span>
      </TooltipCustom>,
    );
  });
});
