import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Navigation from './comp/Navigation';
import Vote from './comp/Vote';
import Propsal from './comp/Propsal';
import FatchCandi from './comp/FatchCandi';
import FatcVoter from './comp/FatcVoter';
import Results from './comp/Results';
import Dashboard from './comp/Dashboard';
import VoterRegistration from './comp/VoterRegistration';
import ABIFILE from "./artifacts/contracts/BlockchainVoting.sol/BlockchainVoting.json";
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const ABI = ABIFILE.abi;
const ContractAddress = "0x0fee2908afda3d25e876c05ed5a6b9e40c37d909";

// NotFound component for invalid routes
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8 text-center">
      <div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">404 - Page Not Found</h2>
        <p className="mt-2 text-sm text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
    </div>
  </div>
);

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    let interval;
    if (window.ethereum) {
      const loadBlockchainData = async () => {
        try {
          if (!isConnecting) {
            setIsConnecting(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);

            try {
              const accounts = await provider.send("eth_requestAccounts", []);
              setAccount(accounts[0]);

              const signer = provider.getSigner();
              const contract = new ethers.Contract(ContractAddress, ABI, signer);
              setContract(contract);
            } catch (error) {
              if (error.code === -32002) {
                console.log("Please check MetaMask for pending connection request");
              } else {
                throw error;
              }
            }
          }
        } catch (error) {
          console.error("Error loading blockchain data:", error);
        } finally {
          setIsConnecting(false);
        }
      };

      loadBlockchainData();

      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          setContract(null);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      window.ethereum.on('disconnect', () => {
        setAccount(null);
        setContract(null);
      });

      return () => {
        if (interval) clearInterval(interval);
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
        window.ethereum.removeAllListeners('disconnect');
      };
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (isConnecting) {
        console.log("Connection request already pending. Please check MetaMask.");
        return;
      }

      setLoading(true);
      setIsConnecting(true);

      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setAccount(accounts[0]);

          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(provider);

          const signer = provider.getSigner();
          const contract = new ethers.Contract(ContractAddress, ABI, signer);
          setContract(contract);
        } catch (error) {
          if (error.code === -32002) {
            console.log("Please check MetaMask for pending connection request");
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      console.error("Error connecting:", error);
    } finally {
      setLoading(false);
      setIsConnecting(false);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation account={account} onConnect={connectWallet} loading={loading} />
        
        <main className="pt-16 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Routes>
              <Route path="/" element={
                <div className="space-y-6">
                  <Dashboard contract={contract} />
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                        Quick Actions
                      </h2>
                      <div className="space-y-4">
                        <button
                          onClick={connectWallet}
                          disabled={loading || account}
                          className={`
                            w-full inline-flex items-center justify-center px-4 py-3 border border-transparent
                            rounded-lg shadow-sm text-base font-medium text-white
                            ${loading || account
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                            } transition-all duration-200
                          `}
                        >
                          {loading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Connecting...
                            </>
                          ) : account ? (
                            'Wallet Connected'
                          ) : (
                            'Connect Wallet'
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <FatchCandi contract={contract} />
                    </div>
                  </div>
                </div>
              } />
              <Route path="/vote" element={
                <div className="max-w-3xl mx-auto">
                  <Vote provider={provider} contract={contract} account={account} />
                </div>
              } />
              <Route path="/register" element={
                <div className="max-w-3xl mx-auto">
                  <VoterRegistration contract={contract} account={account} />
                </div>
              } />
              <Route path="/proposals" element={
                <div className="max-w-4xl mx-auto">
                  <Propsal provider={provider} contract={contract} account={account} />
                </div>
              } />
              <Route path="/results" element={
                <div className="max-w-4xl mx-auto">
                  <Results contract={contract} />
                </div>
              } />
              <Route path="/voters" element={
                <div className="max-w-4xl mx-auto">
                  <FatcVoter contract={contract} />
                </div>
              } />
              {/* Handle /notifications and other invalid routes */}
              <Route path="/notifications" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>

        <ToastContainer 
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="md:mr-4 mb-4"
        />
      </div>
    </Router>
  );
}

export default App;
