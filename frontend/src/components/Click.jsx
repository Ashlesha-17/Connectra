import React, { useRef, useState } from "react";
import axios from "axios";
import "./Click.css";

const Click = ({ onClose, onUpload }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [username, setUsername] = useState("");
  const [caption, setCaption] = useState("");
  const [photoTaken, setPhotoTaken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera error:", err);
      setMessage("Unable to access camera");
    }
  };

  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    video.srcObject.getTracks().forEach((t) => t.stop());
    setPhotoTaken(true);
  };

  const handleSubmit = async () => {
    if (!username || !caption) {
      setMessage("Username and caption are required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const blob = await (await fetch(canvasRef.current.toDataURL())).blob();
      const formData = new FormData();
      formData.append("file", blob, "camera.png");
      formData.append("username", username);
      formData.append("caption", caption);

      await axios.post(`${API_URL}/upload`, formData);
      onUpload();
      onClose();
    } catch (err) {
      console.error("Upload failed:", err);
      setMessage("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create Post</h2>

      {message && <p className="message">{message}</p>}

      <video ref={videoRef} autoPlay hidden={photoTaken} />
      <canvas ref={canvasRef} hidden={!photoTaken} />

      {!photoTaken && (
        <>
          <button className="upload-button" onClick={startCamera}>
            Start Camera
          </button>
          <button className="upload-button" onClick={takePhoto}>
            Capture
          </button>
        </>
      )}

      {photoTaken && (
        <>
          <input
            className="text-input"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <textarea
            className="caption-input"
            placeholder="Caption"
            onChange={(e) => setCaption(e.target.value)}
          />

          <button
            className="upload-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </>
      )}
    </div>
  );
};

export default Click;
