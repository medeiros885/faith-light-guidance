import { useState, useCallback } from "react";

const STREAK_KEY = "caminho-vivo-streak";

interface StreakData {
  count: number;
  lastDate: string;
}

function getLocalDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getYesterdayString(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return getLocalDateString(date);
}

function getDefaultStreak(): StreakData {
  return { count: 0, lastDate: "" };
}

function isValidStreakData(value: unknown): value is StreakData {
  if (!value || typeof value !== "object") return false;

  const data = value as Record<string, unknown>;

  return (
    typeof data.count === "number" &&
    Number.isFinite(data.count) &&
    data.count >= 0 &&
    typeof data.lastDate === "string"
  );
}

function saveStreak(data: StreakData) {
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function loadStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return getDefaultStreak();

    const parsed: unknown = JSON.parse(raw);
    return isValidStreakData(parsed) ? parsed : getDefaultStreak();
  } catch {
    return getDefaultStreak();
  }
}

function calcStreak(data: StreakData): StreakData {
  const today = getLocalDateString();

  if (data.lastDate === today) {
    return data;
  }

  const yesterday = getYesterdayString();

  return data.lastDate === yesterday
    ? { count: data.count + 1, lastDate: today }
    : { count: 1, lastDate: today };
}

export function useDailyStreak() {
  const [streak, setStreak] = useState<StreakData>(() => {
    const initial = calcStreak(loadStreak());
    saveStreak(initial);
    return initial;
  });

  const recordInteraction = useCallback(() => {
    setStreak((prev) => {
      const updated = calcStreak(prev);
      saveStreak(updated);
      return updated;
    });
  }, []);

  return {
    streakCount: streak.count,
    recordInteraction,
  };
}