import BlogCard from "@/components/blog-card";
import { getBlogPosts } from "@/lib/blog";

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <main>
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to the BuzzTrip Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Keep up to date with our latest news and updates.
          </p>
        </div>
      </section>
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {posts.map((post) => (
          <BlogCard
            post={{
              ...post.metadata,
              slug: post.slug,
            }}
          />
        ))}
      </div>
    </main>
  );
}
