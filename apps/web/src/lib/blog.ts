import fs from "fs";
import path from "path";

export type BlogMetadata = {
  title: string;
  publishedAt: string;
  author: string;
  summary: string;
  image: string;
  tag: string;
};

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);
  const frontMatterBlock = match?.[1];
  const content = fileContent.replace(frontmatterRegex, "").trim();
  const frontMatterLines = frontMatterBlock?.trim().split("\n") || [];
  const metadata: Partial<BlogMetadata> = {};

  for (const line of frontMatterLines) {
    const [key, ...valueArr] = line.split(": ");
    if (key) {
      let value = valueArr.join(": ").trim();
      value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes
      metadata[key.trim() as keyof BlogMetadata] = value;
    }
  }

  return { metadata: metadata as BlogMetadata, content };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getBlogPosts() {
  // Only run on server side
  if (typeof window !== "undefined") {
    throw new Error("getBlogPosts can only be called on the server side");
  }

  return getMDXData(
    path.join(process.cwd(), "src", "app", "blog", "posts")
  ).sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  });
}
