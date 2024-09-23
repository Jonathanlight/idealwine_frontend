import { getPagesToDisplay } from "./ShopPagination";

it("getPagesToDisplay should return an array of 5 elements max with default shift (2)", () => {
  expect(getPagesToDisplay(1, 10)).toEqual([1, 2, 3, 4, 5]);
  expect(getPagesToDisplay(2, 10)).toEqual([1, 2, 3, 4, 5]);
  expect(getPagesToDisplay(3, 10)).toEqual([1, 2, 3, 4, 5]);
  expect(getPagesToDisplay(4, 10)).toEqual([2, 3, 4, 5, 6]);
  expect(getPagesToDisplay(5, 10)).toEqual([3, 4, 5, 6, 7]);
  expect(getPagesToDisplay(6, 10)).toEqual([4, 5, 6, 7, 8]);
  expect(getPagesToDisplay(7, 10)).toEqual([5, 6, 7, 8, 9]);
  expect(getPagesToDisplay(8, 10)).toEqual([6, 7, 8, 9, 10]);
  expect(getPagesToDisplay(9, 10)).toEqual([6, 7, 8, 9, 10]);
  expect(getPagesToDisplay(10, 10)).toEqual([6, 7, 8, 9, 10]);

  expect(getPagesToDisplay(1, 7)).toEqual([1, 2, 3, 4, 5]);
  expect(getPagesToDisplay(2, 7)).toEqual([1, 2, 3, 4, 5]);
  expect(getPagesToDisplay(3, 7)).toEqual([1, 2, 3, 4, 5]);
  expect(getPagesToDisplay(4, 7)).toEqual([2, 3, 4, 5, 6]);
  expect(getPagesToDisplay(5, 7)).toEqual([3, 4, 5, 6, 7]);
  expect(getPagesToDisplay(6, 7)).toEqual([3, 4, 5, 6, 7]);
  expect(getPagesToDisplay(7, 7)).toEqual([3, 4, 5, 6, 7]);

  expect(getPagesToDisplay(1, 6)).toEqual([1, 2, 3, 4, 5]);
  expect(getPagesToDisplay(2, 6)).toEqual([1, 2, 3, 4, 5]);
  expect(getPagesToDisplay(3, 6)).toEqual([1, 2, 3, 4, 5]);
  expect(getPagesToDisplay(4, 6)).toEqual([2, 3, 4, 5, 6]);
  expect(getPagesToDisplay(5, 6)).toEqual([2, 3, 4, 5, 6]);
  expect(getPagesToDisplay(6, 6)).toEqual([2, 3, 4, 5, 6]);

  expect(getPagesToDisplay(1, 5)).toEqual([1, 2, 3, 4, 5]);
  expect(getPagesToDisplay(2, 5)).toEqual([1, 2, 3, 4, 5]);
  expect(getPagesToDisplay(3, 5)).toEqual([1, 2, 3, 4, 5]);
  expect(getPagesToDisplay(4, 5)).toEqual([1, 2, 3, 4, 5]);
  expect(getPagesToDisplay(5, 5)).toEqual([1, 2, 3, 4, 5]);

  expect(getPagesToDisplay(1, 4)).toEqual([1, 2, 3, 4]);
  expect(getPagesToDisplay(2, 4)).toEqual([1, 2, 3, 4]);
  expect(getPagesToDisplay(3, 4)).toEqual([1, 2, 3, 4]);
  expect(getPagesToDisplay(4, 4)).toEqual([1, 2, 3, 4]);

  expect(getPagesToDisplay(1, 3)).toEqual([1, 2, 3]);
  expect(getPagesToDisplay(2, 3)).toEqual([1, 2, 3]);
  expect(getPagesToDisplay(3, 3)).toEqual([1, 2, 3]);

  expect(getPagesToDisplay(1, 2)).toEqual([1, 2]);
  expect(getPagesToDisplay(2, 2)).toEqual([1, 2]);

  expect(getPagesToDisplay(1, 1)).toEqual([1]);

  expect(getPagesToDisplay(1, 0)).toEqual([]);

  expect(getPagesToDisplay(0, 0)).toEqual([]);
});

it("getPagesToDisplay should return an array of 3 elements max with shift = 1", () => {
  expect(getPagesToDisplay(1, 6, 1)).toEqual([1, 2, 3]);
  expect(getPagesToDisplay(2, 6, 1)).toEqual([1, 2, 3]);
  expect(getPagesToDisplay(3, 6, 1)).toEqual([2, 3, 4]);
  expect(getPagesToDisplay(4, 6, 1)).toEqual([3, 4, 5]);
  expect(getPagesToDisplay(5, 6, 1)).toEqual([4, 5, 6]);
  expect(getPagesToDisplay(6, 6, 1)).toEqual([4, 5, 6]);

  expect(getPagesToDisplay(1, 5, 1)).toEqual([1, 2, 3]);
  expect(getPagesToDisplay(2, 5, 1)).toEqual([1, 2, 3]);
  expect(getPagesToDisplay(3, 5, 1)).toEqual([2, 3, 4]);
  expect(getPagesToDisplay(4, 5, 1)).toEqual([3, 4, 5]);
  expect(getPagesToDisplay(5, 5, 1)).toEqual([3, 4, 5]);

  expect(getPagesToDisplay(1, 4, 1)).toEqual([1, 2, 3]);
  expect(getPagesToDisplay(2, 4, 1)).toEqual([1, 2, 3]);
  expect(getPagesToDisplay(3, 4, 1)).toEqual([2, 3, 4]);
  expect(getPagesToDisplay(4, 4, 1)).toEqual([2, 3, 4]);

  expect(getPagesToDisplay(1, 3, 1)).toEqual([1, 2, 3]);
  expect(getPagesToDisplay(2, 3, 1)).toEqual([1, 2, 3]);
  expect(getPagesToDisplay(3, 3, 1)).toEqual([1, 2, 3]);

  expect(getPagesToDisplay(1, 2, 1)).toEqual([1, 2]);
  expect(getPagesToDisplay(2, 2, 1)).toEqual([1, 2]);

  expect(getPagesToDisplay(1, 1, 1)).toEqual([1]);

  expect(getPagesToDisplay(1, 0, 1)).toEqual([]);

  expect(getPagesToDisplay(0, 0, 1)).toEqual([]);
});
