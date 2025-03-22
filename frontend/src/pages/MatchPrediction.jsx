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
         alert(response.data.message); // Show success message
      } catch (error) {
         alert(error);
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
         setMatches(data.filter((match) => new Date(match.matchDate) >= now));
         setPastMatches(data.filter((match) => new Date(match.matchDate) < now));

         console.log(selectedMatch)
      } catch (error) {
         console.error("Error fetching matches:", error);
      }
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
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
               <div className="divide-y divide-gray-700">
                  {(activeTab === "upcoming" ? matches : pastMatches).length > 0 ? (
                     (activeTab === "upcoming" ? matches : pastMatches).map((match) => {
                        return (
                           <div
                              key={match._id}
                              className="p-4 flex flex-col gap-2 bg-gray-700 rounded-lg"
                              onClick={() => activeTab === "upcoming" && setSelectedMatch(match)}
                           >
                              <div className="font-medium text-lg">{match.teamOne} vs {match.teamTwo}</div>
                              <div className="text-sm text-gray-400">{new Date(match.matchDate).toLocaleString()}</div>
                              {activeTab === "upcoming" && (
                                 <div className="text-sm text-yellow-400">Your Prediction: {match.userPrediction}</div>
                              )}
                              {activeTab === "past" && (
                                 <div className="text-sm">
                                    <p className="text-gray-300">Your Prediction: <span className={match.userPrediction === match.declaredWinner ? "text-green-400" : "text-red-400"}>{match.userPrediction || "None selected"}</span></p>
                                    <p className="text-gray-300">Match Winner: <span className="text-yellow-400">{match.declaredWinner || "Not yet declared"}</span></p>
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

            {/* Match Prediction Form */}
            {selectedMatch && activeTab === "upcoming" && (
               <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mt-6 p-6">
                  <h2 className="text-xl font-semibold">Make Your Prediction</h2>
                  <div className="text-lg font-medium my-4">{selectedMatch.teamOne} vs {selectedMatch.teamTwo}</div>
                  <div className="text-sm text-gray-400">Match Date & Time: {new Date(selectedMatch.matchDate).toLocaleString()}</div>
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
                     className="mt-4 w-full bg-yellow-500 text-black py-3 rounded-lg font-medium"
                     disabled={!selectedMatch || !prediction || loading}
                     onClick={handleSubmit}
                  >
                     {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Prediction"}
                  </button>
               </div>
            )}
         </div>
      </div>
   );
};

export default MatchPrediction;