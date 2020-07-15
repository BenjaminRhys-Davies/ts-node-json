// Mocks
const mockReaddir = jest.fn();
jest.doMock("../util/readdir", () => ({ readdir: mockReaddir }));

const mockDiagnosticError = jest.fn();
const mockDiagnosticInfo = jest.fn();
jest.doMock("../service/diagnostic", () => ({
  error: mockDiagnosticError,
  info: mockDiagnosticInfo,
}));

// Under test
import { ls } from "./ls";

describe("ls ()", () => {
  const filePath = "EXPECTED DIRECTORY PATH";
  const success = ["EXPECTED SUCCESS"];
  let result: string[];

  describe("should handle", () => {
    afterEach(() => {
      mockDiagnosticError.mockClear();
      mockDiagnosticInfo.mockClear();
      mockReaddir.mockClear();
    });

    describe("success", () => {

      describe("with extension", () => {
        const extension = "EXPECTED EXTENSION";

        afterEach(() => {
          mockDiagnosticError.mockClear();
        });
        beforeEach(async () => {
          mockReaddir.mockImplementation(async () => Promise.resolve(success));
          result = await ls(filePath, { extension, verbose: true });
        });

        it("calls readFile", () => {
          expect(mockReaddir).toHaveBeenCalledWith(filePath, extension);
        });
        it("logs diagnostic info", () => {
          const [[message]] = mockDiagnosticInfo.mock.calls;

          expect(message).toContain(`${success.length} '${extension}' files`);
        });
        it("returns result", () => {
          expect(result).toEqual(success);
        });
      });
      describe("without extension", () => {
        const extension: string = undefined;

        beforeEach(async () => {
          mockReaddir.mockImplementation(async () => Promise.resolve(success));
          result = await ls(filePath, { verbose: true });
        });

        it("calls readFile", () => {
          expect(mockReaddir).toHaveBeenCalledWith(filePath, extension);
        });
        it("logs diagnostic info", () => {
          const [[message]] = mockDiagnosticInfo.mock.calls;

          expect(message).toContain(`${success.length} files`);
        });
        it("returns result", () => {
          expect(result).toEqual(success);
        });
      });
    });

    describe("failure", () => {
      const error = "EXPECTED ERROR VALUE";

      beforeEach(async () => {
        mockReaddir.mockImplementation(async () => {
          throw error;
        });
        result = await ls(filePath, { verbose: true });
      });

      it("calls readFile", () => {
        expect(mockReaddir).toHaveBeenCalledWith(filePath, undefined);
      });
      it("logs error", () => {
        const [[e]] = mockDiagnosticError.mock.calls;

        expect(e).toContain(error);
      });
    });
  });

  describe("can not", () => {
    beforeEach(async () => {
      mockReaddir.mockImplementation(async () => Promise.resolve(success));
      result = await ls(filePath);
    });
    it("does not log", () => {
      expect(mockDiagnosticInfo).not.toHaveBeenCalled();
    });
  });
});
