import { Post } from "./parse";

export const filterPosts = (posts: Post[]): Post[] => {
  const ids = new Set<string>();
  return posts.filter(({ id }) => {
    if (!ids.has(id)) {
      ids.add(id);
      return true;
    }
    return false;
  });
};
