import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface MCQResponseProps {
  response: string;
}

export const MCQResponse = ({ response }: MCQResponseProps) => {
  let options: string[] = [];

  try {
    // Try to parse as JSON first
    options = JSON.parse(response);
  } catch {
    // If not JSON, split by comma
    options = response.split(',').map(opt => opt.trim());
  }

  return (
    <div className="space-y-2">
      {options.map((option, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-2 rounded-lg"
        >
          <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
          <span>{option}</span>
        </motion.div>
      ))}
    </div>
  );
};