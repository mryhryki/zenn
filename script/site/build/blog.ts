import RSS from "rss";
import path from "node:path";
import { BaseURL, DestinationBlogDir } from "../util/definition";
import { Post } from "../util/post";
import { renderBlogIndex, renderBlogPost } from "../html/blog";
import { writeFile } from "node:fs/promises";

export const buildBlog = async (blogPosts: Post[]): Promise<void> => {
  await Promise.all(
    blogPosts.map(async (blogPost): Promise<void> => {
      await writeFile(path.resolve(DestinationBlogDir, `${blogPost.id}.html`), renderBlogPost(blogPost));
    })
  );
  await writeFile(path.resolve(DestinationBlogDir, "index.html"), renderBlogIndex(blogPosts));
  await writeFile(
    path.resolve(path.resolve(DestinationBlogDir, "index.json")),
    JSON.stringify({ posts: blogPosts }, null, 2)
  );

  const feed = new RSS({
    feed_url: `${BaseURL}/blog/feed.rss`,
    language: "ja",
    site_url: `${BaseURL}/blog/`,
    title: "mryhryki's blog",
    ttl: 86400,
  });
  blogPosts.forEach((post) => {
    const url = `${BaseURL}/blog/${post.id}.html`;
    feed.item({
      title: decodeURIComponent(post.title),
      date: post.createdAt,
      description: "",
      url,
    });
  });
  await writeFile(path.resolve(DestinationBlogDir, "feed.xml"), feed.xml({ indent: true }));
};
