import React from 'react';

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 shadow-xl">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{message}</h2>
          <p className="text-gray-600 text-center">Please wait while we process your request...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
