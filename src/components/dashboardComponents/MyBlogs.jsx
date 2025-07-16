'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Heart, MessageCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios
      .get('/api/user-blog')
      .then((res) => setBlogs(res.data.blogs))
      .catch((err) => console.error('Error loading blogs:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-foreground">My Blogs</h2>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <Skeleton key={idx} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <p className="text-muted-foreground text-center">You haven’t written any blogs yet.</p>
      ) : (
        <div className="grid gap-4">
          {blogs.map((blog) => (
            <Card
              key={blog.slug}
              className="transition-all hover:shadow-lg border border-border bg-background"
            >
              <CardContent className="p-5 space-y-2">
                <h3
                  onClick={() => router.push(`/blog/${blog.slug}`)}
                  className="text-xl font-semibold text-primary hover:underline cursor-pointer"
                >
                  {blog.title}
                </h3>
                <div className="text-sm text-muted-foreground flex flex-wrap gap-4">
                  <span>
                    <span className="font-medium">Category:</span> {blog.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" /> {blog.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" /> {blog.totalLikes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" /> {blog.totalComments}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>Created: {new Date(blog.createdAt).toLocaleDateString()}</span>
                  <span>Updated: {new Date(blog.updatedAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
