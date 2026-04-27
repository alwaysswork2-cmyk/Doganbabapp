import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Zap, 
  Lightbulb, 
  Brain, 
  CheckCircle2, 
  Timer, 
  Wind, 
  Users, 
  Smile, 
  Mic,
  BookOpen,
  ChevronLeft,
  Play,
  Pause,
  Loader2,
  SkipBack,
  SkipForward,
  Volume2,
  X,
  Trophy,
  Lock
} from 'lucide-react';
import { Step } from '../types';
import BottomNav from './BottomNav';
import { motion, AnimatePresence } from 'framer-motion';


const BlogCard = React.memo(({ blog, index, activeCategory, loadingId, playingId, onClick, onPlay }: any) => {
  return (
    <motion.div 
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
      onClick={() => activeCategory === 'Bloglar' ? onClick(blog, index) : onPlay(blog, index)}
      className={`relative overflow-hidden rounded-2xl border border-white/5 p-4 bg-gradient-to-br ${blog.color} group hover:border-blue-500/30 transition-all cursor-pointer`}
    >
      <div className="flex gap-4 items-center">
        <div className={`p-2.5 rounded-xl bg-[#0f172a]/50 ${blog.accent} shrink-0`}>
          {activeCategory === 'Sesli Bloglar' ? (
            loadingId === index ? (
              <Loader2 size={20} className="animate-spin" />
            ) : playingId === index ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" />
            )
          ) : (
            <blog.icon size={20} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-0.5">
            <h3 className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">{blog.title}</h3>
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full bg-[#0f172a]/50 uppercase tracking-widest ${blog.accent} shrink-0 ml-2`}>
              {blog.xp}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight line-clamp-1 mb-1">{blog.desc}</p>
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{blog.category}</span>
            <div className="flex items-center gap-1 text-blue-400 font-bold text-[10px]">
              {activeCategory === 'Sesli Bloglar' ? (playingId === index ? 'Durdur' : 'Dinle') : 'Oku'} <ChevronLeft size={12} className="rotate-180" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

interface BlogPageProps {
  onNavigate: (step: Step) => void;
  userAvatar: string;
  setUserXp: React.Dispatch<React.SetStateAction<number>>;
  readBlogs: number[];
  setReadBlogs: React.Dispatch<React.SetStateAction<number[]>>;
  listenedBlogs: number[];
  setListenedBlogs: React.Dispatch<React.SetStateAction<number[]>>;
  isPremium: boolean;
}

export default function BlogPage({ 
  onNavigate, 
  userAvatar, 
  setUserXp,
  readBlogs,
  setReadBlogs,
  listenedBlogs,
  setListenedBlogs,
  isPremium
}: BlogPageProps) {
  const [activeCategory, setActiveCategory] = useState('Bloglar');
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [selectedBlogIndex, setSelectedBlogIndex] = useState<number | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  
  // XP Awarding States
  const [secondsRead, setSecondsRead] = useState(0);
  const [showXpBadge, setShowXpBadge] = useState(false);
  const [lastXpAmount, setLastXpAmount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to top when blog is selected
  useEffect(() => {
    if (selectedBlog) {
      scrollRef.current?.scrollTo(0, 0);
      setSecondsRead(0);
    }
  }, [selectedBlog]);

  // Timer for reading (10 seconds background timer)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedBlog && selectedBlogIndex !== null && !readBlogs.includes(selectedBlogIndex)) {
      interval = setInterval(() => {
        setSecondsRead(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [selectedBlog, selectedBlogIndex, readBlogs]);

  // Check for XP conditions (10 seconds)
  useEffect(() => {
    if (
      selectedBlog && 
      selectedBlogIndex !== null && 
      !readBlogs.includes(selectedBlogIndex) && 
      !listenedBlogs.includes(selectedBlogIndex) &&
      secondsRead >= 10
    ) {
      const xpValue = parseInt(selectedBlog.xp.replace(/[^0-9]/g, '')) || 50;
      setUserXp(prev => prev + xpValue);
      setReadBlogs(prev => [...prev, selectedBlogIndex]);
      setLastXpAmount(xpValue);
      setShowXpBadge(true);
      setTimeout(() => setShowXpBadge(false), 3000);
    }
  }, [secondsRead, selectedBlog, selectedBlogIndex, readBlogs, setUserXp]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // No longer requiring scroll to bottom, but keeping the handler for potential future use or interaction tracking
  };

  const categories = [
    { name: 'Bloglar', icon: BookOpen, color: 'text-cyan-400' },
    { name: 'Sesli Bloglar', icon: Mic, color: 'text-cyan-400' },
  ];

  const blogs = [
    { 
      title: "Zihniyeti Değiştirmek - Allen Carr Tekniği", 
      category: "Motivation", 
      desc: "Sigara bırakmayı kolaylaştıran farklı bir yaklaşım: Allen Carr yöntemi.", 
      xp: "+50 XP", 
      icon: Brain, 
      color: "from-violet-500/20 to-indigo-500/20",
      accent: "text-violet-400",
      audioFileName: "Allen Carr Tekniği.mp3",
      content: `
Allen Carr Tekniği Nedir? Sigara Bırakmayı Kolaylaştıran Farklı Bir Yaklaşım

Sigarayı bırakmak isteyen çoğu insan aynı düşünceyle mücadele eder: “Bırakmak çok zor olacak.” Yıllardır birçok yöntem önerildi; nikotin bantları, sakızlar, irade gücü, azaltarak bırakma gibi. Ancak Allen Carr tekniği, sigara bırakma konusuna oldukça farklı bir açıdan yaklaşır.

Bu yöntemin temel fikri şudur:
Sigara bırakmak aslında zor değildir; zor olan şey sigaranın bize gerekli olduğuna inanmamızdır.

Sigara Gerçekten Ne Sağlıyor?

Sigara içen pek çok kişi sigaranın kendisini rahatlattığını, stresini azalttığını veya odaklanmasına yardımcı olduğunu düşünür. Ancak Allen Carr’a göre bu bir yanılsamadır.

Sigara aslında stres yaratır ve içildiğinde sadece nikotin yoksunluğunu kısa süreliğine giderir. Yani sigara sizi rahatlatmaz; yalnızca sigaranın oluşturduğu gerginliği kısa süreliğine ortadan kaldırır. Bu da bir döngü oluşturur:

1. Nikotin seviyesi düşer
2. Vücut huzursuzluk hisseder
3. Sigara içilir
4. Rahatlama hissi gelir

Bu rahatlama gerçek bir rahatlama değil, yalnızca yoksunluğun geçmesidir.

“Bir Şey Kaybetmiyorum” Düşüncesi

Allen Carr yönteminin en güçlü taraflarından biri, sigarayı bırakmayı bir kayıp gibi değil bir özgürlük gibi göstermesidir.

Çoğu insan sigarayı bırakırken şu korkulara sahiptir:

“Stresle nasıl baş edeceğim?”
“Keyif aldığım anlar eksik olacak mı?”
“Arkadaş ortamında zorlanır mıyım?”

Bu yönteme göre sigara aslında bu keyiflerin sebebi değil, tam tersine onların üzerine eklenen bir bağımlılıktır. Kahve içmek, sohbet etmek veya mola vermek zaten keyiflidir; sigara sadece buna eklenmiş bir alışkanlıktır.

İrade Gücüyle Savaşmak Yerine Zihni Değiştirmek

Birçok yöntem sigarayı bırakmayı bir irade savaşı olarak görür. Allen Carr yöntemi ise bunun tam tersini savunur.

Eğer sigaranın aslında size hiçbir fayda sağlamadığını gerçekten anlarsanız, bırakmak bir mücadele olmaktan çıkar. Çünkü insan kendisine zarar veren ve hiçbir şey kazandırmayan bir şeyi sürdürmek istemez.

Bu yüzden bu yöntem, sigarayı bırakmadan önce sigaraya dair düşünce kalıplarını değiştirmeye odaklanır.

Küçük Canavar – Büyük Canavar

Allen Carr bağımlılığı iki parçaya ayırır:

Küçük canavar: Vücudun nikotin ihtiyacı
Büyük canavar: Zihindeki alışkanlık ve inançlar

Nikotin yoksunluğu aslında çok kısa sürer ve düşündüğümüz kadar güçlü değildir. Zor olan kısım çoğu zaman zihinsel alışkanlıklardır. Sigaranın stres giderdiğine, rahatlatıcı olduğuna veya sosyal ortamlarda gerekli olduğuna inanmak bu döngüyü devam ettirir.

Sigara Bırakmak Bir Kurtuluş Olabilir

Allen Carr tekniğine göre sigarayı bırakmak bir fedakârlık değildir. Tam tersine, bağımlılıktan kurtulmak anlamına gelir.

Sigara bırakıldığında:

Sürekli nikotin ihtiyacı ortadan kalkar
Gün içinde sigara düşünme döngüsü biter
Enerji ve nefes kalitesi artar
Para ve zaman tasarrufu sağlanır

En önemlisi de kişi kendisini daha özgür hisseder.

Sonuç

Sigara bırakmak çoğu zaman düşündüğümüz kadar zor olmak zorunda değildir. Allen Carr yöntemi, sigarayı bırakmayı bir mücadele yerine bir farkındalık süreci olarak görür.

Sigaranın aslında hiçbir şey kazandırmadığını fark ettiğinizde, onu bırakmak bir kayıp değil bir rahatlama gibi hissettirebilir.

Belki de sigarayı bırakmanın ilk adımı, şu soruyu kendinize sormaktır:
Sigara bana gerçekten ne veriyor?
      `
    },
    { 
      title: "Kriz Anlarını Atlatmak", 
      category: "Tips", 
      desc: "Sigara isteğini bastırmada en etkili aktiviteler ve kriz anlarını yönetme stratejileri.", 
      xp: "+50 XP", 
      icon: Zap, 
      color: "from-emerald-500/20 to-teal-500/20",
      accent: "text-emerald-400",
      audioFileName: "kriz anı.mp3",
      content: `
Sigara bırakma sürecinde en zorlayıcı anlar genellikle aniden gelen sigara isteğidir. Bu krizler çoğu zaman 5–10 dakika sürer ve doğru bir şeyle meşgul olduğunuzda düşündüğünüzden çok daha kolay geçer. Önemli olan o kısa anı doğru şekilde yönetebilmektir.

İşte sigara isteğini bastırmada en etkili yöntemlerden bazıları:

1. Kısa bir yürüyüşe çıkmak

Sigara isteği geldiğinde bulunduğunuz ortamdan uzaklaşmak gerçekten çok işe yarar. 5–10 dakikalık kısa bir yürüyüş bile zihninizi dağıtır ve sigara düşüncesinin etkisini azaltır. Aynı zamanda hareket etmek stres hormonlarını düşürür ve kendinizi daha rahat hissetmenizi sağlar.

2. Derin nefes egzersizi yapmak

Sigara çoğu zaman sadece nikotin değil, aynı zamanda bir nefes alışkanlığıdır. Bu yüzden derin nefes egzersizleri oldukça etkilidir. Burnunuzdan yavaşça nefes alıp birkaç saniye tutun, ardından ağzınızdan yavaşça verin. Bunu birkaç dakika tekrarlamak hem zihninizi sakinleştirir hem de kriz anını daha kolay atlatmanıza yardımcı olur.

3. Bir şeyler çiğnemek veya yemek

Bazen sigara isteği tamamen ağız alışkanlığından kaynaklanır. Sakız çiğnemek, elma yemek ya da havuç gibi atıştırmalıklar tüketmek bu ihtiyacı karşılayabilir. Böylece hem ağzınız meşgul olur hem de sigarayı düşünmekten uzaklaşırsınız.

4. Soğuk su içmek

Bir bardak soğuk su içmek basit ama etkili bir yöntemdir. Suyu yavaş yavaş içmek hem zihninizi sakinleştirir hem de o kısa kriz süresini geçirmenize yardımcı olur.

5. Zihninizi meşgul edecek bir şey yapmak

Sigara isteği çoğu zaman can sıkıntısı ya da alışkanlıkla ortaya çıkar. Bu anlarda dikkatinizi başka bir şeye yönlendirmek çok işe yarar. Bir arkadaşınızı aramak, kısa bir video izlemek, küçük bir oyun oynamak ya da bir şeyler yazmak zihninizi farklı bir yöne çeker.

6. Ortam değiştirmek

Sigara içtiğiniz yerler ve rutinler isteği tetikleyebilir. Bu yüzden farklı bir odaya geçmek, dışarı çıkmak ya da ortam değiştirmek isteğin hızlı bir şekilde azalmasına yardımcı olabilir.

7. 10 dakika kuralını uygulamak

Sigara isteği geldiğinde kendinize şu sözü verin: “Şimdi içmeyeceğim, sadece 10 dakika bekleyeceğim.” Bu süre boyunca başka bir şeyle meşgul olduğunuzda isteğin bir dalga gibi gelip geçtiğini ve zamanla azaldığını fark edersiniz.

Unutmayın: Sigara isteği kalıcı değildir. Genellikle birkaç dakika içinde kendiliğinden azalır. Bu kısa süreyi doğru şekilde değerlendirmek, bırakma sürecindeki en büyük avantajınızdır. Her atlatılan krizle birlikte bağımlılık biraz daha zayıflar ve hedefinize bir adım daha yaklaşırsınız. 🚭
      `
    },
    { 
      title: "Bilişsel Davranışçı Terapi", 
      category: "Science", 
      desc: "Zihnini Özgürleştir, Sigarayı Bırak: Bilişsel Davranışçı Terapi (BDT) Rehberi.", 
      xp: "+50 XP", 
      icon: Brain, 
      color: "from-pink-500/20 to-rose-500/20",
      accent: "text-pink-400",
      audioFileName: "Bilişsel Davranışçı Terapi.mp3",
      content: `
Sigara bırakmak sadece fiziksel değil, aynı zamanda güçlü bir zihinsel alışkanlığı değiştirme sürecidir. Bu noktada en etkili ve bilimsel yöntemlerden biri BDT (Bilişsel Davranışçı Terapi)’dir.

BDT (Bilişsel Davranışçı Terapi) Nedir?

BDT, düşünceleriniz, duygularınız ve davranışlarınız arasındaki ilişkiyi ele alan bir terapi yöntemidir. Sigara kullanımında hem nikotin bağımlılığı hem de alışkanlıklar ve düşünce kalıpları birlikte rol oynar.

Örneğin:

“Sigara içmezsem rahatlayamam” düşüncesi, isteği artırabilir ve sigaraya yönlendirebilir.

BDT’nin amacı bu tür düşünceleri fark etmek ve daha gerçekçi şekilde değiştirmektir.

Sigara Bırakmada BDT Teknikleri

1. Tetikleyici Farkındalığı

Sigara içme isteğinin hangi durumlarda arttığını gözlemleyin:

Kahve içerken
Stresliyken
Sosyal ortamlarda

Amaç: Davranışı otomatik olmaktan çıkarıp farkındalık kazanmak.

2. Düşünceyi Yakalama ve Sorgulama

İstek geldiğinde kendinize sorun:

“Bu gerçekten fiziksel ihtiyaç mı yoksa alışkanlık mı?”
“Şu an sigara içmezsem ne olur?”

Amaç: Düşünceleri sorgulayarak isteğin gücünü azaltmak.

3. Alternatif Davranış Geliştirme

Sigaranın yerine koyabileceğiniz basit davranışlar:

Kısa yürüyüş
Sakız çiğneme
Su içme
Nefes egzersizi

Amaç: Beyne farklı başa çıkma yolları öğretmek.

4. Düşünceyi Yeniden Çerçeveleme

Eski düşünce:

“Sigara beni rahatlatıyor.”

Daha gerçekçi düşünce:

“Sigara aslında stresi azaltmaz; sadece nikotin yoksunluğunu kısa süreli giderdiği için rahatlatıyormuş gibi hissettirir.”
Amaç: Daha dengeli ve gerçekçi bakış açısı geliştirmek.

5. Kriz Yönetimi (10 Dakika Kuralı)

İstek geldiğinde:

10 dakika bekle
Bu sürede başka bir aktivite yap

Çoğu sigara isteği kısa süreli dalgalar halinde gelir ve zamanla azalır.

Özet

BDT, sigara bırakma sürecinde hem nikotin bağımlılığını hem de alışkanlık ve düşünce kalıplarını birlikte ele alarak, isteği daha iyi yönetmeni ve süreci daha sürdürülebilir hale getirmeni sağlar.
      `
    },
    { 
      title: "Sigara Tetikleyicileri", 
      category: "Tips", 
      desc: "Sigara bırakma sürecinde tetikleyicileri fark etmek ve değiştirme yöntemleri.", 
      xp: "+50 XP", 
      icon: Lightbulb, 
      color: "from-violet-500/20 to-indigo-500/20",
      accent: "text-violet-400",
      audioFileName: "Sigarq Tetikleyicileri .mp3",
      content: `
Sigarayı bırakmaya çalışırken çoğu kişi sadece nikotini bırakacağını düşünür. Ama işin gerçeği biraz farklıdır. Aslında bırakmaya çalıştığımız şey yalnızca bir madde değil, yıllardır hayatımıza yerleşmiş küçük alışkanlıklar zinciridir. Sabah kahvesiyle birlikte yakılan sigara, yemekten sonra balkona çıkmak ya da arkadaşlarla verilen o klasik sigara molası… Bunların hepsi zamanla beynimiz için birer tetikleyici haline gelir.

Bu yüzden sigarayı bırakırken en önemli konulardan biri, bu tetikleyicileri fark etmek ve mümkün olduğunca değiştirmektir. Süreci biraz daha kolaylaştırabilecek birkaç basit ama etkili yöntem var.

Sigarayı Hatırlatan Şeyleri Ortadan Kaldırın

Başlamak için en basit ama en etkili adım: sigarayı hatırlatan eşyaları hayatınızdan çıkarmak. Evde, arabada ya da iş yerinde duran sigara paketleri, çakmaklar, küllükler… Hepsi beyniniz için küçük birer hatırlatıcıdır. Bunları ortadan kaldırdığınızda, otomatik olarak sigara yakma alışkanlığını da biraz kırmış olursunuz.

Günlük Rutinleri Küçük Küçük Değiştirin

Sigara genellikle belirli anlarla bağlantılıdır. Örneğin sabah kahvesi içtiğiniz anda eliniz otomatik olarak sigaraya gidiyor olabilir. Böyle durumlarda rutini biraz değiştirmek işe yarayabilir. Bir süre kahve yerine çay içmek, kahveyi farklı bir yerde içmek ya da kahveden sonra kısa bir yürüyüş yapmak gibi küçük değişiklikler bile beynin alışkanlık döngüsünü kırmaya yardımcı olur.

El ve Ağız Alışkanlığı İçin Alternatif Bulun

Sigarayı bırakan birçok kişi ellerinin boş kalmasından rahatsız olduğunu söyler. Bu çok normaldir çünkü sigara aynı zamanda bir el alışkanlığıdır. Bu boşluğu doldurmak için yanınızda sakız, su, kuruyemiş gibi küçük şeyler bulundurabilirsiniz. Bazı insanlar kalemle oynamanın, tespih çekmenin ya da stres topu kullanmanın da işe yaradığını söylüyor.

Sigara Molasını Hareket Molasına Çevirin

İş yerinde verilen sigara molaları bazen bırakma sürecini zorlaştırabilir. Herkes dışarı çıkarken siz de çıkmak isteyebilirsiniz. Böyle anlarda farklı bir şey yapmak iyi bir seçenek olabilir. Kısa bir yürüyüş yapmak, biraz temiz hava almak ya da birkaç dakika nefes egzersizi yapmak hem dikkatinizi dağıtır hem de stresinizi azaltır.

Çevrenizden Destek İsteyin

Sigarayı bırakırken çevrenizin desteği gerçekten önemlidir. Arkadaşlarınıza ve ailenize sigarayı bıraktığınızı söyleyin. Hatta mümkünse yanınızda sigara içmemelerini rica edebilirsiniz. Ayrıca onlara Ne olursa olsun bana sigara vermeyin demek de bazen çok yardımcı olur.
      `
    },
    { 
      title: "Sigarayı Bıraktıktan Sonra Ne Olur", 
      category: "Health", 
      desc: "Sigarayı bırakığın an vücudunda başlayan onarım süreci ve zamanla yaşanan değişimler.", 
      xp: "+50 XP", 
      icon: Timer, 
      color: "from-blue-500/20 to-purple-500/20",
      accent: "text-cyan-400",
      audioFileName: "Sigarayı Bıraktıktan sonra vücudunda neler olur.mp3",
      content: `
Sigarayı Bıraktıktan Sonra Vücudunda Neler Olur?

Sigarayı bıraktığın an aslında vücudun kendini onarmaya başlar. Yıllardır maruz kaldığı nikotin ve zararlı maddeler yavaş yavaş temizlenirken, hem bedeninde hem de zihninde bazı değişimler yaşarsın. Bu süreç bazen zorlayıcı olabilir ama her geçen gün vücudun biraz daha toparlanır.

İlk Saatler: Vücut Dengeye Dönmeye Başlar
Sigarayı bıraktıktan yaklaşık 20 dakika sonra nabzın ve kan basıncın normale yaklaşmaya başlar. Birkaç saat içinde kandaki karbonmonoksit seviyesi düşer ve vücuduna giden oksijen miktarı artar. İlk günün sonunda vücudun daha temiz bir dolaşım sistemine doğru ilerlemeye başlamıştır.

İlk 2–3 Gün: Nikotin Vücuttan Çıkar
İlk birkaç gün genellikle en zor dönemdir. Çünkü nikotin büyük ölçüde vücuttan atılır. Bu sırada sinirlilik, huzursuzluk, sigara isteği ve odaklanma zorluğu yaşayabilirsin. Ama aynı zamanda tat ve koku alma duyuların da yavaş yavaş güçlenmeye başlar.

İlk Hafta: Temizlenme Süreci Başlar
Bir hafta içinde akciğerlerin kendini temizlemeye başlar. Solunum yollarındaki mukus ve birikmiş maddeler yavaş yavaş atılır. Bu yüzden bazı kişilerde öksürük görülebilir; aslında bu, akciğerlerin toparlanmaya başladığının bir işaretidir.

2–4 Hafta: Zor Kısım Geride Kalır
Yaklaşık 2–4 hafta sonra yoksunluk belirtileri büyük ölçüde azalır. Sigara isteği eskisi kadar güçlü gelmez ve krizler daha kısa sürer. Bu dönemde nefes almanın kolaylaştığını, enerjinin biraz arttığını fark edebilirsin.

1–2 Ay: Vücut Gücünü Geri Kazanır
Birinci ayı geçtikten sonra kan dolaşımın belirgin şekilde düzelir. Merdiven çıkarken ya da yürürken eskisi kadar çabuk yorulmazsın. Akciğerlerin daha verimli çalışmaya başlar ve fiziksel dayanıklılığın artar.

2–3 Ay: İstekler Büyük Ölçüde Azalır
Bu dönemde birçok kişi sigara isteğinin artık çok daha seyrek geldiğini söyler. Gelen istekler de genellikle birkaç dakika içinde geçer. Beyin artık sigarasız yaşam düzenine alışmaya başlamıştır.

3 Ay ve Sonrası: Yeni Bir Alışkanlık Oluşur
Birkaç ay sonra sigarasız yaşam daha doğal gelmeye başlar. Eskiden sigarayla ilişkilendirdiğin birçok an artık sigarasız şekilde devam eder. İstekler tamamen kaybolmasa bile çok daha zayıf ve kontrol edilebilir hale gelir.

Sigarayı bırakma süreci aslında bir alışkanlık değiştirme yolculuğudur. İlk haftalar biraz zor olabilir ama sabrettikçe hem vücudun hem zihnin yeni düzene uyum sağlar. Zaman geçtikçe sigara düşüncesi hayatında giderek daha küçük bir yer kaplar.
      `
    },
    { 
      title: "Sigarayı Azaltarak Bırakmak Mantıklı mı?", 
      category: "Science", 
      desc: "Sigara azaltarak bırakılır mı? Gerçekten işe yarar mı? Bilimsel araştırmalar ne söylüyor?", 
      xp: "+50 XP", 
      icon: Brain, 
      color: "from-cyan-500/20 to-blue-500/20",
      accent: "text-cyan-400",
      audioFileName: "sigara azaltarak bırakılır mı.mp3",
      content: `
Sigara Azaltarak Bırakılır mı? Gerçekten İşe Yarar mı?

Sigara bırakmak isteyen birçok kişinin aklına gelen ilk yöntem şudur: “Birden bırakmak zor, en iyisi yavaş yavaş azaltayım.”
Kulağa oldukça mantıklı geliyor. Sonuçta bir alışkanlığı bir anda kesmek yerine kademeli olarak azaltmak daha kolay gibi görünüyor.

Peki gerçekten öyle mi? Bilimsel araştırmalar ve sigara bırakma uzmanları bu konuda ne söylüyor?

Azaltarak Bırakmak Neden Mantıklı Görünüyor?

Azaltma yöntemi genellikle şöyle uygulanır:

Günde 20 sigara içen biri önce 15’e düşürür
Sonra 10’a
Sonra 5’e
En sonunda tamamen bırakmayı hedefler

Bu yöntem psikolojik olarak kişiye “kontrol bende” hissi verir. Sigara bir anda hayatınızdan çıkmadığı için stres daha az gibi hissedilebilir.

Ama işin biyolojik tarafı biraz farklıdır.

Nikotin Bağımlılığı Nasıl Çalışır?

Sigaranın bağımlılık yapmasının sebebi nikotin adlı maddedir. Nikotin beyinde dopamin salgılanmasına neden olur ve bu da kısa süreli bir rahatlama hissi yaratır.

Sorun şu:
Beyin nikotine alıştığında, her dozdan sonra yenisini istemeye başlar.

Bu yüzden sigara azaltıldığında çoğu kişi şu durumu yaşar:

Sigara sayısı azalır
Ama her sigara daha değerli hale gelir
Kişi sigarayı daha derin çekmeye başlar
Bazen sigarayı daha uzun içer

Yani nikotin bağımlılığı tamamen ortadan kalkmaz.

Araştırmalar Ne Söylüyor?

Birçok araştırma iki yöntemi karşılaştırmıştır:

1. Bir anda bırakma
2. Azaltarak bırakma

Sonuçlar oldukça ilginçtir. Çoğu çalışmada bir anda bırakmanın başarı oranı daha yüksek bulunmuştur.

Bunun nedeni şudur:

Nikotin tamamen kesildiğinde vücut yoksunluk sürecine girer
Bu süreç genellikle 1–3 hafta sürer
Sonrasında bağımlılık giderek zayıflar

Ama azaltarak bırakıldığında vücut nikotin almaya devam ettiği için bağımlılık döngüsü tam olarak kırılmaz.

Peki Azaltmak Hiç mi İşe Yaramaz?

Aslında bazı insanlar için işe yarayabilir. Özellikle şu kişilerde:

Çok uzun yıllardır yoğun içenler
Bir anda bırakmaya psikolojik olarak hazır olmayanlar
Nikotin bantı veya sakızı kullananlar

Ama burada önemli olan şey şudur:
Azaltma sürecinin mutlaka bir bitiş tarihi olmalıdır.

Örneğin: 2 hafta azaltma, sonrasında tamamen bırakma.
      `
    },
    { 
      title: "Motivasyon Nasıl Korunur", 
      category: "Motivation", 
      desc: "Sigarayı bırakma yolculuğunda motivasyonunuzu nasıl canlı tutarsınız?", 
      xp: "+50 XP", 
      icon: Smile, 
      color: "from-orange-500/20 to-amber-500/20",
      accent: "text-orange-400",
      audioFileName: "Bırakırken motivasyonu nasıl korursun.mp3",
      content: `
Sigarayı bırakmak, sadece iradenizi test etmek değil; aslında beyninizin ve vücudunuzun kendini yeniden düzenlediği bir biyolojik süreçtir. Bu yolculukta motivasyonun iniş çıkışları yaşanması çok normaldir. Önemli olan, doğru stratejilerle bu zor anları birer zafer anına dönüştürebilmektir. İşte motivasyonunuzu korumanın etkili yolları:

1. "Neden"inizi Günlük Hatırlayın

Bırakma kararınızın ardındaki kişisel nedenleri yazın ve sık görebileceğiniz bir yerde tutun. Sağlığınızı korumak, sevdiklerinizi düşünmek veya ekonomik özgürlüğünüzü kazanmak gibi somut nedenler, kriz anlarında size rehberlik eder.

2. Beyninizin İyileştiğini Bilin

Sigara, beynin ödül sistemini ele geçirir ve doğal dopamin üretimini düşürür. Sigarayı bıraktığınızda hissettiğiniz huzursuzluk ya da boşluk duygusu, beyninizin eski sağlığına dönme çabasının bir göstergesidir. Bu iyileşme süreci yaklaşık üç ay sürer ve sonunda hayatın küçük mutluluklarını çok daha net hissedeceksiniz.

3. Kriz Anlarında Motivasyon Al Kartını Kullanın

Sigaraya karşı gelen ani isteklerde, uygulamadaki Kriz Anı sayfasındaki Motivasyon Al kartını hemen açın. Bu kart, kısa motivasyon mesajları ve sizi hatırlatıcı ipuçlarıyla destekler. 5-10 dakikalık dalgayı atlatmanıza ve motivasyonunuzu korumanıza yardımcı olur.

4. Tetikleyicileri Yönetin

Sigara genellikle belirli alışkanlıklarla bağlanır: kahve sonrası, yemek sonrası veya stresli anlar. Bu rutinleri değiştirmek motivasyonu güçlendirir. Örneğin kahve yerine soğuk bir içecek deneyebilir veya yemekten sonra kısa bir yürüyüşe çıkabilirsiniz.

5. Küçük Başarıları Kutlayın

Kendinize karşı nazik olun. Sigaraya harcamadığınız parayı bir kavanoza koyun ve belirli aralıklarla küçük ödüller verin. İlk 28 günü sigarasız geçirebilirseniz, ömür boyu sigarasız kalma şansınız tam 5 kat artar.

6. Destek Alın

Yalnız olmadığınızı bilin. Ailenize ve arkadaşlarınıza kararınızı anlatın; kriz anlarında bu destek sizi korur. Ayrıca ALO 171 Sigara Bırakma Hattı gibi profesyonel destekleri de kullanabilirsiniz.

Unutmayın: Bir tane sigara ne olacak ki? düşüncesi tuzaktır. Vazgeçtiğiniz her sigara, bedeninize ve geleceğinize yaptığınız en değerli yatırımdır.
      `
    },
    { 
      title: "Sigara Stres Yapar mı?", 
      category: "Science", 
      desc: "Sigara stresi azaltır mı yoksa artırır mı? Rahatlama yanılsamasının arkasındaki gerçekler.", 
      xp: "+50 XP", 
      icon: Brain, 
      color: "from-red-500/20 to-orange-500/20",
      accent: "text-red-400",
      audioFileName: "Sigara stres Yapar mı.mp3",
      content: `
Sigara Stres Yapar mı? Rahatlama Yanılsamasının Arkasındaki Gerçekler

Pek çok sigara kullanıcısı, stresli anlarda bir sigara yakmanın onları sakinleştirdiğini düşünür. Ancak bilimsel veriler bunun tam tersini gösteriyor: Sigara, vücutta fiziksel bir stres tepkisi yaratıyor. İşte sigaranın stres üzerindeki etkilerinin arka planı:

1. Adrenalin Patlaması ve Vücudun Stres Tepkisi

Sigara içtiğinizde, nikotin saniyeler içinde beyninize ulaşır ve sempatik sinir sistemini uyarır. Bu tetikleme sonucunda vücut epinefrin (adrenalin) ve norepinefrin salgılar.

Bu hormonlar kana karışınca, vücudunuz şu “savaş ya da kaç” tepkilerini gösterir:

Damarlar daralır (vazokonstriksiyon): Kan akışı zorlaşır.
Kan basıncı yükselir: Tansiyon artar.
Nabız hızlanır: Kalbiniz daha hızlı ve yorucu çalışır.

Yani siz zihnen rahatladığınızı düşünürken, vücudunuz biyolojik olarak stres altındadır.

2. Rahatlama Hissi Neden Olur?

Eğer sigara fiziksel stres yaratıyorsa, neden bazen “rahatladığınızı” hissedersiniz? Bu aslında nikotin yoksunluğu stresinin geçici olarak ortadan kalkmasıdır.

Nikotine bağımlı olan vücutta, son sigaradan birkaç saat sonra huzursuzluk, sinirlilik ve gerginlik başlar. Bir sonraki sigara sadece bu yoksunluk belirtilerini bastırır. Bu, ayağınızı sıkan dar bir ayakkabıyı çıkarmak gibi: Rahatlama, ayakkabının kendisinden değil, yarattığı sıkıntının sona ermesinden gelir.

3. Sigara İçenler Gerçekten Daha mı Stresli?

Araştırmalar, sigara içen yetişkinlerin içmeyenlere göre daha yüksek stres seviyelerine sahip olduğunu gösteriyor. Sigara sorunları çözmez; aksine odağı bağımlılığa kaydırır ve bir “sigara-stres döngüsü” yaratır.

Sigarayı bırakan kişilerde yapılan uzun süreli gözlemler, bırakmanın birkaç ay sonrasında stres ve anksiyete seviyelerinin, sigara içtikleri döneme göre belirgin şekilde azaldığını ortaya koyuyor.

4. Bırakınca Gelen Gerçek Huzur

Sigarayı bıraktıktan sadece 20 dakika sonra, nikotinin baskısı kalktığı için kalp atış hızı ve kan basıncı normale dönmeye başlar. İşte bu gerçek fiziksel rahatlama, kalıcı sakinliğin ilk işaretidir.

Özetle: Sigara stresi azaltmaz; sadece kendi yarattığı yoksunluk stresini maskeleyerek sizi kandırır. Adrenalin seviyenizi yükselterek kalbinizi ve damarlarınızı sürekli bir “acil durum” modunda tutar. Gerçek bir rahatlama, vücudun bu yapay uyarandan kurtulması ve doğal dengesine dönmesiyle başlar.
      `
    }
  ];

  const handleSelectBlog = (blog: any, index: number) => {
    setSelectedBlog(blog);
    setSelectedBlogIndex(index);
  };

  const resolveAudioUrl = (audioFileName: string) => {
    const base = import.meta.env.BASE_URL || '/';
    const normalizedBase = base.endsWith('/') ? base : `${base}/`;
    return `${normalizedBase}sounds/${encodeURIComponent(audioFileName)}`;
  };

  const handlePlayAudio = (blog: any, index: number) => {
    if (!blog.audioFileName) {
      return;
    }

    if (!listenedBlogs.includes(index) && !readBlogs.includes(index)) {
      setListenedBlogs(prev => [...prev, index]);
      const xpValue = parseInt(blog.xp.replace(/[^0-9]/g, '')) || 50;
      setUserXp(prev => prev + xpValue);
      setLastXpAmount(xpValue);
      setShowXpBadge(true);
      setTimeout(() => setShowXpBadge(false), 3000);
    }

    if (playingId === index) {
      if (audioInstance?.paused) {
        audioInstance.play().catch(err => console.error('Play error:', err));
        setPlayingId(index);
      } else {
        audioInstance?.pause();
        setPlayingId(null);
      }
      return;
    }

    if (audioInstance) {
      audioInstance.pause();
      audioInstance.src = '';
    }

    const src = resolveAudioUrl(blog.audioFileName);
    const newAudio = new Audio(src);

    setAudioProgress(0);
    setAudioDuration(0);
    setLoadingId(index);

    newAudio.addEventListener('loadedmetadata', () => {
      setAudioDuration(newAudio.duration);
      setLoadingId(null);
    });

    newAudio.addEventListener('timeupdate', () => {
      setAudioProgress(newAudio.currentTime);
    });

    newAudio.onended = () => {
      setPlayingId(null);
      setAudioProgress(0);
    };

    newAudio.onerror = () => {
      setLoadingId(null);
      setPlayingId(null);
      console.error('Audio file failed to load:', src);
    };

    setAudioInstance(newAudio);
    newAudio
      .play()
      .then(() => {
        setLoadingId(null);
        setPlayingId(index);
      })
      .catch(err => {
        setLoadingId(null);
        setPlayingId(null);
        console.error('Audio play error:', err);
      });
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioInstance) {
      audioInstance.currentTime = time;
      setAudioProgress(time);
    }
  };

  const filteredBlogs = blogs;

  return (
    <>
      {selectedBlog ? (
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="min-h-screen bg-[#0f172a] text-slate-100 max-w-md mx-auto relative pb-32 overflow-y-auto h-screen"
        >
        <header className="sticky top-0 z-20 flex items-center justify-between p-4 backdrop-blur-md bg-[#0f172a]/80 border-b border-white/5">
          <button 
            onClick={() => {
              setSelectedBlog(null);
              setSelectedBlogIndex(null);
            }}
            className="size-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold truncate px-4">{selectedBlog.title}</h1>
          <div className="size-10"></div>
        </header>

        <main className="p-6">
          <div className={`p-6 rounded-3xl bg-gradient-to-br ${selectedBlog.color} mb-8 flex flex-col items-center text-center`}>
            <div className={`p-4 rounded-2xl bg-[#0f172a]/50 ${selectedBlog.accent} mb-4`}>
              <selectedBlog.icon size={48} />
            </div>
            <span className="text-xs font-black px-4 py-1.5 rounded-full bg-[#0f172a]/50 uppercase tracking-widest text-blue-400 mb-2">
              {selectedBlog.category}
            </span>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-slate-300 leading-relaxed text-sm">
              {selectedBlog.content}
            </div>
          </div>

          {/* Reading Timer logic continues in background */}
        </main>

        {/* XP Awarded Badge */}
        <AnimatePresence>
          {showXpBadge && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-full shadow-lg shadow-emerald-500/30 flex items-center gap-3 whitespace-nowrap"
            >
              <div className="bg-white/20 p-1 rounded-full">
                <CheckCircle2 size={18} />
              </div>
              <span className="font-bold text-sm">+{lastXpAmount} XP Kazandın!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <BottomNav onNavigate={onNavigate} activeStep="blogs" />
        </div>
      ) : (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 max-w-md mx-auto relative pb-32 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 bg-[#0f172a]/80 backdrop-blur-md z-50 border-b border-white/5">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="size-10"></div>

          <div className="flex flex-col items-center gap-1">
            <h1 className="text-xl font-bold tracking-tight text-white font-sans">
              Bloglar
            </h1>
            <div className="flex items-center gap-1.5">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-blue-500/60" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400/70">
                Keşfet & Öğren
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-blue-500/60" />
            </div>
          </div>

          <button 
            onClick={() => onNavigate('profile')}
            className="size-10 rounded-full border-2 border-blue-500/20 p-0.5 shrink-0"
          >
            <img 
              alt="User avatar" 
              className="w-full h-full rounded-full object-cover" 
              src={userAvatar}
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Categories - Two Tab System */}
        <div className="flex p-1 bg-slate-800/50/40 rounded-2xl border border-white/5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.name;
            const isLocked = false; // Deneme için kilit kaldırıldı
            
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <cat.icon size={18} />
                <span className="text-sm font-bold tracking-tight flex items-center gap-1.5">
                  {cat.name}
                  {isLocked && <Lock size={12} className="text-slate-500" />}
                </span>
              </button>
            );
          })}
        </div>

        {/* Blog List Container */}
        <div className="relative">
          {/* Blog List */}
          <div className={`grid gap-3 transition-all duration-500 ${activeCategory === 'Sesli Bloglar' && false ? 'blur-sm pointer-events-none opacity-50' : ''}`}>
            {filteredBlogs.map((blog, i) => (
              <BlogCard
                key={i}
                blog={blog}
                index={i}
                activeCategory={activeCategory}
                loadingId={loadingId}
                playingId={playingId}
                onClick={handleSelectBlog}
                onPlay={handlePlayAudio}
              />
            ))}
          </div>

          {/* Premium Overlay */}
          <AnimatePresence>
            {activeCategory === 'Sesli Bloglar' && false && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex items-start justify-center pt-20 p-6"
              >
                <div className="bg-[#0f172a]/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-3">
                  <Lock size={20} className="text-blue-400" />
                  <button 
                    onClick={() => onNavigate('premium')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-500/90 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
                  >
                    Premiuma Yükselt
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Audio Player Bar */}
        {playingId !== null && (
          <div className="fixed bottom-24 left-4 right-4 z-50 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
            <div className="flex items-center gap-4 mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${blogs[playingId].color} ${blogs[playingId].accent}`}>
                <Mic size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{blogs[playingId].title}</h4>
                <p className="text-[10px] text-slate-400">Sesli Blog Oynatılıyor</p>
              </div>
              <button 
                onClick={() => {
                  audioInstance?.pause();
                  setPlayingId(null);
                }}
                className="p-1 text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-1">
              <input 
                type="range" 
                min="0" 
                max={audioDuration || 100} 
                value={audioProgress}
                onChange={handleSeek}
                className="w-full h-1 bg-slate-800/50 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[9px] font-medium text-slate-500">
                <span>{formatTime(audioProgress)}</span>
                <span>{audioDuration > 0 ? formatTime(audioDuration) : '--:--'}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-2">
              <button className="text-slate-400 hover:text-white transition-colors">
                <SkipBack size={20} fill="currentColor" />
              </button>
              <button 
                onClick={() => {
                  if (audioInstance?.paused) {
                    audioInstance.play();
                    setPlayingId(playingId);
                  } else {
                    audioInstance?.pause();
                    setPlayingId(null);
                  }
                }}
                className="size-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                {audioInstance?.paused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
              </button>
              <button className="text-slate-400 hover:text-white transition-colors">
                <SkipForward size={20} fill="currentColor" />
              </button>
            </div>
          </div>
        )}
      </main>

        <BottomNav onNavigate={onNavigate} activeStep="blogs" />
        </div>
      )}
    </>
  );
}
