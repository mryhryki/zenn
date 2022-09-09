import path from "path";
import { DestinationScrapDir } from "../../common/definition";
import { Post } from "../../common/post/parse";
import { writeFile } from "node:fs/promises";
import { renderScrap } from "../html/scrap";

export const buildScrap = async (posts: Post[]): Promise<void> => {
  await Promise.all(
    posts.map(async (post): Promise<void> => {
      await writeFile(path.resolve(DestinationScrapDir, `${post.id}.html`), renderScrap(post));
    })
  );
};
