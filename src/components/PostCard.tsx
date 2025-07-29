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
  const creatorImageUrl = "/assets/images/default-profile-placeholder.svg"; // Changed to local path for development

  return (
  <div
  className="post-card bg-[#111827] rounded-xl shadow-md overflow-hidden flex flex-col cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
  onClick={() => navigate(`/posts/${post.id}`)}
>
  <Link to={`/posts/${post.id}`}>
    <img
      src={post.imageUrl}
      alt={post.caption}
      className="w-full h-52 object-cover"
    />
  </Link>

  <div className="p-4 flex flex-col gap-2">
    <div className="flex items-center gap-3">
      <img
        src={creatorImageUrl}
        alt="Creator Avatar"
        className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
      />
      <div className="flex flex-col">
        <span className="font-semibold text-sky-300 text-sm">Snapgram User</span>
        {/* Optional user handle subtitle */}
        {/* <span className="text-xs text-gray-500">Creator</span> */}
      </div>
    </div>

    <h3 className="text-lg font-medium text-gray-200">{post.caption}</h3>

    <div className="flex flex-wrap gap-2 mt-2">
      {post.tags?.map(tag => (
        <span
          key={tag}
          className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs font-medium"
        >
          #{tag}
        </span>
      ))}
    </div>
  </div>
</div>

  );
};

export default PostCard;