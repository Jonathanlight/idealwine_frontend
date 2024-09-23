import { sortWithHeadingValues } from "./sortWithHeadingValues";

type AlgoliaObject = {
  isRefined: boolean;
  name: string;
  escapedValue: string;
  count: number;
  isExcluded: boolean;
};

type DataSet = {
  value1: AlgoliaObject;
  value2: AlgoliaObject;
  expected: number;
};

const dataSetNoHeadingValues = [
  {
    value1: { name: "bleu", isRefined: false },
    value2: { name: "vert", isRefined: false },
    expected: -1,
  },
  {
    value1: { name: "vert", isRefined: false },
    value2: { name: "bleu", isRefined: false },
    expected: 1,
  },
  {
    value1: { name: "bleu", isRefined: false },
    value2: { name: "bleu", isRefined: false },
    expected: 0,
  },
  {
    value1: { name: "bleu", isRefined: false },
    value2: { name: "vert", isRefined: true },
    expected: 1,
  },
  {
    value1: { name: "vert", isRefined: false },
    value2: { name: "bleu", isRefined: true },
    expected: 1,
  },
  {
    value1: { name: "vert", isRefined: true },
    value2: { name: "vert", isRefined: false },
    expected: -1,
  },
  {
    value1: { name: "vert", isRefined: false },
    value2: { name: "vert", isRefined: true },
    expected: 1,
  },
] as DataSet[];

const headingValues = ["vert", "bleu"];
const dataSetHeadingValues = [
  {
    value1: { name: "bleu", isRefined: false },
    value2: { name: "vert", isRefined: false },
    expected: 1,
  },
  {
    value1: { name: "vert", isRefined: false },
    value2: { name: "bleu", isRefined: false },
    expected: -1,
  },
  {
    value1: { name: "bleu", isRefined: false },
    value2: { name: "bleu", isRefined: false },
    expected: 0,
  },
  {
    value1: { name: "bleu", isRefined: false },
    value2: { name: "rouge", isRefined: false },
    expected: -1,
  },
  {
    value1: { name: "vert", isRefined: false },
    value2: { name: "rouge", isRefined: false },
    expected: -1,
  },
  {
    value1: { name: "rouge", isRefined: false },
    value2: { name: "bleu", isRefined: false },
    expected: 1,
  },
  {
    value1: { name: "rouge", isRefined: false },
    value2: { name: "vert", isRefined: false },
    expected: 1,
  },
  {
    value1: { name: "rouge", isRefined: false },
    value2: { name: "rouge", isRefined: false },
    expected: 0,
  },
] as DataSet[];

describe("sortWithHeadingValues", () => {
  it.each(dataSetNoHeadingValues)(
    "without heading values : $value1 and $value2 should return $expected",
    ({ value1, value2, expected }) => {
      expect(sortWithHeadingValues([])(value1, value2)).toBe(expected);
    },
  );

  it.each(dataSetHeadingValues)(
    "with heading values : $value1 and $value2 should return $expected",
    ({ value1, value2, expected }) => {
      expect(sortWithHeadingValues(headingValues)(value1, value2)).toBe(expected);
    },
  );
});
