"use client";

import { useEffect, useRef, useState } from "react";
import { normalizeExtensionMessage } from "@/services/browserExtensionBridge";

export default function useKeyboardTracker(isTracking) {
  const [metrics, setMetrics] = useState({
    totalKeystrokes: 0,
    backspaceCount: 0,
    typingSpeed: 0,
    wordsPerMinute: 0,
    averageInterval: 0,
    lastKeyAt: null,
    activeSeconds: 0,
  });

  const startTimeRef = useRef(null);
  const lastKeyTimeRef = useRef(null);
  const intervalsRef = useRef([]);
  const keystrokeCountRef = useRef(0);
  const backspaceCountRef = useRef(0);
  const characterCountRef = useRef(0);
  const lastKeyAtRef = useRef(null);
  const isTrackingRef = useRef(isTracking);
  const extensionActiveRef = useRef(false);
  const extensionAverageIntervalRef = useRef(0);

  useEffect(() => {
    isTrackingRef.current = isTracking;
  }, [isTracking]);

  useEffect(() => {
    if (!isTracking) return;

    startTimeRef.current = Date.now();
    lastKeyAtRef.current = Date.now();

    const updateMetrics = (now = Date.now()) => {
      const elapsedMinutes = (now - startTimeRef.current) / 60000;
      const typingSpeed = elapsedMinutes > 0 ? Math.round(keystrokeCountRef.current / elapsedMinutes) : 0;
      const wordsPerMinute = elapsedMinutes > 0 ? Math.round(characterCountRef.current / 5 / elapsedMinutes) : 0;
      const avgInterval = extensionActiveRef.current
        ? extensionAverageIntervalRef.current
        : (intervalsRef.current.length > 0
          ? Math.round(intervalsRef.current.reduce((sum, value) => sum + value, 0) / intervalsRef.current.length)
          : 0);

      setMetrics({
        totalKeystrokes: keystrokeCountRef.current,
        backspaceCount: backspaceCountRef.current,
        typingSpeed,
        wordsPerMinute,
        averageInterval: avgInterval,
        lastKeyAt: lastKeyAtRef.current,
        activeSeconds: Math.round((now - startTimeRef.current) / 1000),
      });
    };

    const handleKeyDown = (event) => {
      if (!isTrackingRef.current) return;
      if (extensionActiveRef.current) return;

      const now = Date.now();

      keystrokeCountRef.current += 1;
      lastKeyAtRef.current = now;

      if (event.key === "Backspace") {
        backspaceCountRef.current += 1;
      }

      if (event.key.length === 1 || event.key === " ") {
        characterCountRef.current += 1;
      }

      if (lastKeyTimeRef.current) {
        intervalsRef.current.push(now - lastKeyTimeRef.current);
      }

      lastKeyTimeRef.current = now;
      updateMetrics(now);
    };

    const handleExtensionMessage = (event) => {
      if (!isTrackingRef.current) return;

      const normalized = normalizeExtensionMessage(event.data);
      if (!normalized?.keyboard) return;

      extensionActiveRef.current = true;
      const extensionKeyboard = normalized.keyboard;
      const extensionTotal = Number(extensionKeyboard.totalKeystrokes ?? 0);
      const extensionBackspaces = Number(extensionKeyboard.backspaceCount ?? 0);
      const extensionCharacters = Number(extensionKeyboard.characters ?? 0);

      keystrokeCountRef.current = extensionTotal;
      backspaceCountRef.current = extensionBackspaces;
      characterCountRef.current = extensionCharacters;
      if (extensionKeyboard.lastKeyAt) {
        lastKeyAtRef.current = Math.max(lastKeyAtRef.current ?? 0, Number(extensionKeyboard.lastKeyAt));
      }
      if (extensionKeyboard.averageInterval !== undefined) {
        extensionAverageIntervalRef.current = Number(extensionKeyboard.averageInterval);
      }
      updateMetrics(Date.now());
    };

    const activityInterval = setInterval(() => {
      if (!isTrackingRef.current) return;
      updateMetrics(Date.now());
    }, 1000);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("message", handleExtensionMessage);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("message", handleExtensionMessage);
      clearInterval(activityInterval);
    };
  }, [isTracking]);

  return metrics;
}
