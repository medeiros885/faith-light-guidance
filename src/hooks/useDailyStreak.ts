import { useState, useCallback } from "react";

const STREAK_KEY = "caminho-vivo-streak";

interface StreakData {
  count: number;
  lastDate: string;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return { count: 0, lastDate: "" };
    return JSON.parse(raw);
  } catch {
    return { count: 0, lastDate: "" };
  }
}

function calcStreak(data: StreakData): StreakData {
  const t = today();
  if (data.lastDate === t) return data;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().slice(0, 10);

  const newData: StreakData =
    data.lastDate === yStr
      ? { count: data.count + 1, lastDate: t }
      : { count: 1, lastDate: t };

  localStorage.setItem(STREAK_KEY, JSON.stringify(newData));
  return newData;
}

export function useDailyStreak() {
  const [streak, setStreak] = useState<StreakData>(() => calcStreak(loadStreak()));

  const recordInteraction = useCallback(() => {
    setStreak((prev) => {
      const updated = calcStreak(prev);
      localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { streakCount: streak.count, recordInteraction };
}
