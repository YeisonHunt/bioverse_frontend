import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/authContext';
import { questionnaireService } from '../../services/api';
import { ArrowLeft, User, LogOut, Save } from 'lucide-react';
import LoadingSpinner from '../../components/loadingSpinner';

interface Question {
  id: number;
  question_text: string;
  question_type: string;
  options: string[] | null;
  QuestionnaireQuestion: {
    priority: number;
  };
}

interface QuestionnaireData {
  id: number;
  name: string;
  questions: Question[];
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

export default function Questionnaire() {
  const router = useRouter();
  const { id } = router.query;
  const { user, logout } = useAuth();
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireData | null>(null);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  useEffect(() => {
    if (questionnaire) {
      const answeredQuestions = Object.keys(answers).length;
      const totalQuestions = questionnaire.questions.length;
      setProgress((answeredQuestions / totalQuestions) * 100);
    }
  }, [answers, questionnaire]);

  const loadData = async () => {
    try {
      const [questionnaireData, responsesData] = await Promise.all([
        questionnaireService.getById(Number(id)),
        questionnaireService.getUserResponses(Number(id))
      ]);

      setQuestionnaire(questionnaireData);

      if (responsesData && responsesData.length > 0) {
        const initialAnswers: Record<number, string | string[]> = {};
        
        responsesData[0].responses.forEach((response: any) => {
          const question = questionnaireData.questions.find(
            (            q: { question_text: any; }) => q.question_text === response.question
          );
          
          if (question) {
            if (question.question_type === 'mcq') {
              initialAnswers[question.id] = JSON.parse(response.response);
            } else {
              initialAnswers[question.id] = response.response;
            }
          }
        });

        setAnswers(initialAnswers);
      }
    } catch (error) {
      setError('Failed to load questionnaire');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionnaire) return;
    
    setSubmitting(true);
    try {
      await questionnaireService.submitResponses(Number(id), answers);
      router.push('/questionnaires');
    } catch (error) {
      setError('Failed to submit responses');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!questionnaire) return <div>Questionnaire not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-sm sticky top-0 z-10"
      >
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/questionnaires')}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <h1 className="text-xl font-bold text-gray-900">{questionnaire.name}</h1>
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
        
        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {questionnaire.questions
              .sort((a, b) => a.QuestionnaireQuestion.priority - b.QuestionnaireQuestion.priority)
              .map((question, index) => (
                <motion.div
                  key={question.id}
                  variants={item}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <h3 className="text-lg font-medium text-gray-800 mb-4">{question.question_text}</h3>
                  {question.question_type === 'input' ? (
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      value={answers[question.id] as string || ''}
                      onChange={(e) => setAnswers({
                        ...answers,
                        [question.id]: e.target.value
                      })}
                      required
                      placeholder="Type your answer here..."
                    />
                  ) : (
                    <div className="space-y-3">
                      {question.options?.map((option, index) => (
                        <motion.label
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                            Array.isArray(answers[question.id]) && 
                            (answers[question.id] as string[])?.includes(option)
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {Array.isArray(answers[question.id]) && 
                             (answers[question.id] as string[])?.includes(option) && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-gray-700">{option}</span>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={
                              Array.isArray(answers[question.id]) &&
                              (answers[question.id] as string[])?.includes(option)
                            }
                            onChange={(e) => {
                              const currentAnswers = Array.isArray(answers[question.id])
                                ? answers[question.id] as string[]
                                : [];

                              const newAnswers = e.target.checked
                                ? [...currentAnswers, option]
                                : currentAnswers.filter(a => a !== option);

                              setAnswers({
                                ...answers,
                                [question.id]: newAnswers
                              });
                            }}
                          />
                        </motion.label>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="sticky bottom-8 mt-8"
          >
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
            >
              <Save className="w-5 h-5" />
              {submitting ? 'Submitting...' : 'Save Responses'}
            </motion.button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}