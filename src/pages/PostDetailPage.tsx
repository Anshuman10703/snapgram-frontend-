// ~/snapgram-amplify-original/frontend/src/pages/PostDetailPage.tsx
import React, { useEffect, useState } from 'react'; // CORRECTED LINE
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPostById, deletePost, type Post } from '../api/posts.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { Message } from '../components/common/Message.tsx';
import { StyledButton } from '../components/common/StyledButton.tsx';

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setError("Post ID is missing.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      const fetchedPost = await getPostById(postId);
      if (fetchedPost) {
        setPost(fetchedPost);
      } else {
        setError("Post not found or failed to load.");
      }
      setLoading(false);
    };
    fetchPost();
  }, [postId]);

  const handleDelete = async () => {
    if (!post || !window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    const success = await deletePost(post.id);
    if (success) {
      alert('Post deleted successfully!');
      navigate('/');
    } else {
      alert('Failed to delete post.');
    }
  };

  if (loading) return <Message>Loading post details...</Message>;
  if (error) return <Message className="text-red">Error: {error}</Message>;
  if (!post) return <Message>Post not found.</Message>;

  const creatorImageUrl = "/public/assets/images/default-profile-placeholder.svg";

  return (
    <div className="common-container flex-col items-center justify-start max-w-3xl"> {/* Tailwind classes */}
      <img src={post.imageUrl} alt={post.caption} className="w-full h-auto rounded-lg mb-4" /> {/* Tailwind classes */}
      <div className="flex flex-col gap-4 w-full"> {/* Tailwind classes */}
        <div className="flex items-center gap-4 mb-2"> {/* Tailwind classes */}
          <img src={creatorImageUrl} alt="Creator Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-primary-500" /> {/* Tailwind classes */}
          <span className="font-bold text-light-1 text-lg">{post.creatorId}</span> {/* Tailwind classes */}
          <p className="text-light-3 text-sm">{new Date(post.createdAt).toLocaleDateString()} - {post.location || 'Unknown Location'}</p> {/* Tailwind classes */}
        </div>
        <p className="text-lg leading-relaxed text-light-1">{post.caption}</p> {/* Tailwind classes */}
        <div className="flex flex-wrap gap-2 mt-2"> {/* Tailwind classes */}
          {post.tags?.map(tag => <span key={tag} className="bg-dark-4 text-light-3 px-2 py-1 rounded-md text-xs">#{tag}</span>)} {/* Tailwind classes */}
        </div>
        {user && user.id === post.creatorId && (
          <div className="flex justify-end gap-4 mt-4 w-full"> {/* Tailwind classes */}
            <StyledButton onClick={() => navigate(`/posts/${post.id}/edit`)} className="shad-button-primary bg-primary-500">Edit Post</StyledButton> {/* Tailwind classes */}
            <StyledButton onClick={handleDelete} className="shad-button-primary bg-red-500">Delete Post</StyledButton> {/* Tailwind classes */}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;