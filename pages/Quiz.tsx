import React from "react";
import { useNavigate } from "react-router-dom";
import QuizLibrary from "../components/quiz/QuizLibrary";

const Quiz: React.FC = () => {
  const navigate = useNavigate();

  const handleStartQuiz = (quizId: string) => {
    navigate(`/active-quiz/${quizId}`);
  };

  return <QuizLibrary onStartQuiz={handleStartQuiz} />;
};

export default Quiz;
