import { SourceBackupDir, SourceMemoDir, SourceScrapDir, SourceSlideDir, SourceZennArticlesDir } from "../definition";
import { Post } from "./parse";
import { readPosts } from "../fs";
import { sortPosts } from "./sort";

export const listAllPosts = async (): Promise<Post[]> => {
  const InputDirPaths: string[] = [SourceMemoDir, SourceBackupDir, SourceZennArticlesDir, SourceSlideDir, SourceScrapDir];
  const posts = (await Promise.all(InputDirPaths.map(readPosts))).flat();
  return sortPosts(posts);
};
