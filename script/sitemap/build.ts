import path from "node:path";
import { writeFile } from "node:fs/promises";
import { listFiles } from "./fs";

const BaseURL = "https://mryhryki.com";

const main = async () => {
  const SiteDir = path.resolve(__dirname, "site");
  const siteMap = [`${BaseURL}/`];
  const files = await listFiles(SiteDir, true);
  files.forEach((absoluteFilePath) => {
    const file = absoluteFilePath.substring(SiteDir.length);
    if (file.endsWith(".json")) return;
    if (file.startsWith("/blog/") || file.startsWith("/reading_log") || file.startsWith("slide")) {
      siteMap.push(`${BaseURL}${file}`.replace(/index.html$/, ""));
    }
  });
  await writeFile(path.resolve(SiteDir, "sitemap.txt"), siteMap.join("\n"));
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
