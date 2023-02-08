import path from "path";

export const BaseURL = "https://mryhryki.com";

export const RootDir = path.resolve(__dirname, "..", "..");
export const SiteDir = path.resolve(RootDir, "site");

export const SourceArticlesDir = path.resolve(RootDir, "articles");
export const SourceMemoDir = path.resolve(RootDir, "memo");
export const SourceScrapDir = path.resolve(RootDir, "scrap");
export const SourceSlideDir = path.resolve(RootDir, "slide");

export const DestinationBlogDir = path.resolve(SiteDir, "blog");
export const DestinationArticleDir = path.resolve(DestinationBlogDir, "article");
export const DestinationMemoDir = path.resolve(DestinationBlogDir, "memo");
export const DestinationSlideDir = path.resolve(DestinationBlogDir, "slide");
export const DestinationScrapDir = path.resolve(DestinationBlogDir, "scrap");
