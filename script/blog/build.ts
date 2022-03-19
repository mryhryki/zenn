import RSS from "rss";
import path from "path";
import { ArticlesDir, BlogDir, PostsDir, ReadingLogDir, SiteDir } from "./util/path";
import { createDir, listFiles } from "./util/fs";
import { parsePost, Post } from "./util/post";
import { renderBlogIndex, renderReadingLogIndex } from "./util/html";
import { writeFile } from "fs/promises";
import { writePostToFile } from "./util/writer";

const BaseURL = "https://mryhryki.com";

const main = async () => {
  const blogPosts: Post[] = [];
  const blogFilePaths = await listFiles(BlogDir, true);
  const zennArticlePaths = await listFiles(ArticlesDir, true);
  await Promise.all(
    [...blogFilePaths, ...zennArticlePaths].map(async (blogFilePath) => {
      const post = await parsePost(blogFilePath);
      blogPosts.push(post);
    })
  );
  blogPosts.sort((p1, p2) => {
    if (p1.createdAt !== p2.createdAt) {
      return p1.createdAt < p2.createdAt ? 1 : -1;
    }
    return p1.id < p2.id ? 1 : -1;
  });

  const readingLogPosts: Post[] = [];
  const readingLogFilePaths = await listFiles(ReadingLogDir, true);
  await Promise.all(
    readingLogFilePaths.map(async (readingLogFilePath) => {
      const post = await parsePost(readingLogFilePath);
      readingLogPosts.push(post);
    })
  );
  readingLogPosts.sort((p1, p2) => {
    if (p1.createdAt !== p2.createdAt) {
      return p1.createdAt < p2.createdAt ? 1 : -1;
    }
    return p1.id < p2.id ? 1 : -1;
  });

  await Promise.all(blogPosts.map(writePostToFile));
  await writeFile(path.resolve(SiteDir, "blog", "index.html"), renderBlogIndex(blogPosts));
  await writeFile(
    path.resolve(path.resolve(SiteDir, "blog", "index.json")),
    JSON.stringify({ posts: blogPosts }, null, 2)
  );

  await createDir(path.resolve(SiteDir, "reading_log"));
  await writeFile(path.resolve(SiteDir, "reading_log", "index.html"), renderReadingLogIndex(readingLogPosts));
  await writeFile(
    path.resolve(path.resolve(SiteDir, "reading_log", "index.json")),
    JSON.stringify({ reading_logs: readingLogPosts }, null, 2)
  );

  const siteMap = [`${BaseURL}/`, `${BaseURL}/blog/`];
  const feed = new RSS({
    feed_url: `${BaseURL}/blog/feed.rss`,
    language: "ja",
    site_url: `${BaseURL}/blog/`,
    title: "mryhryki's blog",
    ttl: 86400,
  });
  blogPosts.forEach((post) => {
    const url = `${BaseURL}/blog/${post.id}.html`;
    siteMap.push(url);
    feed.item({
      title: decodeURIComponent(post.title),
      date: post.createdAt,
      description: "",
      url,
    });
  });
  await writeFile(path.resolve(SiteDir, "blog", "feed.xml"), feed.xml({ indent: true }));
  await writeFile(path.resolve(SiteDir, "sitemap.txt"), siteMap.join("\n"));
};

main()
  .then(() => {
    console.log("Build Completed");
  })
  .catch((err) => {
    console.error("Build Failed");
    console.error(err);
    process.exit(1);
  });
