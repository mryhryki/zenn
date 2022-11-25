import { listAllPosts } from "../common/post";

interface UrlInfo {
  url: URL;
  file: string;
  status: number;
}

const main = async () => {
  const posts = (await listAllPosts()).filter(({ filePath }) => filePath.includes("ukraine"));
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
  const WaitMs = 200;
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
      const { status } = await validateUrl(url.toString());
      console.log(`Validate[${count++}]: ${url.toString()} => ${status}`);
      urlInfo.status = status;
    } catch (err) {
      urlInfo.status = 999;
      console.error(err);
    } finally {
      parallelRequestCount--;
    }
  }));

  if (urlInfoList.length > 0) {
    console.log("[Invalid URLs]");
    urlInfoList.filter(({ status }) => status !== 200).forEach((urlInfo) => {
      console.log(urlInfo.status, urlInfo.url.toString(), urlInfo.file);
    });
  }
};

const UrlMatcher = new RegExp("(^|[^`])https?://[^ )]+", "g");
const getNow = (): number => new Date().getTime();
const validateUrl = async (url: string): Promise<{ status: number }> => {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), 3000);
  const response = await fetch(url, { method: "HEAD", signal: abortController.signal });
  clearTimeout(timeoutId);
  return { status: response.status };
};

const startTime = getNow()
main()
  .then(() => {
    console.log("VALIDATE URL COMPLETED");
  })
  .catch((err) => {
    console.error("VALIDATE URL FAILED");
    console.error(err);
    throw err
  })
  .finally(() => {
    console.log(`Time: ${getNow() - startTime} ms`)
  });
