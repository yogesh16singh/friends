import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Request = () => {
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [error, setError] = useState(null);

  const fetchSentRequests = async () => {
    try {
      const response = await axios.get('https://friends-979v.onrender.com/friends/sent-requests', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSentRequests(response.data);
    } catch (err) {
      setError('Error fetching sent requests');
    }
  };

  const fetchReceivedRequests = async () => {
    try {
      const response = await axios.get('https://friends-979v.onrender.com/friends/received-requests', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setReceivedRequests(response.data);
    } catch (err) {
      setError('Error fetching received requests');
    }
  };

  const manageRequest = async (friendRequestId, action) => {
    try {
      const response = await axios.post(
        'https://friends-979v.onrender.com/friends/manage-request',
        { friendRequestId, action },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setReceivedRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === friendRequestId
            ? { ...request, status: action === 'accept' ? 'accepted' : 'rejected' }
            : request
        )
      );

      alert(response.data.message);
    } catch (err) {
      setError('Error managing friend request');
    }
  };

  useEffect(() => {
    fetchSentRequests();
    fetchReceivedRequests();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-semibold mb-4">Sent Requests</h2>
      {error && <p className="text-red-500">{error}</p>}
      {sentRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sentRequests.map((request) => (
            <div key={request._id} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex flex-col items-start">
                <div className="w-full">
                  <p className="text-gray-800 text-left text-lg md:text-xl mb-4">
                    Sent a request to {request.receiver.username}
                  </p>
                  <div className="flex items-center mt-4">
                    <span className="mr-2 text-lg font-semibold text-indigo-500">Status:</span>
                    <span className="text-xl font-light text-gray-600">{request.status}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    <p><strong>Created At:</strong> {new Date(request.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No sent requests</p>
      )}

      <h2 className="text-3xl font-semibold mt-12 mb-4">Received Requests</h2>
      {receivedRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {receivedRequests.map((request) => (
            <div key={request._id} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex flex-col items-start">
                <div className="w-full">
                  <p className="text-gray-800 text-left text-lg md:text-xl mb-4">
                    Received a request from {request.sender.username}
                  </p>
                  <div className="flex items-center mt-4">
                    <span className="mr-2 text-lg font-semibold text-indigo-500">Status:</span>
                    <span className="text-xl font-light text-gray-600">{request.status}</span>
                  </div>
                  <div className="flex space-x-4 mt-4">
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => manageRequest(request._id, 'accept')}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => manageRequest(request._id, 'reject')}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    <p><strong>Created At:</strong> {new Date(request.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No received requests</p>
      )}
    </div>
  );
};

export default Request;