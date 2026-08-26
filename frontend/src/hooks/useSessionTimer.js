"use client";

import { useEffect, useState } from "react";

export default function useSessionTimer(isRunning) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const resetTimer = () => {
    setSeconds(0);
  };

  const hours = String(
    Math.floor(seconds / 3600)
  ).padStart(2, "0");

  const minutes = String(
    Math.floor((seconds % 3600) / 60)
  ).padStart(2, "0");

  const secs = String(
    seconds % 60
  ).padStart(2, "0");

  return {
    seconds,
    formattedTime: `${hours}:${minutes}:${secs}`,
    resetTimer,
  };
}