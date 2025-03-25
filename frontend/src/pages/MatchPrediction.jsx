import { useEffect, useState } from "react";
import axios from "axios";
import { Trophy, Loader2 } from "lucide-react";

const MatchPrediction = () => {
   const [matches, setMatches] = useState([]);
   const [pastMatches, setPastMatches] = useState([]);
   const [selectedMatch, setSelectedMatch] = useState(null);
   const [loading, setLoading] = useState(false);
   const [prediction, setPrediction] = useState("");
   const [activeTab, setActiveTab] = useState("upcoming");
   const [matchPredictions, setMatchPredictions] = useState([]);

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

   const handleChange = (event) => {
      setPrediction(event.target.value);
   };

   const handleSubmit = async () => {
      if (!selectedMatch || !prediction) return;

      setLoading(true);
      try {
         const response = await axios.post("/api/predictions",
            { matchId: selectedMatch._id, prediction },
            {
               headers: getAuthHeaders(),
               withCredentials: true,
            }
         );
         alert(response.data.msg); // Show success message
         setSelectedMatch(null);
         window.location.reload();
      } catch (error) {
         alert(response.data.msg);
      } finally {
         setLoading(false);
      }
   };

   const getAuthHeaders = () => {
      const token = localStorage.getItem("token");
      return token ? { Authorization: `Bearer ${token}` } : {};
   };

   const fetchMatches = async () => {
      try {
         const { data } = await axios.get("/api/matches", {
            headers: getAuthHeaders(),
            withCredentials: true,
         });
         const now = new Date();
         now.setMinutes(now.getMinutes() + 30);
         const formattedMatches = Array.isArray(data)
            ? data.map((match) => ({
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
         setMatches(formattedMatches.filter((match) => new Date(match.dateString) >= now));
         setPastMatches(formattedMatches.filter((match) => new Date(match.dateString) < now));
      } catch (error) {
         console.error("Error fetching matches:", error);
      }
   };

   const fetchPredictions = async (matchId) => {
      try {
         const { data } = await axios.get(`/api/predictions/${matchId}`, {
            headers: getAuthHeaders(),
            withCredentials: true,
         });
         setMatchPredictions(data);
      } catch (error) {
         console.error("Error fetching predictions:", error);
      }
   };

   const handleMatchSelection = (match) => {
      setSelectedMatch(match);
      fetchPredictions(match._id);
   };

   return (
      <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4">
         <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center gap-2 mb-8">
               <h1 className="mx-auto text-3xl text-yellow-400 font-bold">Match Predictions</h1>
               <p className="text-gray-400">All matches to date</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-700">
               <button
                  className={`py-2 px-4 text-lg font-medium ${activeTab === "upcoming" ? "border-b-2 border-yellow-400 text-yellow-400" : "text-gray-400"
                     }`}
                  onClick={() => setActiveTab("upcoming")}
               >
                  Upcoming Matches
               </button>
               <button
                  className={`py-2 px-4 text-lg font-medium ${activeTab === "past" ? "border-b-2 border-yellow-400 text-yellow-400" : "text-gray-400"
                     }`}
                  onClick={() => setActiveTab("past")}
               >
                  Past Matches
               </button>
            </div>

            {/* Match List */}
            <div className="rounded-xl shadow-lg overflow-hidden">
               <div className="divide-y space-y-5 divide-gray-700">
                  {(activeTab === "upcoming" ? matches : pastMatches).length > 0 ? (
                     (activeTab === "upcoming" ? matches : pastMatches).map((match) => {
                        return (
                           <div key={match._id} onClick={() => handleMatchSelection(match)} className="p-4 bg-gray-700 rounded-lg">
                              {/* Teams Section with Logos */}
                              <div className="flex items-center justify-center">
                                 <div className="flex items-center gap-3">
                                    <img src={logo[match.teamOne]} alt={match.teamOne} className="w-10 h-10" />
                                    <span className="text-lg font-semibold">{match.teamOne}</span>
                                 </div>
                                 <span className="text-gray-400 px-5">vs</span>
                                 <div className="flex items-center gap-3">
                                    <span className="text-lg font-semibold">{match.teamTwo}</span>
                                    <img src={logo[match.teamTwo]} alt={match.teamTwo} className="w-10 h-10" />
                                 </div>
                              </div>

                              {/* Match Date */}
                              <div className="text-sm text-gray-400 text-center mt-2">{match.matchDate}</div>

                              {/* Prediction Info */}
                              {activeTab === "upcoming" && (
                                 <div className="text-sm text-yellow-400 text-center mt-2">
                                    Your Prediction: {match.userPrediction || "None selected"}
                                 </div>
                              )}
                              {activeTab === "past" && (
                                 <div className="text-sm text-center mt-2">
                                    <p className="text-gray-300">Your Prediction: <span className={match.userPrediction === match.declaredWinner ? "text-green-500" : "text-red-500"}>{match.userPrediction || "None selected"}</span></p>
                                    <p className="text-gray-300">Match Winner: <span className="text-yellow-500">{match.declaredWinner || "Not yet declared"}</span></p>
                                 </div>
                              )}
                              {selectedMatch === match && Object.keys(matchPredictions).length > 0 && (
                                 <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mt-6 p-6">
                                    <h2 className="text-xl font-semibold mb-4">User Predictions</h2>
                                    <table className="w-full border-collapse border border-gray-600">
                                       <thead>
                                          <tr className="bg-gray-700 text-yellow-400">
                                             <th className="border border-gray-600 px-4 py-2">Team</th>
                                             <th className="border border-gray-600 px-4 py-2">Users</th>
                                          </tr>
                                       </thead>
                                       <tbody>
                                          {Object.entries(matchPredictions).map(([team, users]) => (
                                             <tr key={team} className="text-center bg-gray-700">
                                                <td className="border border-gray-600 px-4 py-2">{team}</td>
                                                <td className="border border-gray-600 px-4 py-2">
                                                   {users.length > 0 ? users.map(user => user.username.split(' ')[0]).join(", ") : "No votes"}
                                                </td>
                                             </tr>
                                          ))}
                                       </tbody>
                                    </table>
                                 </div>
                              )}
                              {/* Match Prediction Form */}
                              {selectedMatch === match && activeTab === "upcoming" && (
                                 <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mt-6 p-6">
                                    <h2 className="text-xl font-semibold">Make Your Prediction</h2>
                                    <select
                                       className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg mt-4"
                                       value={prediction}
                                       disabled={!selectedMatch}
                                       onChange={handleChange}
                                    >
                                       <option value="">Select winner</option>
                                       <option value={selectedMatch.teamOne}>{selectedMatch.teamOne}</option>
                                       <option value={selectedMatch.teamTwo}>{selectedMatch.teamTwo}</option>
                                    </select>
                                    <button
                                       className="mt-4 w-full bg-yellow-600 hover:bg-yellow-700 text-black py-3 rounded-lg font-medium"
                                       disabled={!selectedMatch || !prediction || loading}
                                       onClick={handleSubmit}
                                    >
                                       {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Prediction"}
                                    </button>
                                 </div>
                              )}
                           </div>
                        );
                     })
                  ) : (
                     <div className="p-6 text-center text-gray-400">No matches available</div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default MatchPrediction;