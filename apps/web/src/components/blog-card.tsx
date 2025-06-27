import type { BlogMetadata } from "@/lib/blog";
import Link from "next/link";

interface BlogCardProps {
  post: BlogMetadata & { slug: string };
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Link href={`/blog/${post.slug}`}>
      <a className="flex flex-col rounded-lg border border-gray-200 p-6 shadow-md hover:border-primary transition-all duration-200 ease-in-out">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">{post.title}</h3>
          <span className="text-sm text-gray-500">{post.publishedAt}</span>
        </div>
        <p className="mt-4 text-sm text-gray-600">{post.summary}</p>
      </a>
    </Link>
  );
};

export default BlogCard;
