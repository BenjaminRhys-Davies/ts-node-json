// Mocks
interface ConsoleMock {
  error: jest.Mock<string>;
  info: jest.Mock<string>;
  log: jest.Mock<string>;
  warn: jest.Mock<string>;
}
const consoleMock: ConsoleMock = {
  error: jest.fn().mockImplementation(str => str),
  info: jest.fn().mockImplementation(str => str),
  log: jest.fn().mockImplementation(str => str),
  warn: jest.fn().mockImplementation(str => str),
};

const mockProgressBarResult = { message: "EXPECTED" };
const mockProgressBar = jest.fn().mockImplementation(() => mockProgressBarResult);
jest.doMock("progress", () => ({ __esModule: true, default: mockProgressBar }));

const realConsole = global.console;
Object.defineProperty(global, "console", {
  value: consoleMock,
  writable: true,
});

// Under test
import * as display from "./display";

describe("display", () => {
  afterAll(() => {
    global.console = realConsole;
  });

  afterEach(() => {
    mockProgressBar.mockClear();
    Object.keys(consoleMock).forEach((method: keyof ConsoleMock) => consoleMock[method].mockClear());
  });

  describe("code ()", () => {
    const msg = "EXPECTED ERROR";

    beforeEach(() => {
      display.code(msg);
    });

    it("calls console info", () => {
      expect(consoleMock.info).toHaveBeenCalledWith(expect.stringMatching(msg));
    });
  });
  describe("error ()", () => {
    const msg = "EXPECTED ERROR";

    beforeEach(() => {
      display.error(msg);
    });

    it("calls console error", () => {
      expect(consoleMock.error).toHaveBeenCalledWith(expect.stringMatching(msg));
    });
  });
  describe("info ()", () => {
    const msg = "EXPECTED INFO";

    beforeEach(() => {
      display.info(msg);
    });

    it("calls console info", () => {
      expect(consoleMock.info).toHaveBeenCalledWith(expect.stringMatching(msg));
    });
  });
  describe("log ()", () => {
    const msg = "EXPECTED LOG";

    beforeEach(() => {
      display.log(msg);
    });

    it("calls console log", () => {
      expect(consoleMock.log).toHaveBeenCalledWith(expect.stringMatching(msg));
    });
  });
  describe("warning ()", () => {
    const msg = "EXPECTED WARNING";

    beforeEach(() => {
      display.warning(msg);
    });

    it("calls console warn", () => {
      expect(consoleMock.warn).toHaveBeenCalledWith(expect.stringMatching(msg));
    });
  });
  describe("welcome ()", () => {
    beforeEach(() => {
      display.welcome();
    });

    it("calls console log", () => {
      expect(consoleMock.log).toHaveBeenCalledWith(expect.any(String));
    });
  });
  describe("progress ()", () => {
    const total = 987654321;
    let result: ProgressBar;

    beforeEach(() => {
      result = display.progress(total);
    });

    it("calls progress", () => {
      expect(mockProgressBar).toHaveBeenCalledWith(
        expect.any(String),
        {
          total,
          complete: expect.any(String),
          incomplete: expect.any(String),
          width: expect.any(Number),
        },
      );
    });

    it("returns a class", () => {
      expect(result).toEqual(mockProgressBarResult);
    });
  });
});
