import { Post } from "../../common/post/parse";
import RSS from "rss";
import { BaseURL, DestinationBlogDir } from "../../common/definition";
import { writeFile } from "node:fs/promises";
import path from "node:path";

export const buildFeed = async (posts: Post[], name: string): Promise<void> => {
  const feed = new RSS({
    feed_url: `${BaseURL}/blog/${name}.rss`,
    language: "ja",
    site_url: `${BaseURL}/blog/`,
    title: "mryhryki's blog",
    ttl: 86400,
  });
  posts.forEach((post) => {
    const url = `${BaseURL}/blog/${post.id}.html`;
    feed.item({
      title: post.title,
      date: post.createdAt,
      description: "",
      url,
    });
  });
  await writeFile(path.resolve(DestinationBlogDir, `feed_${name}.xml`), feed.xml({ indent: true }));
};
