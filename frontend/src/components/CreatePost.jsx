import React, { useState } from "react";
import axios from "axios";
import "./Styles.css"; // ⭐ THIS WAS MISSING

function CreatePost(props) {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !username || !caption) {
      setMessage("All fields required");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", username);
    formData.append("caption", caption);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/upload`,
        formData
      );

      setMessage("Post uploaded!");
      props.setRefreshTrigger(prev => prev + 1);

      setUsername("");
      setCaption("");
      setFile(null);
    } catch (err) {
      setMessage("Upload failed");
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create Post</h2>

      <form className="upload-form" onSubmit={handleSubmit}>
        <input
          className="text-input"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <textarea
          className="caption-input"
          placeholder="Caption"
          value={caption}
          onChange={e => setCaption(e.target.value)}
        />

        <input
          className="file-input"
          type="file"
          onChange={e => setFile(e.target.files[0])}
        />

        <button className="upload-button" type="submit">
          Upload
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default CreatePost;
