import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Styles.css";

function ShowPost({ refreshTrigger }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [refreshTrigger]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/files`
      );
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/delete/${id}`
      );
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file", error);
    }
  };

  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleString();
  };

  return (
    <div className="show-posts-container">
      <h2>Your Feed</h2>

      <div className="posts-grid">
        {files.length === 0 && (
          <p className="no-posts">No posts yet</p>
        )}

        {files.map((file) => (
          <div key={file._id} className="post-card">
            <div className="post-image-container">
              <img
                src={file.file_url}
                alt="post"
                className="post-image"
              />
            </div>

            <div className="post-footer">
              <p className="post-caption">{file.caption}</p>
              <p className="post-time">
                {formatTime(file.upload_time)}
              </p>

              <button
                className="delete-button"
                onClick={() => handleDelete(file._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowPost;
