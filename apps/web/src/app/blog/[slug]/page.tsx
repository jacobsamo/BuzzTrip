import { baseUrl } from "@/app/sitemap";
import { CustomMDX } from "@/components/mdx";
import Image from "next/image";
// import { PostAuthor } from "@/components/post-author";
// import { PostStatus } from "@/components/post-status";
import { getBlogPosts } from "@/lib/blog";
import type { Metadata } from "next";
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

export default async function Page(params: Params) {
  const { slug } = await params;

  const post = getBlogPosts().find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container max-w-[1140px] flex justify-center">
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

      <article className="max-w-[680px] pt-[80px] md:pt-[150px] w-full">
          {/* <PostStatus status={post.metadata.tag} /> */}
  
          <h2 className="font-medium text-2xl mb-6">{post.metadata.title}</h2>
  
          <div className="updates">
            {post.metadata.image && (
              <Image
                src={post.metadata.image}
                alt={post.metadata.title}
                width={680}
                height={442}
                className="mb-12"
              />
            )}
            <CustomMDX source={post.content} />
          </div>
  
          {/* <div className="mt-10">
            <PostAuthor author="pontus" />
          </div> */}
        </article>
    </div>
  );
}
