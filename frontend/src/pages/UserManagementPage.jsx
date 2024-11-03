import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const UserManagementPage = () => {
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/users/get-all-users`, {
        withCredentials: true
      });
      return response.data.data;
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  {user.isVerified ? (
                    <span className="text-green-600">Verified</span>
                  ) : (
                    <span className="text-red-600">Unverified</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {!user.isVerified && (
                    <button
                      onClick={async () => {
                        await axios.put(
                          `${import.meta.env.VITE_BACKEND_BASE_URL}/users/verify-user/${user._id}`,
                          {},
                          { withCredentials: true }
                        );
                        refetch();
                      }}
                      className="bg-primary text-white px-4 py-2 rounded"
                    >
                      Verify User
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;
