import { FileAnswer } from "../command/query";
import { ComparableResult } from "./interrogation";
import { correlate, register } from "./correlation";

describe("correlate ()", () => {
  describe("can handle", () => {
    const fileAnswers: FileAnswer[] = [
      [
        "FILE #1",
        {
          "1ST QUESTION": true,
          "2ND QUESTION": true,
        },
      ],
      [
        "FILE #2",
        {
          "1ST QUESTION": true,
          "2ND QUESTION": false,
        },
      ],
    ];

    it("no criteria", () => {
      expect(correlate(fileAnswers)).toEqual([]);
    });

    describe("criteria", () => {
      const name = "EXPECTED CRITERION";
      let mockPredicate: jest.Mock<ComparableResult>;
      let index: number;
      let result: ReturnType<typeof correlate>;
      let report: typeof result[0];

      afterEach(() => {
        mockPredicate.mockClear();
      });
      beforeAll(() => {
        mockPredicate = jest.fn().mockImplementation(answer => answer);
        index = register(name, mockPredicate);
        result = correlate(fileAnswers);
        report = result[index - 1];
      });

      it("calls predicate", () => {
        expect(mockPredicate).toHaveBeenCalledWith(fileAnswers);
      });

      describe("returns report with", () => {
        it("a name", () => {
          expect(report).toEqual(expect.objectContaining({ name }));
        });

        it("data", () => {
          expect(report).toEqual(expect.objectContaining({ data: fileAnswers }));
        });
      });
    });
  });
});
