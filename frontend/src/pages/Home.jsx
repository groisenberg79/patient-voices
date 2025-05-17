import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import axios from "axios";

function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/disease/search`,
        { params: { name: query } }
      );
      if (response.data.length === 1) {
        const item = response.data[0];
        navigate(`/disease/${item.id}`, {
          state: { name: item.name }
        });
      } else if (response.data.length > 1) {
        setResults(response.data); // show multiple options
      } else {
        navigate(`/disease/unknown`, {
          state: { name: query }
        });
      }
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <div className="main-content">
      <h1>Patient Voices</h1>
      <p className="tagline">A space for patients to share their experiences and insights.</p>
      <p>Search for a disease to read or share experiences.</p>

      <input
        type="text"
        placeholder="Search disease..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <ul>
        {results.map((item, index) => (
          <li
            key={index}
            style={{ cursor: 'pointer', color: 'blue' }}
            onClick={() =>
              navigate(`/disease/${item.id}`, {
                state: { name: item.name }
              })
            }
          >
            <strong>{item.name}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
