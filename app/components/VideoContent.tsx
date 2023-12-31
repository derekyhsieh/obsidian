"use client";
import { useEffect, useState } from "react";
import useWindowSize from "@/hooks/useWindowSize";
import { useDataStore } from "@/stores/dataStore";
import VideoWebcam from "./Webcam";
import { useGlobalState } from "@/stores/globalState";

declare global {
  interface Window {
    webgazer: any;
  }
}

function VideoContent() {
  const [showPoints, setShowPoints] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [intervalMs, setIntervalMs] = useState(1000); // Desired interval for the gaze listener in milliseconds.

  const { setCurrentEyeTrackingState } = useDataStore();

  const {
    incrementTimeSpendOnChatAndTools,
    isCodeProblemOpen,
    timeSpentOnChatAndTools,
  } = useGlobalState();

  const size = useWindowSize();

  useEffect(() => {
    const loadWebgazer = async () => {
      // @ts-ignore webgazer is written in JS, so no typing is available

      const webgazer = (await import("webgazer")).default;
      window.webgazer = webgazer;

      await window.webgazer.begin();
      window.webgazer.showPredictionPoints(false);

      // Set up gaze listener with desired interval
      window.webgazer
        .setGazeListener((data: any, elapsedTime: number) => {
          if (data === null) {
            return;
          }

          // Convert elapsedTime from milliseconds to seconds for better readability
          const elapsedTimeInSeconds = (elapsedTime / 1000).toFixed(2);

          if (data.x < size.width / 2) {
            // increment chat
            if (isCodeProblemOpen) {
              incrementTimeSpendOnChatAndTools("chat");
              console.log();
              timeSpentOnChatAndTools.chat += 1;
            }

            setCurrentEyeTrackingState("chat");
          } else {
            if (isCodeProblemOpen) {
              incrementTimeSpendOnChatAndTools("tools");
              timeSpentOnChatAndTools.chat += 1;
            }
            setCurrentEyeTrackingState("stats");
          }

          window.webgazer.pause();

          // Schedule a resume after the interval
          setTimeout(() => {
            window.webgazer.resume();
          }, intervalMs);
        })
        .begin();

      return () => {
        window.webgazer?.end(); // Clean up WebGazer instance on unmount
      };
    };

    // UNCOMMENT THIS OUT
    loadWebgazer();
  }, [showPoints, intervalMs]); // Only re-run the effect if showPoints or intervalMs changes

  const togglePoints = () => {
    setShowPoints((prev) => {
      const newShowPoints = !prev;
      window.webgazer.showPredictionPoints(newShowPoints);
      return newShowPoints;
    });
  };

  const toggleVideo = () => {
    setShowVideo((prev) => !prev);
  };

  return <VideoWebcam />;
}

export default VideoContent;
