// Mocks
const mockReadFile = jest.fn();
jest.doMock("../util/readFile", () => ({ readFile: mockReadFile }));

const mockDiagnosticError = jest.fn();
jest.doMock("../service/diagnostic", () => ({ error: mockDiagnosticError }));

// Under test
import { cat } from "./cat";

describe("cat ()", () => {
  describe("should handle", () => {
    const filePath = "EXPECTED FILE PATH";
    let result: string;

    afterEach(() => {
      mockReadFile.mockClear();
      mockDiagnosticError.mockClear();
    });

    describe("success", () => {
      const success = "EXPECTED SUCCESS VALUE";

      beforeEach(async () => {
        mockReadFile.mockImplementation(async () => Promise.resolve(success));
        result = await cat(filePath);
      });

      it("calls readFile", () => {
        expect(mockReadFile).toHaveBeenCalledWith(filePath);
      });
      it("returns result", () => {
        expect(result).toEqual(success);
      });
    });

    describe("failure", () => {
      const error = "EXPECTED ERROR VALUE";

      beforeEach(async () => {
        mockReadFile.mockImplementation(async () => {
          throw error;
        });
        await cat(filePath).catch(r => {
          result = r;
        });
      });

      it("calls readFile", () => {
        expect(mockReadFile).toHaveBeenCalledWith(filePath);
      });
      it("logs error", () => {
        const [[e]] = mockDiagnosticError.mock.calls;

        expect(e).toContain(error);
      });
    });
  });
});
