// 21. src/components/PostCard.tsx
// -----------------------------------------------------------------------------
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { type Post, type UserProfile } from '../api/posts.ts';
// No Message or StyledButton imports needed here as they are not directly used in this component.

interface PostCardProps {
  post: Post;
  currentUser: UserProfile | null;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser }) => {
  const navigate = useNavigate();

  // Placeholder for creator's actual image URL (if you store it in DynamoDB user table)
  const creatorImageUrl = "/public/assets/images/default-profile-placeholder.svg"; // Changed to local path for development

  return (
    <div className="post-card bg-dark-2 rounded-lg shadow-lg overflow-hidden flex flex-col cursor-pointer transform transition-transform duration-200 hover:scale-105" onClick={() => navigate(`/posts/${post.id}`)}> {/* Tailwind classes */}
      <Link to={`/posts/${post.id}`}>
        <img src={post.imageUrl} alt={post.caption} className="w-full h-52 object-cover rounded-t-lg" /> {/* Tailwind classes */}
      </Link>
      <div className="p-4 flex flex-col gap-2"> {/* Tailwind classes */}
        <div className="flex items-center gap-2"> {/* Tailwind classes */}
          <img src={creatorImageUrl} alt="Creator Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-primary-500" /> {/* Tailwind classes */}
          <span className="font-bold text-light-1 text-lg">{post.creatorId}</span> {/* Tailwind classes */}
        </div>
        <h3 className="text-xl font-semibold text-light-1">{post.caption}</h3> {/* Tailwind classes */}
        <p className="text-light-3 text-sm">{post.creatorId}</p> {/* Tailwind classes */}
        <div className="flex flex-wrap gap-1 mt-2"> {/* Tailwind classes */}
          {post.tags?.map(tag => <span key={tag} className="bg-dark-4 text-light-3 px-2 py-1 rounded-md text-xs">#{tag}</span>)} {/* Tailwind classes */}
        </div>
      </div>
    </div>
  );
};

export default PostCard;