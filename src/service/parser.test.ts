import { parse, register } from "./parser";

describe("parse ()", () => {
  describe("can handle", () => {
    it("an unknown extension", () => {
      expect(parse("UNKNOWN EXTENSION", "erggdgdfgdgertge")).toBeUndefined();
    });
    describe("a known extension", () => {
      const extension = "KNOWN";
      const content = "INPUT CONTENT";
      const parsedResult = "EXPECTED RESULT";
      let mockHandler: jest.Mock<string>;
      let result: string;

      afterEach(() => {
        mockHandler.mockClear();
      });
      beforeEach(() => {
        mockHandler = jest.fn().mockImplementation(() => parsedResult);
        register(extension, mockHandler);
        result = parse<string>(extension, content);
      });

      it("call handler", () => {
        expect(mockHandler).toHaveBeenCalledWith(content);
      });

      it("return content", () => {
        expect(result).toEqual(parsedResult);
      });
    });
  });
});
