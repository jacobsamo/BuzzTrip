import type { BlogMetadata } from "@/lib/blog";
import { authors } from "@/lib/data";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  post: BlogMetadata & { slug: string };
}

const BlogCard = ({ post }: BlogCardProps) => {
  const author = authors.find((author) => author.id === post.author);

  if (!author) {
    return null;
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="h-fit w-full flex flex-col rounded-lg border border-gray-200 p-6 shadow-md hover:border-primary transition-all duration-200 ease-in-out"
    >
      <div className="relative h-48">
        <Image
          src={post.image}
          alt={post.title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold">{post.title}</h2>
        <p className="text-gray-600">{post.summary}</p>
        <div className="flex items-center mt-4">
          <Image
            src={author.image}
            alt={author.fullName}
            width={24}
            height={24}
            className="rounded-full"
          />
          <p className="text-gray-600 ml-2">
            {format(new Date(post.publishedAt), "MMM d, yyyy")}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
