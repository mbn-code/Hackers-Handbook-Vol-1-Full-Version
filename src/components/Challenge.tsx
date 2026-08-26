import { useState } from "react";
import "./Challenge.css";

interface ChallengeProps {
  prompt: string;
  hint: string;
  solution: string;
}

export default function Challenge({ prompt, hint, solution }: ChallengeProps) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="challenge-card">
      <div className="challenge-prompt">{prompt}</div>
      <button className="challenge-btn" onClick={() => setShowHint((v) => !v)}>
        {showHint ? "Hide Hint" : "Show Hint"}
      </button>
      {showHint && <div className="challenge-hint">{hint}</div>}
      <button className="challenge-btn" onClick={() => setShowSolution((v) => !v)}>
        {showSolution ? "Hide Solution" : "Show Solution"}
      </button>
      <div
        className={`challenge-solution${showSolution ? " revealed" : ""}`}
        aria-hidden={!showSolution}
      >
        {showSolution ? solution : <span className="spoiler-blur">Spoiler hidden</span>}
      </div>
    </div>
  );
}
