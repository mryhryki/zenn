import path from "path";
import { DestinationScrapDir } from "../util/definition";
import { Post } from "../util/post";
import { writeFile } from "node:fs/promises";
import { renderScrap } from "../html/scrap";

export const buildScrap = async (posts: Post[]): Promise<void> => {
  await Promise.all(
    posts.map(async (post): Promise<void> => {
      await writeFile(path.resolve(DestinationScrapDir, `${post.id}.html`), renderScrap(post));
    })
  );
};
