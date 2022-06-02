import { Post } from "../util/post";
import RSS from "rss";
import { BaseURL, DestinationBlogDir } from "../util/definition";
import { writeFile } from "node:fs/promises";
import path from "node:path";

export const buildFeed = async (posts: Post[]): Promise<void> => {
  const feed = new RSS({
    feed_url: `${BaseURL}/blog/feed.rss`,
    language: "ja",
    site_url: `${BaseURL}/blog/`,
    title: "mryhryki's blog",
    ttl: 86400,
  });
  posts.forEach((post) => {
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
