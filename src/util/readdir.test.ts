// Mocks
const mockIsFile = jest.fn().mockImplementation(() => true);
const mockReaddirResult = [{ name: "EXPECTED DIRENT", isFile: mockIsFile }];
const mockReaddir = jest.fn().mockImplementation(() => Promise.resolve(mockReaddirResult));
jest.doMock("graceful-fs", () => ({ readdir: mockReaddir }));

const mockExtname = jest.fn();
const mockJoin = jest.fn().mockImplementation((path: string, name: string) => `${path}${name}`);
jest.doMock("path", () => ({ extname: mockExtname, join: mockJoin }));

const mockPromisify = jest.fn().mockImplementation(() => mockReaddir);
jest.doMock("util", () => ({ promisify: mockPromisify }));

const encoding = "EXPECTED ENCODING";
jest.doMock("../config/encoding", () => ({ encoding }));

// Under test
import { readdir } from "./readdir";

interface File {
  isFile: () => boolean;
  name: string;
}

describe("readdir ()", () => {
  const path = "EXPECTED PATH";
  const genIsFile = (file: boolean): File["isFile"] => () => file;
  let result: string[];

  afterEach(() => {
    mockJoin.mockClear();
    mockPromisify.mockClear();
  });

  it("promisifys readdir", () => {
    expect(mockPromisify).toHaveBeenCalledWith(mockReaddir);
  });

  describe("should", () => {
    beforeEach(async () => {
      result = await readdir(path);
    });

    it("call readFile", () => {
      expect(mockReaddir).toHaveBeenCalledWith(path, { encoding, withFileTypes: true });
    });

    it("return a promise", () => {
      const { 0: { name }} = mockReaddirResult;

      expect(result).toEqual([`${path}${name}`]);
      expect(mockJoin).toHaveBeenCalledTimes(mockReaddirResult.length);
    });
  });

  describe("should only return", () => {
    const folders: File[] = [
      "UNEXPECTED",
    ].map(name => ({ name, isFile: genIsFile(false) }));
    const file: File = {
      isFile: genIsFile(true),
      name: "EXPECTED",
    };

    beforeEach(async () => {
      mockReaddir.mockImplementation(() => Promise.resolve([...folders, file]));
      result = await readdir(path);
    });

    it("files", () => {
      expect(result).toEqual([`${path}${file.name}`]);
      expect(mockJoin).toHaveBeenCalledTimes(1);
    });
  });

  describe("should only return", () => {
    const extension = ".json";
    const isFile: File["isFile"] = genIsFile(true);
    const invalidExtensions: File[] = [
      { isFile, name: "json" },
      { isFile, name: "..json" },
    ];
    const validExtensions: File[] = [
      { isFile, name: extension },
      { isFile, name: extension.toUpperCase() },
    ];

    beforeEach(async () => {
      mockReaddir.mockImplementation(() => Promise.resolve([...invalidExtensions, ...validExtensions]));
      mockExtname.mockImplementation(name => name);
      result = await readdir(path, extension);
    });

    it("files with extension", () => {
      expect(result).toEqual(validExtensions.map(({ name }) => `${path}${name}`));
      expect(mockExtname).toHaveBeenCalledTimes(invalidExtensions.length + validExtensions.length);
    });
  });
});
