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
    <div className="common-container flex-col items-center justify-start max-w-2xl"> {/* Tailwind classes */}
      <h2 className="h2-bold text-center mb-6">Create New Post</h2> {/* Tailwind classes */}
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
              <p className="text-light-4 text-sm-regular mt-2">Click to change image</p> {/* Tailwind classes */}
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
          <StyledButton type="button" onClick={() => navigate('/')} className="shad-button-dark4">
            Cancel
          </StyledButton>
          <StyledButton type="submit" disabled={loading} className="shad-button-primary">
            {loading ? 'Creating...' : 'Create Post'}
          </StyledButton>
        </div>
      </form>
    </div>
  );
};

export default CreatePostPage;