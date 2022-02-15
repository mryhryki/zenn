import { createDir, listFiles } from "./util/fs";
import { parsePost, Post } from "./util/post";
import { ArticlesDir, BlogDir, PostsDir } from "./util/path";

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
  // const siteMap = [`${BaseURL}/`, `${BaseURL}/blog/`];
  const posts: Post[] = [];
  await createDir(BlogDir);

  const postFilePaths = await listFiles(PostsDir, true);
  const zennArticlePaths = await listFiles(ArticlesDir, true);

  await Promise.all(
    [...postFilePaths, ...zennArticlePaths].map(async (postFilePath) => {
      const post = await parsePost(postFilePath);
      posts.push(post);
    })
  );

  posts.forEach((post) => {
    post.markdown = post.markdown.substring(0, 100);
    console.debug(JSON.stringify(post, null, 2));
  });

  return;
  //
  // const [articles, blogEntries] = await Promise.all([
  //   readdir(ArticlesDir).then((entries) => entries.filter(matchBlogFileFormat)),
  //   readdir(BlogDir).then((entries) => entries.filter(matchBlogFileFormat)),
  // ]);
  //
  // await Promise.all(blogEntries.map(async (blog) => {
  //   const markdown = (await readFile(path.resolve(BlogDir, blog))).toString();
  //   const { title, html } = convert(markdown);
  //   const postHtml = await renderPost(title, html, null);
  //   const date = blog.slice(0, 10);
  //   const fileName = `${blog.slice(0, -3)}.html`;
  //   await writeFile(path.resolve(BlogDir, fileName), postHtml);
  //   posts.push({ title, path: `/blog/${fileName}`, date, canonical: null });
  // }));
  //
  // await Promise.all(articles.map(async (article) => {
  //   const contents = (await readFile(path.resolve(ArticlesDir, article))).toString().split("\n");
  //   const boundaryLineNumber = contents.findIndex((line, index) => (index !== 0 && ArticleDelimiter.test(line.trim())));
  //   const { title } = yaml.parse(contents.slice(1, boundaryLineNumber - 1).join("\n"));
  //   if (title == null || title.trim() === "") {
  //     throw new Error(`Title not found in article: ${article}`);
  //   }
  //   const markdown = contents.slice(boundaryLineNumber + 1).map((line) => line.trim().replace(/^#/, "##")).join("\n");
  //   const canonical = `https://zenn.dev/mryhryki/articles/${article.replace(".md", "")}`;
  //   const { html } = convert(`# ${title}\n\n${markdown}`);
  //   const postHtml = await renderPost(title, html, canonical);
  //   const date = article.slice(0, 10);
  //   const fileName = `${article.slice(0, -3)}.html`;
  //   await writeFile(path.resolve(BlogDir, fileName), postHtml);
  //   posts.push({ title, path: `/blog/${fileName}`, date, canonical });
  // }));
  //
  // await Promise.all(backups.map(async ({ filePath, date, slug, canonical }) => {
  //   const markdown = (await readFile(path.resolve(BackupDir, filePath))).toString();
  //   const { title, html } = convert(markdown);
  //   const postHtml = await renderPost(title, html, canonical);
  //   const fileName = `${date}-${slug}.html`;
  //   await writeFile(path.resolve(BlogDir, fileName), postHtml);
  //   posts.push({ title, path: `/blog/${fileName}`, date, canonical });
  // }));
  //
  // posts.sort((p1, p2) => p2.path <= p1.path ? -1 : 1);
  //
  // const indexHtml = await renderIndex(posts);
  // await writeFile(path.resolve(BlogDir, "index.html"), indexHtml);
  //
  // const feed = new RSS({
  //   feed_url: `${BaseURL}/blog/feed.rss`,
  //   language: "ja",
  //   site_url: `${BaseURL}/blog/`,
  //   title: "mryhryki's blog",
  //   ttl: 86400,
  // });
  // posts.forEach((post) => {
  //   const url = `${BaseURL}${post.id}.html`;
  //   siteMap.push(url);
  //   feed.item({
  //     title: decodeURIComponent(post.title),
  //     date: post.createdAt,
  //     description: "",
  //     url,
  //   });
  // });
  //
  // await writeFile(path.resolve(BlogDir, "feed.xml"), feed.xml({ indent: true }));
  // await writeFile(path.resolve(SiteDir, "sitemap.txt"), siteMap.join("\n"));
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
