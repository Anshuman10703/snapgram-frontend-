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
    <div className="common-container flex-col items-center justify-start max-w-5xl"> {/* Tailwind classes */}
      {/* Header with Logo and Navigation */}
      <header className="flex justify-between items-center w-full p-4 mb-6 border-b border-dark-4"> {/* Tailwind classes */}
        <Link to="/" className="flex items-center gap-2"> {/* Tailwind classes */}
          <img src="/public/assets/images/logo.svg" alt="Snapgram Logo" className="h-10" /> {/* Tailwind classes */}
          <span className="h2-bold text-light-1">Snapgram</span> {/* Tailwind classes */}
        </Link>
        <nav className="flex items-center gap-4"> {/* Tailwind classes */}
          <StyledButton onClick={() => navigate('/create-post')} className="shad-button-primary">Create Post</StyledButton> {/* Tailwind classes */}
          {user && (
            <StyledButton onClick={signOut} className="shad-button-dark4">Sign Out</StyledButton> 
          )}
        </nav>
      </header>

      <h2 className="h2-bold text-center mb-6">Snapgram Feed</h2> {/* Tailwind classes */}
      
      {user && (
        <div className="text-center mb-6"> {/* Tailwind classes */}
          <p className="text-green-400">
            Welcome, {user.name} ({user.username})! Your ID: {user.id}
          </p>
        </div>
      )}
      
      {loading && <Message>Loading posts...</Message>}
      {error && <Message className="text-red">Error: {error}</Message>}
      {!loading && !error && posts.length === 0 && <Message>No posts yet. Be the first to create one!</Message>}
      
      <div className="post-grid"> {/* Tailwind classes */}
        {posts.map(post => (
          <PostCard key={post.id} post={post} currentUser={user} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;