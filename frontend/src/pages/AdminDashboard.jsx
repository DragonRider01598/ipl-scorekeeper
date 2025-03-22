import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminMatchPanel = () => {
  const [matches, setMatches] = useState([]);
  const [newMatch, setNewMatch] = useState({
    teamOne: '',
    teamTwo: '',
    matchDate: '',
    matchTime: '',
    teamOneImage: '',
    teamTwoImage: '',
    additionalDetails: ''
  });

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get('/api/matches', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMatches(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setMatches([]);
    }
  };

  const handleInputChange = (e) => {
    setNewMatch({ ...newMatch, [e.target.name]: e.target.value });
  };

  const handleAddMatch = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post('/api/matches', newMatch, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      fetchMatches();
    } catch (error) {
      console.error('Error adding match:', error);
    }
  };

  const handleDeclareWinner = async (matchId, winner) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/matches/declare/${matchId}`, { declaredWinner: winner }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMatches();
    } catch (error) {
      console.error('Error declaring winner:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Admin Match Panel</h2>

      {/* Add Match Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Add Match</h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="teamOne" placeholder="Team One" className="p-2 bg-gray-700 rounded" onChange={handleInputChange} />
          <input type="text" name="teamTwo" placeholder="Team Two" className="p-2 bg-gray-700 rounded" onChange={handleInputChange} />
          <input type="date" name="matchDate" className="p-2 bg-gray-700 rounded" onChange={handleInputChange} />
          <input type="time" name="matchTime" className="p-2 bg-gray-700 rounded" onChange={handleInputChange} />
        </div>
        <textarea name="additionalDetails" placeholder="Additional Details" className="w-full p-2 bg-gray-700 rounded mt-4" onChange={handleInputChange}></textarea>
        <button onClick={handleAddMatch} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Match</button>
      </div>

      {/* Existing Matches Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Existing Matches</h3>
        {matches.length > 0 ? (
          <ul className="space-y-4">
            {matches.map(match => (
              <li key={match._id} className="p-4 bg-gray-700 rounded flex flex-col gap-2">
                <p className="text-lg font-semibold">{match.teamOne} vs {match.teamTwo}</p>
                <p>{new Date(match.matchDate).toDateString()} at {match.matchTime}</p>

                {/* Display Declared Winner */}
                {match.declaredWinner && (
                  <p className="text-green-400 font-bold">Winner: {match.declaredWinner}</p>
                )}

                <div className="flex gap-2">
                  <button onClick={() => handleDeclareWinner(match._id, match.teamOne)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-4 rounded">{match.teamOne} Wins</button>
                  <button onClick={() => handleDeclareWinner(match._id, match.teamTwo)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded">{match.teamTwo} Wins</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No matches available</p>
        )}
      </div>
    </div>
  );
};

export default AdminMatchPanel;