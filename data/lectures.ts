export type LectureStatus = "ready" | "processing" | "failed";
export type LectureType = "PDF" | "DOCX" | "MP3" | "VIDEO";

export type LectureRecord = {
  id: string;
  title: string;
  course: string;
  term: string;
  date: string;
  status: LectureStatus;
  progress?: number;
  type: LectureType;
  description: string;
  readTime: string;
  accuracyLabel: string;
  icon: string;
};

export const lectures: LectureRecord[] = [
  {
    id: "1",
    title: "Supply and Demand Dynamics",
    course: "ECON 101",
    term: "Fall Semester",
    date: "Oct 24, 2023",
    status: "ready",
    type: "PDF",
    description:
      "Understanding how market forces interact to determine price and quantity in a competitive environment.",
    readTime: "1hr 15 min read",
    accuracyLabel: "Transcript - 96% accuracy",
    icon: "description",
  },
  {
    id: "2",
    title: "Advanced Machine Learning",
    course: "CS 405",
    term: "Fall Semester",
    date: "2 mins ago",
    status: "processing",
    progress: 45,
    type: "PDF",
    description: "Extracting text content and preparing a local MVP processing state.",
    readTime: "Processing",
    accuracyLabel: "Processing",
    icon: "autorenew",
  },
  {
    id: "3",
    title: "Data Structures - Binary Trees",
    course: "CS 201",
    term: "Fall Semester",
    date: "Oct 15, 2023",
    status: "ready",
    type: "DOCX",
    description:
      "Lecture notes on AVL trees, red-black tree properties, and traversal algorithms.",
    readTime: "35 min read",
    accuracyLabel: "Notes - ready",
    icon: "table_chart",
  },
];

export const getLectureById = (id: string | undefined) => {
  return lectures.find((lecture) => lecture.id === id) || null;
};
