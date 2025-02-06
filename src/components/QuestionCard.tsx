import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface QuestionCardProps {
  questionText: string;
  type: string;
  options?: string[] | null;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  index: number;
}

const QuestionCard = ({ questionText, type, options, value, onChange, index }: QuestionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800">{questionText}</h3>
        
        {type === 'input' ? (
          <input
            type="text"
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            required
            placeholder="Type your answer here..."
          />
        ) : (
          <div className="space-y-3">
            {options?.map((option, idx) => (
              <motion.label
                key={idx}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                  Array.isArray(value) && value.includes(option)
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-300'
                }`}>
                  {Array.isArray(value) && value.includes(option) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-gray-700">{option}</span>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const currentAnswers = Array.isArray(value) ? value : [];
                    const newAnswers = e.target.checked
                      ? [...currentAnswers, option]
                      : currentAnswers.filter(a => a !== option);
                    onChange(newAnswers);
                  }}
                />
              </motion.label>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default QuestionCard;