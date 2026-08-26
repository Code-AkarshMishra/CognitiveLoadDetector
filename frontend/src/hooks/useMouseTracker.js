"use client";

import { useEffect, useRef, useState } from "react";
import { normalizeExtensionMessage } from "@/services/browserExtensionBridge";

export default function useMouseTracker(isTracking) {
  const [metrics, setMetrics] = useState({
    x: 0,
    y: 0,
    clickCount: 0,
    totalDistance: 0,
    movementSpeed: 0,
    idleTime: 0,
    lastActivityAt: null,
    movementEvents: 0,
  });

  const lastPositionRef = useRef(null);
  const lastMoveTimeRef = useRef(0);
  const totalDistanceRef = useRef(0);
  const clickCountRef = useRef(0);
  const movementEventsRef = useRef(0);
  const extensionActiveRef = useRef(false);

  useEffect(() => {
    if (!isTracking) return;

    lastMoveTimeRef.current = Date.now();

    const handleMove = (event) => {
      if (extensionActiveRef.current) return;

      const now = Date.now();
      const currentPosition = {
        x: event.clientX ?? 0,
        y: event.clientY ?? 0,
      };

      movementEventsRef.current += 1;

      if (lastPositionRef.current) {
        const dx = currentPosition.x - lastPositionRef.current.x;
        const dy = currentPosition.y - lastPositionRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        totalDistanceRef.current += distance;

        const timeDifference = now - lastMoveTimeRef.current;
        const speed = timeDifference > 0 ? (distance / timeDifference).toFixed(2) : 0;

        setMetrics((prev) => ({
          ...prev,
          x: currentPosition.x,
          y: currentPosition.y,
          totalDistance: Math.round(totalDistanceRef.current),
          movementSpeed: speed,
          idleTime: 0,
          lastActivityAt: now,
          movementEvents: movementEventsRef.current,
        }));
      }

      lastPositionRef.current = currentPosition;
      lastMoveTimeRef.current = now;
    };

    const handleClick = () => {
      if (extensionActiveRef.current) return;

      clickCountRef.current += 1;
      lastMoveTimeRef.current = Date.now();

      setMetrics((prev) => ({
        ...prev,
        clickCount: clickCountRef.current,
        idleTime: 0,
        lastActivityAt: Date.now(),
      }));
    };

    const handleScroll = () => {
      if (extensionActiveRef.current) return;

      movementEventsRef.current += 1;
      lastMoveTimeRef.current = Date.now();

      setMetrics((prev) => ({
        ...prev,
        idleTime: 0,
        lastActivityAt: Date.now(),
        movementEvents: movementEventsRef.current,
      }));
    };

    const handleExtensionMessage = (event) => {
      if (!isTracking) return;
      const normalized = normalizeExtensionMessage(event.data);
      if (!normalized?.mouse) return;

      extensionActiveRef.current = true;
      const extensionMouse = normalized.mouse;
      const extensionMovements = Number(extensionMouse.movementEvents ?? 0);
      const extensionClicks = Number(extensionMouse.clickCount ?? 0);
      const extensionDistance = Number(extensionMouse.totalDistance ?? 0);
      const extensionLastPosition = extensionMouse.lastPosition;
      const extensionLastActivityAt = Number(extensionMouse.lastActivityAt ?? 0);

      movementEventsRef.current = extensionMovements;
      clickCountRef.current = extensionClicks;
      totalDistanceRef.current = extensionDistance;
      if (extensionLastPosition) {
        lastPositionRef.current = {
          x: extensionLastPosition.x ?? 0,
          y: extensionLastPosition.y ?? 0,
        };
      }
      if (extensionLastActivityAt > lastMoveTimeRef.current) {
        lastMoveTimeRef.current = extensionLastActivityAt;
      }

      setMetrics((prev) => ({
        ...prev,
        x: extensionLastPosition?.x ?? prev.x,
        y: extensionLastPosition?.y ?? prev.y,
        clickCount: clickCountRef.current,
        movementEvents: movementEventsRef.current,
        totalDistance: Math.round(totalDistanceRef.current),
        idleTime: 0,
        lastActivityAt: extensionLastActivityAt || Date.now(),
      }));
    };

    const idleInterval = setInterval(() => {
      const idleSeconds = Math.floor((Date.now() - lastMoveTimeRef.current) / 1000);

      setMetrics((prev) => ({
        ...prev,
        idleTime: idleSeconds,
        lastActivityAt: lastMoveTimeRef.current,
      }));
    }, 1000);

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("message", handleExtensionMessage);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("message", handleExtensionMessage);
      clearInterval(idleInterval);
    };
  }, [isTracking]);

  return metrics;
}
