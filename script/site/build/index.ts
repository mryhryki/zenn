import { Post } from "../../common/post/parse";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { DestinationBlogDir } from "../../common/definition";
import { renderBlogIndex } from "../html";

export const buildIndex = async (posts: Post[]): Promise<void> => {
  await Promise.all([
    writeFile(path.resolve(DestinationBlogDir, "index.html"), renderBlogIndex(posts)),
    writeFile(path.resolve(DestinationBlogDir, "index.json"), JSON.stringify({ posts }, null, 2)),
  ]);
};
