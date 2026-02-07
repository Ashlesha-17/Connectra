import React, { useState } from "react";
import axios from "axios";
import "./Styles.css";

function SearchUser() {
  const [username, setUsername] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL; // Render backend

  const handleSearch = async () => {
    if (!username.trim()) return;

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/files?username=${username}`);
      setSearchResults(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching user posts:", err);
      setError("Error fetching user posts");
      setSearchResults([]);
    } finally {
      setSearched(true);
      setLoading(false);
    }
  };

  return (
    <div className="search-user-container">
      <input
        type="text"
        placeholder="Search by username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="search-input"
      />
      <button onClick={handleSearch} className="search-btn">
        Search
      </button>

      {loading && <p className="loading-message">Searching...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="search-results">
        {searched && !loading &&
          (searchResults.length > 0 ? (
            searchResults.map((post) => (
              <div key={post._id} className="post-card">
                <img
                  src={post.file_url}
                  alt={post.caption || "User post"}
                  className="post-image"
                />
                <p className="post-caption">{post.caption}</p>
              </div>
            ))
          ) : (
            <p>No posts found</p>
          ))}
      </div>
    </div>
  );
}

export default SearchUser;
