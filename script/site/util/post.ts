import path from "path";
import { readFile } from "fs/promises";
import { PostsDir } from "./path";
import { DateTime } from "@mryhryki/datetime";

const BreakCharacter = new RegExp("\r?\n");
const FrontMatterSplitter = new RegExp("^[-]{3,}$");
const DateTimeFormat = new RegExp(
  [
    "20[0-9]{2}-",
    "(0[1-9]|1[012])-",
    "(0[1-9]|[12][0-9]|3[01])T",
    "([01][0-9]|2[0-3]):",
    "([0-5][0-9]):",
    "([0-5][0-9])",
    "\\+09:00",
  ].join("")
);

export interface Post {
  id: string;
  title: string;
  markdown: string;
  createdAt: string;
  updatedAt?: string | null;
  canonical?: string | null;
}

const checkPost = (post: Post, filePath: string) => {
  if (post.id.trim().length < 3) {
    throw new Error(`ID must be at least 10 characters long: ${filePath}`);
  }
  if (post.title.trim().length < 5) {
    throw new Error(`Title must be at least 10 characters long: ${filePath}`);
  }
  if (post.markdown.trim().length < 10) {
    throw new Error(`Markdown must be at least 10 characters long: ${filePath}`);
  }
  if (DateTimeFormat.test(post.createdAt)) {
    throw new Error(`CreatedAt must be valid DateTime format[${post.createdAt}]: ${filePath}`);
  }
  if (post.updatedAt != null && !DateTimeFormat.test(post.createdAt)) {
    throw new Error(`UpdatedAt must be valid DateTime format[${post.updatedAt}]: ${filePath}`);
  }
  if (post.canonical != null && !post.canonical.startsWith("https://")) {
    throw new Error(`Canonical must be valid URL format[${post.canonical}]: ${filePath}`);
  }
};

const getPost = (filePath: string, frontMatter: Record<string, string>, markdown: string): Post => {
  const post: Post = {
    id: path.basename(filePath).replace(".md", "").trim(),
    title: (frontMatter.title ?? "").trim(),
    markdown,
    createdAt: "",
    updatedAt: frontMatter.updatedAt ?? null,
    canonical: frontMatter.canonical ?? null,
  };

  if (filePath.startsWith("blog/")) {
    post.createdAt = DateTime.parse(`${post.id.substring(0, 10)}T10:00:00+09:00`).toISO();
  } else if (filePath.startsWith("reading_log/")) {
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
  }

  return post;
};

export const parsePost = async (filePath: string): Promise<Post> => {
  const content: string = (await readFile(path.resolve(PostsDir, filePath))).toString("utf-8");
  const lines: string[] = content.split(BreakCharacter);

  const frontMatter: Record<string, string> = {};
  const markdownLines: string[] = [];

  let inFrontMatter = 0;
  lines.forEach((line) => {
    if (inFrontMatter > 1) {
      markdownLines.push(line);
      return;
    }

    if (FrontMatterSplitter.test(line.trim())) {
      inFrontMatter++;
    } else {
      const [key, ...values] = line.split(":");
      switch (key) {
        case "title":
        case "updated_at":
        case "canonical":
          frontMatter[key] = values.join(":").trim();
          break;
        default:
          if (!filePath.includes("/articles/") /* do not error that zenn article */) {
            throw new Error(`Unknown key: ${key}`);
          }
      }
    }
  });

  const post = getPost(filePath, frontMatter, markdownLines.join("\n"));
  checkPost(post, filePath);
  return post;
};
