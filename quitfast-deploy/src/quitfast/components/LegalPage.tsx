import React from 'react';
import { ChevronLeft, Shield, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Step } from '../types';

interface LegalPageProps {
  onNavigate: (step: Step) => void;
}

export default function LegalPage({ onNavigate }: LegalPageProps) {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 max-w-md mx-auto relative pb-10 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-blue-500/10">
        <div className="flex items-center p-4 justify-between w-full">
          <button 
            onClick={() => onNavigate('settings')}
            className="text-slate-100 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-blue-500/10 transition-colors cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Yasal Bilgiler</h2>
        </div>
      </header>

      <main className="p-6 space-y-10">
        {/* Terms of Service */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-blue-400">
            <FileText size={24} />
            <h3 className="text-xl font-bold tracking-tight">Hizmet Şartları</h3>
          </div>
          
          <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
            <div className="space-y-2">
              <h4 className="text-slate-100 font-bold">1. Kabul ve Giriş</h4>
              <p>
                Bu uygulama ("Uygulama"), kullanıcıların sigarayı bırakma süreçlerini takip etmelerine, kriz anlarını yönetmelerine ve motivasyonel içeriklere erişmelerine yardımcı olmak amacıyla tasarlanmıştır. Uygulamayı indirerek veya kullanarak, bu şartları kabul etmiş sayılırsınız.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-slate-100 font-bold">2. Sağlık Beyanı ve Sorumluluk Reddi</h4>
              <p>
                Uygulama, bilimsel verilere (örneğin Bilişsel Davranışçı Terapi prensipleri) dayalı bilgilendirici içerikler ve takip araçları sunar. Ancak:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="font-semibold text-slate-100">Tıbbi Tavsiye Değildir:</span> Uygulama bir doktor, psikiyatrist veya profesyonel sağlık kuruluşunun yerini tutmaz.</li>
                <li><span className="font-semibold text-slate-100">Kişisel Sorumluluk:</span> Sigara bırakma sürecindeki fiziksel ve ruhsal değişimler kişiden kişiye farklılık gösterebilir. Herhangi bir sağlık sorunu yaşamanız durumunda bir sağlık profesyoneline danışmanız önerilir.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-slate-100 font-bold">3. Uygulama Özellikleri ve Kullanım</h4>
              <p>Uygulama kullanıcıya şu hizmetleri sunar:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="font-semibold text-slate-100">Gelişim Takibi:</span> Tasarruf edilen para, sigarasız gün sayısı ve kazanılan ömür gibi verilerin takibi.</li>
                <li><span className="font-semibold text-slate-100">Duygu ve Kriz Yönetimi:</span> Günlük duygu durumu kaydı ve "Kriz" butonu aracılığıyla sunulan sakinleşme teknikleri (4D tekniği, derin nefes vb.).</li>
                <li><span className="font-semibold text-slate-100">Eğitim İçerikleri:</span> Sesli ve yazılı bloglar, 30 günlük özel bırakma programları ve görevler.</li>
                <li><span className="font-semibold text-slate-100">Oyunlaştırma:</span> Başarı rozetleri, XP puanları ve sıralama listesi.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-slate-100 font-bold">4. Abonelik Sistemi ve Ödemeler</h4>
              <p>Uygulama, bazı özellikleri "Premium" (Taç ikonu ile belirtilen alanlar) kapsamında sunar.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="font-semibold text-slate-100">Ödeme:</span> Abonelik ücretleri, satın alma onayında uygulama mağazası hesabınızdan (App Store/Google Play) tahsil edilir.</li>
                <li><span className="font-semibold text-slate-100">Otomatik Yenileme:</span> Abonelikler, dönem bitiminden en az 24 saat önce iptal edilmediği sürece otomatik olarak yenilenir.</li>
                <li><span className="font-semibold text-slate-100">İptal ve İade:</span> İptal işlemleri ilgili uygulama mağazasının ayarlarından yapılmalıdır. Kısmi kullanımlar için iade yapılmaz.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-slate-100 font-bold">5. Kullanıcı Yükümlülükleri</h4>
              <p>
                Kullanıcılar, sıralama ve topluluk özelliklerini kullanırken diğer kullanıcılara saygılı olmalı ve sistemi manipüle edecek yanıltıcı veri girişinden kaçınmalıdır.
              </p>
            </div>
          </div>
        </section>

        <div className="h-px bg-slate-700 w-full" />

        {/* Privacy Policy */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-blue-400">
            <Shield size={24} />
            <h3 className="text-xl font-bold tracking-tight">Gizlilik Politikası</h3>
          </div>

          <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
            <div className="space-y-2">
              <h4 className="text-slate-100 font-bold">1. Toplanan Veriler</h4>
              <p>Uygulamayı kullanırken aşağıdaki veriler toplanabilir:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="font-semibold text-slate-100">Kişisel Bilgiler:</span> Hesap oluşturma sırasında verilen e-posta ve kullanıcı adı.</li>
                <li><span className="font-semibold text-slate-100">Kullanım Verileri:</span> Sigarayı bırakma tarihi, günlük içilen sigara adedi, bir paket ücreti gibi hesaplama araçları için gerekli bilgiler.</li>
                <li><span className="font-semibold text-slate-100">Duygu ve Sağlık Günlüğü:</span> Kullanıcının günlük olarak kaydettiği duygu durumları ve atlatılan kriz anlarına dair veriler.</li>
                <li><span className="font-semibold text-slate-100">Etkileşim Verileri:</span> Tamamlanan 30 günlük program görevleri, okunan bloglar ve kazanılan XP/rozet bilgileri.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-slate-100 font-bold">2. Verilerin Kullanım Amacı</h4>
              <p>Toplanan veriler şu amaçlarla kullanılır:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Kullanıcıya özel "Gelişim" ve "Sağlık" istatistiklerini oluşturmak.</li>
                <li>Kriz anlarında kişiselleştirilmiş destek sunmak ve gelişim programını yönetmek.</li>
                <li>Uygulama içi sıralama (leaderboard) sistemini işletmek.</li>
                <li>Abonelik durumunu doğrulamak ve premium özellikleri aktif etmek.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-slate-100 font-bold">3. Veri Paylaşımı ve Üçüncü Taraflar</h4>
              <p>
                Verileriniz, yasal zorunluluklar haricinde üçüncü taraflarla reklam amacıyla paylaşılmaz. Ödeme işlemleri, güvenli bir şekilde ilgili uygulama mağazası altyapıları üzerinden yürütülür.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-slate-100 font-bold">4. Veri Güvenliği ve Saklama</h4>
              <p>
                Verileriniz, modern güvenlik standartlarına uygun olarak şifrelenmiş sunucularda saklanır. Sigara bırakma sürecinize dair veriler, hesabınızı silmeniz durumunda sistemimizden de kaldırılır.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-slate-100 font-bold">5. Çocukların Gizliliği</h4>
              <p>
                Uygulama, sigara kullanımına yardımcı bir araç olduğu için genellikle 18 yaş ve üzeri bireylere yöneliktir. Reşit olmayan kullanıcıların ebeveyn denetiminde kullanması sorumluluğu kullanıcıya aittir.
              </p>
            </div>
          </div>
        </section>

        <footer className="pt-10 text-center">
          <p className="text-slate-500 text-xs italic">Son güncelleme: 18 Mart 2026</p>
        </footer>
      </main>
    </div>
  );
}
