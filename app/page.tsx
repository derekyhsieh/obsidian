"use client";
import ChatContent from "./components/ChatContent";
import ClockTimer from "./components/ClockTimer";
import Navbar from "./components/Navbar";
import StatsContent from "./components/StatsContent";
import VideoContent from "./components/VideoContent";

export default function Home() {
  return (
    <main className="flex flex-col max-h-screen h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-row flex-1 h-full">
        <div className="w-1/2">
          <ChatContent />
        </div>

        <div className="border-r border-gray-300 mr-3"></div> {/* This is the divider */}

        
        <div className="w-1/2 flexh h-full flex-col">
          <div className="flex flex-1 h-1/6 m-4 mr-3 rounded-md ml-auto items-center justify-between">
            <ClockTimer/>
            <VideoContent />
          </div>
          <div className="flex-1 h-5/7">
            <StatsContent />
          </div>
        </div>
      </div>
    </main>
  );
}
