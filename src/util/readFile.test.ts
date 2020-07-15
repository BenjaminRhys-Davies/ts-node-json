// Mocks
const mockReadFileResult = { value: "EXPECTED READFILE VALUE" };
const mockReadFile = jest.fn().mockImplementation(() => Promise.resolve(mockReadFileResult));
jest.doMock("graceful-fs", () => ({ readFile: mockReadFile }));

const mockPromisify = jest.fn().mockImplementation(() => mockReadFile);
jest.doMock("util", () => ({ promisify: mockPromisify }));

const encoding = "EXPECTED ENCODING";
jest.doMock("../config/encoding", () => ({ encoding }));

// Under test
import { readFile } from "./readFile";

describe("readFile ()", () => {
  afterEach(() => {
    mockPromisify.mockClear();
    mockReadFile.mockClear();
  });

  it("promisifys readFile", () => {
    expect(mockPromisify).toHaveBeenCalledWith(mockReadFile);
  });

  describe("should", () => {
    const path = "EXPECTED PATH";
    let result: string;

    beforeEach(async () => {
      result = await readFile(path);
    });

    it("call readFile", () => {
      expect(mockReadFile).toHaveBeenCalledWith(path, { encoding });
    });

    it("return a promise", () => {
      expect(result).toEqual(mockReadFileResult);
    });
  });
});
