export type QuizQuestion = {
  id: string;
  topic: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
};

export type QuizSummary = {
  id: string;
  title: string;
  description: string;
  questions: number | null;
  time: string;
  status: "High Priority" | "New" | "Review" | "Completed";
  progress: string;
  color: string;
};

export const quizSummaries: QuizSummary[] = [
  {
    id: "biology-midterm",
    title: "Mid-term Review: Biology 101",
    description:
      "Comprehensive review covering cellular respiration, photosynthesis, and cellular structure.",
    questions: 3,
    time: "15 Mins",
    status: "High Priority",
    progress: "Not Started",
    color: "orange",
  },
  {
    id: "data-structures-trees",
    title: "Data Structures: Trees",
    description:
      "Binary trees, AVL trees, and heaps. Based on Lecture 14 from Prof. Smith.",
    questions: 15,
    time: "20 Mins",
    status: "New",
    progress: "New",
    color: "emerald",
  },
  {
    id: "history-19th-century",
    title: "European History: 19th Century",
    description: "Focusing on the industrial revolution and major political shifts.",
    questions: 30,
    time: "60% Done",
    status: "Review",
    progress: "In Progress",
    color: "indigo",
  },
  {
    id: "intro-marketing",
    title: "Intro to Marketing",
    description: "Key concepts from Chapter 4: Consumer Behavior and Segmentation.",
    questions: null,
    time: "2 Attempts",
    status: "Completed",
    progress: "Highest: 92%",
    color: "green",
  },
];

export const biologyMidtermQuestions: QuizQuestion[] = [
  {
    id: "q1",
    topic: "Cellular Biology",
    text: "Which cellular organelle is responsible for generating the majority of the cell's supply of adenosine triphosphate (ATP)?",
    options: [
      { id: "opt1", text: "Nucleus" },
      { id: "opt2", text: "Mitochondria" },
      { id: "opt3", text: "Golgi Apparatus" },
      { id: "opt4", text: "Endoplasmic Reticulum" },
    ],
    correctOptionId: "opt2",
    explanation:
      "Mitochondria are membrane-bound cell organelles that generate most of the chemical energy needed to power the cell's biochemical reactions.",
  },
  {
    id: "q2",
    topic: "Genetics",
    text: "Which molecule carries genetic information in most living organisms?",
    options: [
      { id: "opt1", text: "DNA" },
      { id: "opt2", text: "RNA" },
      { id: "opt3", text: "Protein" },
      { id: "opt4", text: "Lipid" },
    ],
    correctOptionId: "opt1",
    explanation:
      "DNA (Deoxyribonucleic acid) is the molecule that carries genetic information for the development and functioning of an organism.",
  },
  {
    id: "q3",
    topic: "Ecology",
    text: "What is the primary source of energy for the Earth's climate system?",
    options: [
      { id: "opt1", text: "Geothermal energy" },
      { id: "opt2", text: "The Sun" },
      { id: "opt3", text: "Wind" },
      { id: "opt4", text: "Ocean currents" },
    ],
    correctOptionId: "opt2",
    explanation:
      "The Sun is the primary source of energy for Earth's climate system, driving weather patterns and ocean currents.",
  },
];

export const getQuizById = (id = "biology-midterm") => {
  return quizSummaries.find((quiz) => quiz.id === id) || quizSummaries[0];
};
