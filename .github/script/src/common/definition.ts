import path from "path";

export const BaseURL = "https://mryhryki.com";

export const RootDir = path.resolve(__dirname, "..", "..");
export const SiteDir = path.resolve(RootDir, "site");

export const SourceArticlesDir = path.resolve(RootDir, "articles");
export const SourceBackupDir = path.resolve(RootDir, "backup");
export const SourceMemoDir = path.resolve(RootDir, "memo");
export const SourceScrapDir = path.resolve(RootDir, "scrap");
export const SourceSlideDir = path.resolve(RootDir, "slide");

export const DestinationBlogDir = path.resolve(SiteDir, "blog");
export const DestinationSlideDir = path.resolve(SiteDir, "slide");
export const DestinationScrapDir = path.resolve(SiteDir, "scrap");
