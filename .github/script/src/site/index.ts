import {
  DestinationArticleDir,
  DestinationMemoDir,
  DestinationScrapDir,
  DestinationSlideDir,
} from "../common/definition";
import { buildArticle } from "./build/article";
import { buildIndex } from "./build";
import { buildRss } from "./build/rss";
import { buildScrap } from "./build/scrap";
import { buildSiteMap } from "./build/sitemap";
import { buildSlide } from "./build/slide";
import { listAllPosts } from "../common/post";
import { mkdir, rm } from "node:fs/promises";
import { buildMemo } from "./build/memo";

const main = async () => {
  await Promise.all(
    [DestinationArticleDir, DestinationMemoDir, DestinationSlideDir, DestinationScrapDir].map(
      async (dirPath: string): Promise<void> => {
        await rm(dirPath, { recursive: true }).catch(() => undefined);
        await mkdir(dirPath, { recursive: true });
      }
    )
  );

  const posts = await listAllPosts();
  const articlePosts = posts.filter(({ type }) => type === "articles");
  const memoPosts = posts.filter(({ type }) => type === "memo");
  const scrapPosts = posts.filter(({ type }) => type === "scrap");
  const slidePosts = posts.filter(({ type }) => type === "slide");
  console.log(
    [
      `Found ${posts.length} files => Article: ${articlePosts.length}`,
      `Memo: ${memoPosts.length}`,
      `Scrap: ${scrapPosts.length}`,
      `Slide: ${slidePosts.length}`,
    ].join(", ")
  );

  await Promise.all([
    buildArticle(articlePosts),
    buildMemo(memoPosts),
    buildSlide(slidePosts),
    buildScrap(scrapPosts),
    buildRss(articlePosts, DestinationArticleDir),
    buildRss(memoPosts, DestinationMemoDir),
    buildRss(scrapPosts, DestinationScrapDir),
    buildRss(slidePosts, DestinationSlideDir),
    buildIndex(posts),
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
