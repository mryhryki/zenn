import {
  SourceArticleBackupDir,
  SourceMemoDir,
  SourceScrapDir,
  SourceSlideDir,
  SourceArticlesDir,
} from "../definition";
import { Post } from "./parse";
import { readPosts } from "../fs";
import { sortPosts } from "./sort";
import { filterPosts } from "./filter";

export const listAllPosts = async (): Promise<Post[]> => {
  const InputDirPaths: string[] = [
    SourceArticleBackupDir,
    SourceArticlesDir,
    SourceMemoDir,
    SourceScrapDir,
    SourceSlideDir,
  ];
  const posts = (await Promise.all(InputDirPaths.map(readPosts))).flat();
  return sortPosts(filterPosts(posts));
};
