import { Zap, Brain, ShieldCheck, Activity, Heart, Smile, Activity as Pulse, Award, Wind, Timer, ZapOff, Footprints, Lightbulb, Cloud } from 'lucide-react';

export const PROGRAM_DAYS = [
  {
    day: 1,
    title: "Oksijen Artışı",
    scientificStatus: "Kandaki karbonmonoksit seviyesi normale dönerken organlarınıza giden oksijen miktarı hızla artmaya başlar.",
    task: "Evdeki, arabadaki ve iş yerindeki tüm sigara, çakmak ve kültablalarını çöpe atarak hatırlatıcılardan kurtulun; sigara içmeyince değişecek şeyleri artı ve eksileriyle yazın.",
    suggestion: "Yoğun istek yaşadığında kriz anı butonunu kullanmaya başla. Bloglardan Allen Carr Tekniği bloğunu dinleyerek sigaranın neden stresi azaltmadığını öğren.",
    tip: "İlk gün en zorudur ama aynı zamanda en önemli adımıdır. Unutma, her büyük yolculuk tek bir adımla başlar."
  },
  {
    day: 2,
    title: "Duyuların Dönüşü",
    scientificStatus: "Vücudunuzda nikotin azalırken hasar görmüş sinir uçları iyileşmeye başlar; bu da tat ve koku duyularınızı keskinleştirir.",
    task: "Yoğun istek yaşadığında derin nefes al ve motivasyon koçundan tavsiye iste.",
    suggestion: "Baş dönmesi hissederseniz bunun beyninize giden oksijen artışından kaynaklanan olumlu bir işaret olduğunu hatırlayın ve yavaş hareket edin.",
    tip: "Krizler genellikle sadece 5-10 dakika süren zirve biyolojik sinyallerdir."
  },
  {
    day: 3,
    title: "Yoksunluk Zirvesi",
    scientificStatus: "Vücudunuzdaki nikotin tamamen temizlenir ve hava yolları gevşemeye başlar ancak bu gün yoksunluk belirtilerinin en tepe noktasıdır.",
    task: "Yoğun istek yaşadığında kriz anı butonundan 4D tekniğini ve derin nefesi kullan.",
    suggestion: "Sinirlilik ve anksiyete zirve yapabilir; derin nefes egzersizleri yaparak bu geçici duygu dalgasının geçmesini bekleyin.",
    tip: "Bugün zirve noktası. Burayı geçerseniz işler kolaylaşacak."
  },
  {
    day: 4,
    title: "Akciğer Temizliği",
    scientificStatus: "Akciğerlerinizdeki temizlikçi tüyler (silyalar) tekrar çalışmaya başladığı için yoğun bir temizlik öksürüğü yaşayabilirsiniz.",
    task: "En az 2 litre su için. Artan enerjinizi dengelemek ve moralinizi yükseltmek için 15-20 dakikalık hafif bir yürüyüşe çıkın.",
    suggestion: "Sigarayı bıraktığınızda kafein vücudunuzda iki kat daha uzun süre kaldığı için çarpıntı yaşamamak adına kahve tüketiminizi yarıya indirin.",
    tip: "Su içmek toksinlerin atılmasını hızlandırır."
  },
  {
    day: 5,
    title: "Beyin Sisi",
    scientificStatus: "Beyninizin nikotinsizliğe alışma süreci nedeniyle odaklanma güçlüğü ve \"beyin sisi\" yaşamanız bu evrede oldukça yaygındır.",
    task: "Zihinsel olarak yüksek konsantrasyon gerektiren işlerinizi mümkünse erteleyin veya bu işleri 25 dakikada bir mola verebileceğiniz kısa parçalara bölün.",
    suggestion: "Bol su içmek, omega 3 takviyesi almak veya kısa yürüyüşlerle beyninize giden oksijen miktarını artırmak odaklanmayı artırır.",
    tip: "Kafein nikotin yokluğunda daha güçlü etki edebilir."
  },
  {
    day: 6,
    title: "Doğal Ritim",
    scientificStatus: "Nikotinin bağırsak hareketlerini uyarıcı etkisi ortadan kalktığı için vücudunuz kendi doğal ritmini bulmaya çalışırken geçici olarak kabızlık yaşayabilirsiniz.",
    task: "Bağırsak sisteminizi desteklemek için öğünlerinize tam tahıllar, taze sebze ve meyve gibi lifli gıdalar ekleyin ve su tüketiminizi artırın.",
    suggestion: "Fiziksel aktivite bağırsak motilitesini (hareketliliğini) artırdığı için bugün tempolu bir yürüyüş veya egzersiz yapmayı deneyin.",
    tip: "Oksijen seviyeniz normale dönüyor, daha derin nefes alabiliyorsunuz."
  },
  {
    day: 7,
    title: "İlk Hafta Zaferi",
    scientificStatus: "Birinci haftanın sonunda fiziksel bağımlılık büyük oranda kırılmış olur, nefes alışverişiniz belirgin şekilde rahatlar.",
    task: "Sigaraya harcamadığın parayı biriktirerek bu 7 günlük büyük başarıyı kutlamak için kendine bir ödül belirle.",
    suggestion: "İlk haftayı bitirmek kalıcı başarı şansını ciddi oranda artırır; kendinle gurur duy ve hayatında değişen şeyleri kağıda dök.",
    tip: "Tebrikler! İlk haftayı devirdiniz."
  },
  {
    day: 8,
    title: "Huzursuzlukla Başa Çıkma",
    scientificStatus: "Beyniniz hala nikotin beklediği için kendinizi huzursuz ve gergin hissedebilirsiniz.",
    task: "En güçlü üç sigara tetikleyicini (örn: kahve sonrası) bul ve yerine yeni bir şey koy.",
    suggestion: "Gergin hissettiğinde derin nefes egzersizi yap; bu sinirlerini hemen yatıştırır.",
    tip: "Yeni ortamlar yeni alışkanlıklar demektir."
  },
  {
    day: 9,
    title: "Kan Akışı",
    scientificStatus: "Vücudunuzda kan akışı düzeldiği için ellerinizde ve ayaklarınızda hafif karıncalanmalar olabilir.",
    task: "Ellerini meşgul etmek için yanında stres topu veya kalem taşı.",
    suggestion: "Karıncalanmayı kötü bir şey değil, damarlarının açılmasının bir kanıtı olarak gör.",
    tip: "Alışkanlıklar zincirleme reaksiyonlardır, bir halkayı kırmak tüm zinciri zayıflatır."
  },
  {
    day: 10,
    title: "Odaklanma Stratejisi",
    scientificStatus: "Hala zihninizde bir \"sis\" varmış gibi hissedebilir ve işlerinize odaklanmakta zorlanabilirsiniz.",
    task: "Odaklanman gereken işleri 25 dakikalık kısa parçalara böl.",
    suggestion: "Dikkatini toplamak için bilinçli kafein al veya her mola verdiğinde bir bardak su iç.",
    tip: "Kendinizi nasıl tanımladığınız, nasıl davrandığınızı belirler."
  },
  {
    day: 11,
    title: "İştah Dengesi",
    scientificStatus: "Nikotin artık iştahınızı kapatmadığı için kendinizi normalden çok daha aç hissedebilirsiniz.",
    task: "Sebze veya elma gibi sağlıklı atıştırmalıkları elinin altında tut.",
    suggestion: "Yemek yerken sadece yemeğe odaklan; bu, tokluk hissini daha iyi anlamanı sağlar.",
    tip: "Beyniniz yeni mutluluk kaynakları arıyor, ona sağlıklı seçenekler sunun."
  },
  {
    day: 12,
    title: "Enerji Yönetimi",
    scientificStatus: "Vücudunuzdan uyarıcı bir madde (nikotin) çıktığı için kendinizi çok yorgun hissedebilirsiniz.",
    task: "Bol su iç ve gün içinde 20 dakikalık tempolu bir yürüyüşe çık.",
    suggestion: "Egzersiz yapmak vücuduna doğal bir enerji verir ve moralini düzeltir.",
    tip: "Zihniniz sizi kandırmaya çalışabilir, gerçeklere tutunun."
  },
  {
    day: 13,
    title: "Uyku Düzeni",
    scientificStatus: "Beyniniz uykunuzu yeniden düzene sokmaya çalışırken garip rüyalar görebilir veya uyumakta zorlanabilirsiniz.",
    task: "Yatmadan bir saat önce tüm ekranları kapat.",
    suggestion: "Sigarayı bıraktığın için kahve, çay seni daha çok uykusuz bırakabilir; akşamları kafeinden kaçın.",
    tip: "Tek bir nefes, tüm süreci başa sarabilir. Dikkatli olun."
  },
  {
    day: 14,
    title: "İkinci Hafta Zaferi",
    scientificStatus: "Zorlu iki haftayı bitirmek üzeresiniz; nüks etme riskiniz istatistiksel olarak azalmaya başlıyor.",
    task: "2 haftada hayatında değişen olumlu şeyleri yaz ve kendine bir ödül al.",
    suggestion: "Bu başarıyı kutlayarak beynine sigara içmeden de mutlu olunabileceğini göster.",
    tip: "2 hafta! Artık vücudunuz tamamen temizlendi, şimdi zihninizi özgürleştirme vakti."
  },
  {
    day: 15,
    title: "Bahar Temizliği",
    scientificStatus: "Akciğerlerinizdeki tüyler tekrar çalışmaya başladığı için daha fazla öksürmeye başlayabilirsiniz.",
    task: "Mukusu yumuşatmak için gün boyu bol bol su iç.",
    suggestion: "Öksürüğü bir hastalık değil, akciğerlerinin yılların pisliğini dışarı atması olarak gör.",
    tip: "Motivasyonunuz düşükse bunun geçici bir biyolojik süreç olduğunu hatırlayın."
  },
  {
    day: 16,
    title: "Lezzet Keşfi",
    scientificStatus: "Tat ve koku duyularınızın geri gelmesiyle yemeklerin lezzetini çok daha iyi almaya başlarsınız.",
    task: "Sevdiğin bir yemeği ye ve tadının ne kadar değiştiğini fark et.",
    suggestion: "Kazanımlar listene \"tadı güzel yemek > sigara\" diye yazabilirsin.",
    tip: "Eski alışkanlıklar sadece birer hafıza kaydıdır, onlara uymak zorunda değilsiniz."
  },
  {
    day: 17,
    title: "Rahat Nefes",
    scientificStatus: "Kanınızdaki oksijen miktarı arttığı için artık daha rahat nefes aldığınızı fark edersiniz.",
    task: "Bir egzersiz yap ve nefesinin ne kadar az kesildiğini test et.",
    suggestion: "Bu fiziksel rahatlamayı her zorlandığın an kendine hatırlat.",
    tip: "Vücudunuz artık daha verimli çalışıyor, bu enerjiyi hissedin."
  },
  {
    day: 18,
    title: "Ayna Etkisi",
    scientificStatus: "Etrafınızda sigara içenleri görmek sizde ani bir \"ayna etkisi\" ile içme isteği uyandırabilir.",
    task: "Sigara içilen ortamlardan bir süre daha uzak durmaya çalış.",
    suggestion: "Birisi sigara ikram ederse \"Hayır, ben artık içmiyorum\" diyerek yeni kimliğini onayla, sigara içtikleri için onların sağlıksız olduğunu düşün.",
    tip: "Hayatın gerçek tatlarını keşfetmeye başladınız."
  },
  {
    day: 19,
    title: "Stres Kapasitesi",
    scientificStatus: "Nikotin desteği olmadan stresle başa çıkma kapasiteniz belirgin şekilde artar.",
    task: "Gün içinde yaşadığınız küçük bir gerginlik anında sigaraya sarılmak yerine, sadece 5 kez derin nefes alarak vücudunuzun kendi kendini yatıştırma yeteneğini test edin.",
    suggestion: "Sakinleşmek için müzik dinlemek veya kısa bir yürüyüş yapmak gibi yeni bir rutin oluşturarak beyninizin dinlenme alışkanlığını sigaradan tamamen koparın.",
    tip: "Küçük değişiklikler büyük özgürlükler getirir."
  },
  {
    day: 20,
    title: "Doğal Sakinleştiriciler",
    scientificStatus: "Beyniniz artık stresli anlarda sigara desteği aramak yerine, kendi doğal sakinleştiricilerini kullanarak sizi yatıştırmayı yeniden öğreniyor.",
    task: "Zihninizi ve ellerinizi sigara düşüncesinden uzaklaştıracak yeni bir uğraşa en az 30 dakika ayırın (enstrüman çalmak, satranç oynamak, spor yapmak vb.).",
    suggestion: "Yeni bir beceri öğrenmek beyninizi \"başarı\" sinyalleriyle besler ve bu da sigaranın verdiği sahte dopaminin yerini çok daha sağlıklı bir şekilde doldurur.",
    tip: "Öksürük veya mukus artışı akciğerlerinizin temizlendiğinin işaretidir."
  },
  {
    day: 21,
    title: "Üçüncü Hafta Zaferi",
    scientificStatus: "Üçüncü haftayı bitirerek nikotin bağımlılığının en zorlu psikolojik barajlarından birini aştınız; artık beyniniz nikotinsiz bir hayata büyük oranda uyum sağladı.",
    task: "Geçen 21 günde neler kazandığınızı yazın ve bu büyük dönüm noktasını kutlamak için kendinize özel bir ödül belirleyin.",
    suggestion: "Önünüzdeki 28. günü devirdiğinizde, sigarayı kalıcı olarak bırakma şansınızın 5 kat daha artacağını hatırlayarak motivasyonunuzu koruyun.",
    tip: "3 hafta! Bir alışkanlığı kırmak için gereken kritik süreyi tamamladınız."
  },
  {
    day: 22,
    title: "Karar Verme Gücü",
    scientificStatus: "Beyninizin karar verme bölgesi güçlendiği için ani dürtülerinizi daha iyi kontrol edersiniz.",
    task: "Stres anında sana en iyi gelen çözümleri belirle ve bir ritüel oluştur.",
    suggestion: "Yürüyüş doğal bir stres atıcıdır. Sigaranın stresi çözmediğini, sadece nikotin eksikliğinin yarattığı stresi bitirdiğini unutma.",
    tip: "Zihniniz artık daha berrak."
  },
  {
    day: 23,
    title: "Cilt Canlılığı",
    scientificStatus: "Cildinizdeki kan dolaşımı iyice düzeldiği için yüzünüz daha sağlıklı ve canlı görünmeye başlar.",
    task: "Aynada cildindeki ve dişlerindeki iyileşmeyi yakından incele.",
    suggestion: "Bu görsel değişimi fotoğraflayarak motivasyonunu taze tut.",
    tip: "Dış görünüşünüzdeki değişimi fark edin."
  },
  {
    day: 24,
    title: "Ağız Sağlığı",
    scientificStatus: "Sigara dumanının ağız içinde bıraktığı kimyasal kalıntılar temizlendiği ve tükürük kalitesi arttığı için sigara kaynaklı kronik ağız kokusu (halitozis) bu evrede tamamen ortadan kalkmıştır.",
    task: "Dişinizi fırçalayarak nefesinizdeki doğal tazeliği kontrol edin.",
    suggestion: "Dişlerinizdeki sigara lekelerinden tamamen kurtulmak ve bu ferahlığı kalıcı kılmak için diş fırçalama alışkanlığı edinin.",
    tip: "Nefesiniz artık daha ferah."
  },
  {
    day: 25,
    title: "Krizlerin Zayıflaması",
    scientificStatus: "Sigara krizleri artık çok daha seyrek gelir ve genellikle 3 dakikadan kısa sürer.",
    task: "Bir kriz gelirse kronometre tut ve ne kadar kısa sürede geçtiğini gör.",
    suggestion: "Krizlerin gücünü kaybettiğini görmek sana büyük bir özgüven kazandırır.",
    tip: "Zamanla krizler yok olacak."
  },
  {
    day: 26,
    title: "Fiziksel Dayanıklılık",
    scientificStatus: "Akciğer kapasiteniz belirgin şekilde arttığı için fiziksel dayanıklılığınız yükselir.",
    task: "Daha önce yorulduğun bir mesafeyi yürü veya hafif bir koşu yap.",
    suggestion: "Fiziksel olarak güçlenmek moralini yükselten en doğal ilaçtır.",
    tip: "Vücudunuzun gücünü hissedin."
  },
  {
    day: 27,
    title: "Doğal Keyif",
    scientificStatus: "Beyniniz artık doğal yollardan (sosyalleşmek, başarı vb.) keyif almayı yeniden öğreniyor.",
    task: "Çok sevdiğin bir müziği dinle veya komedi türünde bir şey izle.",
    suggestion: "sosyalleşmek, bir hobiyle uğraşmak gibi şeyler beynine sigaranın veremediği gerçek mutluluk sinyallerini gönderir.",
    tip: "Gerçek mutluluk hormonları devrede."
  },
  {
    day: 28,
    title: "Dördüncü Hafta Zaferi",
    scientificStatus: "Bir ayı doldurdunuz; vücudunuz artık biyolojik olarak \"sigara içmeyen\" birinin düzenine geçti.",
    task: "Bir ayda neler kazandığını yaz ve düzenli oku.",
    suggestion: "Bir ayı devirmek kalıcı başarı ihtimalini %400 artırır; bu zaferi mühürle.",
    tip: "Bir ay! İnanılmaz bir başarı."
  },
  {
    day: 29,
    title: "Mekansal Değişim",
    scientificStatus: "Günlük alışkanlıklarınız artık sigarayla olan bağını tamamen koparmaya başladı.",
    task: "Evde eskiden sigara içtiğin o köşeyi yeniden düzenle veya dekorunu değiştir.",
    suggestion: "Mekansal değişim, beynindeki \"burada sigara içilir\" sinyalini tamamen siler.",
    tip: "Yeni bir yaşam alanı yaratın."
  },
  {
    day: 30,
    title: "Özgürlük Zaferi",
    scientificStatus: "30 günlük süreci tamamladınız; artık sigara hayatınızın bir parçası değil, geride kalmış bir anı.",
    task: "Başardın. Kendine \"ben artık sigara içmeyen biriyim\" de. Bu süreçte öğrendiğin en etkili yöntemi sigarayı bırakmak isteyen biriyle paylaş.",
    suggestion: "Başkasına yardım etmek, senin bu kararındaki kararlılığını daha da pekiştirir. Arada bir istek gelirse artık ne yapacağını biliyorsun...",
    tip: "Tebrikler! Artık tamamen özgürsünüz."
  }
];

export const NICOTINE_GOALS = [
  { id: 101, time: '20. Dakika', description: 'Otonom sinir sisteminiz üzerindeki nikotinik baskı azalmaya başladı.', hours: 1/3, xp: 10, icon: Zap },
  { id: 102, time: '2. Saat', description: 'Nikotin vücudunuzu hızla terk etmeye başladı.', hours: 2, xp: 15, icon: Zap },
  { id: 103, time: '4. Saat', description: 'Vücudunuzdaki nikotin seviyesi %90 oranında düştü.', hours: 4, xp: 20, icon: Zap },
  { id: 104, time: '12. Saat', description: 'Kandaki nikotin seviyesi düşerken oksijen taşıma kapasitesi arttı.', hours: 12, xp: 25, icon: ShieldCheck },
  { id: 105, time: '24. Saat', description: 'Kandaki nikotin seviyesi ihmal edilebilir düzeye indi.', hours: 24, xp: 30, icon: Zap },
  { id: 106, time: '24. Saat', description: 'Damarlarınızdaki nikotin kaynaklı vazokonstriksiyon (daralma) sona erdi.', hours: 24, xp: 30, icon: ShieldCheck },
  { id: 107, time: '48. Saat', description: 'Vücudunuzda artık ölçülebilir düzeyde nikotin kalmadı.', hours: 48, xp: 40, icon: Zap },
  { id: 108, time: '48. Saat', description: 'Nikotinin baskıladığı sinir uçları yeniden büyümeye başladı.', hours: 48, xp: 40, icon: Brain },
  { id: 109, time: '72. Saat', description: 'Nikotin vücudunuzdan tamamen atıldı; fiziksel bağımlılık zirve yaptı ve düşüşe geçti.', hours: 72, xp: 50, icon: Zap },
  { id: 110, time: '72. Saat', description: 'Bronşlardaki nikotinik reseptörlerin duyarlılığı azaldı, nefes almak kolaylaştı.', hours: 72, xp: 50, icon: ShieldCheck },
  { id: 111, time: '5. Gün', description: 'Beyindeki nikotin reseptörleri (nAChR) sayıca azalmaya ve normale dönmeye başladı.', hours: 120, xp: 75, icon: Brain },
  { id: 112, time: '10. Gün', description: 'Dopamin sistemi nikotin olmadan çalışmaya uyum sağlamaya başladı.', hours: 240, xp: 100, icon: Brain },
  { id: 113, time: '2. Hafta', description: 'Asetilkolin reseptörlerinin dengesi büyük oranda sağlandı.', hours: 336, xp: 150, icon: Brain },
  { id: 114, time: '3. Hafta', description: 'Nikotin yoksunluğuna bağlı anksiyete ve sinirlilik hali nörolojik olarak yatıştı.', hours: 504, xp: 200, icon: Brain },
  { id: 115, time: '1. Ay', description: 'Beyindeki gri madde yoğunluğu ve bilişsel fonksiyonlar iyileşmeye başladı.', hours: 720, xp: 300, icon: Brain },
  { id: 116, time: '3. Ay', description: 'Dopamin reseptörlerinin hassasiyeti sigara içmeyen bir bireyinkiyle aynı seviyeye geldi.', hours: 2160, xp: 500, icon: Brain },
  { id: 117, time: '6. Ay', description: 'Stresle başa çıkma mekanizmaları nikotin desteği olmadan tamamen stabilize oldu.', hours: 4320, xp: 1000, icon: Brain },
  { id: 118, time: '1. Yıl', description: 'Nikotin kaynaklı nörolojik hasarların çoğu onarıldı, odaklanma süresi arttı.', hours: 8760, xp: 2000, icon: Brain },
  { id: 119, time: '2. Yıl', description: 'Beyindeki ödül yolları sigarayı tamamen yabancı bir madde olarak algılamaya başladı.', hours: 17520, xp: 5000, icon: Brain },
  { id: 120, time: '5. Yıl', description: 'Nikotinik hafıza zayıfladı, sigara isteği nörolojik olarak "silinme" aşamasına geldi.', hours: 43800, xp: 10000, icon: Brain },
];

export const HEALTH_GOALS = [
  { id: 201, time: '20. Dakika', description: 'Kalp atış hızınız ve kan basıncınız düşmeye başladı.', hours: 1/3, xp: 10, icon: Pulse },
  { id: 202, time: '2. Saat', description: 'Nikotin vücudunuzu terk etmeye başladı.', hours: 2, xp: 15, icon: Zap },
  { id: 203, time: '2. Saat', description: 'El ve ayaklarınızdaki kan dolaşımı iyileşmeye başladı.', hours: 2, xp: 15, icon: Activity },
  { id: 204, time: '8. Saat', description: 'Kandaki karbonmonoksit seviyeniz yarıya indi.', hours: 8, xp: 20, icon: ShieldCheck },
  { id: 205, time: '8. Saat', description: 'Kandaki oksijen seviyeniz normale döndü.', hours: 8, xp: 20, icon: ShieldCheck },
  { id: 206, time: '12. Saat', description: 'Kandaki karbonmonoksit seviyesi tamamen normale döndü.', hours: 12, xp: 25, icon: ShieldCheck },
  { id: 207, time: '24. Saat', description: 'Kalp krizi geçirme riskiniz azalmaya başladı.', hours: 24, xp: 30, icon: Heart },
  { id: 208, time: '24. Saat', description: 'Karbonmonoksit vücudunuzdan tamamen atıldı.', hours: 24, xp: 30, icon: ShieldCheck },
  { id: 209, time: '48. Saat', description: 'Tat alma ve koku duyularınız keskinleşti.', hours: 48, xp: 40, icon: Smile },
  { id: 210, time: '48. Saat', description: 'Hasar görmüş sinir uçlarınız onarılmaya başladı.', hours: 48, xp: 40, icon: Brain },
  { id: 211, time: '72. Saat', description: 'Vücudunuzda nikotin kalmadı.', hours: 72, xp: 50, icon: Zap },
  { id: 212, time: '72. Saat', description: 'Bronşiyal tüpleriniz gevşedi ve solunumunuz rahatladı.', hours: 72, xp: 50, icon: ShieldCheck },
  { id: 213, time: '1. Hafta', description: 'Akciğerlerinizdeki temizlik tüyleri (silyalar) aktifleşti.', hours: 168, xp: 75, icon: ShieldCheck },
  { id: 214, time: '2. Hafta', description: 'Kan dolaşımınız ve yürüme kapasiteniz iyileşti.', hours: 336, xp: 100, icon: Activity },
  { id: 215, time: '28. Gün', description: 'Bağımlılıktan kalıcı olarak kurtulma şansınız 5 kat arttı.', hours: 672, xp: 150, icon: Award },
  { id: 216, time: '1. Ay', description: 'Beyin sisi dağıldı ve enerji seviyeniz yükseldi.', hours: 720, xp: 200, icon: Zap },
  { id: 221, time: '50. Gün', description: 'Kan dolaşımınız tazelendi.', hours: 1200, xp: 250, icon: Activity },
  { id: 222, time: '60. Gün', description: 'Akciğer fonksiyonlarınız belirgin oranda iyileşti.', hours: 1440, xp: 275, icon: ShieldCheck },
  { id: 217, time: '3. Ay', description: 'Biyolojik sigara isteğiniz sona erdi.', hours: 2160, xp: 300, icon: Brain },
  { id: 219, time: '6. Ay', description: 'Stres ve anksiyete seviyeniz belirgin şekilde düştü.', hours: 4320, xp: 500, icon: Smile },
  { id: 220, time: '1. Yıl', description: 'Koroner kalp hastalığı riskiniz büyük oranda azaldı.', hours: 8760, xp: 1000, icon: Heart },
];

export const SAVINGS_GOALS = [
  { id: 301, type: 'cigarette', target: 20, title: '20 sigara içmediniz.', xp: 50 },
  { id: 302, type: 'money', target: 100, title: '100 TL tasarruf ettiniz.', xp: 50 },
  { id: 303, type: 'cigarette', target: 50, title: '50 sigara içmediniz.', xp: 100 },
  { id: 304, type: 'money', target: 250, title: '250 TL tasarruf ettiniz.', xp: 100 },
  { id: 305, type: 'cigarette', target: 100, title: '100 sigara içmediniz.', xp: 200 },
  { id: 306, type: 'money', target: 500, title: '500 TL tasarruf ettiniz.', xp: 200 },
  { id: 307, type: 'cigarette', target: 200, title: '200 sigara içmediniz.', xp: 400 },
  { id: 308, type: 'money', target: 750, title: '750 TL tasarruf ettiniz.', xp: 400 },
  { id: 309, type: 'cigarette', target: 350, title: '350 sigara içmediniz.', xp: 600 },
  { id: 310, type: 'money', target: 1000, title: '1.000 TL tasarruf ettiniz.', xp: 600 },
  { id: 311, type: 'cigarette', target: 500, title: '500 sigara içmediniz.', xp: 1000 },
  { id: 312, type: 'money', target: 2000, title: '2.000 TL tasarruf ettiniz.', xp: 1000 },
  { id: 313, type: 'cigarette', target: 750, title: '750 sigara içmediniz.', xp: 1500 },
  { id: 314, type: 'money', target: 3000, title: '3.000 TL tasarruf ettiniz.', xp: 1500 },
  { id: 315, type: 'cigarette', target: 1000, title: '1.000 sigara içmediniz.', desc: 'Önemli bir eşiği aştınız!', xp: 2000 },
  { id: 316, type: 'money', target: 4000, title: '4.000 TL tasarruf ettiniz.', xp: 2000 },
  { id: 317, type: 'cigarette', target: 1250, title: '1.250 sigara içmediniz.', xp: 2500 },
  { id: 318, type: 'money', target: 5000, title: '5.000 TL tasarruf ettiniz.', xp: 2500 },
  { id: 319, type: 'cigarette', target: 1500, title: '1.500 sigara içmediniz.', xp: 3000 },
  { id: 320, type: 'money', target: 7500, title: '7.500 TL tasarruf ettiniz.', xp: 3000 },
  { id: 321, type: 'cigarette', target: 2000, title: '2.000 sigara içmediniz.', xp: 4000 },
  { id: 322, type: 'money', target: 10000, title: '10.000 TL tasarruf ettiniz.', xp: 4000 },
  { id: 323, type: 'cigarette', target: 2500, title: '2.500 sigara içmediniz.', xp: 5000 },
  { id: 324, type: 'money', target: 15000, title: '15.000 TL tasarruf ettiniz.', xp: 5000 },
  { id: 325, type: 'cigarette', target: 3000, title: '3.000 sigara içmediniz.', xp: 7500 },
  { id: 326, type: 'money', target: 20000, title: '20.000 TL tasarruf ettiniz.', xp: 7500 },
  { id: 327, type: 'cigarette', target: 4000, title: '4.000 sigara içmediniz.', xp: 10000 },
  { id: 328, type: 'money', target: 30000, title: '30.000 TL tasarruf ettiniz.', xp: 10000 },
  { id: 330, type: 'money', target: 40000, title: '40.000 TL tasarruf ettiniz.', desc: 'Sağlığınıza ve finansal özgürlüğünüze büyük bir yatırım yaptınız.', xp: 20000 },
];
