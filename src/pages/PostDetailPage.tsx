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

  const creatorImageUrl = "/assets/images/boy.png";

  return (
   <div className="common-container flex-col items-center justify-start max-w-3xl mx-auto px-4 sm:px-6">
  {/* Post Image */}
  <img 
    src={post.imageUrl} 
    alt={post.caption} 
    className="w-full h-auto rounded-xl shadow-lg mb-6 border border-dark-4" 
  />

  <div className="flex flex-col gap-4 w-full">
    
    {/* User Info */}
    <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
      <div className="flex items-center gap-3">
        <img 
          src={creatorImageUrl} 
          alt="Creator Avatar" 
          className="w-12 h-12 rounded-full object-cover border-2 border-primary-500" 
        />
       <span className="font-semibold text-light-1 text-lg break-all">
             Anonymous
      </span>

      </div>
      <p className="text-light-3 text-sm">
        {new Date(post.createdAt).toLocaleDateString()} • {post.location || 'Unknown Location'}
      </p>
    </div>

    {/* Caption */}
    <p className="text-base sm:text-lg leading-relaxed text-light-1 border-l-4 border-primary-500 pl-4 italic">
      {post.caption}
    </p>

    {/* Tags */}
    {post.tags?.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-2">
        {post.tags.map(tag => (
          <span 
            key={tag} 
            className="bg-dark-4 text-light-2 px-3 py-1 rounded-full text-xs tracking-wide hover:bg-dark-3 transition"
          >
            #{tag}
          </span>
        ))}
      </div>
    )}

    {/* Post Controls */}
    {user && user.id === post.creatorId && (
      <div className="flex justify-end gap-3 mt-6">
        <StyledButton 
          onClick={() => navigate(`/posts/${post.id}/edit`)} 
          className="shad-button-primary bg-primary-500 hover:bg-primary-600 transition-all"
        >
          Edit Post
        </StyledButton>
        <StyledButton 
          onClick={handleDelete} 
          className="shad-button-primary bg-red-500 hover:bg-red-600 transition-all"
        >
          Delete Post
        </StyledButton>
      </div>
    )}
  </div>
</div>

)};

export default PostDetailPage;