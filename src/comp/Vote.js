import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function Vote({ contract, account }) {
  const [candidateId, setCandidateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);

  const handleVote = async (e) => {
    e.preventDefault();
    if (!contract || !account) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.vote(candidateId);
      await tx.wait();
      toast.success('Vote cast successfully!');
      setCandidateId('');
    } catch (error) {
      console.error('Error casting vote:', error);
      toast.error(error.message || 'Error casting vote');
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidates = async () => {
    if (!contract) return;
    
    try {
      const candidateCount = await contract.candidateCount();
      const fetchedCandidates = [];
      
      for (let i = 1; i <= candidateCount.toNumber(); i++) {
        const candidate = await contract.candidates(i);
        fetchedCandidates.push({
          id: i,
          name: candidate.name,
          voteCount: candidate.voteCount.toNumber()
        });
      }
      
      setCandidates(fetchedCandidates);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast.error('Error fetching candidates');
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [contract]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Voting Form */}
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Cast Your Vote</h2>
            
            <form onSubmit={handleVote} className="space-y-4">
              <div>
                <label htmlFor="candidateId" className="block text-sm font-medium text-gray-700">
                  Candidate ID
                </label>
                <input
                  type="number"
                  id="candidateId"
                  value={candidateId}
                  onChange={(e) => setCandidateId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                  min="1"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !account}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading || !account
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                }`}
              >
                {loading ? 'Casting Vote...' : 'Cast Vote'}
              </button>
            </form>
          </div>
        </div>

        {/* Candidate List */}
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Candidates</h2>
              <button
                onClick={fetchCandidates}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Refresh List
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vote Count
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {candidates.map((candidate) => (
                    <tr key={candidate.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {candidate.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {candidate.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {candidate.voteCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {candidates.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No candidates found. Click refresh to load candidates.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vote;
