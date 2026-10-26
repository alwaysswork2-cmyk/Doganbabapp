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
  isPremium: boolean;
}

interface RankingUser {
  name: string;
  day: number;
  xp: number;
  avatar: string;
  rank: number;
  isUser?: boolean;
  isPremium?: boolean;
}

export default function RankingPage({ onNavigate, userAvatar, userName, currentDay, completedDays, userXp, isPremium }: RankingPageProps) {
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
      { name: userName || "Siz", day: currentDay, xp: displayedUserXp, avatar: userAvatar, isUser: true, isPremium },
      { name: "Ahmet", day: 12, xp: 200, avatar: "https://picsum.photos/seed/1/200", isPremium: true },
      { name: "Mehmet", day: 15, xp: 200, avatar: "https://picsum.photos/seed/2/200", isPremium: true },
      { name: "Ayşe", day: 12, xp: 200, avatar: "https://picsum.photos/seed/3/200", isPremium: true },
      { name: "Fatma", day: 12, xp: 200, avatar: "https://picsum.photos/seed/4/200", isPremium: true },
      { name: "Can", day: 14, xp: 210, avatar: "https://picsum.photos/seed/5/200", isPremium: true },
      { name: "Elif", day: 18, xp: 220, avatar: "https://picsum.photos/seed/6/200", isPremium: true },
      { name: "Burak", day: 20, xp: 230, avatar: "https://picsum.photos/seed/7/200", isPremium: true },
      { name: "Selin", day: 22, xp: 240, avatar: "https://picsum.photos/seed/8/200", isPremium: true },
      { name: "Mert", day: 25, xp: 250, avatar: "https://picsum.photos/seed/9/200", isPremium: true },
      { name: "Deniz", day: 30, xp: 260, avatar: "https://picsum.photos/seed/10/200", isPremium: true }
    ];
  }, [userName, userAvatar, userXp, currentDay, activeTab, isPremium]);

  const premiumUsers = React.useMemo(() => {
    return allUsers.filter((user) => user.isPremium);
  }, [allUsers]);

  // Sort logic: Primary XP (desc), Secondary Days (desc)
  const displayRankings = React.useMemo(() => {
    const sorted = [...premiumUsers].sort((a, b) => {
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
  }, [premiumUsers]);

  const formatXP = (xp: number) => {
    return xp >= 1000 ? (xp / 1000).toFixed(1) + 'K' : xp.toString();
  };

  if (!isPremium) {
    return (
      <div className="ranking-page min-h-screen relative pb-24">
        <style>{`
          .ranking-page {
            --bg: #0B0F18;
            --surface: #111827;
            --card: #131D2E;
            --border: #1D2D45;
            --blue: #1A6EF7;
            --tp: #E8F0FF;
            --ts: #6B7D9A;
            background: var(--bg);
            color: var(--tp);
            max-width: 480px;
            margin: 0 auto;
            font-family: 'Outfit', sans-serif;
          }
          .locked-wrap {
            min-height: calc(100vh - 88px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
          }
          .locked-card {
            width: 100%;
            border-radius: 28px;
            background: linear-gradient(180deg, rgba(17,24,39,0.9), rgba(12,18,28,0.95));
            border: 1px solid rgba(26,110,247,0.25);
            box-shadow: 0 20px 60px rgba(0,0,0,0.35);
            padding: 28px 22px;
            text-align: center;
          }
          .lock-icon {
            width: 72px;
            height: 72px;
            border-radius: 24px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: rgba(26,110,247,0.12);
            color: var(--blue);
            margin-bottom: 18px;
          }
          .title {
            font-size: 24px;
            font-weight: 800;
            margin: 0 0 10px;
            color: #fff;
          }
          .subtitle {
            font-size: 14px;
            line-height: 1.65;
            color: var(--ts);
            margin: 0;
          }
          .cta {
            margin-top: 24px;
            width: 100%;
            border: none;
            border-radius: 16px;
            padding: 14px 20px;
            font-weight: 800;
            font-size: 14px;
            color: white;
            background: linear-gradient(135deg, #2563eb, #3b82f6);
            box-shadow: 0 12px 24px rgba(37,99,235,0.35);
          }
        `}</style>

        <header className="sticky top-0 bg-[#0f172a]/80 backdrop-blur-md z-50 border-b border-white/5">
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div className="size-10" />
            <div className="flex flex-col items-center gap-1">
              <h1 className="text-xl font-bold tracking-tight text-white font-sans">Sıralama</h1>
            </div>
            <div className="size-10" />
          </div>
        </header>

        <div className="locked-wrap">
          <div className="locked-card">
            <div className="lock-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 1 1 8 0v4" />
              </svg>
            </div>
            <h2 className="title">Premium üyeler görünür</h2>
            <p className="subtitle">
              Liderlik tablosu sadece premium üyeler için açıktır. Üyelik planınızı açarak rekabetin içine katılabilirsiniz.
            </p>
            <button
              onClick={() => onNavigate('premium')}
              className="cta"
            >
              Premium Ol
            </button>
          </div>
        </div>

        <BottomNav onNavigate={onNavigate} activeStep="ranking" />
      </div>
    );
  }

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

          --tp:  #E8F0FF;
          --ts:  #6B7D9A;
          --tm:  #344766;

          --teal-sq: #0C3828;
          --blue-sq: #0A1E3A;
          --amber-sq:#2E1D00;
          --purple-sq:#1E0A3C;

          background: var(--bg);
          font-family: 'Outfit', sans-serif;
          color: var(--tp);
          max-width: 480px;
          margin: 0 auto;
        }

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

        .crown { margin-bottom: -10px; z-index: 2; animation: bob 2s ease-in-out infinite alternate; }
        .p2 .crown { animation-delay: .3s; }
        .p3 .crown { animation-delay: .6s; }
        .c-gold { color: var(--gold); filter: drop-shadow(0 0 8px var(--gold-bg)); }
        .c-silver { color: #A0B2C6; filter: drop-shadow(0 0 8px rgba(160,178,198,.2)); }
        .c-bronze { color: #CD7F32; filter: drop-shadow(0 0 8px rgba(205,127,50,.2)); }

        .ava-wrap { position: relative; }
        .ava {
          border-radius: 50%; object-fit: cover;
          background: var(--card);
        }
        .p1 .ava { width: 64px; height: 64px; border: 3px solid var(--gold); box-shadow: 0 0 20px var(--gold-bg); }
        .p2 .ava { width: 52px; height: 52px; border: 3px solid #A0B2C6; }
        .p3 .ava { width: 52px; height: 52px; border: 3px solid #CD7F32; }

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

        .p-name { font-size: 12px; font-weight: 700; color: var(--tp); margin-top: 10px; }
        .p1 .p-name { font-size: 14px; color: var(--gold); }
        .p-xp { font-size: 11px; font-weight: 600; color: var(--ts); margin-top: 2px; }

        .pedestal {
          width: 100%; border-top-left-radius: 12px; border-top-right-radius: 12px;
          margin-top: 10px;
          background: linear-gradient(180deg, var(--card) 0%, rgba(19,29,46,0) 100%);
          border: 1px solid var(--border); border-bottom: none;
        }
        .ped-1 { height: 50px; border-color: var(--gold-d); background: linear-gradient(180deg, rgba(245,197,24,.1) 0%, rgba(245,197,24,0) 100%); }
        .ped-2 { height: 30px; }
        .ped-3 { height: 20px; }

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

        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes bob {
          0% { transform: translateY(0); }
          100% { transform: translateY(-6px); }
        }
      `}</style>

      <header className="sticky top-0 bg-[#0f172a]/80 backdrop-blur-md z-50 border-b border-white/5">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="size-10"></div>

          <div className="flex flex-col items-center gap-1">
            <h1 className="text-xl font-bold tracking-tight text-white font-sans">Sıralama</h1>
            <div className="flex items-center gap-1.5">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-blue-500/60" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400/70">Liderlik Tablosu</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-blue-500/60" />
            </div>
          </div>

          <div className="size-10" />
        </div>
      </header>
      
      <div className="tabs">
        <div className={`tab ${activeTab === 'haftalik' ? 'on' : 'off'}`} onClick={() => setActiveTab('haftalik')}>Haftalık</div>
        <div className={`tab ${activeTab === 'aylik' ? 'on' : 'off'}`} onClick={() => setActiveTab('aylik')}>Aylık</div>
        <div className={`tab ${activeTab === 'tum' ? 'on' : 'off'}`} onClick={() => setActiveTab('tum')}>Tüm Zamanlar</div>
      </div>

      <div className="podium">
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
