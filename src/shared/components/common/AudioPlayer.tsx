"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2, FastForward } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { formatDuration } from "@/shared/utils/formatters";
import { LiveWaveform } from "./LiveWaveform";

export interface AudioPlayerProps {
  durationSeconds: number;
  initialPlaying?: boolean;
  onTimeUpdate?: (currentTime: number) => void;
  className?: string;
}

export function AudioPlayer({
  durationSeconds,
  initialPlaying = false,
  onTimeUpdate,
  className,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(initialPlaying);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<1 | 1.25 | 1.5>(1);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1 * playbackRate;
          if (next >= durationSeconds) {
            setIsPlaying(false);
            return durationSeconds;
          }
          if (onTimeUpdate) onTimeUpdate(next);
          return next;
        });
      }, 1000 / playbackRate);
    }
    return () => clearInterval(interval);
  }, [isPlaying, durationSeconds, playbackRate, onTimeUpdate]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const handleReset = () => {
    setCurrentTime(0);
    setIsPlaying(false);
    if (onTimeUpdate) onTimeUpdate(0);
  };
  const toggleSpeed = () => {
    setPlaybackRate((prev) => (prev === 1 ? 1.25 : prev === 1.25 ? 1.5 : 1));
  };

  const progressPercent = Math.min(100, (currentTime / (durationSeconds || 1)) * 100);

  return (
    <div
      className={cn(
        "rounded-2xl p-4 bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-xl flex flex-col gap-3",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Play / Reset controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="h-10 w-10 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-transform active:scale-95 cursor-pointer"
          >
            {isPlaying ? <Pause className="h-5 w-5 fill-slate-950" /> : <Play className="h-5 w-5 fill-slate-950 ml-0.5" />}
          </button>

          <button
            onClick={handleReset}
            title="Reset to start"
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 flex items-center justify-center transition-colors cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* Live waveform center */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <LiveWaveform isPlaying={isPlaying} barsCount={36} variant="cyan" />
        </div>

        {/* Speed & volume indicator */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSpeed}
            className="px-2 py-1 rounded-lg bg-slate-800 text-xs font-semibold text-cyan-300 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {playbackRate}x
          </button>
          <div className="hidden sm:flex items-center text-slate-400">
            <Volume2 className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Progress scrubber */}
      <div className="space-y-1">
        <div
          className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            const newTime = Math.floor(clickPos * durationSeconds);
            setCurrentTime(newTime);
            if (onTimeUpdate) onTimeUpdate(newTime);
          }}
        >
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-100 group-hover:brightness-125"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>{formatDuration(Math.floor(currentTime))}</span>
          <span className="text-slate-500">Duration: {formatDuration(durationSeconds)}</span>
        </div>
      </div>
    </div>
  );
}
