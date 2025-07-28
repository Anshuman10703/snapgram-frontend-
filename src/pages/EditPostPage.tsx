// ~/snapgram-amplify-original/frontend/src/pages/EditPostPage.tsx
import React, { useState, useEffect } from 'react'; // CORRECTED LINE
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, updatePost, getPresignedUrl, uploadFileToS3Direct, type Post } from '../api/posts.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { StyledButton } from '../components/common/StyledButton.tsx';
import { Message } from '../components/common/Message.tsx';

const EditPostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setError("Post ID is missing.");
        setInitialLoading(false);
        return;
      }
      const fetchedPost = await getPostById(postId);
      if (fetchedPost) {
        setPost(fetchedPost);
        setCaption(fetchedPost.caption);
        setTags(fetchedPost.tags.join(', '));
        setLocation(fetchedPost.location || '');
        setFilePreview(fetchedPost.imageUrl);
      } else {
        setError("Post not found or failed to load.");
      }
      setInitialLoading(false);
    };
    fetchPost();
  }, [postId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setFilePreview(post?.imageUrl || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to create a post.');
      return;
    }

    setLoading(true);
    let newImageUrl = post?.imageUrl;
    let newImageID = post?.imageID;

    if (file) {
      const presignedData = await getPresignedUrl(file.name, file.type);
      if (!presignedData) {
        alert('Failed to get pre-signed URL for upload.');
        setLoading(false);
        return;
      }
      const uploadSuccess = await uploadFileToS3Direct(presignedData.presignedUrl, file);
      if (uploadSuccess) {
        newImageUrl = presignedData.imageUrl;
        newImageID = presignedData.imageID;
      } else {
        alert('New image upload failed during direct S3 PUT.');
        setLoading(false);
        return;
      }
    }

    const updatedData: Partial<Post> = {
      caption,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      location,
      imageUrl: newImageUrl,
      imageID: newImageID,
    };

    const updatedPost = await updatePost(post!.id, updatedData);
    if (updatedPost) {
      alert('Post updated successfully!');
      navigate(`/posts/${updatedPost.id}`);
    } else {
      alert('Failed to update post.');
    }
    setLoading(false);
  };

  if (initialLoading) return <Message>Loading post for editing...</Message>;
  if (error) return <Message className="text-red">Error: {error}</Message>;
  if (!post) return <Message>Post not found.</Message>;
  if (user && user.id !== post.creatorId) return <Message className="text-red">You are not authorized to edit this post.</Message>;

  return (
    <div className="common-container flex-col items-center justify-start max-w-2xl"> {/* Tailwind classes */}
      <h2 className="h2-bold text-center mb-6">Edit Post</h2> {/* Tailwind classes */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full"> {/* Tailwind classes */}
        <textarea
          placeholder="Caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          required
          className="shad-textarea" // Tailwind class
        ></textarea>
        <div className="file-input-container flex-col flex-center p-8 rounded-xl cursor-pointer bg-dark-3 text-purple-300 relative overflow-hidden"> {/* Tailwind classes */}
          {filePreview ? (
            <div className="file-preview flex flex-col items-center"> {/* Tailwind classes */}
              <img src={filePreview} alt="File Preview" className="max-w-full max-h-40 rounded-md mt-2" /> {/* Tailwind classes */}
              <p className="text-light-4 text-sm-regular mt-2">Click to change image</p>
            </div>
          ) : (
            <p className="text-light-4 text-sm-regular">Drag & drop an image here, or click to select</p>
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" /> {/* Tailwind classes */}
        </div>
        <input
          type="text"
          placeholder="Location (e.g., City, Country)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="shad-input" // Tailwind class
        />
        <input
          type="text"
          placeholder="Tags (comma-separated, e.g., #nature, #travel)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="shad-input" // Tailwind class
        />
        <div className="flex justify-end gap-4 mt-4"> {/* Tailwind classes */}
          <StyledButton type="button" onClick={() => navigate(`/posts/${post!.id}`)} className="shad-button-dark4">
            Cancel
          </StyledButton>
          <StyledButton type="submit" disabled={loading} className="shad-button-primary">
            {loading ? 'Updating...' : 'Update Post'}
          </StyledButton>
        </div>
      </form>
    </div>
  );
};

export default EditPostPage;