import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function Dashboard({ contract }) {
  const [stats, setStats] = useState({
    totalVoters: 0,
    totalCandidates: 0,
    totalVotes: 0,
    votingStatus: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval;
    if (contract) {
      fetchStats();
      interval = setInterval(fetchStats, 10000); // Refresh every 10 seconds
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [contract]);

  const fetchStats = async () => {
    try {
      if (!contract || !contract.provider) {
        console.log('Contract or provider not initialized');
        return;
      }

      // Check if the contract is deployed
      const code = await contract.provider.getCode(contract.address);
      if (code === '0x') {
        console.error('Contract not deployed at the specified address');
        toast.error('Smart contract not found at the specified address');
        return;
      }

      // Get candidates data with proper error handling
      let candidates = [];
      try {
        candidates = await contract.getCandidate();
      } catch (error) {
        console.error('Error fetching candidates:', error);
        candidates = [];
      }

      // Get voters data with proper error handling
      let voters = [];
      try {
        voters = await contract.getVoter();
      } catch (error) {
        console.error('Error fetching voters:', error);
        voters = [];
      }

      // Calculate total votes safely
      let totalVotes = 0;
      if (Array.isArray(candidates)) {
        candidates.forEach(candidate => {
          if (candidate && candidate.vote) {
            totalVotes += Number(candidate.vote.toString());
          }
        });
      }

      setStats({
        totalVoters: Array.isArray(voters) ? voters.length : 0,
        totalCandidates: Array.isArray(candidates) ? candidates.length : 0,
        totalVotes: totalVotes,
        votingStatus: Array.isArray(candidates) && candidates.length >= 2
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Error fetching dashboard statistics. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Voting Dashboard</h3>
        
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6">
              <h4 className="text-lg font-medium text-primary-900">Total Voters</h4>
              <p className="mt-2 text-3xl font-bold text-primary-700">{stats.totalVoters}</p>
            </div>
            
            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-lg p-6">
              <h4 className="text-lg font-medium text-secondary-900">Total Candidates</h4>
              <p className="mt-2 text-3xl font-bold text-secondary-700">{stats.totalCandidates}</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
              <h4 className="text-lg font-medium text-green-900">Total Votes</h4>
              <p className="mt-2 text-3xl font-bold text-green-700">{stats.totalVotes}</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
              <h4 className="text-lg font-medium text-purple-900">Voting Status</h4>
              <p className="mt-2 text-xl font-semibold text-purple-700">
                {stats.votingStatus ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-red-600">Inactive</span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
