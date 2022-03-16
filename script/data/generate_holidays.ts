import https, { RequestOptions } from "node:https";
import { IncomingMessage } from "node:http";
import path from "node:path";
import { writeFile } from "node:fs/promises";
import iconv from "iconv-lite";

const requestGet = (url: string | URL, options: RequestOptions = {}): Promise<IncomingMessage> =>
  new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timeoutId: NodeJS.Timeout | null = null;
    const req = https.get(url, { ...options, signal: controller.signal }, (res) => {
      if (timeoutId != null) clearTimeout(timeoutId);
      resolve(res);
    });
    req.on("error", reject);
  });

const getCsvData = (): Promise<string> =>
  new Promise((resolve, reject) => {
    const buffers: Buffer[] = [];
    requestGet("https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv").then((response) => {
      response.on("data", (chunk) => {
        buffers.push(chunk);
      });
      response.on("error", reject);
      response.on("end", () => {
        const csv = iconv.decode(Buffer.concat(buffers), "Shift-JIS");
        resolve(csv);
      });
    });
  });

interface Holiday {
  [date: string /* YYYY-MM-DD */]: {
    name: string;
  };
}

const main = async (): Promise<void> => {
  const holiday: Holiday = {};
  const csv = await getCsvData();
  csv
    .split(/\r?\n/g)
    .slice(1 /* Skip header line */)
    .filter((line) => line.startsWith("20"))
    .forEach((line) => {
      const arr = line.split(",", 2);
      if (arr.length !== 2) throw new Error(`Invalid line format: "${line}"`);

      const [year, month, day] = arr[0].split("/");
      const name = arr[1].trim();

      const date = `${year}-${(month ?? "").padStart(2, "0")}-${(day ?? "").padStart(2, "0")}`;
      holiday[date] = { name };
    });

  await writeFile(
    path.resolve(process.cwd(), "site", "assets", "data", "holidays.json"),
    JSON.stringify(holiday, null, 2)
  );
};

main()
  .then(() => {
    console.log("SUCCESS");
  })
  .catch((err) => {
    console.error("ERROR:", err);
  });
