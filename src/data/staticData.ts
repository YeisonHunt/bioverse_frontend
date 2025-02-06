export const questionnaires: Questionnaire[] = [
    { id: 1, name: 'semaglutide' },
    { id: 2, name: 'nad-injection' },
    { id: 3, name: 'metformin' }
  ];
  
  export const questions: Question[] = [
    {
      id: 1,
      type: 'mcq',
      question: 'Why are you interested in this product? Select all that apply.',
      options: [
        'Improve blood pressure',
        'Reduce risk of future cardiac events',
        'Support lifestyle changes',
        'Longevity benefits'
      ]
    },
    {
      id: 2,
      type: 'input',
      question: 'Tell us anything else you\'d like your provider to know when prescribing your medication.'
    },
    {
      id: 3,
      type: 'input',
      question: 'What is your current weight?'
    },
    {
      id: 4,
      type: 'mcq',
      question: 'Which of the following have you tried in the past? Select all that apply.',
      options: [
        'Keto or low carb',
        'Plant-based',
        'Macro or calorie counting',
        'Weight Watchers',
        'Noom',
        'Calibrate',
        'Found',
        'Alpha',
        'Push Health'
      ]
    },
    {
      id: 5,
      type: 'mcq',
      question: 'What\'s your weight loss goal?',
      options: [
        'Losing 1-15 pounds',
        'Losing 16-50 pounds',
        'Losing 51+ pounds',
        'Not sure, I just need to lose weight'
      ]
    },
    {
      id: 6,
      type: 'input',
      question: 'Please list any new medications you are taking.'
    }
  ];
  
  export const questionnaireQuestions: QuestionnaireQuestion[] = [
    { id: 1, question_id: 1, questionnaire_id: 1, priority: 0 },
    { id: 2, question_id: 2, questionnaire_id: 1, priority: 10 },
    { id: 3, question_id: 4, questionnaire_id: 1, priority: 20 },
    { id: 4, question_id: 1, questionnaire_id: 2, priority: 0 },
    { id: 5, question_id: 2, questionnaire_id: 2, priority: 10 },
    { id: 6, question_id: 3, questionnaire_id: 2, priority: 20 },
    { id: 7, question_id: 1, questionnaire_id: 3, priority: 0 },
    { id: 8, question_id: 5, questionnaire_id: 3, priority: 10 },
    { id: 9, question_id: 6, questionnaire_id: 3, priority: 20 }
  ];
  