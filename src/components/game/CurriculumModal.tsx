// src/components/game/CurriculumModal.tsx
import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { BigButton } from "@/components/ui/BigButton";
import { MISSION_CURRICULUM, type LearningLesson } from "@/lib/curriculum";
import { useMission } from "@/stores/mission-store";
import { voiceMentor } from "@/lib/voice-mentor";

interface CurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLessonId?: string | undefined;
}

export const CurriculumModal: React.FC<CurriculumModalProps> = ({
  isOpen,
  onClose,
  initialLessonId,
}) => {
  const defaultLesson = MISSION_CURRICULUM[0]!;
  const [activeLessonId, setActiveLessonId] = useState<string>(
    initialLessonId || defaultLesson.id
  );
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);

  const lang = useMission((s) => s.lang);
  const userMode = useMission((s) => s.userMode);

  if (!isOpen) return null;

  const currentLesson: LearningLesson =
    MISSION_CURRICULUM.find((l) => l.id === activeLessonId) ?? defaultLesson;

  const handleSelectOption = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);
    voiceMentor.explainQuiz(currentLesson.quiz, index);
    if (index === currentLesson.quiz.correctIndex) {
      if (!completedQuizzes.includes(currentLesson.id)) {
        setCompletedQuizzes([...completedQuizzes, currentLesson.id]);
      }
    }
  };

  const handleNextLesson = () => {
    const curIdx = MISSION_CURRICULUM.findIndex((l) => l.id === currentLesson.id);
    const nextIdx = (curIdx + 1) % MISSION_CURRICULUM.length;
    const nextLesson = MISSION_CURRICULUM[nextIdx];
    if (nextLesson) {
      setActiveLessonId(nextLesson.id);
    }
    setSelectedOption(null);
    setShowExplanation(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <GlassCard className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col z-10 p-0 border-cyan-500/30">
        {/* Top Header */}
        <div className="p-6 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎓</span>
            <div>
              <div className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider">
                SPACE ACADEMY • INTERACTIVE CURRICULUM
              </div>
              <h2 className="text-2xl font-bold font-mono text-white">
                {currentLesson.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-slate-300">
              <span>BADGES:</span>
              <span className="px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
                {completedQuizzes.length} / {MISSION_CURRICULUM.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Main Split Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Lesson Selector & Tabs */}
          <div className="md:col-span-4 space-y-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-2">
              Curriculum Lessons
            </span>
            {MISSION_CURRICULUM.map((lesson) => {
              const isDone = completedQuizzes.includes(lesson.id);
              const isActive = lesson.id === currentLesson.id;
              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setActiveLessonId(lesson.id);
                    setSelectedOption(null);
                    setShowExplanation(false);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isActive
                      ? "bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-950/40"
                      : "bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-lg">{lesson.badgeIcon}</span>
                    <div className="truncate">
                      <div className="text-xs font-mono text-cyan-400/80">
                        {lesson.category}
                      </div>
                      <div className="font-semibold text-sm truncate">
                        {lesson.title}
                      </div>
                    </div>
                  </div>
                  {isDone && <span className="text-emerald-400 text-xs font-bold">✓</span>}
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Lesson Deep Dive & Quiz */}
          <div className="md:col-span-8 space-y-6">
            {/* Core Science Concept */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider">
                Physical Principle {userMode === "kid" && "🎈 (Kid Mode Explainer)"}
              </span>
              <p className="text-sm text-slate-200 leading-relaxed font-body">
                {userMode === "kid"
                  ? currentLesson.whyTopic.kidExplanation
                  : currentLesson.whyTopic.cadetExplanation}
              </p>

              {currentLesson.whyTopic.equation && (
                <div className="mt-3 p-3.5 rounded-xl bg-black/60 border border-white/5 font-mono">
                  <div className="text-xs text-slate-400 mb-1">
                    {currentLesson.whyTopic.equation.description}
                  </div>
                  <div className="text-lg font-bold text-cyan-300">
                    {currentLesson.whyTopic.equation.formula}
                  </div>
                </div>
              )}
            </div>

            {/* Dr. Ayesha Voice Mentor Card */}
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center font-bold text-slate-950 text-sm flex-shrink-0">
                  Dr.A
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono text-indigo-300 font-bold uppercase">
                    Dr. Ayesha • Flight Mentor
                  </span>
                  <p className="text-xs text-indigo-100 leading-relaxed italic">
                    "{currentLesson.quiz.ayeshaVoiceTip}"
                  </p>
                </div>
              </div>
              <button
                onClick={() => voiceMentor.briefLesson(currentLesson, userMode)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 text-xs text-cyan-300 transition shrink-0 cursor-pointer"
                title="Listen to Dr. Ayesha speak this lesson"
              >
                <span>🔊</span>
                <span className="hidden sm:inline font-mono">Audio</span>
              </button>
            </div>

            {/* Interactive Concept Quiz */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider">
                  Knowledge Check • {currentLesson.badgeName}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Select the best answer
                </span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">
                {currentLesson.quiz.question}
              </h3>

              <div className="space-y-2 pt-1">
                {currentLesson.quiz.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentLesson.quiz.correctIndex;

                  let btnStyle = "bg-slate-950/70 border-white/10 hover:border-cyan-400/50 text-slate-200";
                  if (showExplanation) {
                    if (isCorrect) {
                      btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold";
                    } else if (isSelected) {
                      btnStyle = "bg-rose-950/80 border-rose-500 text-rose-200 line-through";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={showExplanation}
                      className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {showExplanation && isCorrect && <span className="text-emerald-400 font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>

              {/* Quiz Explanation Reveal */}
              {showExplanation && (
                <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    {selectedOption === currentLesson.quiz.correctIndex ? (
                      <span className="text-emerald-400 font-bold text-sm">
                        🎉 Correct! You unlocked the {currentLesson.badgeName} badge.
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold text-sm">
                        ⚠️ Not quite. Here is the science behind it:
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentLesson.quiz.explanation}
                  </p>
                  <div className="pt-2 flex justify-end">
                    <BigButton variant="primary" onClick={handleNextLesson} className="!min-h-[44px] text-xs">
                      Next Lesson →
                    </BigButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
