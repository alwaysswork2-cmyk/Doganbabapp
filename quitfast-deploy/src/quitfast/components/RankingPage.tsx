import React, { useState } from 'react';
import { ChevronLeft, Crown } from 'lucide-react';
import { Step } from '../types';
import BottomNav from './BottomNav';

interface RankingPageProps {
  onNavigate: (step: Step) => void;
  userAvatar: string;
  userName: string;
  currentDay: number;
  completedDays: number[];
  userXp: number;
}

interface RankingUser {
  name: string;
  day: number;
  xp: number;
  avatar: string;
  rank: number;
  isUser?: boolean;
}

export default function RankingPage({ onNavigate, userAvatar, userName, currentDay, completedDays, userXp }: RankingPageProps) {
  const [activeTab, setActiveTab] = useState<'haftalik' | 'aylik' | 'tum'>('haftalik');

  // Combine real user with mock users
  const allUsers = React.useMemo(() => {
    // Sadece kullanıcının XP'sini sekmelere göre hesapla
    let displayedUserXp = userXp;
    if (activeTab === 'haftalik') {
      displayedUserXp = Math.round(userXp * (Math.min(currentDay, 7) / Math.max(currentDay, 1)));
    } else if (activeTab === 'aylik') {
      displayedUserXp = Math.round(userXp * (Math.min(currentDay, 30) / Math.max(currentDay, 1)));
    }

    return [
      { name: userName || "Siz", day: currentDay, xp: displayedUserXp, avatar: userAvatar, isUser: true },
      { name: "Ahmet", day: 12, xp: 200, avatar: "https://picsum.photos/seed/1/200" },
      { name: "Mehmet", day: 15, xp: 200, avatar: "https://picsum.photos/seed/2/200" },
      { name: "Ayşe", day: 12, xp: 200, avatar: "https://picsum.photos/seed/3/200" },
      { name: "Fatma", day: 12, xp: 200, avatar: "https://picsum.photos/seed/4/200" },
      { name: "Can", day: 14, xp: 210, avatar: "https://picsum.photos/seed/5/200" },
      { name: "Elif", day: 18, xp: 220, avatar: "https://picsum.photos/seed/6/200" },
      { name: "Burak", day: 20, xp: 230, avatar: "https://picsum.photos/seed/7/200" },
      { name: "Selin", day: 22, xp: 240, avatar: "https://picsum.photos/seed/8/200" },
      { name: "Mert", day: 25, xp: 250, avatar: "https://picsum.photos/seed/9/200" },
      { name: "Deniz", day: 30, xp: 260, avatar: "https://picsum.photos/seed/10/200" }
    ];
  }, [userName, userAvatar, userXp, currentDay, activeTab]);

  // Sort logic: Primary XP (desc), Secondary Days (desc)
  const displayRankings = React.useMemo(() => {
    const sorted = [...allUsers].sort((a, b) => {
      if (b.xp !== a.xp) {
        return b.xp - a.xp;
      }
      return b.day - a.day;
    });

    // Assign ranks with tie-breaking logic
    let currentRank = 1;
    return sorted.map((user, index) => {
      if (index > 0) {
        const prevUser = sorted[index - 1];
        if (user.xp !== prevUser.xp || user.day !== prevUser.day) {
          currentRank = index + 1;
        }
      }
      return { ...user, rank: currentRank };
    });
  }, [allUsers]);

  const formatXP = (xp: number) => {
    return xp >= 1000 ? (xp / 1000).toFixed(1) + 'K' : xp.toString();
  };

  return (
    <div className="ranking-page min-h-screen relative pb-24">
      <style>{`
        .ranking-page {
          --bg:      #0B0F18;
          --surface: #111827;
          --card:    #131D2E;
          --card2:   #162035;
          --border:  #1D2D45;
          --border2: #243450;

          --gold:    #F5C518;
          --gold2:   #FADA6A;
          --gold-bg: rgba(245,197,24,.12);
          --gold-d:  #5C4300;

          --blue:    #1A6EF7;
          --blue2:   #4A90F8;
          --blue-bg: rgba(26,110,247,.15);

          --cyan:    #3DB8FF;
          --cyan2:   #7DCFFF;

          --red:     #E32020;
          --red2:    #FF4040;

          --tp:  #E8F0FF;
          --ts:  #6B7D9A;
          --tm:  #344766;

          --teal-sq: #0C3828;
          --blue-sq: #0A1E3A;
          --amber-sq:#2E1D00;
          --purple-sq:#1E0A3C;
          --red-sq:  #2E0A0A;

          background: var(--bg);
          font-family: 'Outfit', sans-serif;
          color: var(--tp);
          max-width: 480px;
          margin: 0 auto;
        }

        /* ── HEADER ─────────────────────────────── */
        .hdr {
          display:flex; justify-content:space-between; align-items:center;
          padding: 24px 24px 16px;
          background: linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%);
          position: relative; z-index: 10;
        }
        .back-btn {
          width: 40px; height: 40px; border-radius: 12px;
          background: var(--card); border: 1px solid var(--border);
          display:flex; justify-content:center; align-items:center;
          color: var(--tp); cursor:pointer; transition: .2s;
        }
        .back-btn:active { transform:scale(.92); background:var(--card2); }
        .title {
          font-size: 20px; font-weight: 900; letter-spacing: 3px;
          background: linear-gradient(90deg, #3DB8FF 0%, #4A90F8 50%, #1A6EF7 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 10px rgba(61,184,255,0.35));
        }
        .title-wrap {
          display: flex; align-items: center; justify-content: center; gap: 0;
          background: linear-gradient(135deg, rgba(61,184,255,0.08), rgba(26,110,247,0.06));
          border: 1px solid rgba(61,184,255,0.2);
          border-radius: 14px;
          padding: 7px 20px;
          position: relative;
          overflow: hidden;
        }
        .title-wrap::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 20%, rgba(61,184,255,0.07) 50%, transparent 80%);
          background-size: 200% 100%;
          animation: titleShimmer 3s ease-in-out infinite;
        }
        @keyframes titleShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── TABS ───────────────────────────────── */
        .tabs {
          display:flex; gap: 8px; padding: 0 24px 16px;
        }
        .tab {
          flex:1; text-align:center; padding: 10px 0;
          font-size: 13px; font-weight: 600; border-radius: 10px;
          cursor:pointer; transition:.3s;
        }
        .tab.on { background: var(--blue); color: #fff; box-shadow: 0 4px 12px var(--blue-bg); }
        .tab.off { background: var(--card); color: var(--ts); border: 1px solid var(--border); }

        /* ── PODIUM ─────────────────────────────── */
        .podium {
          display:flex; justify-content:center; align-items:flex-end;
          height: 180px; padding: 0 24px; gap: 12px;
          position: relative;
        }
        .pod-col {
          display:flex; flex-direction:column; align-items:center;
          position: relative; animation: slideUp .4s cubic-bezier(.2,1,.3,1) backwards;
        }
        .p1, .p2, .p3 { animation-delay: 0s; }

        /* Crowns */
        .crown { margin-bottom: -10px; z-index: 2; animation: bob 2s ease-in-out infinite alternate; }
        .p2 .crown { animation-delay: .3s; }
        .p3 .crown { animation-delay: .6s; }
        .c-gold { color: var(--gold); filter: drop-shadow(0 0 8px var(--gold-bg)); }
        .c-silver { color: #A0B2C6; filter: drop-shadow(0 0 8px rgba(160,178,198,.2)); }
        .c-bronze { color: #CD7F32; filter: drop-shadow(0 0 8px rgba(205,127,50,.2)); }

        /* Avatars */
        .ava-wrap { position: relative; }
        .ava {
          border-radius: 50%; object-fit: cover;
          background: var(--card);
        }
        .p1 .ava { width: 64px; height: 64px; border: 3px solid var(--gold); box-shadow: 0 0 20px var(--gold-bg); }
        .p2 .ava { width: 52px; height: 52px; border: 3px solid #A0B2C6; }
        .p3 .ava { width: 52px; height: 52px; border: 3px solid #CD7F32; }

        /* Rank Badges */
        .rank-badge {
          position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);
          width: 20px; height: 20px; border-radius: 50%;
          display:flex; justify-content:center; align-items:center;
          font-size: 10px; font-weight: 800; color: #000;
          border: 2px solid var(--bg);
        }
        .rb-gold { background: linear-gradient(135deg, var(--gold2), var(--gold)); }
        .rb-silver { background: linear-gradient(135deg, #D4E0ED, #A0B2C6); }
        .rb-bronze { background: linear-gradient(135deg, #F0A868, #CD7F32); }

        /* Info */
        .p-name { font-size: 12px; font-weight: 700; color: var(--tp); margin-top: 10px; }
        .p1 .p-name { font-size: 14px; color: var(--gold); }
        .p-xp { font-size: 11px; font-weight: 600; color: var(--ts); margin-top: 2px; }

        /* Pedestals */
        .pedestal {
          width: 100%; border-top-left-radius: 12px; border-top-right-radius: 12px;
          margin-top: 10px;
          background: linear-gradient(180deg, var(--card) 0%, rgba(19,29,46,0) 100%);
          border: 1px solid var(--border); border-bottom: none;
        }
        .ped-1 { height: 50px; border-color: var(--gold-d); background: linear-gradient(180deg, rgba(245,197,24,.1) 0%, rgba(245,197,24,0) 100%); }
        .ped-2 { height: 30px; }
        .ped-3 { height: 20px; }

        /* ── LIST SECTION ───────────────────────── */
        .list-section {
          padding: 24px;
          display:flex; flex-direction:column; gap: 12px;
        }

        .urow {
          display:flex; align-items:center; padding: 16px;
          background: var(--card); border: 1px solid var(--border);
          border-radius: 20px; transition: .2s;
          animation: slideUp .4s cubic-bezier(.2,1,.3,1) backwards;
        }
        .urow { animation-delay: 0s; }

        .urow:active { transform: scale(.98); background: var(--card2); }

        .u-rank {
          width: 24px; font-size: 15px; font-weight: 800; color: var(--tm);
          text-align: center; margin-right: 12px;
        }
        .u-ava {
          width: 48px; height: 48px; border-radius: 16px;
          object-fit: cover; background: var(--surface);
          margin-right: 16px;
        }
        .u-info { flex: 1; }
        .u-name { font-size: 15px; font-weight: 700; color: var(--tp); margin-bottom: 4px; }
        .u-badges { display:flex; gap: 6px; }
        .badge {
          padding: 2px 6px; border-radius: 6px; font-size: 10px; font-weight: 700;
        }
        .b-teal { background: var(--teal-sq); color: #2DD4BF; }
        .b-blue { background: var(--blue-sq); color: #60A5FA; }
        .b-amber{ background: var(--amber-sq); color: #FBBF24; }
        .b-purple{ background: var(--purple-sq); color: #C084FC; }

        .u-stats { text-align: right; }
        .u-xp { font-size: 14px; font-weight: 800; color: var(--cyan); margin-bottom: 2px; }
        .u-days { font-size: 12px; font-weight: 600; color: var(--ts); }

        /* Me Row */
        .me-row {
          background: linear-gradient(90deg, rgba(26,110,247,.1) 0%, var(--card) 100%);
          border-color: var(--blue);
          position: relative; overflow: hidden;
        }
        .me-row::before {
          content:''; position:absolute; left:0; top:0; bottom:0; width:4px;
          background: var(--blue);
        }
        .me-row .u-rank { color: var(--blue); }

        /* ── ANIMATIONS ─────────────────────────── */
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes bob {
          0% { transform: translateY(0); }
          100% { transform: translateY(-6px); }
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 bg-[#0f172a]/80 backdrop-blur-md z-50 border-b border-white/5">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="size-10"></div>

          <div className="flex flex-col items-center gap-1">
            <h1 className="text-xl font-bold tracking-tight text-white font-sans">
              Sıralama
            </h1>
            <div className="flex items-center gap-1.5">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-blue-500/60" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400/70">
                Liderlik Tablosu
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-blue-500/60" />
            </div>
          </div>

          <div className="size-10" />
        </div>
      </header>
      
      {/* Tabs */}
      <div className="tabs">
        <div className={`tab ${activeTab === 'haftalik' ? 'on' : 'off'}`} onClick={() => setActiveTab('haftalik')}>Haftalık</div>
        <div className={`tab ${activeTab === 'aylik' ? 'on' : 'off'}`} onClick={() => setActiveTab('aylik')}>Aylık</div>
        <div className={`tab ${activeTab === 'tum' ? 'on' : 'off'}`} onClick={() => setActiveTab('tum')}>Tüm Zamanlar</div>
      </div>

      {/* Podium */}
      <div className="podium">
        {/* Rank 2 */}
        {displayRankings.length >= 2 ? (
          <div className="pod-col p2">
            <div className="crown c-silver"><Crown size={24} fill="currentColor" /></div>
            <div className="ava-wrap">
              <img src={displayRankings[1].avatar} className="ava" alt={displayRankings[1].name} />
              <div className="rank-badge rb-silver">2</div>
            </div>
            <div className="p-name">{displayRankings[1].name}</div>
            <div className="p-xp">{formatXP(displayRankings[1].xp)} XP</div>
            <div className="pedestal ped-2"></div>
          </div>
        ) : <div className="pod-col p2" style={{ visibility: 'hidden' }}><div className="pedestal ped-2"></div></div>}
        
        {/* Rank 1 */}
        {displayRankings.length >= 1 && (
          <div className="pod-col p1">
            <div className="crown c-gold"><Crown size={32} fill="currentColor" /></div>
            <div className="ava-wrap">
              <img src={displayRankings[0].avatar} className="ava" alt={displayRankings[0].name} />
              <div className="rank-badge rb-gold">1</div>
            </div>
            <div className="p-name">{displayRankings[0].name}</div>
            <div className="p-xp">{formatXP(displayRankings[0].xp)} XP</div>
            <div className="pedestal ped-1"></div>
          </div>
        )}

        {/* Rank 3 */}
        {displayRankings.length >= 3 ? (
          <div className="pod-col p3">
            <div className="crown c-bronze"><Crown size={24} fill="currentColor" /></div>
            <div className="ava-wrap">
              <img src={displayRankings[2].avatar} className="ava" alt={displayRankings[2].name} />
              <div className="rank-badge rb-bronze">3</div>
            </div>
            <div className="p-name">{displayRankings[2].name}</div>
            <div className="p-xp">{formatXP(displayRankings[2].xp)} XP</div>
            <div className="pedestal ped-3"></div>
          </div>
        ) : <div className="pod-col p3" style={{ visibility: 'hidden' }}><div className="pedestal ped-3"></div></div>}
      </div>

      {/* List Section */}
      <div className="list-section">
        {displayRankings.slice(3).map((user, idx) => (
          <div key={`${user.name}-${idx}`} className={`urow ${user.isUser ? 'me-row' : ''}`}>
            <div className="u-rank">{user.rank}</div>
            <img src={user.avatar} className="u-ava" alt={user.name} />
            <div className="u-info">
              <div className="u-name">{user.name}</div>
              <div className="u-badges">
                {user.day >= 30 && <div className="badge b-teal">30G</div>}
                {user.xp >= 10000 && <div className="badge b-blue">Pro</div>}
                {user.isUser && <div className="badge b-amber">Ateş</div>}
              </div>
            </div>
            <div className="u-stats">
              <div className="u-xp">{formatXP(user.xp)} XP</div>
              <div className="u-days">{user.day} Gün</div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav onNavigate={onNavigate} activeStep="ranking" />
    </div>
  );
}
