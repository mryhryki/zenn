import { Post } from "../../common/post/parse";
import RSS from "rss";
import { BaseURL, DestinationBlogDir } from "../../common/definition";
import { writeFile } from "node:fs/promises";
import path from "node:path";

export const buildRss = async (posts: Post[], name: string): Promise<void> => {
  const feed = new RSS({
    feed_url: `${BaseURL}/blog/rss_${name}.xml`,
    language: "ja",
    site_url: `${BaseURL}/blog/`,
    title: "mryhryki's blog",
    ttl: 3600,
  });
  posts.forEach((post) => {
    const url = `${BaseURL}/${name === "scrap" ? "scrap" : "blog"}/${post.id}.html`;
    feed.item({
      title: post.title,
      date: post.createdAt,
      description: "",
      url,
    });
  });
  await writeFile(path.resolve(DestinationBlogDir, `rss_${name}.xml`), feed.xml({ indent: true }));
};
