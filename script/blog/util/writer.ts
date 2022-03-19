import path from "path";
import { writeFile } from "fs/promises";
import { Post } from "./post";
import { SiteDir } from "./path";
import { renderPost } from "./html";
import { createDir } from "./fs";

const getWriteFilePath = (post: Post): string => {
  switch (post.type) {
    case "blog":
    case "zenn":
      return path.resolve(SiteDir, "blog", `${post.id}.html`);
    case "reading_log":
      return path.resolve(SiteDir, "reading_log", `${post.id}.html`);
    default:
      throw new Error(`Unknown type: ${post.type}`);
  }
};

export const writePostToFile = async (post: Post): Promise<void> => {
  const filePath = getWriteFilePath(post);
  await createDir(path.dirname(filePath));
  await writeFile(filePath, renderPost(post));
};
