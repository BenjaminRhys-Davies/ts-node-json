// Mocks
const mockCat = jest.fn();
jest.mock("./cat", () => ({ cat: mockCat }));
const mockLs = jest.fn();
jest.mock("./ls", () => ({ ls: mockLs }));
const mockProgress = jest.fn();
jest.mock("../util/display", () => ({ progress: mockProgress }));
const mockDiagnosticInfo = jest.fn();
jest.mock("../service/diagnostic", () => ({ info: mockDiagnosticInfo }));
const mockParse = jest.fn();
jest.doMock("../service/parser", () => ({ parse: mockParse }));
const mockQuestion = jest.fn();
jest.doMock("../service/interrogation", () => ({ question: mockQuestion }));

// Under test
import { FileAnswer, query } from "./query";

describe("query ()", () => {
  describe("should handle", () => {
    const filePath = "EXPECTED DIRECTORY PATH";
    const extension = "EXPECTED EXTENSION";
    let result: FileAnswer[];

    afterEach(() => {
      mockCat.mockClear();
      mockDiagnosticInfo.mockClear();
      mockLs.mockClear();
      mockParse.mockClear();
      mockProgress.mockClear();
      mockQuestion.mockClear();
    });

    describe("no files", () => {
      beforeEach(async () => {
        mockLs.mockImplementation(async () => Promise.resolve([]));
        result = await query(filePath);
      });

      it("return result", () => {
        expect(result).toEqual([]);
      });
    });

    describe("some files", () => {
      const questionMockResult = (fileName: string) => ({ "what is the filename": fileName });
      const fileNames = [
        "EXPECTED FILE #1",
        "EXPECTED FILE #2",
      ];
      let mockTick: jest.Mock<void>;

      beforeEach(async () => {
        mockLs.mockImplementation(async () => Promise.resolve(fileNames));
        mockCat.mockImplementation(async fileName => Promise.resolve(fileName));
        mockParse.mockImplementation((_, fileName) => fileName);
        mockQuestion.mockImplementation(questionMockResult);
        mockTick = jest.fn();
        mockProgress.mockImplementation(() => ({ tick: mockTick }));
        result = await query(filePath, { extension, verbose: true });
      });

      describe("should", () => {
        it("call ls", () => {
          expect(mockLs).toHaveBeenCalledWith(filePath, { extension });
        });
        it("call progress", () => {
          expect(mockProgress).toHaveBeenCalledWith(fileNames.length);
        });
        describe("call", () => {
          fileNames.forEach((fileName, i) => {
            it("cat ()", () => {
              expect(mockCat.mock.calls[i]).toEqual([fileName]);
            });
            it("parse ()", () => {
              expect(mockParse.mock.calls[i]).toEqual([extension, fileName]);
            });
            it("question ()", () => {
              expect(mockQuestion.mock.calls[i]).toEqual([fileName]);
            });
            it("info ()", () => {
              const [msg] = mockDiagnosticInfo.mock.calls[i];

              expect(msg).toMatch(`<${fileName}>`);
              expect(msg).toMatch(JSON.stringify(questionMockResult(fileName)));
            });
            it("progress bar tick ()", () => {
              expect(mockTick.mock.calls[i]).toEqual([]);
            });
          });
        });
        it("return result", () => {
          expect(result).toEqual(fileNames.map(fileName => [fileName, questionMockResult(fileName)]));
        });
      });
    });

    describe("some files with unparsable content", () => {
      const questionMockResult = () => ({ "EXPECTED QUESTION": {}});
      const fileNames = [
        "EXPECTED FILE #1",
      ];
      let mockTick: jest.Mock<void>;

      beforeEach(async () => {
        mockLs.mockImplementation(async () => Promise.resolve(fileNames));
        mockCat.mockImplementation(async fileName => Promise.resolve(fileName));
        mockParse.mockImplementation(() => undefined);
        mockQuestion.mockImplementation(questionMockResult);
        mockTick = jest.fn();
        mockProgress.mockImplementation(() => ({ tick: mockTick }));
        result = await query(filePath, { extension });
      });

      describe("should", () => {
        describe("handle files", () => {
          fileNames.forEach((_, i) => {
            it("question ()", () => {
              expect(mockQuestion.mock.calls[i]).toEqual([undefined]);
            });
          });
        });
        it("return result", () => {
          expect(result).toEqual(fileNames.map(fileName => [fileName, questionMockResult()]));
        });
      });
    });
  });
});
