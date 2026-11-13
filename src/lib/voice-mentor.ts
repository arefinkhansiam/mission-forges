import { useMissionStore, type UserMode } from "../stores/mission-store";
import type { LearningLesson, QuizQuestion } from "./curriculum";

class VoiceMentorEngine {
  private synth: SpeechSynthesis | null = null;
  private isSpeaking = false;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public speak(text: string, priority: boolean = false) {
    if (typeof window === "undefined" || !this.synth) return;

    const state = useMissionStore.getState();
    if (state.muted) return;

    if (priority && this.synth.speaking) {
      this.synth.cancel();
    }

    // Post to on-screen HUD captions
    if (state.captions) {
      state.say(`🎙️ Ayesha: "${text}"`, "info");
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05; // Friendly, clear educational tone

      // Pick an English or preferred voice if available
      const voices = this.synth.getVoices();
      const preferred = voices.find(
        (v) => (v.name.includes("Natural") || v.name.includes("Google") || v.lang.startsWith("en")) && !v.name.includes("Bad")
      );
      if (preferred) {
        utterance.voice = preferred;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
      };
      utterance.onend = () => {
        this.isSpeaking = false;
      };
      utterance.onerror = () => {
        this.isSpeaking = false;
      };

      this.synth.speak(utterance);
    } catch {
      // Graceful fallback if speech synthesis is disabled by browser policy
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  // Educational voice briefings tailored for STEM kids
  public briefDistrict(districtId: string) {
    switch (districtId) {
      case "space-center":
        this.speak(
          "Welcome to Mission Operations! Here we monitor real NASA orbital trajectories and assemble mission payloads.",
          true
        );
        break;
      case "academy":
        this.speak(
          "Welcome to the Flight Academy! Learn orbital mechanics, rocket staging, and the Tsiolkovsky equation here.",
          true
        );
        break;
      case "launch-complex":
        this.speak(
          "Pad 39X is ready! That's a full-scale Saturn V rocket capable of delivering 140 metric tons to orbit.",
          true
        );
        break;
      case "antigravity":
        this.speak(
          "You've entered the Anti-Gravity Research Zone! Adjusting the field reduces gravitational losses, saving precious rocket fuel!",
          true
        );
        break;
      case "hangar":
        this.speak(
          "Vehicle Integration Facility! Here we configure engine ISPs, thermal Whipple shields, and science instruments.",
          true
        );
        break;
      default:
        break;
    }
  }

  public briefLesson(lesson: LearningLesson, userMode: UserMode = "cadet") {
    const text = userMode === "kid" 
      ? `${lesson.title}! ${lesson.whyTopic.kidExplanation}`
      : `${lesson.title}. ${lesson.whyTopic.concept} ${lesson.whyTopic.cadetExplanation}`;
    this.speak(text, true);
  }

  public explainQuiz(quiz: QuizQuestion, selectedIndex: number) {
    const isCorrect = selectedIndex === quiz.correctIndex;
    const text = isCorrect
      ? `Spot on! ${quiz.ayeshaVoiceTip || quiz.explanation}`
      : `Not quite. Let's see why: ${quiz.explanation}`;
    this.speak(text, true);
  }
}

export const voiceMentor = new VoiceMentorEngine();
