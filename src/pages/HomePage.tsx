// ~/snapgram-amplify-original/frontend/src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { getPosts, type Post } from '../api/posts.ts';
import { useAuth } from '../context/AuthContext.tsx';
import PostCard from '../components/PostCard.tsx';
import { Message } from '../components/common/Message.tsx';
import { StyledButton } from '../components/common/StyledButton.tsx';
// @ts-ignore
import { useNavigate, Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      const data = await getPosts();
      if (data) {
        setPosts(data.posts);
      } else {
        setError("Failed to load posts.");
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
<div className="common-container flex-col items-center justify-start max-w-5xl mx-auto px-4 sm:px-6">
  {/* Header with Logo and Navigation */}
  <header className="flex justify-between items-center w-full py-4 mb-6 border-b border-dark-4">
    <Link to="/" className="flex items-center gap-2">
      <img src="/assets/images/logo.svg" alt="Snapgram Logo" className="h-10" />
    </Link>

    <nav className="flex items-center gap-4">
      <StyledButton 
        onClick={() => navigate('/create-post')} 
        className="shad-button-primary hover:bg-primary-600 transition duration-200"
      >
        Create Post
      </StyledButton>

      {user && (
        <StyledButton 
          onClick={signOut} 
          className="shad-button-dark4 hover:bg-dark-3 transition duration-200"
        >
          Sign Out
        </StyledButton>
      )}
    </nav>
  </header>

  {/* Feed Header */}
  <h2 className="h2-bold text-center mb-6">Snapgram Feed</h2>

  {/* Welcome Message */}
  {user && (
    <div className="text-center mb-6">
  <p className="text-sky-400 text-base sm:text-lg font-medium">
    Welcome, {user?.name || 'User'} <span className="text-gray-400">(@{user?.username || 'anon'})</span>
  </p>
</div>

  )}

  {/* Status Messages */}
  {loading && (
    <Message className="text-light-2 text-center mb-4">Loading posts...</Message>
  )}
  {error && (
    <Message className="text-red-500 text-center mb-4">Error: {error}</Message>
  )}
  {!loading && !error && posts.length === 0 && (
    <Message className="text-light-3 text-center mb-4">
      No posts yet. Be the first to create one!
    </Message>
  )}

  {/* Post Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
    {posts.map(post => (
      <PostCard key={post.id} post={post} currentUser={user} />
    ))}
  </div>
</div>

  );
};

export default HomePage;