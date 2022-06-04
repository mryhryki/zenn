import {
  DestinationBlogDir,
  DestinationScrapDir,
  DestinationSlideDir,
  SourceZennArticlesDir,
  SourceArticleDir,
  SourceScrapDir,
  SourceSlideDir,
} from "./util/definition";
import { readPosts } from "./util/fs";
import { buildSlide } from "./build/slide";
import { mkdir, rm } from "node:fs/promises";
import { buildBlog } from "./build/blog";
import { buildScrap } from "./build/scrap";
import { sortPosts } from "./util/sort";
import { buildSiteMap } from "./build/sitemap";
import { buildFeed } from "./build/feed";
import { buildIndex } from "./build/index";

const main = async () => {
  await Promise.all(
    [DestinationBlogDir, DestinationSlideDir, DestinationScrapDir].map(async (dirPath: string): Promise<void> => {
      await rm(dirPath, { recursive: true }).catch(() => undefined);
      await mkdir(dirPath, { recursive: true });
    })
  );

  const InputDirPaths: string[] = [SourceArticleDir, SourceZennArticlesDir, SourceSlideDir, SourceScrapDir];
  const [blogPosts, articlePosts, slidePosts, scrapPosts] = await Promise.all(InputDirPaths.map(readPosts));

  await Promise.all([
    buildBlog(sortPosts([...blogPosts, ...articlePosts])),
    buildSlide(sortPosts(slidePosts)),
    buildScrap(sortPosts(scrapPosts)),
    buildFeed(sortPosts([...blogPosts, ...articlePosts, ...slidePosts])),
    buildIndex(sortPosts([...blogPosts, ...articlePosts, ...slidePosts, ...scrapPosts])),
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
