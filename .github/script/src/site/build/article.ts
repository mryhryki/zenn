import path from "node:path";
import { DestinationArticleDir } from "../../common/definition";
import { Post } from "../../common/post/parse";
import { renderBlogPost } from "../html/blog";
import { writeFile } from "node:fs/promises";

export const buildArticle = async (blogPosts: Post[]): Promise<void> => {
  await Promise.all(
    blogPosts.map(async (blogPost): Promise<void> => {
      await writeFile(path.resolve(DestinationArticleDir, `${blogPost.id}.html`), renderBlogPost(blogPost));
    })
  );
};
