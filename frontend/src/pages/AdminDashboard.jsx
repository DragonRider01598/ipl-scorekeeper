import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminMatchPanel = () => {
  const [matches, setMatches] = useState([]);
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [editedWinner, setEditedWinner] = useState('');
  const [newMatch, setNewMatch] = useState({
    teamOne: "",
    teamTwo: "",
    matchDate: "",
    matchTime: "",
    teamOneImage: "",
    teamTwoImage: "",
    additionalDetails: "",
  });

  const logo = {
    "CSK": "https://documents.iplt20.com/ipl/CSK/logos/Logooutline/CSKoutline.png",
    "DC": "https://documents.iplt20.com/ipl/DC/Logos/LogoOutline/DCoutline.png",
    "GT": "https://documents.iplt20.com/ipl/GT/Logos/Logooutline/GToutline.png",
    "KKR": "https://documents.iplt20.com/ipl/KKR/Logos/Logooutline/KKRoutline.png",
    "LSG": "https://documents.iplt20.com/ipl/LSG/Logos/Logooutline/LSGoutline.png",
    "MI": "https://documents.iplt20.com/ipl/MI/Logos/Logooutline/MIoutline.png",
    "PBKS": "https://documents.iplt20.com/ipl/PBKS/Logos/Logooutline/PBKSoutline.png",
    "RR": "https://documents.iplt20.com/ipl/RR/Logos/Logooutline/RRoutline.png",
    "RCB": "https://documents.iplt20.com/ipl/RCB/Logos/Logooutline/RCBoutline.png",
    "SRH": "https://documents.iplt20.com/ipl/SRH/Logos/Logooutline/SRHoutline.png"
  }

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/matches", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedMatches = Array.isArray(res.data)
        ? res.data.map((match) => ({
          ...match,
          matchDate: new Date(match.matchDate).toLocaleString("en-US", {
            weekday: "long",
            month: "long",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        }))
        : [];

      setMatches(formattedMatches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setMatches([]);
    }
  };

  const handleInputChange = (e) => {
    setNewMatch({ ...newMatch, [e.target.name]: e.target.value });
  };

  const handleAddMatch = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/matches", newMatch, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      fetchMatches();
    } catch (error) {
      console.error("Error adding match:", error);
    }
  };

  const handleDeclareWinner = async (matchId, winner) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/matches/declare/${matchId}`, { declaredWinner: winner }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMatches();
      setEditingMatchId(null);
    } catch (error) {
      console.error('Error declaring winner:', error);
    }
  };

  const handleEditWinner = (matchId, currentWinner) => {
    setEditingMatchId(matchId);
    setEditedWinner(currentWinner);
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Admin Match Panel</h2>

      {/* Add Match Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Add Match</h3>
        <div className="grid grid-cols-2 gap-4">
          <select
            name="teamOne"
            className="p-2 bg-gray-700 rounded text-white"
            onChange={handleInputChange}
            value={newMatch.teamOne}
          >
            <option value="">Select Team One</option>
            {Object.keys(logo).map((team) => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
          <select
            name="teamTwo"
            className="p-2 bg-gray-700 rounded text-white"
            onChange={handleInputChange}
            value={newMatch.teamTwo}
          >
            <option value="">Select Team Two</option>
            {Object.keys(logo).map((team) => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
          <input
            type="date"
            name="matchDate"
            className="p-2 bg-gray-700 rounded text-white"
            onChange={handleInputChange}
          />
          <input
            type="time"
            name="matchTime"
            className="p-2 bg-gray-700 rounded text-white"
            onChange={handleInputChange}
          />
        </div>
        <textarea
          name="additionalDetails"
          placeholder="Additional Details"
          className="w-full p-2 bg-gray-700 rounded text-white mt-4"
          onChange={handleInputChange}
        ></textarea>
        <button
          onClick={handleAddMatch}
          className="mt-4 bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
        >
          Add Match
        </button>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Existing Matches</h3>
        {matches.length > 0 ? (
          <ul className="space-y-4">
            {matches.map(match => (
              <li key={match._id} className="p-4 bg-gray-700 rounded flex flex-col gap-2 items-center">
                {/* Match Title with Logos */}
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2">
                    <img src={logo[match.teamOne]} alt={match.teamOne} className="w-8 h-8 rounded-full" />
                    <p className="text-lg font-semibold">{match.teamOne}</p>
                  </div>
                  <p className="text-lg font-semibold">vs</p>
                  <div className="flex items-center gap-2">
                    <img src={logo[match.teamTwo]} alt={match.teamTwo} className="w-8 h-8 rounded-full" />
                    <p className="text-lg font-semibold">{match.teamTwo}</p>
                  </div>
                </div>

                {/* Match Date */}
                <p>{match.matchDate}</p>

                {/* If winner is declared, show winner and Edit button */}
                {match.declaredWinner ? (
                  <div className="flex items-center gap-4">
                    {editingMatchId === match._id ? (
                      <>
                        <select
                          value={editedWinner}
                          onChange={(e) => setEditedWinner(e.target.value)}
                          className="p-2 bg-gray-600 rounded"
                        >
                          <option value={match.teamOne}>{match.teamOne}</option>
                          <option value={match.teamTwo}>{match.teamTwo}</option>
                        </select>
                        <button
                          onClick={() => handleDeclareWinner(match._id, editedWinner)}
                          className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-1 px-4 rounded"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-green-400 font-bold">Winner: {match.declaredWinner}</p>
                        <button
                          onClick={() => handleEditWinner(match._id, match.declaredWinner)}
                          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-4 rounded"
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeclareWinner(match._id, match.teamOne)}
                      className="bg-green-800 hover:bg-green-900 text-white font-bold py-1 px-4 rounded flex items-center gap-2"
                    >
                      <img src={logo[match.teamOne]} alt={match.teamOne} className="w-6 h-6 rounded-full" />
                      {match.teamOne} Wins
                    </button>
                    <button
                      onClick={() => handleDeclareWinner(match._id, match.teamTwo)}
                      className="bg-red-800 hover:bg-red-900 text-white font-bold py-1 px-4 rounded flex items-center gap-2"
                    >
                      <img src={logo[match.teamTwo]} alt={match.teamTwo} className="w-6 h-6 rounded-full" />
                      {match.teamTwo} Wins
                    </button>
                  </div>
                )}
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