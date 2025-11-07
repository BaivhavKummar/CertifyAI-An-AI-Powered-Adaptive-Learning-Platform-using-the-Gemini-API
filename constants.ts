
import { User, Role, Topic, Question, QuestionType, Difficulty } from './types';

export const MOCK_USERS: User[] = [
  { id: 'student1', username: 'student', role: Role.Student },
  { id: 'instructor1', username: 'instructor', role: Role.Instructor },
];

export const MOCK_TOPICS: Topic[] = [
  { id: 't1', name: 'Introduction to React', mastery: 0, prerequisites: [] },
  { id: 't2', name: 'Components & Props', mastery: 0, prerequisites: ['t1'] },
  { id: 't3', name: 'State & Lifecycle', mastery: 0, prerequisites: ['t2'] },
  { id: 't4', name: 'Handling Events', mastery: 0, prerequisites: ['t2'] },
  { id: 't5', name: 'Hooks', mastery: 0, prerequisites: ['t3'] },
  { id: 't6', name: 'Advanced Hooks', mastery: 0, prerequisites: ['t5'] },
];

export const MOCK_QUESTION_BANK: Question[] = [
    {
        id: 'q1',
        topic: 'Introduction to React',
        questionText: 'What is React?',
        questionType: QuestionType.ShortAnswer,
        correctAnswer: 'A JavaScript library for building user interfaces.',
        explanation: 'React is a declarative, efficient, and flexible JavaScript library for building user interfaces.',
        difficulty: Difficulty.Easy,
        source: 'Manual'
    },
    {
        id: 'q2',
        topic: 'Components & Props',
        questionText: 'What is a component in React?',
        questionType: QuestionType.MCQ,
        options: ['A function that returns HTML', 'A reusable piece of UI', 'A CSS class', 'A database entry'],
        correctAnswer: 'A reusable piece of UI',
        explanation: 'Components let you split the UI into independent, reusable pieces, and think about each piece in isolation.',
        difficulty: Difficulty.Easy,
        source: 'Manual'
    },
    {
        id: 'q3',
        topic: 'State & Lifecycle',
        questionText: 'Which method is used to update state in a class component?',
        questionType: QuestionType.MCQ,
        options: ['this.updateState()', 'this.setState()', 'this.changeState()', 'this.modifyState()'],
        correctAnswer: 'this.setState()',
        explanation: '`this.setState()` schedules an update to a component\'s state object. When state changes, the component responds by re-rendering.',
        difficulty: Difficulty.Medium,
        source: 'Manual'
    },
    {
        id: 'q4',
        topic: 'Hooks',
        questionText: 'What is the purpose of the `useEffect` hook?',
        questionType: QuestionType.ShortAnswer,
        correctAnswer: 'To perform side effects in function components.',
        explanation: 'The `useEffect` Hook lets you perform side effects in function components, such as data fetching, subscriptions, or manually changing the DOM.',
        difficulty: Difficulty.Medium,
        source: 'Manual'
    },
];

export const MOCK_ANALYTICS_DATA = {
    masteryHeatmap: [
        { student: 'Alice', 'Introduction to React': 95, 'Components & Props': 88, 'State & Lifecycle': 75, 'Hooks': 60 },
        { student: 'Bob', 'Introduction to React': 85, 'Components & Props': 92, 'State & Lifecycle': 81, 'Hooks': 70 },
        { student: 'Charlie', 'Introduction to React': 70, 'Components & Props': 65, 'State & Lifecycle': 50, 'Hooks': 45 },
        { student: 'Diana', 'Introduction to React': 100, 'Components & Props': 98, 'State & Lifecycle': 95, 'Hooks': 92 },
    ],
    masteryTrajectory: [
        { week: 'Week 1', 'Alice': 30, 'Bob': 25, 'Charlie': 20 },
        { week: 'Week 2', 'Alice': 55, 'Bob': 45, 'Charlie': 35 },
        { week: 'Week 3', 'Alice': 75, 'Bob': 68, 'Charlie': 50 },
        { week: 'Week 4', 'Alice': 90, 'Bob': 82, 'Charlie': 65 },
    ]
};
