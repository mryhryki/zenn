import path from "node:path";
import { DestinationBlogDir } from "../util/definition";
import { Post } from "../util/post";
import { renderBlogPost } from "../html/blog";
import { writeFile } from "node:fs/promises";

export const buildBlog = async (blogPosts: Post[]): Promise<void> => {
  await Promise.all(
    blogPosts.map(async (blogPost): Promise<void> => {
      await writeFile(path.resolve(DestinationBlogDir, `${blogPost.id}.html`), renderBlogPost(blogPost));
    })
  );
};
