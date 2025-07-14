import { baseUrl } from "@/app/sitemap";
import { CustomMDX } from "@/components/mdx";
import { getBlogPosts } from "@/lib/blog";
import { authors } from "@/lib/data";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  const post = getBlogPosts().find((post) => post.slug === slug);

  if (!post) {
    return;
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: image
        ? [
            {
              url: image,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image
        ? [
            {
              url: image,
            },
          ]
        : undefined,
    },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;

  const post = getBlogPosts().find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  const author = authors.find((author) => author.id === post.metadata.author);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: `${baseUrl}${post.metadata.image}`,
            url: `${baseUrl}/blog/${post.slug}`,
          }),
        }}
      />

      {/* Hero Section */}
      <div className="relative">
        {post.metadata.image && (
          <div className="relative h-72 w-full overflow-hidden">
            <Image
              src={post.metadata.image || "/placeholder.svg"}
              alt={post.metadata.title}
              fill
              className="object-center aspect-video object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        )}

        {/* Main Content Container */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          {/* Article Card */}
          <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Article Header */}
            <div className="px-6 sm:px-8 lg:px-12 pt-8 pb-6">
              {/* Category Badge */}
              {post.metadata.tag && (
                <div className="flex items-center space-x-2 mb-6">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    {post.metadata.tag}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8">
                {post.metadata.title}
              </h1>

              {/* Author and Date Info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-gray-200">
                {/* Author Info */}
                {author && (
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Image
                        src={author.image || "/placeholder.svg"}
                        alt={author.fullName}
                        width={60}
                        height={60}
                        className="rounded-full object-cover ring-2 ring-blue-100"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {author.fullName}
                      </h3>
                      <p className="text-gray-600 text-sm">{author.title}</p>
                    </div>
                  </div>
                )}

                {/* Publication Date */}
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <time
                    dateTime={post.metadata.publishedAt}
                    className="text-sm font-medium"
                  >
                    {format(new Date(post.metadata.publishedAt), "MMM d, yyyy")}
                  </time>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="px-6 sm:px-8 lg:px-12 pb-12">
              <div className="prose prose-lg prose-gray max-w-none">
                <CustomMDX source={post.content} />
              </div>
            </div>

            {/* Article Footer */}
            <div className="px-6 sm:px-8 lg:px-12 py-6 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Share this article:
                  </span>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors">
                      Twitter
                    </button>
                    <button className="px-3 py-1 bg-blue-800 text-white text-xs rounded-md hover:bg-blue-900 transition-colors">
                      LinkedIn
                    </button>
                    <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded-md hover:bg-gray-700 transition-colors">
                      Copy Link
                    </button>
                  </div>
                </div> */}
                <div className="text-sm text-gray-500">
                  Last updated:{" "}
                  {format(new Date(post.metadata.publishedAt), "MMM d, yyyy")}
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
