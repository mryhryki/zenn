import { Post } from "./parse";

export const filterPosts = (posts: Post[]): Post[] => {
  const existsIdSet = new Set<string>();
  return posts.filter(({ id }) => {
    if (existsIdSet.has(id)) {
      return true;
    }
    existsIdSet.add(id);
    return false;
  });
};
