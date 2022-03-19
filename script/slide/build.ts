import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { renderSlide } from "./html";

const main = async () => {
  await mkdir(path.resolve(__dirname, "site", "slide"), { recursive: true });
  const markdown = new TextDecoder().decode(
    await readFile(path.resolve(__dirname, "posts", "slide", "2022-03-28-connehito-tech-marche.md"))
  );
  await writeFile(
    path.resolve(__dirname, "site", "slide", "2022-03-28-connehito-tech-marche.html"),
    renderSlide(markdown)
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
