import { useCallback, useEffect, useRef, useState } from "react";

const InfiniteScroll = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://dummyjson.com/posts?limit=5&skip=${page * 5}`
      );
      const data = await response.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(([entry]) => {
      console.log(entry.isIntersecting);
      if (entry.isIntersecting && !loading) {
        setPage((prev) => prev + 1);
      }
    }, options);

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loader, loading]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Infinite Scroll</h1>
      <div className="grid grid-cols-1 gap-4">
        {posts.map((post, index) => (
          <div key={index} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p>{post.body}</p>
            <div className="mt-2 text-gray-600">
              Views: {post.views} | Likes: {post.reactions.likes} | Dislikes:{" "}
              {post.reactions.dislikes}
            </div>
          </div>
        ))}
      </div>
      {loading && <div className="text-center mt-4">Loading...</div>}
      <div ref={loader} />
    </div>
  );
};

export default InfiniteScroll;
