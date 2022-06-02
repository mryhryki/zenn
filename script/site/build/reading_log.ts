import path from "path";
import { DestinationReadingLogDir } from "../util/definition";
import { Post } from "../util/post";
import { writeFile } from "node:fs/promises";
import { renderReadingLogPost } from "../html/reading_log";

export const buildReadingLog = async (readingLogPosts: Post[]): Promise<void> => {
  await Promise.all(
    readingLogPosts.map(async (post): Promise<void> => {
      await writeFile(path.resolve(DestinationReadingLogDir, `${post.id}.html`), renderReadingLogPost(post));
    })
  );
};
