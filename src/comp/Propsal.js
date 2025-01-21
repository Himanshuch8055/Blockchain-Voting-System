import { useState } from 'react';
import { toast } from 'react-toastify';

function Proposal({ contract, account }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    candidateId: '',
    name: '',
    party: '',
    age: '',
    qualification: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract || !account) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.addCandidate(
        formData.candidateId,
        formData.name,
        formData.party,
        formData.age,
        formData.qualification
      );
      await tx.wait();
      toast.success('Candidate added successfully!');
      setFormData({
        candidateId: '',
        name: '',
        party: '',
        age: '',
        qualification: ''
      });
    } catch (error) {
      console.error('Error adding candidate:', error);
      toast.error(error.message || 'Error adding candidate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add New Candidate</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="candidateId" className="block text-sm font-medium text-gray-700">
                  Candidate ID
                </label>
                <input
                  type="number"
                  name="candidateId"
                  id="candidateId"
                  value={formData.candidateId}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                  min="1"
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="party" className="block text-sm font-medium text-gray-700">
                  Party
                </label>
                <input
                  type="text"
                  name="party"
                  id="party"
                  value={formData.party}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  id="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                  min="18"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="qualification" className="block text-sm font-medium text-gray-700">
                  Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  id="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !account}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  loading || !account
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Candidate...
                  </>
                ) : (
                  'Add Candidate'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Proposal;
