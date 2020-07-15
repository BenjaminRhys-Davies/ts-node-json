import { correlate } from "../service/correlation";

// Mocks
const mockQuery = jest.fn();
jest.doMock("./query", () => ({ query: mockQuery }));
const mockCorrelate = jest.fn();
jest.doMock("../service/correlation", () => ({ correlate: mockCorrelate }));
const mockDiagnosticInfo = jest.fn();
jest.doMock("../service/diagnostic", () => ({ info: mockDiagnosticInfo }));
const mockWriteFile = jest.fn();
jest.doMock("../util/writeStream", () => ({ writeFile: mockWriteFile }));

// Under test
import { report } from "./report";

describe("report ()", () => {
  const filename = "EXPECTED_REPORT.json";
  const filePath = "EXPECTED FILE PATH";
  const answers = "EXPECTED ANSWERS";
  const reports: ReturnType<typeof correlate> = [
    { name: "REPORT #1", data: { "question #1": true }, },
  ];
  let result: ReturnType<typeof correlate>;

  describe("should", () => {

    afterEach(() => {
      mockQuery.mockClear();
      mockCorrelate.mockClear();
      mockDiagnosticInfo.mockClear();
      mockWriteFile.mockClear();
    });
    beforeEach(async () => {
      mockQuery.mockImplementation(async () => Promise.resolve(answers));
      mockCorrelate.mockImplementation(() => reports);
      result = await report(filePath, { filename });
    });

    it("call query service", () => {
      expect(mockQuery).toHaveBeenCalledWith(filePath, { extension: undefined });
    });
    it("call corralate service", () => {
      expect(mockCorrelate).toHaveBeenCalledWith(answers);
    });
    it("write report file", () => {
      expect(mockWriteFile).toHaveBeenCalledWith(filename, reports);
    });
    it("return result", () => {
      expect(result).toEqual(reports);
    });
  });

  describe("can", () => {
    afterEach(() => {
      mockDiagnosticInfo.mockClear();
    });
    beforeEach(async () => {
      mockQuery.mockImplementation(async () => Promise.resolve(answers));
      mockCorrelate.mockImplementation(() => reports);
      result = await report(filePath, { filename, verbose: true });
    });

    reports.forEach(({ data, name }, i) => {
      it(`log ${name} report`, () => {
        const [message] = mockDiagnosticInfo.mock.calls[i];

        expect(message).toContain(name);
        expect(message).toContain(JSON.stringify(data));
      });
    });
  });
});
