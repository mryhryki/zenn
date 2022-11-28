import { Post } from "./parse";

export const sortPosts = (posts: Post[]): Post[] => {
  const sortedPosts = [...posts];
  sortedPosts.sort((p1, p2) => {
    if (p1.createdAt !== p2.createdAt) {
      return p1.createdAt < p2.createdAt ? 1 : -1;
    }
    return p1.id < p2.id ? 1 : -1;
  });
  return sortedPosts;
};
