import { Post } from "../../common/post/parse";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { renderSlide } from "../html/slide";
import { DestinationSlideDir } from "../../common/definition";

export const buildSlide = async (slidePosts: Post[]): Promise<void> => {
  await Promise.all(
    slidePosts.map(async (slidePost: Post): Promise<void> => {
      await writeFile(path.resolve(DestinationSlideDir, `${slidePost.id}.html`), renderSlide(slidePost.markdown));
    })
  );
};
