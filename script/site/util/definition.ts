import path from "path";

export const BaseURL = "https://mryhryki.com";

export const RootDir = __dirname;
export const PostsDir = path.resolve(RootDir, "posts");
export const SiteDir = path.resolve(RootDir, "site");

export const SourceArticlesDir = path.resolve(RootDir, "articles");
export const SourceBlogDir = path.resolve(PostsDir, "blog");
export const SourceReadingLogDir = path.resolve(PostsDir, "reading_log");
export const SourceSlideDir = path.resolve(PostsDir, "slide");

export const DestinationBlogDir = path.resolve(SiteDir, "blog");
export const DestinationSlideDir = path.resolve(SiteDir, "slide");
export const DestinationReadingLogDir = path.resolve(SiteDir, "reading_log");
