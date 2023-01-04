import path from "path";
import { readFile } from "fs/promises";
import {
  BaseURL,
  RootDir,
  SourceBackupDir,
  SourceMemoDir,
  SourceScrapDir,
  SourceSlideDir,
  SourceArticlesDir,
} from "../definition";
import { DateTime } from "@mryhryki/datetime";
import { digestSha256 } from "../digest";

const BreakCharacter = new RegExp("\r?\n");
const FrontMatterSplitter = new RegExp("^[-]{3,}$");
const WrapDoubleQuote = new RegExp('(^"|"$)', "g");
const DateTimeFormat = new RegExp(
  [
    "^20[0-9]{2}-",
    "(0[1-9]|1[012])-",
    "(0[1-9]|[12][0-9]|3[01])T",
    "([01][0-9]|2[0-3]):",
    "([0-5][0-9]):",
    "([0-5][0-9])",
    "\\+09:00$",
  ].join("")
);

export interface Post {
  type: PostType;
  url: string;
  id: string;
  title: string;
  markdown: string;
  createdAt: string;
  filePath: string;
  digest: string;
  canonical?: string | null;
}

type PostType = "zenn" | "article" | "memo" | "slide" | "scrap";
const getPostType = (filePath: string): PostType => {
  if (filePath.startsWith(SourceBackupDir)) {
    return "article";
  } else if (filePath.startsWith(SourceArticlesDir)) {
    return "zenn";
  } else if (filePath.startsWith(SourceMemoDir)) {
    return "memo";
  } else if (filePath.startsWith(SourceSlideDir)) {
    return "slide";
  } else if (filePath.startsWith(SourceScrapDir)) {
    return "scrap";
  }
  throw new Error(`Unknown post type: ${filePath}`);
};

const checkPost = (post: Post, filePath: string) => {
  if (post.id.trim().length < 3) {
    throw new Error(`ID must be at least 10 characters long: ${filePath}`);
  }
  if (!post.url.trim().startsWith(BaseURL)) {
    throw new Error(`URL must be valid URL format[${post.url}]: ${filePath}`);
  }
  if (post.title.trim().length < 5) {
    throw new Error(`Title must be at least 10 characters long: ${filePath}`);
  }
  if (post.markdown.trim().length < 10) {
    throw new Error(`Markdown must be at least 10 characters long: ${filePath}`);
  }
  if (!DateTimeFormat.test(post.createdAt)) {
    throw new Error(`CreatedAt must be valid DateTime format[${post.createdAt}]: ${filePath}`);
  }
  if (post.canonical != null && !post.canonical.startsWith("https://")) {
    throw new Error(`Canonical must be valid URL format[${post.canonical}]: ${filePath}`);
  }
};

const getPost = async (
  absoluteFilePath: string,
  frontMatter: Record<string, string>,
  markdown: string
): Promise<Post> => {
  const id = path.basename(absoluteFilePath).replace(".md", "").trim();
  const type = getPostType(absoluteFilePath);
  const canonical = type === "zenn" ? `https://zenn.dev/mryhryki/articles/${id}` : frontMatter.canonical ?? null;
  const title = (frontMatter.title ?? "").trim();

  const post: Post = {
    type,
    url: "",
    id,
    title,
    markdown,
    filePath: absoluteFilePath.replace(RootDir, ""),
    createdAt: "",
    canonical,
    digest: await digestSha256(`${title}\n\n${markdown}`),
  };

  if (type === "memo" || type === "article" || type === "zenn") {
    post.createdAt = DateTime.parse(`${post.id.substring(0, 10)}T00:00:00+09:00`).toISO();
    post.url = `${BaseURL}/blog/${post.id}.html`;
  } else if (type === "slide") {
    post.createdAt = DateTime.parse(`${post.id.substring(0, 10)}T00:00:00+09:00`).toISO();
    post.url = `${BaseURL}/slide/${post.id}.html`;
  } else if (type === "scrap") {
    post.createdAt = DateTime.parse(
      [
        post.id.substring(0, 4),
        "-",
        post.id.substring(4, 6),
        "-",
        post.id.substring(6, 8),
        "T",
        post.id.substring(9, 11),
        ":",
        post.id.substring(11, 13),
        ":",
        post.id.substring(13, 15),
        "+09:00",
      ].join("")
    ).toISO();
    post.url = `${BaseURL}/scrap/${post.id}.html`;
  }

  return post;
};

export const parsePost = async (filePath: string): Promise<Post> => {
  const isZenn = filePath.includes("/articles/");

  const content: string = (await readFile(path.resolve(RootDir, filePath))).toString("utf-8");
  const lines: string[] = content.split(BreakCharacter);

  const frontMatter: Record<string, string> = {};
  const markdownLines: string[] = [];

  let inFrontMatter = 0;
  lines.forEach((line) => {
    if (inFrontMatter > 1) {
      if (isZenn && line.startsWith("#")) {
        markdownLines.push(`#${line}`);
      } else {
        markdownLines.push(line);
      }
      return;
    }

    if (FrontMatterSplitter.test(line.trim())) {
      inFrontMatter++;
    } else {
      const [key, ...values] = line.split(":");
      switch (key) {
        case "title":
        case "canonical":
          frontMatter[key] = values.join(":").trim().replace(WrapDoubleQuote, "");
          break;
        case "backup":
          // Ignore keys
          break;
        default:
          if (!isZenn /* do not error that zenn article */) {
            throw new Error(`Unknown key: ${key}`);
          }
      }
    }
  });

  const post = await getPost(filePath, frontMatter, markdownLines.join("\n").trim());
  checkPost(post, filePath);
  return post;
};
