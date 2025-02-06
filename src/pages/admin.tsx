import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { adminService } from '../services/api';
import LoadingSpinner from '../components/loadingSpinner';
import { 
  User, 
  LogOut, 
  Users, 
  ClipboardList,
  ChevronRight,
  Search
} from 'lucide-react';
import { MCQResponse } from '../components/MCQResponse';

interface User {
  id: number;
  username: string;
  completedQuestionnaires: number;
}

interface UserResponse {
  questionnaireName: string;
  responses: Array<{
    question: string;
    response: string;
  }>;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Admin() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userResponses, setUserResponses] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/questionnaires');
    }
  }, [user, router]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = async (user: User) => {
    try {
      setSelectedUser(user);
      const responses = await adminService.getUserResponses(user.id);
      setUserResponses(responses);
    } catch (err) {
      setError('Failed to load user responses');
    }
  };

  const formatResponse2 = (response: string, questionType: string) => {
    if (!response) return '-';
    
    if (questionType === 'mcq') {
      try {
        const parsed = JSON.parse(response);
        return Array.isArray(parsed) ? parsed.join(', ') : response;
      } catch {
        return response;
      }
    }
    
    return response;
  };

  const formatResponse = (response: string, questionType: string) => {
    if (!response) return '-';
    
    if (questionType === 'mcq') {
      return <MCQResponse response={response} />;
    }
    
    return response;
  };



  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-5 h-5" />
                <span>{user?.username}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users List */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Users
              </h2>
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all outline-none"
                />
              </div>
            </div>
            <motion.div
              variants={item}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4 text-gray-600 text-sm font-medium">Username</th>
                    <th className="text-left py-3 px-4 text-gray-600 text-sm font-medium">Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      onClick={() => handleUserClick(user)}
                      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                      className={`border-t cursor-pointer transition-colors ${
                        selectedUser?.id === user.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="py-3 px-4 flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        {user.username}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1">
                          <ClipboardList className="w-4 h-4 text-green-500" />
                          {user.completedQuestionnaires}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </motion.div>

          {/* User Responses */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-blue-500" />
              {selectedUser ? `Responses - ${selectedUser.username}` : 'Select a user to view responses'}
            </h2>
            {selectedUser && userResponses.length > 0 ? (
              <div className="space-y-6">
                {userResponses.map((questionnaireResponse, index) => (
                  <motion.div
                    key={index}
                    variants={item}
                    className="bg-white rounded-xl shadow-sm p-6"
                  >
                    <h3 className="text-lg font-medium mb-4 text-blue-600">
                      {questionnaireResponse.questionnaireName}
                    </h3>
                    <div className="space-y-4">
                    {questionnaireResponse.responses.map((response, responseIndex) => (
                        <motion.div
                          key={responseIndex}
                          variants={item}
                          className="border-b border-gray-100 pb-4 last:border-b-0"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-semibold text-blue-600">Q</span>
                            </div>
                            <p className="font-medium text-gray-800 flex-grow ">
                              {response.question}
                            </p>
                          </div>
                          <div className="flex items-start gap-3 mt-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-sm font-semibold text-green-600">A</span>
                            </div>
                            <div className="text-gray-600 flex-grow">
                              {formatResponse(response.response, response.question.includes('Select all') ? 'mcq' : 'input')}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : selectedUser ? (
              <motion.div
                variants={item}
                className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500"
              >
                No responses found for this user
              </motion.div>
            ) : null}
          </motion.div>
        </div>
      </div>
    </div>
  );
}