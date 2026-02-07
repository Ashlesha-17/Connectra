import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Styles.css";

function ShowPost({ refreshTrigger }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [refreshTrigger]);

  const fetchFiles = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_URL}/files`);
      setFiles(response.data);
    } catch (err) {
      console.error("Error fetching files:", err);
      setError("Failed to fetch posts. Please try again.");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      fetchFiles();
    } catch (err) {
      console.error("Error deleting file:", err);
      setError("Failed to delete post. Please try again.");
    }
  };

  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleString();
  };

  return (
    <div className="show-posts-container">
      <h2>Your Feed</h2>

      {loading && <p className="loading-message">Loading posts...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="posts-grid">
        {!loading && files.length === 0 && (
          <p className="no-posts">No posts yet</p>
        )}

        {files.map((file) => (
          <div key={file._id} className="post-card">
            <div className="post-image-container">
              <img
                src={file.file_url}
                alt={file.caption || "User post"}
                className="post-image"
              />
            </div>

            <div className="post-footer">
              <p className="post-caption">{file.caption}</p>
              <p className="post-time">{formatTime(file.upload_time)}</p>

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
