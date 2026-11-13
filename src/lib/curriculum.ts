// src/lib/curriculum.ts
import type { WhyTopic } from "@/components/ui/WhyCard";
import type { Provenance } from "./provenance";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  ayeshaVoiceTip: string;
}

export interface LearningLesson {
  id: string;
  title: string;
  category: "Propulsion" | "Orbits" | "Power" | "Telecommunications" | "Atmosphere" | "Safety";
  badgeName: string;
  badgeIcon: string;
  whyTopic: WhyTopic;
  quiz: QuizQuestion;
}

const NASA_PROVENANCE: Provenance = {
  source: "NASA JPL Science Division / Glenn Research Center",
  url: "https://www.grc.nasa.gov/www/k-12/rocket/",
  fetchedAt: "2026-10-19T00:00:00Z",
  status: "snapshot",
  license: "Public Domain / NASA Educational Resource",
};

export const MISSION_CURRICULUM: LearningLesson[] = [
  {
    id: "rocket-equation",
    title: "The Tsiolkovsky Rocket Equation & Delta-V",
    category: "Propulsion",
    badgeName: "Rocket Scientist",
    badgeIcon: "🚀",
    whyTopic: {
      title: "Delta-V (Δv) & Exhaust Velocity",
      concept: "Delta-v is the total velocity change a spacecraft can produce. It represents the currency of space travel.",
      cadetExplanation:
        "To speed up in the vacuum of space, a rocket must shoot mass out of its engine backwards. Konstantin Tsiolkovsky proved that your velocity change depends logarithmically on how much fuel you burn compared to your empty spacecraft mass.",
      kidExplanation:
        "Imagine throwing heavy basketballs behind you while standing on a skateboard. Every ball you throw kicks you forward! If you throw them super fast, you zoom ahead faster!",
      equation: {
        formula: "Δv = Isp · g0 · ln(m0 / mf)",
        description: "Tsiolkovsky Ideal Rocket Equation",
        variables: [
          { symbol: "Δv", name: "Velocity Change", value: "m/s" },
          { symbol: "Isp", name: "Specific Impulse (Engine Efficiency)", value: "seconds" },
          { symbol: "g0", name: "Standard Earth Gravity", value: "9.80665 m/s²" },
          { symbol: "m0", name: "Initial Total Wet Mass (Rocket + Fuel)", value: "kg" },
          { symbol: "mf", name: "Final Dry Mass (Empty Rocket)", value: "kg" },
        ],
      },
      provenance: NASA_PROVENANCE,
    },
    quiz: {
      id: "q-rocket",
      question: "Why does adding more fuel give diminishing returns for rocket delta-v?",
      options: [
        "Fuel evaporates quickly in space",
        "The engine gets too hot to handle more fuel",
        "You have to burn extra fuel just to carry the heavy fuel you just added",
        "Earth's gravity gets stronger the more fuel you carry",
      ],
      correctIndex: 2,
      explanation:
        "Because of the natural logarithm (ln), every extra kilogram of fuel requires even more fuel to accelerate it off the launchpad. This is known as the 'Tyranny of the Rocket Equation'.",
      ayeshaVoiceTip:
        "Remember: lightweight composite structures and high Isp engines are far better than just piling on more fuel tanks!",
    },
  },
  {
    id: "inverse-square-law",
    title: "Solar Irradiance & The Inverse-Square Law",
    category: "Power",
    badgeName: "Solar Navigator",
    badgeIcon: "☀️",
    whyTopic: {
      title: "Solar Power Decay in Deep Space",
      concept: "Sunlight spreads out over the surface of an expanding sphere, causing light intensity to drop with the square of the distance.",
      cadetExplanation:
        "At 1 AU (Earth), the Sun provides ~1,361 Watts per square meter. At Mars (1.52 AU), power drops to 43%. By Jupiter (5.2 AU), solar power drops to just 3.7% of Earth's level, requiring gigantic solar arrays (like Juno) or nuclear RTG generators.",
      kidExplanation:
        "Think of a flashlight shining on a wall. Up close, the circle is small and super bright. Step far back, and the circle spreads out wide and gets dim!",
      equation: {
        formula: "P(d) = P_Earth / (d / 1 AU)²",
        description: "Inverse-Square Law for Radiant Intensity",
        variables: [
          { symbol: "P(d)", name: "Solar Intensity at distance d", value: "W/m²" },
          { symbol: "P_Earth", name: "Solar Constant at Earth", value: "1,361 W/m²" },
          { symbol: "d", name: "Distance from Sun", value: "Astronomical Units (AU)" },
        ],
      },
      provenance: NASA_PROVENANCE,
    },
    quiz: {
      id: "q-solar",
      question: "If a probe travels to Jupiter at 5.2 AU, how much sunlight hits its solar panels compared to Earth?",
      options: [
        "About 50%",
        "About 20%",
        "Less than 4%",
        "It stays exactly the same",
      ],
      correctIndex: 2,
      explanation:
        "1 / (5.2)² = 1 / 27.04 ≈ 0.037 (3.7%). Solar arrays must be over 27 times larger at Jupiter to produce the same electrical wattage as in Earth orbit!",
      ayeshaVoiceTip:
        "For deep-space outer planet missions beyond the Asteroid Belt, always pack an RTG nuclear generator or oversized solar wings!",
    },
  },
  {
    id: "comms-delay",
    title: "Speed-of-Light Radio Communications Delay",
    category: "Telecommunications",
    badgeName: "Deep Space Communicator",
    badgeIcon: "📡",
    whyTopic: {
      title: "Speed of Light & One-Way Light Time",
      concept: "Radio waves travel at the speed of light (299,792 km/s). Across interplanetary distances, signals take minutes to hours to arrive.",
      cadetExplanation:
        "When communicating with the Curiosity or Perseverance rovers on Mars, radio signals take between 4.3 and 21 minutes one-way depending on Earth-Mars orbital positions. Real-time joystick driving is impossible; spacecraft must be autonomous.",
      kidExplanation:
        "When you talk to someone on Mars, your words have to travel across a giant cosmic highway. Even traveling at the speed of light, it takes up to 20 minutes for your 'Hello' to reach their ears!",
      equation: {
        formula: "t_delay = d / c",
        description: "One-Way Light Time Equation",
        variables: [
          { symbol: "t_delay", name: "One-Way Signal Latency", value: "seconds" },
          { symbol: "d", name: "Distance between Earth and Craft", value: "km" },
          { symbol: "c", name: "Speed of Light in Vacuum", value: "299,792 km/s" },
        ],
      },
      provenance: NASA_PROVENANCE,
    },
    quiz: {
      id: "q-comms",
      question: "Why cannot NASA engineers fly a Mars rover in real-time with an Xbox controller?",
      options: [
        "Mars has too much dust in the air",
        "Radio signals take 4 to 20 minutes to reach Mars at the speed of light",
        "Satellites turn off during nighttime",
        "Rovers do not have Bluetooth antennas",
      ],
      correctIndex: 1,
      explanation:
        "Because of light delay, by the time you see the rover approaching a cliff edge on Earth, it would have driven off the cliff 15 minutes ago! This is why rovers use onboard AI hazard avoidance.",
      ayeshaVoiceTip:
        "Equip your spacecraft with high-gain antennas and autonomous computer modules so it can survive during radio blackout periods!",
    },
  },
  {
    id: "orbital-mechanics",
    title: "Kepler's Laws & Planetary Orbital Periods",
    category: "Orbits",
    badgeName: "Orbital Navigator",
    badgeIcon: "🪐",
    whyTopic: {
      title: "Kepler's Third Law (Harmonic Law)",
      concept: "The square of the orbital period of a planet is directly proportional to the cube of the semi-major axis of its orbit.",
      cadetExplanation:
        "Planets closer to the Sun move faster and have shorter years. Mercury circles the Sun in just 88 days, while Neptune takes 165 Earth years. Interplanetary transfer windows only open when planets align in their respective orbits.",
      kidExplanation:
        "Picture running on a track. The inside runner has a short lap and dashes around fast. The runner on the very outside lane has a huge long circle to run and takes much longer!",
      equation: {
        formula: "T² = a³",
        description: "Kepler's Third Law (in Earth years and AU)",
        variables: [
          { symbol: "T", name: "Orbital Period", value: "Earth Years" },
          { symbol: "a", name: "Semi-Major Axis (Average Distance)", value: "Astronomical Units (AU)" },
        ],
      },
      provenance: NASA_PROVENANCE,
    },
    quiz: {
      id: "q-orbit",
      question: "Mars orbits at an average distance of 1.52 AU from the Sun. About how long is one Martian year?",
      options: [
        "6 months",
        "About 1.9 Earth years (687 days)",
        "5 Earth years",
        "Exact same as Earth (365 days)",
      ],
      correctIndex: 1,
      explanation:
        "Using Kepler's Law: T = √(1.52³) = √(3.51) ≈ 1.87 Earth years, which matches Mars's exact 687-day orbit!",
      ayeshaVoiceTip:
        "To reach Mars, we don't aim where Mars is today—we launch on a Hohmann transfer ellipse to rendezvous where Mars will be 9 months from now!",
    },
  },
];

/**
 * Mission Autopsy Diagnosis Generator
 * Pinpoints exact engineering failure causes and connects learners to corresponding lessons.
 */
export function generateMissionAutopsy(outcome: {
  success: boolean;
  reason?: string;
  dvMargin?: number;
  powerDeficit?: boolean;
  commsLost?: boolean;
  heatExceeded?: boolean;
}) {
  if (outcome.success) {
    return {
      status: "MISSION_SUCCESS",
      title: "Mission Completed with Scientific Distinction",
      diagnostic: "All engineering envelopes (Δv, thermal, power, and communications) held stable through arrival.",
      recommendedLessonId: "rocket-equation",
    };
  }

  if (outcome.dvMargin !== undefined && outcome.dvMargin < 0) {
    return {
      status: "OUT_OF_PROPELLANT",
      title: "Catastrophic Propulsive Depletion (Δv Deficit)",
      diagnostic: `Your spacecraft expended 100% of propellant before orbital insertion, drifting into a heliocentric graveyard orbit. Deficit: ${Math.abs(outcome.dvMargin)} m/s.`,
      recommendedLessonId: "rocket-equation",
      fixAdvice: "Increase propellant mass, choose a higher Isp engine, or strip unneeded instruments to reduce dry mass.",
    };
  }

  if (outcome.powerDeficit) {
    return {
      status: "POWER_BLACKOUT",
      title: "Electrical Grid Starvation (Battery Depletion)",
      diagnostic: "Solar panels could not produce enough wattage at your destination's orbital distance from the Sun.",
      recommendedLessonId: "inverse-square-law",
      fixAdvice: "Install an RTG nuclear power unit or significantly expand your solar array surface area.",
    };
  }

  if (outcome.commsLost) {
    return {
      status: "COMMUNICATIONS_BLACKOUT",
      title: "Link Budget Attenuation (Loss of Signal)",
      diagnostic: "The signal-to-noise ratio dropped below decibel thresholds across interplanetary distance.",
      recommendedLessonId: "comms-delay",
      fixAdvice: "Equip a 3.0-meter High-Gain parabolic dish or choose an autonomous guidance computer.",
    };
  }

  return {
    status: "MISSION_ANOMALY",
    title: "Trajectory Divergence Anomaly",
    diagnostic: outcome.reason || "Engineering safety margins were breached during flight execution.",
    recommendedLessonId: "orbital-mechanics",
    fixAdvice: "Review your staging sequence and run another pre-flight flight director poll.",
  };
}
