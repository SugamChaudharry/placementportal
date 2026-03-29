"use client";

import { useState } from "react";
import {
  BookOpen,
  CheckCircle,
  MessageSquare,
  Mic,
  MicOff,
  PhoneOff,
  ScreenShare,
  Video,
  VideoOff,
  XCircle,
} from "lucide-react";
import { Av, Btn, Card, ColorBdg, LogoCircle } from "@/placement-portal/components/atoms";

export function MeetingsPage() {
  const [inRoom, setInRoom] = useState(false);
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);

  const meetings = [
    {
      id: 1,
      company: "Google",
      logo: "G",
      color: "#4285F4",
      title: "SDE Technical Interview – Round 1",
      type: "Technical",
      date: "Feb 5, 2025",
      time: "10:00 AM",
      duration: "60 min",
      interviewer: "Priya Nair · Senior SDE",
      slot: "Slot 3 of 8",
      status: "Scheduled",
    },
    {
      id: 2,
      company: "Flipkart",
      logo: "F",
      color: "#2874F0",
      title: "Data Analyst HR Discussion",
      type: "HR",
      date: "Feb 12, 2025",
      time: "2:30 PM",
      duration: "30 min",
      interviewer: "Raj Verma · HR Manager",
      slot: "Slot 1 of 5",
      status: "Scheduled",
    },
  ];

  if (inRoom) {
    return (
      <div className="fixed inset-0 bg-gray-950 flex flex-col z-50 fi">
        <div className="flex-1 grid grid-cols-2 gap-3 p-4">
          <div className="bg-gray-900 rounded-2xl flex items-center justify-center relative">
            <Av name="Priya Nair" size={80} color="#4285F4" />
            <div className="absolute bottom-4 left-4">
              <p className="text-white text-sm font-medium">Priya Nair · Google</p>
              <p className="text-gray-400 text-xs">Senior SDE</p>
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-red-600 rounded-full px-2 py-0.5">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white text-xs">REC</span>
            </div>
          </div>
          <div className="bg-gray-900 rounded-2xl flex items-center justify-center relative">
            <Av name="Arjun Kumar" size={60} color="#4f46e5" />
            <div className="absolute bottom-4 left-4">
              <p className="text-white text-sm font-medium">You (Arjun Kumar)</p>
            </div>
            {!mic && (
              <div className="absolute top-3 right-3 bg-red-600 rounded-full p-1">
                <MicOff size={14} className="text-white" />
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 py-5 bg-gray-900">
          <button onClick={() => setMic(!mic)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${mic ? "bg-gray-700" : "bg-red-600"}`}>
            {mic ? <Mic size={20} className="text-white" /> : <MicOff size={20} className="text-white" />}
          </button>
          <button onClick={() => setCam(!cam)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${cam ? "bg-gray-700" : "bg-red-600"}`}>
            {cam ? <Video size={20} className="text-white" /> : <VideoOff size={20} className="text-white" />}
          </button>
          <button className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
            <ScreenShare size={20} className="text-white" />
          </button>
          <button className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
            <MessageSquare size={20} className="text-white" />
          </button>
          <button onClick={() => setInRoom(false)} className="w-14 h-12 rounded-full bg-red-600 flex items-center justify-center">
            <PhoneOff size={20} className="text-white" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="su space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2">
          <input placeholder="Enter 6-digit room code" className="text-sm focus:outline-none w-36" />
          <Btn size="sm">Join</Btn>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meetings.map((m) => (
          <Card key={m.id} className="p-5">
            <div className="flex items-start gap-3 mb-4">
              <LogoCircle letter={m.logo} color={m.color} size={46} />
              <div className="flex-1">
                <p className="font-600" style={{ fontWeight: 600 }}>
                  {m.title}
                </p>
                <p className="text-xs text-gray-500">
                  {m.company} · {m.type} Interview
                </p>
                <ColorBdg label={m.status} color="#4f46e5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                ["Date", m.date],
                ["Time", m.time],
                ["Duration", m.duration],
                ["Slot", m.slot],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-gray-400">{k}</p>
                  <p className="text-sm font-medium text-gray-700">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-gray-50">
              <Av name={m.interviewer.split(" ").slice(0, 2).join(" ")} size={32} />
              <div>
                <p className="text-xs font-medium text-gray-800">{m.interviewer.split("·")[0].trim()}</p>
                <p className="text-xs text-gray-500">{m.interviewer.split("·")[1]?.trim()}</p>
              </div>
            </div>
            <div className="mb-4 space-y-1.5">
              {(
                [
                  ["Camera", true],
                  ["Microphone", true],
                  ["Internet Speed", true],
                ] as const
              ).map(([label, ok]) => (
                <div key={label} className="flex items-center gap-2">
                  {ok ? <CheckCircle size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-red-500" />}
                  <span className="text-xs text-gray-600">
                    {label} — {ok ? "Ready" : "Check required"}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Btn onClick={() => setInRoom(true)} className="flex-1 justify-center" icon={Video}>
                Join Meeting
              </Btn>
              <Btn variant="secondary" icon={BookOpen}>
                Prepare
              </Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
