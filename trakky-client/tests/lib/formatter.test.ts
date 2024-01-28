import {
  firstOfTheMonthDateString,
  formatCurrency,
  formatDateMonth,
  formatToShortDate,
  isValidDate
} from "../../src/lib/formatter";

describe('testing formatCurrency', () => {
  test('should format number to £ currency', () => {
    // arrange
    const total = 1748;
    const expectedResult = "£1,748.00";

    // act
    const result = formatCurrency(total);

    // assert
    expect(result).toBe(expectedResult);
  });
});

describe('testing formatDateMonth', () => {
  test('should format numeric date to month name', () => {
    // arrange
    const date = new Date("2021-01-01");
    const expectedResult = "January";

    // act
    const result = formatDateMonth(date);

    // assert
    expect(result).toBe(expectedResult);
  });
});

describe('testing formatToShortDate', () => {
  test('should format string date to short date', () => {
    // arrange
    const date = "2021-01-01";
    const expectedResult = "01/01/2021";

    // act
    const result = formatToShortDate(date);

    // assert
    expect(result).toBe(expectedResult);
  });
});

describe('testing isValidDate', () => {
  test('should return true if date is valid', () => {
    // arrange
    const date = "2021-01-01";

    // act
    const result = isValidDate(date);

    // assert
    expect(result).toBe(true);
  });

  test('should return false if date is invalid', () => {
    // arrange
    const date = "some nonsense";

    // act
    const result = isValidDate(date);

    // assert
    expect(result).toBe(false);
  });
});

describe('testing firstOfTheMonthDateString', () => {
  test('should return first of the month date string', () => {
    // arrange
    const date = new Date("2021-01-15");
    const expectedResult = new Date("2021-01-01");

    // act
    const result = firstOfTheMonthDateString(date);

    // assert
    expect(result).toStrictEqual(expectedResult);
  });
});