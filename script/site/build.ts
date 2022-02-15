import RSS from "rss";
import path from "path";
import { ArticlesDir, PostsDir, SiteDir } from "./util/path";
import { createDir, listFiles } from "./util/fs";
import { parsePost, Post } from "./util/post";
import { renderBlogIndex, renderReadingLogIndex } from "./util/html";
import { writeFile } from "fs/promises";
import { writePostToFile } from "./util/writer";

const BaseURL = "https://mryhryki.com";

const ArticleDelimiter = new RegExp("^-{3,}$");
const BlogFileFormat = new RegExp("^20[0-9]{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])-[a-z0-9-]{1,50}.md$");

const matchBlogFileFormat = (fileName: string): boolean => {
  if (BlogFileFormat.test(fileName)) {
    return true;
  }
  console.warn(`Unmatch format: ${fileName}`);
  return false;
};

const main = async () => {
  const posts: Post[] = [];

  const postFilePaths = await listFiles(PostsDir, true);
  const zennArticlePaths = await listFiles(ArticlesDir, true);

  await Promise.all(
    [...postFilePaths, ...zennArticlePaths].map(async (postFilePath) => {
      const post = await parsePost(postFilePath);
      posts.push(post);
    })
  );
  posts.sort((p1, p2) => {
    if (p1.createdAt !== p2.createdAt) {
      return p1.createdAt < p2.createdAt ? 1 : -1;
    }
    return p1.id < p2.id ? 1 : -1;
  });
  const blogPosts = posts.filter(({ type }) => type !== "reading_log");
  const readingLogPosts = posts.filter(({ type }) => type === "reading_log");

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
