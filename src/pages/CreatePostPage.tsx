// ~/snapgram-amplify-original/frontend/src/pages/CreatePostPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost, getPresignedUrl, uploadFileToS3Direct } from '../api/posts.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { StyledButton } from '../components/common/StyledButton.tsx';
import { Message } from '../components/common/Message.tsx';

const CreatePostPage: React.FC = () => {
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setFilePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to create a post.');
      return;
    }

    setLoading(true);
    let imageUrl = '';
    let imageID = '';

    if (file) {
      console.log('Attempting to get pre-signed URL...');
      const presignedData = await getPresignedUrl(file.name, file.type);
      if (!presignedData || !presignedData.presignedUrl || !presignedData.imageUrl || !presignedData.imageID) {
        alert('Failed to get pre-signed URL data (URL, ID, or Image URL missing).');
        setLoading(false);
        return;
      }
      console.log('Pre-signed URL obtained:', presignedData.presignedUrl);

      const uploadSuccess = await uploadFileToS3Direct(presignedData.presignedUrl, file);
      if (uploadSuccess) {
        imageUrl = presignedData.imageUrl;
        imageID = presignedData.imageID;
        console.log('Direct S3 Upload successful:', { imageUrl, imageID });
      } else {
        alert('Image upload failed during direct S3 PUT.');
        setLoading(false);
        return;
      }
    } else {
      alert('Please select an image for your post.');
      setLoading(false);
      return;
    }

    const postData = {
      caption,
      tags,
      location,
      imageUrl,
      imageID,
      creatorId: user.id,
    };

    console.log('Attempting to create post in DynamoDB:', postData);
    const newPost = await createPost(postData);
    if (newPost) {
      alert('Post created successfully!');
      navigate('/');
    } else {
      alert('Failed to create post.');
    }
    setLoading(false);
  };

  return (
   <div className="bg-dark-2 shadow-xl rounded-3xl p-10 w-full max-w-2xl mx-auto flex flex-col items-center animate-fade-in">
  <h2 className="text-3xl font-bold text-center mb-8 text-white">Create New Post</h2>

  <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
    
    {/* Caption */}
    <textarea
      placeholder="What's on your mind?"
      value={caption}
      onChange={(e) => setCaption(e.target.value)}
      required
      className="bg-dark-4 border border-dark-3 text-white rounded-xl p-4 min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
    />

    {/* Image Upload */}
    <div className="flex flex-col items-center justify-center bg-dark-3 border-2 border-dashed border-purple-500 p-6 rounded-xl cursor-pointer hover:bg-dark-4 transition relative overflow-hidden">
      {filePreview ? (
        <div className="flex flex-col items-center animate-scale-in">
          <img src={filePreview} alt="Preview" className="max-w-full max-h-48 rounded-lg shadow-md" />
          <p className="text-sm text-purple-300 mt-2">Click to change image</p>
        </div>
      ) : (
        <p className="text-sm text-purple-200">Drag & drop an image here, or click to select</p>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>

    {/* Location */}
    <input
      type="text"
      placeholder="Location (e.g., City, Country)"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
      className="bg-dark-4 border border-dark-3 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
    />

    {/* Tags */}
    <input
      type="text"
      placeholder="Tags (comma-separated, e.g., #nature, #travel)"
      value={tags}
      onChange={(e) => setTags(e.target.value)}
      className="bg-dark-4 border border-dark-3 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
    />

    {/* Buttons */}
    <div className="flex justify-end gap-4 mt-4">
      <StyledButton
        type="button"
        onClick={() => navigate('/')}
        className="bg-dark-4 text-white px-6 py-3 rounded-xl hover:bg-dark-5 transition"
      >
        Cancel
      </StyledButton>
      <StyledButton
        type="submit"
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Post'}
      </StyledButton>
    </div>
  </form>
</div>

  );
};

export default CreatePostPage;