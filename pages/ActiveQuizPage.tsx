import React from "react";
import { useNavigate } from "react-router-dom";
import ActiveQuiz from "../components/quiz/ActiveQuiz";

const ActiveQuizPage: React.FC = () => {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate("/quiz");
  };

  return <ActiveQuiz onExit={handleExit} />;
};

export default ActiveQuizPage;
