import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function Results({ contract }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [winner, setWinner] = useState(null);

  const fetchResults = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      const candidateCount = await contract.candidateCount();
      const fetchedResults = [];
      let maxVotes = 0;
      let currentWinner = null;

      for (let i = 1; i <= candidateCount.toNumber(); i++) {
        const candidate = await contract.candidates(i);
        const result = {
          id: i,
          name: candidate.name,
          party: candidate.party,
          voteCount: candidate.voteCount.toNumber(),
        };
        fetchedResults.push(result);

        if (result.voteCount > maxVotes) {
          maxVotes = result.voteCount;
          currentWinner = result;
        }
      }

      setResults(fetchedResults);
      setWinner(currentWinner);
    } catch (error) {
      console.error('Error fetching results:', error);
      toast.error('Error fetching results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [contract]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Winner Card */}
        {winner && (
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 overflow-hidden shadow-lg sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-white">Current Winner</h3>
              <div className="mt-5">
                <div className="text-3xl font-bold text-white">{winner.name}</div>
                <div className="mt-2 text-sm text-primary-100">
                  Party: {winner.party} | Votes: {winner.voteCount}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Table */}
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Election Results</h2>
              <button
                onClick={fetchResults}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh Results'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Party
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Votes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results
                    .sort((a, b) => b.voteCount - a.voteCount)
                    .map((result, index) => {
                      const totalVotes = results.reduce((sum, r) => sum + r.voteCount, 0);
                      const percentage = totalVotes === 0 
                        ? 0 
                        : ((result.voteCount / totalVotes) * 100).toFixed(1);

                      return (
                        <tr key={result.id} className={index === 0 ? 'bg-primary-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {result.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {result.party}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {result.voteCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <span className="mr-2">{percentage}%</span>
                              <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-primary-600 h-2.5 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              {results.length === 0 && !loading && (
                <p className="text-center text-gray-500 py-4">
                  No results available. Start the election to see results.
                </p>
              )}

              {loading && (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;
