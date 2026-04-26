import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { getSupabaseClient } from "../lib/supabase";

import { Step, OnboardingData, Reward, NotificationSettings } from "../quitfast/types";
import { PROGRAM_DAYS } from "../quitfast/constants";

import Dashboard from "../quitfast/components/Dashboard";
import BlogPage from "../quitfast/components/BlogPage";
import ProfilePage from "../quitfast/components/ProfilePage";
import ProgramPage from "../quitfast/components/ProgramPage";
import CrisisPage from "../quitfast/components/CrisisPage";
import RankingPage from "../quitfast/components/RankingPage";
import BadgesPage from "../quitfast/components/BadgesPage";
import SettingsPage from "../quitfast/components/SettingsPage";
import HabitEditPage from "../quitfast/components/HabitEditPage";
import AccountInfoPage from "../quitfast/components/AccountInfoPage";
import NotificationsPage from "../quitfast/components/NotificationsPage";
import LegalPage from "../quitfast/components/LegalPage";
import AudioPlayerPrototype from "../quitfast/components/AudioPlayerPrototype";
import GoalsPage from "../quitfast/components/GoalsPage";
import PremiumPage from "../quitfast/components/PremiumPage";
import { MoodSelection, MoodReportPage } from "../quitfast/components/MoodPages";
import { AvatarCustomizer } from "../quitfast/components/AvatarCustomizer";
import {
  CharacterSelectionPage,
  RewardsPage,
  AddRewardPage,
  EditRewardsPage,
} from "../quitfast/components/RewardPages";
import CrisisGame from "../quitfast/components/CrisisGame";

const DEFAULT_ONBOARDING: OnboardingData = {
  age: 25,
  dailyCigarettes: 20,
  packsPerDay: 1,
  cigarettesPerPack: 20,
  pricePerPack: 60,
};

export default function Home() {
  const [, setLocation] = useLocation();
  const supabase = getSupabaseClient();

  const [step, setStep] = useState<Step>("dashboard");
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [onboardingData, setOnboardingData] = useState<OnboardingData>(DEFAULT_ONBOARDING);
  const [userAvatar, setUserAvatar] = useState(
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4,c0aede&radius=50",
  );
  const [userName, setUserName] = useState("Kullanıcı");

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [moodHistory, setMoodHistory] = useState<{ day: number; emoji: string; entry?: string }[]>([]);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [userXp, setUserXp] = useState(0);
  const [readBlogs, setReadBlogs] = useState<number[]>([]);
  const [listenedBlogs, setListenedBlogs] = useState<number[]>([]);
  const [crisisCount, setCrisisCount] = useState(0);
  const [claimedBadges, setClaimedBadges] = useState<string[]>([]);
  const [claimedGoals, setClaimedGoals] = useState<number[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [dashboardScrollPos, setDashboardScrollPos] = useState(0);
  const [stepHistory, setStepHistory] = useState<Step[]>(["dashboard"]);
  const [premiumReturnStep, setPremiumReturnStep] = useState<Step>("dashboard");
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    dailyCheck: true,
    programNotifs: true,
    goalNotifs: true,
    updateNotifs: true,
    dailyTime: "20:00",
    programTime: "09:00",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const fetchUserData = async (userId: string) => {
    try {
      const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
      if (data) {
        if (data.onboarding_data) setOnboardingData(data.onboarding_data);
        if (data.avatar_url) setUserAvatar(data.avatar_url);
        if (data.start_date) {
          const d = new Date(data.start_date);
          if (!isNaN(d.getTime())) setStartDate(d);
        }
        if (data.xp !== undefined) setUserXp(data.xp);
        if (data.read_blogs) setReadBlogs(data.read_blogs);
        if (data.listened_blogs) setListenedBlogs(data.listened_blogs);
        if (data.completed_days) setCompletedDays(data.completed_days);
        if (data.claimed_badges) setClaimedBadges(data.claimed_badges);
        if (data.claimed_goals) setClaimedGoals(data.claimed_goals);
        if (data.mood_history) setMoodHistory(data.mood_history);
        if (data.rewards) setRewards(data.rewards);
        if (data.crisis_count !== undefined) setCrisisCount(data.crisis_count);
        if (data.notification_settings) setNotificationSettings(data.notification_settings);
      }
    } catch {
      // profiles table may not exist; use defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!s?.user) {
        setLocation("/login");
        return;
      }
      setSession(s);
      setUserName(s.user.user_metadata?.full_name || s.user.email?.split("@")[0] || "Kullanıcı");
      if (s.user.user_metadata?.avatar_url) setUserAvatar(s.user.user_metadata.avatar_url);
      fetchUserData(s.user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, ns) => {
      if (!ns?.user) {
        setLocation("/login");
      }
    });
    return () => listener.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCurrentDay = () => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  };
  const currentDay = getCurrentDay();

  const handleMoodSelect = (mood: { emoji: string; label: string }) => {
    const isFirstToday = !moodHistory.some((h) => h.day === currentDay);
    setMoodHistory((prev) => {
      const existing = prev.find((h) => h.day === currentDay);
      if (existing) return prev.map((h) => (h.day === currentDay ? { ...h, emoji: mood.emoji } : h));
      return [...prev, { day: currentDay, emoji: mood.emoji }];
    });
    if (isFirstToday) setUserXp((prev) => prev + 20);
    setStep("dashboard");
  };

  const handleCompleteDay = (day: number, xp: number) => {
    if (!completedDays.includes(day)) {
      setCompletedDays((prev) => [...prev, day]);
      setUserXp((prev) => prev + xp);
    }
  };

  const handleAddReward = (reward: Omit<Reward, "id" | "currentAmount">) => {
    setRewards((prev) => [
      ...prev,
      { ...reward, id: Math.random().toString(36).slice(2, 11), currentAmount: 0, isCompleted: false },
    ]);
  };

  const handleDeleteReward = (id: string) => setRewards((prev) => prev.filter((r) => r.id !== id));

  const handleClaimGoalXp = (goalId: number, xp: number) => {
    if (!claimedGoals.includes(goalId)) {
      setClaimedGoals((prev) => [...prev, goalId]);
      setUserXp((prev) => prev + xp);
    }
  };

  const handleNavigate = (newStep: Step) => {
    if (step === "dashboard") {
      setDashboardScrollPos(window.scrollY);
    }

    if (newStep === "premium") {
      setPremiumReturnStep(step);
    }

    if (newStep === "auth") {
      supabase.auth.signOut().finally(() => setLocation("/login"));
      return;
    }

    if (newStep === "onboarding") {
      setLocation("/onboarding");
      return;
    }

    // Geri gitme mantığı (Özel durum: 'back' adında bir step gelirse geçmişten al)
    if ((newStep as string) === "back") {
      if (stepHistory.length > 1) {
        const newHistory = [...stepHistory];
        newHistory.pop(); // Mevcut sayfayı çıkar
        const prevStep = newHistory[newHistory.length - 1];
        setStepHistory(newHistory);
        setStep(prevStep);
      } else {
        setStep("dashboard");
        setStepHistory(["dashboard"]);
      }
      return;
    }

    // Yeni sayfaya gitme
    setStepHistory(prev => [...prev, newStep]);
    setStep(newStep);
  };

  const handleResetData = async () => {
    setOnboardingData(DEFAULT_ONBOARDING);
    setStartDate(new Date());
    setMoodHistory([]);
    setCompletedDays([]);
    setUserXp(0);
    setReadBlogs([]);
    setListenedBlogs([]);
    setCrisisCount(0);
    setClaimedBadges([]);
    setClaimedGoals([]);
    setRewards([]);
  };

  const handleDeleteAccount = async () => {
    await supabase.auth.signOut();
    setLocation("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold animate-pulse">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  switch (step) {
    case "dashboard":
      return (
        <Dashboard
          onNavigate={handleNavigate}
          moodHistory={moodHistory}
          currentDay={currentDay}
          startDate={startDate}
          userAvatar={userAvatar}
          completedDays={completedDays}
          onboardingData={onboardingData}
          crisisCount={crisisCount}
          rewards={rewards}
          isPremium={isPremium}
          scrollPos={dashboardScrollPos}
        />
      );
    case "blogs":
      return (
        <BlogPage
          onNavigate={handleNavigate}
          userAvatar={userAvatar}
          setUserXp={setUserXp}
          readBlogs={readBlogs}
          setReadBlogs={setReadBlogs}
          listenedBlogs={listenedBlogs}
          setListenedBlogs={setListenedBlogs}
          isPremium={isPremium}
        />
      );
    case "profile":
      return (
        <ProfilePage
          onNavigate={handleNavigate}
          userAvatar={userAvatar}
          currentDay={currentDay}
          userName={userName}
          userXp={userXp}
          onboardingData={onboardingData}
          completedDays={completedDays}
          startDate={startDate}
          claimedBadges={claimedBadges}
        />
      );
    case "program":
      return (
        <ProgramPage
          onNavigate={handleNavigate}
          currentDay={currentDay}
          completedDays={completedDays}
          programDays={PROGRAM_DAYS}
          onCompleteDay={handleCompleteDay}
          userXp={userXp}
          claimedBadges={claimedBadges}
          onClaimBadge={(badgeId: string) => setClaimedBadges((prev) => [...prev, badgeId])}
          isPremium={isPremium}
        />
      );
    case "crisis":
      return (
        <CrisisPage
          onNavigate={handleNavigate}
          crisisCount={crisisCount}
          setCrisisCount={setCrisisCount}
          isPremium={isPremium}
        />
      );
    case "puzzle":
      return (
        <CrisisGame onClose={() => handleNavigate("dashboard")} onAddXp={(xp: number) => setUserXp((prev) => prev + xp)} />
      );
    case "ranking":
      return (
        <RankingPage
          onNavigate={handleNavigate}
          userAvatar={userAvatar}
          userName={userName}
          currentDay={currentDay}
          completedDays={completedDays}
          userXp={userXp}
        />
      );
    case "badges":
      return <BadgesPage onNavigate={handleNavigate} claimedBadges={claimedBadges} />;
    case "settings":
      return <SettingsPage onNavigate={handleNavigate} onResetData={handleResetData} />;
    case "habit_edit":
      return (
        <HabitEditPage
          onNavigate={handleNavigate}
          onboardingData={onboardingData}
          setOnboardingData={setOnboardingData}
          startDate={startDate}
          setStartDate={setStartDate}
        />
      );
    case "account_info":
      return (
        <AccountInfoPage
          onNavigate={handleNavigate}
          userName={userName}
          setUserName={setUserName}
          onboardingData={onboardingData}
          userEmail={session?.user?.email || ""}
          onDeleteAccount={handleDeleteAccount}
        />
      );
    case "notifications":
      return (
        <NotificationsPage onNavigate={handleNavigate} settings={notificationSettings} onUpdateSettings={setNotificationSettings} />
      );
    case "legal":
      return <LegalPage onNavigate={handleNavigate} />;
    case "premium":
      return <PremiumPage onNavigate={handleNavigate} setIsPremium={setIsPremium} returnStep={premiumReturnStep} />;
    case "audio_prototype":
      return <AudioPlayerPrototype onNavigate={handleNavigate} />;
    case "goals":
      return (
        <GoalsPage
          onNavigate={handleNavigate}
          startDate={startDate}
          userXp={userXp}
          category="nicotine"
          claimedGoals={claimedGoals}
          onClaimGoalXp={handleClaimGoalXp}
          claimedBadges={claimedBadges}
          onClaimBadge={(badgeId: string) => setClaimedBadges((prev) => [...prev, badgeId])}
        />
      );
    case "health_goals":
      return (
        <GoalsPage
          onNavigate={handleNavigate}
          startDate={startDate}
          userXp={userXp}
          category="health"
          claimedGoals={claimedGoals}
          onClaimGoalXp={handleClaimGoalXp}
          claimedBadges={claimedBadges}
          onClaimBadge={(badgeId: string) => setClaimedBadges((prev) => [...prev, badgeId])}
        />
      );
    case "mood_selection":
      return <MoodSelection onNavigate={handleNavigate} onSelect={handleMoodSelect} />;
    case "mood_report":
      return <MoodReportPage onNavigate={handleNavigate} moodHistory={moodHistory} currentDay={currentDay} />;
    case "character_selection":
      return (
        <CharacterSelectionPage
          onNavigate={handleNavigate}
          onSelect={(avatar: string) => {
            setUserAvatar(avatar);
            handleNavigate("profile");
          }}
        />
      );
    case "avatar_customizer":
      return (
        <AvatarCustomizer
          onNavigate={handleNavigate}
          onSelect={(avatar: string) => {
            setUserAvatar(avatar);
            handleNavigate("profile");
          }}
        />
      );
    case "rewards": {
      const diffSec = Math.floor((Date.now() - startDate.getTime()) / 1000);
      const costPerCigarette = onboardingData.pricePerPack / onboardingData.cigarettesPerPack;
      const dailyCost = onboardingData.dailyCigarettes * costPerCigarette;
      const savedMoney = (diffSec * dailyCost) / 86400;
      const savedCigarettes = (diffSec * onboardingData.dailyCigarettes) / 86400;
      return (
        <RewardsPage
          onNavigate={handleNavigate}
          savedMoney={Math.floor(savedMoney)}
          savedCigarettes={Math.floor(savedCigarettes)}
          claimedGoals={claimedGoals}
          onClaimGoalXp={handleClaimGoalXp}
          claimedBadges={claimedBadges}
          onClaimBadge={(badgeId: string) => setClaimedBadges((prev) => [...prev, badgeId])}
        />
      );
    }
    case "add_reward":
      return <AddRewardPage onNavigate={handleNavigate} onAdd={handleAddReward} />;
    case "edit_rewards":
      return (
        <EditRewardsPage
          onNavigate={handleNavigate}
          rewards={rewards}
          onDelete={handleDeleteReward}
          onboardingData={onboardingData}
          startDate={startDate}
          onGoalComplete={() => {}}
        />
      );
    default:
      return (
        <Dashboard
          onNavigate={handleNavigate}
          moodHistory={moodHistory}
          currentDay={currentDay}
          startDate={startDate}
          userAvatar={userAvatar}
          completedDays={completedDays}
          onboardingData={onboardingData}
          crisisCount={crisisCount}
          rewards={rewards}
          isPremium={isPremium}
        />
      );
  }
}
