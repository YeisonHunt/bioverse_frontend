type QuestionType = 'mcq' | 'input';

interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
}

interface Questionnaire {
  id: number;
  name: string;
}

interface QuestionnaireQuestion {
  id: number;
  question_id: number;
  questionnaire_id: number;
  priority: number;
}