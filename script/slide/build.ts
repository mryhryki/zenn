import { Marp } from "@marp-team/marp-core";
import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { renderSlide } from "./html";

const main = async () => {
  await mkdir(path.resolve(__dirname, "site", "slide"), { recursive: true });
  const marp = new Marp();
  const markdown = await readFile(path.resolve(__dirname, "posts", "slide", "2022-03-28-connehito-tech-marche.md"));
  const { html, css } = marp.render(new TextDecoder().decode(markdown));
  await writeFile(
    path.resolve(__dirname, "site", "slide", "2022-03-28-connehito-tech-marche.html"),
    renderSlide(html, css)
  );
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
