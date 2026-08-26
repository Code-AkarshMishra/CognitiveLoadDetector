export const EXTENSION_SOURCE = "neurotrack-extension";
export const EXTENSION_ACTIVITY_TYPE = "neurotrack-extension:activity";

export function normalizeExtensionMessage(payload) {
  if (!payload || typeof payload !== "object") return null;

  const isExtensionEvent =
    payload?.source === EXTENSION_SOURCE ||
    payload?.source === EXTENSION_ACTIVITY_TYPE ||
    payload?.type === EXTENSION_ACTIVITY_TYPE ||
    payload?.type === "activity_update" ||
    payload?.type === "keyboard" ||
    payload?.type === "mouse";

  if (!isExtensionEvent) return null;

  const messagePayload = payload.payload ?? payload.data ?? payload;
  const keyboard = messagePayload?.keyboard ?? messagePayload?.input?.keyboard ?? {};
  const mouse = messagePayload?.mouse ?? messagePayload?.input?.mouse ?? {};
  const distractions = messagePayload?.distractions ?? {};

  return {
    keyboard,
    mouse,
    distractions,
    timestamp: messagePayload?.timestamp ?? payload.timestamp ?? Date.now(),
  };
}
