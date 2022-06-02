import {
  DestinationBlogDir,
  DestinationReadingLogDir,
  DestinationSlideDir,
  SourceArticlesDir,
  SourceArticleDir,
  SourceReadingLogDir,
  SourceSlideDir,
} from "./util/definition";
import { readPosts } from "./util/fs";
import { buildSlide } from "./build/slide";
import { mkdir, rm } from "node:fs/promises";
import { buildBlog } from "./build/blog";
import { buildReadingLog } from "./build/reading_log";
import { sortPosts } from "./util/sort";
import { buildSiteMap } from "./build/sitemap";
import { buildFeed } from "./build/feed";
import { buildIndex } from "./build/index";

const main = async () => {
  await Promise.all(
    [DestinationBlogDir, DestinationSlideDir, DestinationReadingLogDir].map(async (dirPath: string): Promise<void> => {
      await rm(dirPath, { recursive: true }).catch(() => undefined);
      await mkdir(dirPath, { recursive: true });
    })
  );

  const InputDirPaths: string[] = [SourceArticleDir, SourceArticlesDir, SourceSlideDir, SourceReadingLogDir];
  const [blogPosts, articlePosts, slidePosts, readingLogPosts] = await Promise.all(InputDirPaths.map(readPosts));

  await Promise.all([
    buildBlog(sortPosts([...blogPosts, ...articlePosts])),
    buildSlide(sortPosts(slidePosts)),
    buildReadingLog(sortPosts(readingLogPosts)),
    buildFeed(sortPosts([...blogPosts, ...articlePosts, ...slidePosts])),
    buildIndex(sortPosts([...blogPosts, ...articlePosts, ...slidePosts, ...readingLogPosts])),
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
