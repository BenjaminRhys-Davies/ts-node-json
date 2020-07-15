import { question, register } from "./interrogation";

describe("question ()", () => {
  describe("can ask", () => {
    it("no questions", () => {
      expect(question("lkjsdfklsdf")).toEqual({});
    });

    describe("a", () => {
      const json = "EXPECTED JSON";
      const name = "EXPECTED QUESTION";
      let mockPredicate: jest.Mock<boolean>;
      let result: ReturnType<typeof question>;

      describe("positive question", () => {
        const answer = true;

        beforeEach(() => {
          mockPredicate = jest.fn().mockImplementation(() => answer);
          register(name, mockPredicate);
          result = question(json);
        });

        it("calls predicate", () => {
          expect(mockPredicate).toHaveBeenCalledWith(json);
        });

        it("returns answer", () => {
          expect(result).toEqual({ [name]: answer });
        });
      });
      describe("negative question", () => {
        const answer = false;

        beforeEach(() => {
          mockPredicate = jest.fn().mockImplementation(() => answer);
          register(name, mockPredicate);
          result = question(json);
        });

        it("calls predicate", () => {
          expect(mockPredicate).toHaveBeenCalledWith(json);
        });

        it("returns answer", () => {
          expect(result).toEqual({ [name]: answer });
        });
      });
    });

    describe("many questions", () => {
      const json = "EXPECTED JSON";
      const questions = [
        {
          answer: true,
          name: "A POSITIVE QUESTION",
          mockPredicate: jest.fn(),
        },
        {
          answer: false,
          name: "A NEGATIVE QUESTION",
          mockPredicate: jest.fn(),
        },
        {
          answer: false,
          name: "ANOTHER QUESTION",
          mockPredicate: jest.fn(),
        },
      ];
      let result: ReturnType<typeof question>;

      afterEach(() => {
        questions.forEach(({ mockPredicate }) => mockPredicate.mockClear());
      });
      beforeEach(() => {
        questions.forEach(({ answer, name, mockPredicate }) => {
          register(name, mockPredicate.mockImplementation(() => answer));
        });
        result = question(json);
      });

      it("calls each predicate", () => {
        questions.forEach(({ mockPredicate }) => {
          expect(mockPredicate).toHaveBeenCalledWith(json);
        });
      });

      it("returns all answers", () => {
        questions.forEach(({ answer, name }) => {
          expect(result).toEqual(expect.objectContaining({ [name]: answer }));
        });
      });
    });
  });
});
