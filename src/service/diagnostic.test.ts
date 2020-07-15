import { WriteStream } from "graceful-fs";

// Mocks
const mockClose = jest.fn();
const mockInitResult = ({ writable: true }) as WriteStream;
const mockInit = jest.fn().mockImplementation(() => mockInitResult);
const mockLogResult = false;
const mockLog = jest.fn().mockImplementation(() => mockLogResult);
jest.doMock("../util/writeStream", () => ({
  close: mockClose,
  init: mockInit,
  log: mockLog,
}));

const mockNowResult = new Date("2020-02-21T09:07:19.309Z");
const mockNow = jest.fn().mockImplementation(() => mockNowResult);
jest.doMock("../util/date", () => ({ now: mockNow }));

// Under test
import { info, error, stop } from "./diagnostic";

describe("diagnostic", () => {
  afterEach(() => {
    mockClose.mockClear();
    mockInit.mockClear();
    mockLog.mockClear();
    mockNow.mockClear();
  });

  it("initialises write stream", () => {
    expect(mockInit).toHaveBeenCalledWith("diagnostics.log");
  });

  describe("error ()", () => {
    describe("should", () => {
      const e = { name: "ERROR", message: "EXPECDTED MESSAGE" } as Error;
      let result: boolean;

      beforeEach(() => {
        result = error(e);
      });

      describe("write error line", () => {
        it("call log", () => {
          expect(mockLog).toHaveBeenCalled();
        });
        it("with stream", () => {
          const [[stream]] = mockLog.mock.calls;

          expect(stream).toEqual(mockInitResult);
        });
        it("with message", () => {
          const [[, message]] = mockLog.mock.calls;

          expect(message).toContain(mockNowResult.toISOString());
          expect(message).toContain(JSON.stringify(e));
        });
      });

      it("return success", () => {
        expect(result).toEqual(mockLogResult);
      });
    });
  });

  describe("info ()", () => {
    describe("should", () => {
      const line = "EXPECTED MESSAGE";
      let result: boolean;

      beforeEach(() => {
        result = info(line);
      });

      describe("write log line", () => {
        it("call log", () => {
          expect(mockLog).toHaveBeenCalled();
        });
        it("with stream", () => {
          const [[stream]] = mockLog.mock.calls;

          expect(stream).toEqual(mockInitResult);
        });
        it("with message", () => {
          const [[, message]] = mockLog.mock.calls;

          expect(message).toContain(mockNowResult.toISOString());
          expect(message).toContain(line);
        });
      });

      it("return success", () => {
        expect(result).toEqual(mockLogResult);
      });
    });
  });

  describe("stop ()", () => {
    describe("should", () => {
      const stopMockResult = new Date("2020-02-21T09:07:20.559Z");

      beforeEach(() => {
        mockNow.mockImplementation(() => stopMockResult);
        stop();
      });

      describe("write finish line", () => {
        const duration = stopMockResult.getTime() - mockNowResult.getTime();

        it("call log", () => {
          expect(mockLog).toHaveBeenCalled();
        });
        it("with stream", () => {
          const [[stream]] = mockLog.mock.calls;

          expect(stream).toEqual(mockInitResult);
        });
        it("with message", () => {
          const [[, message]] = mockLog.mock.calls;

          expect(message).toContain(stopMockResult.toISOString());
          expect(message).toContain(`${duration}ms`);
        });
      });

      it("return success", () => {
        expect(mockClose).toHaveBeenCalledWith(mockInitResult);
      });
    });
  });
});
