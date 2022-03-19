import { mkdir, readdir, stat } from "fs/promises";

export const createDir = async (dirPath: string): Promise<void> => {
  await mkdir(dirPath, { recursive: true });
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
