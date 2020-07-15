const mockInterrogationRegister = jest.fn();
jest.doMock("../service/interrogation", () => ({ register: mockInterrogationRegister }));

const mockParserRegister = jest.fn();
jest.doMock("../service/parser", () => ({ register: mockParserRegister }));

const mockCorrelationRegister = jest.fn();
jest.doMock("../service/correlation", () => ({ register: mockCorrelationRegister }));

import { extension } from "./json";

describe("json", () => {
  it("has an extension", () => {
    expect(extension).toEqual(".json");
  });

  describe("registers", () => {
    const questionName = "bigrams";

    it("parser", () => {
      expect(mockParserRegister).toHaveBeenCalledTimes(1);
      expect(mockParserRegister).toHaveBeenCalledWith(extension, expect.any(Function));
    });

    describe("parser", () => {
      let parserFn: (str: string) => {} | undefined;

      beforeAll(() => {
        [{ 1: parserFn }] = mockParserRegister.mock.calls;
      });

      it("success", () => {
        expect(parserFn("{\"json\":true}")).toEqual({ json: true });
      });
      it("failure", () => {
        expect(parserFn("{")).toEqual(undefined);
      });
    });

    it("question", () => {
      const m_BiGrams = ["EXPECTED"];
      const [{ 1: questionFn }] = mockInterrogationRegister.mock.calls;

      expect(mockInterrogationRegister).toHaveBeenCalledTimes(1);
      expect(mockInterrogationRegister).toHaveBeenCalledWith(questionName, expect.any(Function));
      expect(questionFn({ m_BiGrams })).toEqual(m_BiGrams);
    });

    it("correlation criteria", () => {
      const answers = [
        ["file01.json", { [questionName]: ["The", "quick", "lively", "brown", "fox"] }],
        ["file02.json", { [questionName]: ["jumps", "over", "the", "lazy", "sleeping", "dog"] }],
        ["file03.json", { [questionName]: ["the", "the", "THE", "dog", "DOG"] }],
      ];
      const [{ 1: criteriaFn }] = mockCorrelationRegister.mock.calls;

      expect(mockCorrelationRegister).toHaveBeenCalledTimes(1);
      expect(mockCorrelationRegister).toHaveBeenCalledWith("bigrams", expect.any(Function));
      expect(criteriaFn(answers)).toEqual([
        { text: "the", frequency: 5 },
        { text: "dog", frequency: 3 },
        { text: "quick", frequency: 1 },
        { text: "lively", frequency: 1 },
        { text: "brown", frequency: 1 },
        { text: "fox", frequency: 1 },
        { text: "jumps", frequency: 1 },
        { text: "over", frequency: 1 },
        { text: "lazy", frequency: 1 },
        { text: "sleeping", frequency: 1 },
      ]);
    });
  });
});