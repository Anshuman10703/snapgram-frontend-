// 13. src/api/posts.ts (API functions for Posts)
// -----------------------------------------------------------------------------
// Contains functions to interact with your Post-related Lambda endpoints.
import axios from 'axios'; // Add this import
import { API_GATEWAY_URL, S3_BUCKET_NAME, S3_BUCKET_URL_PREFIX } from '../aws-config.ts';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { v4 as uuidv4 } from 'uuid';

export interface Post {
  id: string;
  creatorId: string;
  caption: string;
  tags: string[];
  location?: string;
  imageUrl: string;
  imageID?: string;
  createdAt: string;
  likes: string[];
  saves: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  name: string;
  imageUrl?: string;
  bio?: string;
}

// New function to get a pre-signed URL from your Lambda
export const getPresignedUrl = async (fileName: string, contentType: string): Promise<{ presignedUrl: string; imageID: string; imageUrl: string } | null> => {
  try {
    const response = await axios.get(`${API_GATEWAY_URL}/presigned-url?fileName=${fileName}&contentType=${contentType}`);
    const data = response.data; // Axios puts response data in .data
    return data;
  } catch (error: any) {
    console.error('Error getting pre-signed URL:', error.response?.data || error.message);
    alert(`Failed to get upload URL: ${error.response?.data?.message || error.message}`);
    return null;
  }
};

// New function to perform the direct S3 upload using the presigned URL
export const uploadFileToS3Direct = async (presignedUrl: string, file: File): Promise<boolean> => {
  try {
    const response = await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type, // Important: Content-Type must match what was signed
      },
      // Axios handles arraybuffer/blob directly for PUT
    });

    if (response.status >= 200 && response.status < 300) { // Check for 2xx status codes
      console.log('File uploaded directly to S3 using presigned URL.');
      return true;
    } else {
      throw new Error(`S3 direct upload failed with status: ${response.status} - ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Error during direct S3 upload:', error.response?.data || error.message);
    alert(`Direct S3 upload failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
};

// Original deleteFileFromS3 function (adjusted to remove credentials param as it's not needed for direct S3 delete via Lambda proxy)
export const deleteFileFromS3 = async (imageID: string): Promise<boolean> => {
  if (!imageID) {
    console.error("Deletion failed: Image ID missing.");
    return false;
  }
  // In this simplified setup, the deletePost Lambda handles S3 deletion.
  // This frontend function is a placeholder if you needed a separate API for image deletion.
  console.warn("deleteFileFromS3 is not implemented for direct frontend use in this simplified version. deletePost Lambda handles S3 deletion.");
  return true; // Assume success for now, as the backend handles it.
};


export const createPost = async (postData: { caption: string; tags: string; location: string; imageUrl: string; imageID: string; creatorId: string; }): Promise<Post | null> => {
  try {
    const response = await axios.post(`${API_GATEWAY_URL}/posts`, postData, {
      headers: { 'Content-Type': 'application/json' },
    });
    const data = response.data;
    return data.post;
  } catch (error: any) {
    console.error('Error creating post:', error.response?.data || error.message);
    alert(`Error creating post: ${error.response?.data?.message || error.message}`);
    return null;
  }
};

export const getPosts = async (lastId?: string): Promise<{ posts: Post[]; lastId: string | null } | null> => {
  try {
    const url = lastId ? `${API_GATEWAY_URL}/posts?lastId=${lastId}` : `${API_GATEWAY_URL}/posts`;
    const response = await axios.get(url);
    const data = response.data;
    return data;
  } catch (error: any) {
    console.error('Error fetching posts:', error.response?.data || error.message);
    alert(`Error fetching posts: ${error.response?.data?.message || error.message}`);
    return null;
  }
};

export const getPostById = async (postId: string): Promise<Post | null> => {
  try {
    const response = await axios.get(`${API_GATEWAY_URL}/posts/${postId}`);
    const data = response.data;
    if (response.status === 404) { // Check for 404 explicitly
      return null;
    }
    return data.post;
  } catch (error: any) {
    console.error('Error fetching post by ID:', error.response?.data || error.message);
    alert(`Error fetching post: ${error.response?.data?.message || error.message}`);
    return null;
  }
};

export const updatePost = async (postId: string, postData: Partial<Post>): Promise<Post | null> => {
  try {
    const response = await axios.put(`${API_GATEWAY_URL}/posts/${postId}`, postData, {
      headers: { 'Content-Type': 'application/json' },
    });
    const data = response.data;
    return data.post;
  } catch (error: any) {
    console.error('Error updating post:', error.response?.data || error.message);
    alert(`Error updating post: ${error.response?.data?.message || error.message}`);
    return null;
  }
};

export const deletePost = async (postId: string): Promise<boolean> => {
  try {
    const response = await axios.delete(`${API_GATEWAY_URL}/posts/${postId}`);
    const data = response.data;
    alert(data.message);
    return true;
  } catch (error: any) {
    console.error('Error deleting post:', error.response?.data || error.message);
    alert(`Error deleting post: ${error.response?.data?.message || error.message}`);
    return false;
  }
};