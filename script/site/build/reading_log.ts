import path from "path";
import { DestinationReadingLogDir } from "../util/definition";
import { Post } from "../util/post";
import { renderReadingLogIndex } from "../html/reading_log";
import { writeFile } from "node:fs/promises";

export const buildReadingLog = async (readingLogPosts: Post[]): Promise<void> => {
  await writeFile(path.resolve(DestinationReadingLogDir, "index.html"), renderReadingLogIndex(readingLogPosts));
  await writeFile(
    path.resolve(path.resolve(DestinationReadingLogDir, "index.json")),
    JSON.stringify({ reading_logs: readingLogPosts }, null, 2)
  );
};
