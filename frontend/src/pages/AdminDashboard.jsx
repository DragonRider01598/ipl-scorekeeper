import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";

const AdminMatchPanel = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [editedWinner, setEditedWinner] = useState('');
  const [activeTab, setActiveTab] = useState(localStorage.getItem('adminTab') || 'match');
  const [newMatch, setNewMatch] = useState({
    teamOneName: "",
    teamTwoNmae: "",
    matchDate: "",
    matchTime: "",
    additionalDetails: "",
  });
  const [newTeam, setNewTeam] = useState({
    teamName: "",
    imageUrl: "",
    additionalDetails: ""
  });
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editedTeam, setEditedTeam] = useState({});

  useEffect(() => {
    fetchMatches();
    fetchTeams();
  }, [activeTab]);

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/matches", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formattedMatches = Array.isArray(res.data)
        ? res.data.map((match) => ({
          ...match,
          dateString: match.matchDate,
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

  const fetchTeams = async () => {
    try {
      const res = await axios.get("/api/teams");
      setTeams(res.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
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
      alert("Match added successfully!");
      fetchMatches();
    } catch (error) {
      console.error("Error adding match:", error);
    }
  };

  const handleAddTeam = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/teams", newTeam, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Team successfuly added!");
      fetchTeams();
    } catch (error) {
      console.error("Error adding team:", error);
    }
  };

  const handleUpdateTeam = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`/api/teams/${id}`, editedTeam, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTeams();
      setEditingTeamId(null);
      setEditedTeam({});
      alert("Team updated successfuly!");
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to update team');
    }
  };

  const handleDeleteTeam = async (id) => {
    if (!window.confirm('Delete this team?')) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/teams/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTeams();
      alert("Team deleted successfuly!");
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to delete team');
    }
  };

  const handleDeclareWinner = async (matchId, declaredWinner) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/matches/declare", {
        matchId, declaredWinner
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Winner declared successfully!");
      fetchMatches();
    } catch (error) {
      console.error("Error adding match:", error);
    }
  }

  const handleEditWinner = (matchId, currentWinner) => {
    setEditingMatchId(matchId);
    setEditedWinner(currentWinner);
  };

  const saveActiveTab = (value) => {
    setActiveTab(value);
    localStorage.setItem('adminTab', value);
  }

  const handleDeleteMatch = async (matchId) => {
    if (!window.confirm('Delete this match?')) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/matches/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Match deleted successfully!");
      fetchMatches();
    } catch (error) {
      console.error("Error deleting match:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4 max-w-6xl mx-auto">
      <div className="flex flex-col items-center gap-2 mb-8">
        <h1 className="mx-auto text-3xl text-yellow-400 font-bold">Admin Panel</h1>
        <p className="text-gray-400">Add teams and matches to roster</p>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-700">
        <button
          className={`py-2 px-4 text-lg font-medium ${activeTab === "match" ? "border-b-2 border-yellow-400 text-yellow-400" : "text-gray-400"
            }`}
          onClick={() => saveActiveTab("match")}
        >
          Add Match
        </button>
        <button
          className={`py-2 px-4 text-lg font-medium ${activeTab === "team" ? "border-b-2 border-yellow-400 text-yellow-400" : "text-gray-400"
            }`}
          onClick={() => saveActiveTab("team")}
        >
          Add Team
        </button>
      </div>

      {/* Add Match Section */}
      {activeTab == "match" && (
        <div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-2 gap-4">
              <select
                name="teamOneName"
                className="p-2 bg-gray-700 rounded text-white"
                onChange={handleInputChange}
              >
                <option value="">Select Team One</option>
                {teams.map(team => (
                  <option key={team.teamName} value={team.teamName}>{team.teamName}</option>
                ))}
              </select>
              <select
                name="teamTwoName"
                className="p-2 bg-gray-700 rounded text-white"
                onChange={handleInputChange}
              >
                <option value="">Select Team Two</option>
                {teams.map(team => (
                  <option key={team.teamName} value={team.teamName}>{team.teamName}</option>
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
                  <li key={match._id} className="relative p-4 bg-gray-700 rounded flex flex-col gap-2 items-center">
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteMatch(match._id)}
                      className="absolute top-5 right-5 text-red-400 hover:text-red-600 hover:bg-gray-600 p-2 rounded-xl cursor-pointer"
                      title="Delete Match"
                    >
                      <Trash2 size={24} />
                    </button>

                    {/* Match Title with Logos */}
                    <div className="flex items-center gap-5">
                      <div className="flex items-center gap-2">
                        <img src={match.teamOneImage} alt={match.teamOneName} className="w-8 h-8 rounded-full" />
                        <p className="text-lg font-semibold">{match.teamOneName}</p>
                      </div>
                      <p className="text-lg font-semibold">vs</p>
                      <div className="flex items-center gap-2">
                        <img src={match.teamTwoImage} alt={match.teamTwoName} className="w-8 h-8 rounded-full" />
                        <p className="text-lg font-semibold">{match.teamTwoName}</p>
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
                              <option value={match.teamOne}>{match.teamOneName}</option>
                              <option value={match.teamTwo}>{match.teamTwoName}</option>
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
                          onClick={() => handleDeclareWinner(match._id, match.teamOneName)}
                          className="bg-green-800 hover:bg-green-900 text-white font-bold py-1 px-4 rounded flex items-center gap-2"
                        >
                          <img src={match.teamOneImage} alt={match.teamOneName} className="w-6 h-6 rounded-full" />
                          {match.teamOne} Wins
                        </button>
                        <button
                          onClick={() => handleDeclareWinner(match._id, match.teamTwoName)}
                          className="bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-4 rounded flex items-center gap-2"
                        >
                          <img src={match.teamTwoImage} alt={match.teamTwo} className="w-6 h-6 rounded-full" />
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
      )}

      {/* Add Team Section */}
      {activeTab == "team" && (
        <div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-4">Add Team</h3>
            <input
              type="text"
              name="teamName"
              value={newTeam.teamName}
              placeholder="Team Name"
              className="p-2 bg-gray-700 rounded text-white w-full"
              onChange={(e) => setNewTeam({ ...newTeam, teamName: e.target.value })}
            />
            <input
              type="text"
              name="imageUrl"
              value={newTeam.imageUrl}
              placeholder="Image URL"
              className="p-2 bg-gray-700 rounded text-white w-full mt-4"
              onChange={(e) => setNewTeam({ ...newTeam, imageUrl: e.target.value })}
            />
            <textarea
              name="additionalDetails"
              value={newTeam.additionalDetails}
              placeholder="Additional Details"
              className="w-full p-2 bg-gray-700 rounded text-white mt-4"
              onChange={(e) => setNewTeam({ ...newTeam, additionalDetails: e.target.value })}
            ></textarea>
            <button
              onClick={handleAddTeam}
              className="mt-4 bg-green-800 hover:bg-green-900 text-white font-bold py-2 px-4 rounded"
            >
              Add Team
            </button>
          </div>

          {/* List Teams */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Existing Teams</h3>
            {teams.length > 0 ? (
              <ul className="space-y-4">
                {teams.map((team) => (
                  <li key={team._id} className="p-4 bg-gray-700 rounded flex flex-col gap-2 sm:flex-row items-center sm:justify-between">
                    <div className="flex flex-col items-center mx-auto w-full gap-3">
                      <img src={team.imageUrl} alt={team.teamName} className="w-10 h-10 rounded-full" />
                      {editingTeamId === team._id ? (
                        <div className="flex flex-col gap-2 w-[90%]">
                          <input
                            type="text"
                            value={editedTeam.teamName}
                            onChange={(e) => setEditedTeam({ ...editedTeam, teamName: e.target.value })}
                            className="bg-gray-600 p-1 rounded text-white"
                            placeholder="Team Name"
                          />
                          <input
                            type="text"
                            value={editedTeam.imageUrl}
                            onChange={(e) => setEditedTeam({ ...editedTeam, imageUrl: e.target.value })}
                            className="bg-gray-600 p-1 rounded text-white"
                            placeholder="Image URL"
                          />
                          <textarea
                            value={editedTeam.additionalDetails}
                            onChange={(e) => setEditedTeam({ ...editedTeam, additionalDetails: e.target.value })}
                            className="bg-gray-600 p-1 rounded text-white"
                            placeholder="Details"
                          ></textarea>
                          <div className="flex gap-2 mx-auto mt-4">
                            <button
                              className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-white"
                              onClick={() => handleUpdateTeam(team._id)}
                            >
                              Save
                            </button>
                            <button
                              className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-white"
                              onClick={() => setEditingTeamId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-lg font-semibold">{team.teamName}</p>
                      )}
                    </div>
                    {editingTeamId !== team._id && (
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        <button
                          className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-1 rounded cursor-pointer"
                          onClick={() => {
                            setEditingTeamId(team._id);
                            setEditedTeam({
                              teamName: team.teamName,
                              imageUrl: team.imageUrl,
                              additionalDetails: team.additionalDetails || '',
                            });
                          }}
                        >
                          Edit
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteTeam(team._id)}
                          className="text-red-500 hover:text-red-400 hover:bg-gray-600 p-2 rounded cursor-pointer"
                          title="Delete Match"
                        >
                          <Trash2 size={24} />
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No teams available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMatchPanel;