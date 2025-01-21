import React from "react";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';

function FatchCandi({ contract }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      if (!contract) {
        setLoading(false);
        return;
      }

      try {
        // Check if contract is deployed
        const code = await contract.provider.getCode(contract.address);
        if (code === '0x') {
          throw new Error('Contract not deployed at the specified address');
        }

        const info = await contract.getCandidate();
        if (!Array.isArray(info)) {
          throw new Error('Invalid candidates data received');
        }

        setCandidates(info);
        setError(null);
      } catch (err) {
        console.error('Error fetching candidates:', err);
        setError(err.message || 'Failed to fetch candidates');
        toast.error('Error loading candidates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [contract]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!candidates.length) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">No candidates registered yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Candidates</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Votes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {candidates.map((candidate, index) => (
              <tr key={`${candidate._CandidateAddress}-${index}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {candidate.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {candidate._CandidateAddress ? (
                    <span className="font-mono">{candidate._CandidateAddress}</span>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {candidate.vote ? candidate.vote.toString() : '0'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FatchCandi;
