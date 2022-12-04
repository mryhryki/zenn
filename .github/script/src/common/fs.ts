import { readdir, stat } from "fs/promises";
import { parsePost, Post } from "./post/parse";

const FileNameChecker = new RegExp("^(20[0-9]{2}-[0-9]{2}-[0-9]{2}-[a-z0-9-]{3,}|20[0-9]{6}-[0-9]{6}).md$");

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
      if (FileNameChecker.test(p)) {
        filePaths.push(path);
      }
    } else if (recursive && statInfo.isDirectory()) {
      const filePathsInChildDirectory = await listFiles(path, recursive);
      filePathsInChildDirectory.forEach((f) => filePaths.push(f));
    }
  }
  return filePaths;
};
