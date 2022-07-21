import { readdir, stat } from "fs/promises";
import { parsePost, Post } from "./post";

export const readPosts = async (dirPath: string): Promise<Post[]> => {
  const files = await listFiles(dirPath, false);
  return await Promise.all(files.map(async (filePath): Promise<Post> => parsePost(filePath)));
};

export const listFiles = async (dirPath: string, recursive: boolean): Promise<string[]> => {
  const filePaths: string[] = [];
  const paths = await readdir(dirPath);
  for await (const p of paths) {
    const path = `${dirPath}/${p}`;
    const statInfo = await stat(path);
    if (statInfo.isFile()) {
      filePaths.push(path);
    } else if (recursive && statInfo.isDirectory()) {
      const filePathsInChildDirectory = await listFiles(path, recursive);
      filePathsInChildDirectory.forEach((f) => filePaths.push(f));
    }
  }
  return filePaths;
};
