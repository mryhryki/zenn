import { DestinationBlogDir, DestinationScrapDir, DestinationSlideDir } from "../common/definition";
import { buildSlide } from "./build/slide";
import { mkdir, rm } from "node:fs/promises";
import { buildBlog } from "./build/blog";
import { buildScrap } from "./build/scrap";
import { buildSiteMap } from "./build/sitemap";
import { buildFeed } from "./build/feed";
import { buildIndex } from "./build";
import { listAllPosts } from "../common/post";

const main = async () => {
  await Promise.all(
    [DestinationBlogDir, DestinationSlideDir, DestinationScrapDir].map(async (dirPath: string): Promise<void> => {
      await rm(dirPath, { recursive: true }).catch(() => undefined);
      await mkdir(dirPath, { recursive: true });
    })
  );

  const posts = await listAllPosts();
  await Promise.all([
    buildBlog(posts.filter(({ type }) => type === "article" || type === "memo" || type === "zenn")),
    buildSlide(posts.filter(({ type }) => type === "slide")),
    buildScrap(posts.filter(({ type }) => type === "scrap")),
    buildFeed(posts),
    buildIndex(posts)
  ]);
  await buildSiteMap();
};

main()
  .then(() => {
    console.log("BUILD COMPLETED");
  })
  .catch((err) => {
    console.error("BUILD FAILED");
    console.error(err);
    process.exit(1);
  });
