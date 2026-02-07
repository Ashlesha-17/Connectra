import React, { useRef, useState } from "react";
import axios from "axios";
import "./Click.css";

const Click = ({ onClose, onUpload }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [username, setUsername] = useState("");
  const [caption, setCaption] = useState("");
  const [photoTaken, setPhotoTaken] = useState(false);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    video.srcObject.getTracks().forEach(t => t.stop());
    setPhotoTaken(true);
  };

  const handleSubmit = async () => {
    const blob = await (await fetch(canvasRef.current.toDataURL())).blob();
    const formData = new FormData();
    formData.append("file", blob, "camera.png");
    formData.append("username", username);
    formData.append("caption", caption);

    await axios.post("http://localhost:3000/upload", formData);
    onUpload();
    onClose();
  };

return (
  <div className="create-post-container">
    <h2>Create Post</h2>

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
          onChange={e => setUsername(e.target.value)}
        />

        <textarea
          className="caption-input"
          placeholder="Caption"
          onChange={e => setCaption(e.target.value)}
        />

        <button className="upload-button" onClick={handleSubmit}>
          Upload
        </button>
      </>
    )}
  </div>
);

};

export default Click;
