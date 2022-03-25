import { Post } from "../util/post";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { renderSlide, renderSlideIndex } from "../html/slide";
import { DestinationSlideDir } from "../util/definition";

export const buildSlide = async (slidePosts: Post[]): Promise<void> => {
  await Promise.all(
    slidePosts.map(async (slidePost: Post): Promise<void> => {
      await writeFile(path.resolve(DestinationSlideDir, `${slidePost.id}.html`), renderSlide(slidePost.markdown));
    })
  );
  await writeFile(path.resolve(DestinationSlideDir, "index.html"), renderSlideIndex(slidePosts));
};
