// Mocks
const dateTime = "2020-02-21T09:07:19.309Z";
const mockDateResult = new Date(dateTime);
const DateStub = class extends Date {
  constructor() {
    super();
    return mockDateResult;
  }
};

Object.defineProperty(global, "Date", {
  value: DateStub,
  writable: true,
});

// Under test
import { now } from "./date";

describe("now ()", () => {
  describe("returns", () => {
    it("a date object", () => {
      expect(now()).toEqual(mockDateResult);
    });

    it("with dateTime", () => {
      expect(now().toISOString()).toEqual(dateTime);
    });
  });
});
