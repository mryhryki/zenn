import { SourceArticleDir, SourceScrapDir, SourceSlideDir, SourceZennArticlesDir } from "../definition";
import { Post } from "./parse";
import { readPosts } from "../fs";
import { sortPosts } from "./sort";

export const listAllPosts = async(): Promise<Post[]> => {
  const InputDirPaths: string[] = [SourceArticleDir, SourceZennArticlesDir, SourceSlideDir, SourceScrapDir];
  const posts = (await Promise.all(InputDirPaths.map(readPosts))).flat()
  return sortPosts(posts);
}