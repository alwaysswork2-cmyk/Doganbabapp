import React, { useState, useEffect } from "react";
import { ChevronLeft, Check } from "lucide-react";
import { Step } from '../types';

interface AvatarCustomizerProps {
  onNavigate: (step: Step) => void;
  onSelect: (avatar: string) => void;
}

export function AvatarCustomizer({
  onNavigate,
  onSelect,
}: AvatarCustomizerProps) {
  const [gender, setGender] = useState<"female" | "male">("female");

  // avataaars options
  const skinColors = ["pale", "light", "brown", "darkBrown", "black"];
  const hairColors = ["black", "brown", "blonde", "auburn", "platinum", "red"];
  const eyes = ["default", "happy", "wink", "squint", "side"];
  const eyebrows = ["default", "defaultNatural", "flatNatural", "raisedExcited", "sadConcerned"];
  const mouths = ["default", "smile", "serious", "smirk", "twinkle"];

  const femaleHair = [
    "longHairStraight",
    "longHairBob",
    "longHairBun",
    "longHairCurly",
    "longHairCurvy",
    "longHairDreads"
  ];
  const maleHair = [
    "shortHairShortFlat",
    "shortHairShortRound",
    "shortHairShortWaved",
    "shortHairSides",
    "shortHairTheCaesar",
    "noHair"
  ];

  const facialHairs = [
    "none",
    "beardLight",
    "beardMedium",
    "beardMajestic",
    "moustaceMagnum",
    "moustaceFancy",
  ];

  const [skinColor, setSkinColor] = useState(skinColors[1]);
  const [hairColor, setHairColor] = useState(hairColors[0]);
  const [eye, setEye] = useState(eyes[0]);
  const [eyebrow, setEyebrow] = useState(eyebrows[0]); // neutral
  const [mouth, setMouth] = useState(mouths[0]); // neutral
  const [hair, setHair] = useState(femaleHair[0]); // longStraight
  const [facialHair, setFacialHair] = useState(facialHairs[0]);

  useEffect(() => {
    if (gender === "female") {
      setHair(femaleHair[0]);
      setFacialHair("none");
      setHairColor(hairColors[0]);
    } else {
      setHair(maleHair[0]);
      setHairColor(hairColors[1]); 
    }
  }, [gender]);

  const currentHairList = gender === "female" ? femaleHair : maleHair;

  const generateUrl = () => {
    const seed = gender === "female" ? "Aneka" : "Felix";
    let url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede&radius=50&skinColor=${skinColor}&hairColor=${hairColor}&eyes=${eye}&eyebrows=${eyebrow}&mouth=${mouth}&top=${hair}`;

    if (facialHair !== "none") {
      url += `&facialHair=${facialHair}&facialHairProbability=100`;
    } else {
      url += `&facialHairProbability=0`;
    }

    return url;
  };

  const handleSave = () => {
    onSelect(generateUrl());
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 max-w-md mx-auto px-6 py-12 pb-32">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black italic tracking-tighter">
          Avatarını <span className="text-blue-400">Oluştur</span>
        </h1>
        <button
          onClick={() => onNavigate("character_selection")}
          className="size-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="flex justify-center mb-8">
        <div className="relative size-40 rounded-full border-4 border-blue-500/30 shadow-[0_0_30px_rgba(37,123,244,0.2)] bg-white/5 p-2">
          <img
            src={generateUrl()}
            alt="Preview"
            className="w-full h-full rounded-full"
          />
        </div>
      </div>

      <div className="flex bg-white/5 rounded-2xl p-1 mb-8">
        <button
          onClick={() => setGender("female")}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${gender === "female" ? "bg-blue-500 text-white" : "text-slate-400 hover:text-white"}`}
        >
          Kız
        </button>
        <button
          onClick={() => setGender("male")}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${gender === "male" ? "bg-blue-500 text-white" : "text-slate-400 hover:text-white"}`}
        >
          Erkek
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-bold text-slate-400 mb-3 block">
            Ten Rengi
          </label>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {skinColors.map((color) => (
              <button
                key={color}
                onClick={() => setSkinColor(color)}
                className={`shrink-0 size-12 rounded-full border-4 transition-all ${skinColor === color ? "border-blue-500 scale-110" : "border-transparent hover:border-white/20"}`}
                style={{ backgroundColor: `#${color}` }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-400 mb-3 block">
            Saç Stili
          </label>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {currentHairList.map((h) => (
              <button
                key={h}
                onClick={() => setHair(h)}
                className={`shrink-0 px-4 py-2 rounded-xl border-2 transition-all ${hair === h ? "border-blue-500 bg-blue-500/10 text-white" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30"}`}
              >
                {h === "none" ? "Yok" : h.replace(/([A-Z])/g, " $1").trim()}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-400 mb-3 block">
            Saç / Sakal Rengi
          </label>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {hairColors.map((color) => (
              <button
                key={color}
                onClick={() => setHairColor(color)}
                className={`shrink-0 size-12 rounded-full border-4 transition-all ${hairColor === color ? "border-blue-500 scale-110" : "border-transparent hover:border-white/20"}`}
                style={{ backgroundColor: `#${color}` }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-400 mb-3 block">
            Kaşlar
          </label>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {eyebrows.map((e) => (
              <button
                key={e}
                onClick={() => setEyebrow(e)}
                className={`shrink-0 px-4 py-2 rounded-xl border-2 transition-all ${eyebrow === e ? "border-blue-500 bg-blue-500/10 text-white" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30"}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-400 mb-3 block">
            Gözler
          </label>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {eyes.map((e) => (
              <button
                key={e}
                onClick={() => setEye(e)}
                className={`shrink-0 px-4 py-2 rounded-xl border-2 transition-all ${eye === e ? "border-blue-500 bg-blue-500/10 text-white" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30"}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-400 mb-3 block">
            Ağız
          </label>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {mouths.map((m) => (
              <button
                key={m}
                onClick={() => setMouth(m)}
                className={`shrink-0 px-4 py-2 rounded-xl border-2 transition-all ${mouth === m ? "border-blue-500 bg-blue-500/10 text-white" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30"}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {gender === "male" && (
          <div>
            <label className="text-sm font-bold text-slate-400 mb-3 block">
              Sakal / Bıyık
            </label>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {facialHairs.map((fh) => (
                <button
                  key={fh}
                  onClick={() => setFacialHair(fh)}
                  className={`shrink-0 px-4 py-2 rounded-xl border-2 transition-all ${facialHair === fh ? "border-blue-500 bg-blue-500/10 text-white" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30"}`}
                >
                  {fh === "none" ? "Yok" : fh.replace(/([A-Z])/g, " $1").trim()}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0f172a] via-[#0f172a] to-transparent max-w-md mx-auto">
        <button
          onClick={handleSave}
          className="w-full bg-blue-500 hover:bg-blue-500/90 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25"
        >
          <Check size={20} />
          Kaydet ve Kullan
        </button>
      </div>
    </div>
  );
}
