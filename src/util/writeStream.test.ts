import { WriteStream } from "graceful-fs";

// Mocks
const mockCreateWriteStreamResult = jest.fn();
const mockCreateWriteStream = jest.fn().mockImplementation(() => mockCreateWriteStreamResult);
jest.doMock("graceful-fs", () => ({ createWriteStream: mockCreateWriteStream }));

const encoding = "EXPECTED ENCODING";
jest.doMock("../config/encoding", () => ({ encoding }));

// Under test
import { close, init, log, writeFile } from "./writeStream";

describe("writeStream", () => {
  afterEach(() => {
    mockCreateWriteStream.mockClear();
  });

  describe("close ()", () => {
    describe("should", () => {
      let end: WriteStream["end"];

      beforeEach(() => {
        end = jest.fn();
      });

      describe("close", () => {
        beforeEach(() => {
          close({ end, writable: true } as WriteStream);
        });

        it("a writable stream", () => {
          expect(end).toHaveBeenCalledWith();
        });
      });
      describe("not close", () => {
        beforeEach(() => {
          close({ end, writable: false } as WriteStream);
        });

        it("an non-writable stream", () => {
          expect(end).not.toHaveBeenCalledWith();
        });
      });
    });
  });

  describe("init ()", () => {
    afterEach(() => {
      mockCreateWriteStreamResult.mockReset();
    });

    describe("should", () => {
      const fileName = "EXPECTED FILE NAME";
      let result: WriteStream;

      beforeAll(() => {
        result = init(fileName);
      });

      it("create a stream", () => {
        expect(mockCreateWriteStream).toHaveBeenCalledWith(
          fileName,
          { encoding, flags: "a" },
        );
      });

      it("returns stream", () => {
        expect(result).toEqual(mockCreateWriteStreamResult);
      });

      describe("accept optional flags", () => {
        const flags = "EXPECTED FLAGS";

        beforeAll(() => {
          result = init(fileName, flags);
        });

        it("create a stream", () => {
          expect(mockCreateWriteStream).toHaveBeenCalledWith(
            fileName,
            { encoding, flags },
          );
        });
      });
    });
  });

  describe("log ()", () => {
    let result: boolean;

    describe("should", () => {
      const content = "EXPECTED LOG LINE";
      let write: WriteStream["write"];

      beforeEach(() => {
        write = jest.fn().mockImplementation(() => true);
      });

      describe("close", () => {
        beforeEach(() => {
          result = log(
            { write, writable: true } as WriteStream,
            content,
          );
        });

        it("a writable stream", () => {
          expect(write).toHaveBeenCalledWith(`${content}\n`);
        });

        it("return success", () => {
          expect(result).toEqual(true);
        });
      });
      describe("not close", () => {
        beforeEach(() => {
          result = log(
            { write, writable: false } as WriteStream,
            content,
          );
        });

        it("an non-writable stream", () => {
          expect(write).not.toHaveBeenCalled();
        });

        it("return failure", () => {
          expect(result).toEqual(false);
        });
      });
    });
  });

  describe("writeFile ()", () => {
    describe("should", () => {
      const content = {
        thisIs: "json",
      };
      const fileName = "expected-file-name.json";
      let end: WriteStream["end"];
      let write: WriteStream["write"];

      beforeEach(() => {
        end = jest.fn();
        write = jest.fn().mockImplementation(() => true);
        mockCreateWriteStream.mockImplementation(() => ({ end, write, writable: true }) as WriteStream);
        writeFile(fileName, content);
      });

      it("create writable stream", () => {
        expect(mockCreateWriteStream).toHaveBeenCalledWith(fileName, { encoding, flags: "w" });
      });

      it("write content", () => {
        expect(write).toHaveBeenCalledWith(`${JSON.stringify(content, null, "\t")}\n`);
      });

      it("close stream", () => {
        expect(end).toHaveBeenCalledWith();
      });
    });
  });
});
