import { Post } from "../../common/post/parse";
import RSS from "rss";
import { BaseURL } from "../../common/definition";
import { writeFile } from "node:fs/promises";
import path from "node:path";

export const buildRss = async (posts: Post[], dirPath: string): Promise<void> => {
  const type = path.basename(dirPath);
  const feed = new RSS({
    feed_url: `${BaseURL}/blog/${type}/rss.xml`,
    language: "ja",
    site_url: `${BaseURL}/blog/`,
    title: "mryhryki's blog",
    ttl: 3600,
  });
  posts.forEach((post) => {
    feed.item({
      title: post.title,
      date: post.createdAt,
      description: "",
      url: post.url,
    });
  });
  await writeFile(path.resolve(dirPath, "rss.xml"), feed.xml({ indent: true }));
};
