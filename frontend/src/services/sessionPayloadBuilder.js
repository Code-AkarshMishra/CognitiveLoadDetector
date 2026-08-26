export default function sessionPayloadBuilder({
  keyboardMetrics,
  mouseMetrics,
  webcamMetrics,
  sessionTimer,
}) {
  return {
    timestamp: new Date().toISOString(),

    session: {
      durationSeconds:
        sessionTimer.seconds,

      durationFormatted:
        sessionTimer.formattedTime,
    },

    keyboard: {
      totalKeystrokes:
        keyboardMetrics.totalKeystrokes,

      backspaceCount:
        keyboardMetrics.backspaceCount,

      typingSpeed:
        keyboardMetrics.typingSpeed,

      averageInterval:
        keyboardMetrics.averageInterval,
    },

    mouse: {
      positionX:
        mouseMetrics.x,

      positionY:
        mouseMetrics.y,

      clickCount:
        mouseMetrics.clickCount,

      totalDistance:
        mouseMetrics.totalDistance,

      movementSpeed:
        mouseMetrics.movementSpeed,

      idleTime:
        mouseMetrics.idleTime,
    },

    webcam: {
      permissionGranted:
        webcamMetrics.permissionGranted,

      cameraActive:
        webcamMetrics.cameraActive,

      snapshotCount:
        webcamMetrics.snapshotCount,

      lastCaptureTime:
        webcamMetrics.lastCaptureTime,
    },
  };
}