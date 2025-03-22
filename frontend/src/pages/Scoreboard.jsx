import { useEffect, useState } from "react";
import axios from "axios";
import { Trophy, Medal, Star, Loader2 } from "lucide-react";

export default function Scoreboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const { data } = await axios.get("/api/scoreboard");
        setScores(data);
      } catch (error) {
        console.error("Error fetching scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-300" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <Star className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 mb-2">
            Leaderboard
          </h2>
          <p className="text-gray-400">Top players and their achievements</p>
        </div>

        {/* Scoreboard Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <span className="ml-3 text-gray-400">Loading scores...</span>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl">
              <div className="overflow-x-auto" style={{ maxHeight: "70vh" }}>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-700/50 text-gray-300">
                      <th className="sticky top-0 bg-gray-700/50 backdrop-blur-sm px-6 py-4 text-left font-bold text-lg">Rank</th>
                      <th className="sticky top-0 bg-gray-700/50 backdrop-blur-sm px-6 py-4 text-left font-bold text-lg">Player</th>
                      <th className="sticky top-0 bg-gray-700/50 backdrop-blur-sm px-6 py-4 text-right font-bold text-lg">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {scores.length > 0 ? (
                      scores.map((player, index) => (
                        <tr
                          key={player.userId}
                          className={`group transition-all duration-200 hover:bg-gray-700/30 ${index === 0 ? "bg-yellow-500/10" :
                              index === 1 ? "bg-gray-400/10" :
                                index === 2 ? "bg-amber-600/10" :
                                  "bg-gray-700/10"
                            }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {getRankIcon(index + 1)}
                              <span className={`text-xl font-bold ${index === 0 ? "text-yellow-400" :
                                  index === 1 ? "text-gray-300" :
                                    index === 2 ? "text-amber-600" : "text-gray-400"
                                }`}>
                                #{index + 1}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold mr-3 text-lg ${index === 0 ? "bg-gradient-to-br from-yellow-400 to-amber-600" :
                                  index === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500" :
                                    index === 2 ? "bg-gradient-to-br from-amber-600 to-amber-800" :
                                      "bg-gradient-to-br from-blue-500 to-purple-600"
                                }`}>
                                {player.username.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-white font-medium text-lg group-hover:text-blue-400 transition-colors duration-200">
                                {player.username}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className={`inline-flex items-center px-4 py-2 rounded-full ${index === 0 ? "bg-yellow-500/20 text-yellow-400" :
                                index === 1 ? "bg-gray-500/20 text-gray-300" :
                                  index === 2 ? "bg-amber-600/20 text-amber-500" :
                                    "bg-blue-500/20 text-blue-400"
                              }`}>
                              <span className="text-2xl font-bold mr-1">
                                {player.totalScore.toLocaleString()}
                              </span>
                              <span className="text-sm opacity-75">pts</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                          <div className="flex flex-col items-center gap-2">
                            <Trophy className="h-8 w-8 text-gray-600" />
                            <p>No scores available yet.</p>
                            <p className="text-sm">Be the first to make it to the leaderboard!</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          Scores are updated in real-time as matches are completed
        </div>
      </div>
    </div>
  );
}