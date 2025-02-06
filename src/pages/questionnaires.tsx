import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { questionnaireService } from '../services/api';
import QuestionnaireCard from '../components/QuestionnaireCard';

import { LogOut, User } from 'lucide-react';
import LoadingSpinner from '../components/loadingSpinner';

interface Questionnaire {
  id: number;
  name: string;
  questions: any[];
  completed: boolean;
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

export default function Questionnaires() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestionnaires();
  }, []);

  const loadQuestionnaires = async () => {
    try {
      const allQuestionnaires = await questionnaireService.getAll();
      const questionnairesWithResponses = await Promise.all(
        allQuestionnaires.map(async (questionnaire: Questionnaire) => {
          const responses = await questionnaireService.getUserResponses(questionnaire.id);
          const isCompleted = responses && responses.length > 0 && 
            responses[0].responses.length === questionnaire.questions.length;
          return {
            ...questionnaire,
            completed: isCompleted
          };
        })
      );
      setQuestionnaires(questionnairesWithResponses);
    } catch (err) {
      setError('Failed to load questionnaires');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-sm"
      >
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Medical Questionnaires</h1>
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
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 text-red-700 p-4 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        ) : null}

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2"
        >
          {questionnaires.map((questionnaire) => (
            <QuestionnaireCard
              key={questionnaire.id}
              name={questionnaire.name}
              completed={questionnaire.completed}
              totalQuestions={questionnaire.questions.length}
              onClick={() => router.push(`/questionnaire/${questionnaire.id}`)}
            />
          ))}
        </motion.div>

        {questionnaires.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500">No questionnaires available at the moment.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}