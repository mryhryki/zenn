import { SourceBackupDir, SourceMemoDir, SourceScrapDir, SourceSlideDir, SourceArticlesDir } from "../definition";
import { Post } from "./parse";
import { readPosts } from "../fs";
import { sortPosts } from "./sort";
import { filterPosts } from "./filter";

export const listAllPosts = async (): Promise<Post[]> => {
  const InputDirPaths: string[] = [SourceMemoDir, SourceBackupDir, SourceArticlesDir, SourceSlideDir, SourceScrapDir];
  const posts = (await Promise.all(InputDirPaths.map(readPosts))).flat();
  return sortPosts(filterPosts(posts));
};
