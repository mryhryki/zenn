import path from "path";

export const RootDir = __dirname;
export const ArticlesDir = path.resolve(RootDir, "articles");
export const PostsDir = path.resolve(RootDir, "posts");
export const SiteDir = path.resolve(RootDir, "site");
export const BlogDir = path.resolve(SiteDir, "blog");
export const TemplateDir = path.resolve(__dirname, "template");
