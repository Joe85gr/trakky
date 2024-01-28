import { calculateChangePercentage, getPreviousYearTotal, getYearPartialTotal } from "../../src/lib/calculators";
import { Total } from "../../src/components/ui/summary";

describe('testing calculateChange', () => {
  test('when previous is 0, should return 0', () => {
    // arrange
    const expectedResult = 0;

    // act
    const result = calculateChangePercentage(1795, 0);

    // assert
    expect(result).toBe(expectedResult);
  });

  test('when previous is not 0, should calculate percentage change', () => {
    // arrange
    const expectedResult = -10.25;

    // act
    const result = calculateChangePercentage(1795, 2000);

    // assert
    expect(result).toBe(expectedResult);
  });
});

describe('testing getPreviousYearPartialTotal', () => {
  test('when no totals, should return 0', () => {
    // arrange
    const totalsPerYear = [] as unknown as Total[];
    const expectedResult = 0;

    // act
    const result = getYearPartialTotal(totalsPerYear, new Date());

    // assert
    expect(result).toBe(expectedResult);
  });

  test('when totals, should return total', () => {
    // arrange
    const totalsPerYear = [
      { date: "2021-01-01", amount: 100 },
      { date: "2021-02-01", amount: 200 },
      { date: "2021-03-01", amount: 300 },
      { date: "2021-04-01", amount: 400 },
      { date: "2022-01-01", amount: 200 },
    ] as unknown as Total[];

    const date = new Date("2021-02-01");

    const expectedResult = 300;

    // act
    const result = getYearPartialTotal(totalsPerYear, date);

    // assert
    expect(result).toBe(expectedResult);
  });
})

describe('testing getPreviousYearTotal', () => {
  test('should return previous year total', () => {
    // arrange
    const totalsPerYear = [
      { date: "2021-01-01", amount: 100 },
      { date: "2021-02-01", amount: 200 },
      { date: "2021-03-01", amount: 300 },
      { date: "2021-04-01", amount: 400 },
      { date: "2022-01-01", amount: 200 },
    ] as unknown as Total[];

    const selectedYear = "2022";

    const expectedResult = 1000;

    // act
    const result = getPreviousYearTotal(totalsPerYear, selectedYear);

    // assert
    expect(result).toBe(expectedResult);
  });

  test('when no totals, should return 0', () => {
    // arrange
    const totalsPerYear = [] as unknown as Total[];
    const expectedResult = 0;

    // act
    const result = getYearPartialTotal(totalsPerYear, new Date());

    // assert
    expect(result).toBe(expectedResult);
  });

  test('when no previous year total, should return 0', () => {
    // arrange
    const totalsPerYear = [
      { date: "2021-01-01", amount: 100 },
      { date: "2021-02-01", amount: 200 },
      { date: "2021-03-01", amount: 300 },
      { date: "2021-04-01", amount: 400 },
      { date: "2022-01-01", amount: 200 },
    ] as unknown as Total[];

    const selectedYear = "2021";

    const expectedResult = 0;

    // act
    const result = getPreviousYearTotal(totalsPerYear, selectedYear);

    // assert
    expect(result).toBe(expectedResult);
  });
})