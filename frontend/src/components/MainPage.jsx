import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MainPage = () => {
  const [users, setUsers] = useState([]);
  const [searchusers, setSearchUsers] = useState([]);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No token found, please log in');
      return;
    }

    axios
      .get('http://localhost:8000/friends/home', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data.allUsers || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load data');
      });

    axios
      .get('http://localhost:8000/friends/recommend-friends', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then((response) => {
        setRecommendedUsers(response.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load recommended users');
      });
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    axios
      .get(`http://localhost:8000/friends/search?query=${query}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        setSearchUsers(response.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load search results');
      });
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const sendFriendRequest = (receiverId) => {
    const token = localStorage.getItem('token');
    
    axios
      .post('http://localhost:8000/friends/send-request', 
        { receiverId }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        alert('Friend request sent successfully');
        closeModal();
      })
      .catch((err) => {
        console.error(err);
        alert('Error sending friend request');
      });
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="py-8">
        <div className="overflow-x-auto px-4 sm:px-8">
          <div className="inline-block min-w-full bg-white rounded-lg shadow-lg">
            {error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : (
              <div className="p-6">
                <div className="mb-6 flex justify-center">
                  <input
                    type="text"
                    value={searchQuery}
                    placeholder="Search for a user..."
                    onChange={handleSearchChange}
                    className="px-6 py-3 w-full md:w-1/3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Search Users</h2>
                <table className="min-w-full leading-normal mt-6">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-gray-50 border-b border-gray-200">
                        Username
                      </th>
                      <th className="px-6 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-gray-50 border-b border-gray-200">
                        Friends Count
                      </th>
                      <th className="px-6 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-gray-50 border-b border-gray-200">
                        Interests
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchusers.map((user) => (
                      <tr key={user._id} onClick={() => handleUserClick(user)} className="hover:bg-gray-50 cursor-pointer">
                        <td className="px-6 py-4 text-sm bg-white border-b border-gray-200">
                          <p className="text-gray-900">{user.username}</p>
                        </td>
                        <td className="px-6 py-4 text-sm bg-white border-b border-gray-200">
                          <p className="text-gray-900">{user.friends.length}</p>
                        </td>
                        <td className="px-6 py-4 text-sm bg-white border-b border-gray-200">
                          <p className="text-gray-900">{user.interests.join(', ')}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8">Friends</h2>
                <table className="min-w-full leading-normal mt-6">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-gray-50 border-b border-gray-200">
                        Username
                      </th>
                      <th className="px-6 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-gray-50 border-b border-gray-200">
                        Interests
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} onClick={() => handleUserClick(user)} className="hover:bg-gray-50 cursor-pointer">
                        <td className="px-6 py-4 text-sm bg-white border-b border-gray-200">
                          <p className="text-gray-900">{user.username}</p>
                        </td>
                        <td className="px-6 py-4 text-sm bg-white border-b border-gray-200">
                          <p className="text-gray-900">{user.interests.join(', ')}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8">Recommended Friends</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                  {recommendedUsers.length > 0 ? (
                    recommendedUsers.map((user) => (
                      <div key={user._id} className="max-w-sm rounded-lg border border-gray-200 shadow-md overflow-hidden hover:shadow-lg transition">
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900">{user.username}</h3>
                          <p className="text-gray-600 text-sm">Mutual Friends: {user.mutualFriendsCount}</p>
                          <div className="text-gray-500">
                            <p>Mutual Friends: {user.mutualFriends.length > 0 ? user.mutualFriends.join(', ') : 'No mutual friends'}</p>
                          </div>
                          <div className="mt-4">
                            <button
                              onClick={() => sendFriendRequest(user._id)}
                              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                            >
                              Send Friend Request
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No recommended users found.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50" aria-hidden={!isModalOpen}>
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-2xl font-semibold text-gray-800">{selectedUser.username}</h2>
            <p className="mt-4 text-gray-600"><strong>Interests:</strong> {selectedUser.interests.join(', ')}</p>
            <div className="mt-4">
              <button
                onClick={() => sendFriendRequest(selectedUser._id)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
              >
                Send Friend Request
              </button>
            </div>
            <div className="mt-4">
              <button
                onClick={closeModal}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
