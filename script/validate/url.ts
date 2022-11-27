import { listAllPosts } from "../common/post";
import { Post } from "../common/post/parse";

interface UrlInfo {
  url: URL;
  file: string;
  status: number;
}

const main = async () => {
  const posts = (await listAllPosts()).filter(({ filePath }: Post) => filePath.includes("ukraine"));
  const existsUrls = new Set<string>([]);
  const urlInfoList: UrlInfo[] = [];

  for (const post of posts) {
    const { filePath, markdown } = post;
    let row = 1;
    for (const line of markdown.split("\n")) {
      for (const match of line.matchAll(UrlMatcher)) {
        const url = new URL(match[0].startsWith("http") ? match[0] : match[0].slice(1));
        if (!existsUrls.has(url.toString())) {
          existsUrls.add(url.toString());
          urlInfoList.push({ url, file: `${filePath}#${row}`, status: 0 });
        }
      }
      row++;
    }
  }

  const MaxParallelRequest = 5;
  const WaitMs = 100;
  let parallelRequestCount = 0;
  const nextRequest: Record<string, number | null> = {};

  console.log(`TOTAL: ${urlInfoList.length}`);
  let count = 0;

  await Promise.all(urlInfoList.sort((info1, info2) => info1.file < info2.file ? -1 : 1).map(async (urlInfo) => {
    const { url } = urlInfo;
    while (parallelRequestCount >= MaxParallelRequest || ((nextRequest[url.origin] ?? 0) > getNow())) {
      await new Promise((resolve) => setTimeout(resolve, WaitMs));
    }
    nextRequest[url.origin] = getNow() + WaitMs;
    parallelRequestCount++;
    try {
      const { status } = await validateUrl(url);
      console.log(`Validate[${count++}]: ${url.toString()} => ${status}`);
      urlInfo.status = status;
    } catch (err) {
      urlInfo.status = 999;
      console.error(err);
    } finally {
      parallelRequestCount--;
    }
  }));

  const invalidUrls = urlInfoList.filter(({ status }) => status !== 200)
  if (invalidUrls.length > 0) {
    console.log("[Invalid URLs]");
    invalidUrls.forEach((urlInfo) => {
      console.log(urlInfo.status, urlInfo.url.toString(), urlInfo.file);
    });
    throw new Error("Exists invalid URLs");
  }
};

const UrlMatcher = new RegExp("(^|[^`])https?://[^ )]+", "g");
const getNow = (): number => new Date().getTime();

const UnsupportedHeadRequestOrigins = new Set(["https://www.recordchina.co.jp", "https://jp.yna.co.kr"]);
const validateUrl = async (url: URL): Promise<{ status: number }> => {
  for (let i = 0; i < 3; i++) {
    try {

      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 10000);
      const response = await fetch(url, {
        method: UnsupportedHeadRequestOrigins.has(url.origin) ? "GET" : "HEAD",
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
        },
        signal: abortController.signal
      });
      clearTimeout(timeoutId);
      return { status: response.status };
    } catch (err) {
      console.warn("WARN:", url, err);
    }
  }
  return { status: 998 };
};

const startTime = getNow();
main()
  .then(() => {
    console.log("VALIDATE URL COMPLETED");
    console.log(`Time: ${getNow() - startTime} ms`);
  })
  .catch((err) => {
    console.error("VALIDATE URL FAILED");
    console.error(err);
    process.exit(1);
  });
