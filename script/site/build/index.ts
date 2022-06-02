import { Post } from "../util/post";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { DestinationBlogDir } from "../util/definition";
import { renderBlogIndex } from "../html/blog";

export const buildIndex = async (posts: Post[]): Promise<void> => {
  await writeFile(path.resolve(DestinationBlogDir, "index.html"), renderBlogIndex(posts));
};
