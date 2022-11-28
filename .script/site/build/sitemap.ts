import path from "node:path";
import { writeFile } from "node:fs/promises";
import { listFiles } from "../../common/fs";
import { BaseURL, SiteDir } from "../../common/definition";

export const buildSiteMap = async () => {
  const siteMap = [`${BaseURL}/`];
  const files = await listFiles(SiteDir, true);
  files.forEach((absoluteFilePath) => {
    const file = absoluteFilePath.substring(SiteDir.length);
    if (file.endsWith(".json") || file.endsWith(".xml")) return;
    if (file.startsWith("/blog/") || file.startsWith("/scrap/") || file.startsWith("/slide/")) {
      siteMap.push(`${BaseURL}${file}`.replace(/index.html$/, ""));
    }
  });
  await writeFile(path.resolve(SiteDir, "sitemap.txt"), siteMap.sort().join("\n"));
};
