import path from "path";

export const RootDir = __dirname;
export const ArticlesDir = path.resolve(RootDir, "articles");
export const PostsDir = path.resolve(RootDir, "posts");
export const BlogDir = path.resolve(PostsDir, "blog");
export const ReadingLogDir = path.resolve(PostsDir, "reading_log");
export const SiteDir = path.resolve(RootDir, "site");
export const TemplateDir = path.resolve(RootDir, "script", "site", "template");
