import { motion } from 'framer-motion';
import { Clock, CheckCircle, ArrowRight } from 'lucide-react';

interface QuestionnaireCardProps {
  name: string;
  completed: boolean;
  totalQuestions: number;
  onClick: () => void;
}

const QuestionnaireCard = ({ name, completed, totalQuestions, onClick }: QuestionnaireCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">{name}</h2>
          <p className="text-sm text-gray-500">{totalQuestions} questions</p>
        </div>
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className={`rounded-full p-2 ${
            completed ? 'bg-green-100' : 'bg-yellow-100'
          }`}
        >
          {completed ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <Clock className="w-5 h-5 text-yellow-600" />
          )}
        </motion.div>
      </div>
      
      <div className="flex justify-between items-center">
        <span
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            completed
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {completed ? 'Completed' : 'Pending'}
        </span>
        <motion.button
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            completed
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {completed ? 'Review' : 'Start'}
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default QuestionnaireCard;