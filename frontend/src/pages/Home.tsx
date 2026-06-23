import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ageGroupApi, settingsApi } from "@/services/api";
import QuizFlow from "@/components/QuizFlow";
import PrismLandingV3 from "@/components/prism/PrismLandingV3";

export default function Home() {
  const [showLanding, setShowLanding] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);

  const { data: ageGroups } = useQuery({
    queryKey: ["ageGroups"],
    queryFn: ageGroupApi.list,
  });

  const { data: publicSettings } = useQuery({
    queryKey: ["publicSettings"],
    queryFn: settingsApi.getPublic,
  });

  const defaultGroup = ageGroups?.[3] ?? ageGroups?.[0];
  const questionCount = publicSettings?.quizQuestionCount ?? 5;

  const handleStartTest = () => {
    setShowLanding(false);
    setShowQuiz(true);
  };

  const handleQuizClose = () => {
    setShowQuiz(false);
    sessionStorage.setItem("qaTestTaken", "true");
  };

  if (showLanding) {
    return <PrismLandingV3 onStart={handleStartTest} questionCount={questionCount} />;
  }

  if (showQuiz && defaultGroup) {
    return <QuizFlow ageGroup={defaultGroup} onClose={handleQuizClose} />;
  }

  return null;
}
