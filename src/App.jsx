import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Heart, Terminal, Sparkles } from 'lucide-react';

const FloatingHearts = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // Hər 400ms-dən bir yeni ürək yaradırıq
    const interval = setInterval(() => {
      setHearts(prev => {
        // Çox yüklənməməsi üçün ekranda maksimum 30 ürək saxlayırıq
        const newHearts = prev.length > 30 ? prev.slice(1) : prev;
        return [...newHearts, {
          id: Math.random(),
          left: Math.random() * 100, // Üfüqi oxda təsadüfi yer
          animationDuration: 4 + Math.random() * 4, // 4-8 saniyə arası uçuş sürəti
          size: 15 + Math.random() * 25 // Fərqli ölçülərdə ürəklər
        }];
      });
    }, 400);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="absolute -bottom-10 text-rose-500 opacity-80"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animation: `floatUp ${heart.animationDuration}s linear forwards`
          }}
        >
          ❤️
        </div>
      ))}
      <style>
        {`
          @keyframes floatUp {
            0% { transform: translateY(0) scale(0.5); opacity: 0; }
            10% { opacity: 0.8; }
            100% { transform: translateY(-110vh) scale(1.2); opacity: 0; }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
          .animate-shake {
            animation: shake 0.4s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

const Confetti = () => {
  const [particles, setParticles] = useState([]);
  // Konfeti rəngləri
  const colors = ['#ff718d', '#fdff6a', '#71b7ff', '#6aff8a', '#b071ff', '#ffa871'];

  useEffect(() => {
    // 60 ədəd təsadüfi konfeti dənəsi yaradırıq
    const newParticles = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 5, // Fərqli vaxtlarda düşməyə başlasınlar
      duration: 3 + Math.random() * 4, // Düşmə sürəti
      size: 6 + Math.random() * 8, // Ölçülər
      type: Math.random() > 0.5 ? 'circle' : 'square' // Forması
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute -top-5"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.type === 'circle' ? '50%' : '0',
            animation: `confettiFall ${p.duration}s linear ${p.delay}s infinite`
          }}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  // --- DİQQƏT: BURADAN ŞİFRƏNİ VƏ İPUCUNU DƏYİŞƏ BİLƏRSƏN ---
  const SECRET_PASSWORD = "seni sevirem"; // Kiçik hərflərlə yaz
  // ---------------------------------------------------------

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Daxil edilən şifrəni kiçik hərflərə çevirib kənarlarındakı boşluqları silirik
    const cleanInput = password.trim().toLowerCase();

    if (cleanInput === SECRET_PASSWORD) {
      setError(false);
      setIsUnlocked(true);
    } else {
      setError(true);
      setPassword(''); // Səhv olanda inputu təmizləyirik
      setTimeout(() => setError(false), 800); // 0.8 saniyə sonra error vəziyyətini ləğv edirik
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-black text-green-500 font-mono flex flex-col items-center justify-center p-4 selection:bg-green-500 selection:text-black">
        <div className="w-full max-w-md bg-gray-950 border border-green-500/30 p-6 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.2)]">
          <div className="flex items-center gap-3 mb-6 border-b border-green-500/30 pb-4">
            <Terminal className="w-6 h-6 animate-pulse" />
            <h1 className="text-xl tracking-widest font-bold">SİSTEM KİLİDLİ</h1>
            <Lock className="w-5 h-5 ml-auto text-red-500" />
          </div>

          <div className="space-y-4 mb-8 text-sm md:text-base">
            <p>{'>'} Məxfi sənədlərə giriş tələb olunur.</p>
            <p>{'>'} Xəbərdarlıq: Yalnız icazəli şəxslər daxil ola bilər.</p>
            <p className="text-gray-400 italic">
              {'>'} İpucu: Mən sənə hər gün nə deyirəm? (2 söz, boşluqla)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className={`relative flex items-center ${error ? 'animate-shake' : ''}`}>
              <span className="absolute left-3 text-green-500">{'>'}</span>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-black border ${error ? 'border-red-500 text-red-500' : 'border-green-500/50 text-green-500'} py-3 pl-8 pr-4 outline-none focus:border-green-400 transition-colors rounded`}
                placeholder="şifrəni daxil et..."
                autoComplete="off"
                autoFocus
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-xs mt-1">
                [XƏTA] Səhv şifrə! Yenidən cəhd edin.
              </p>
            )}

            <button
              type="submit"
              className="mt-2 flex items-center justify-center gap-2 bg-green-500 text-black py-3 px-4 rounded font-bold hover:bg-green-400 transition-colors"
            >
              <Unlock className="w-4 h-4" />
              SİSTEMƏ DAXİL OL
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-100 to-red-200 flex flex-col items-center justify-center p-4 relative overflow-hidden animate-gradient-xy">
      {/* Arxa planda uçuşan animasiyalar */}
      <FloatingHearts />
      <Confetti />

      {/* Əsas məzmun - Şüşə effekti (Glassmorphism) və pilləli animasiya */}
      <div className="z-10 bg-white/40 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-[0_8px_32px_0_rgba(255,105,135,0.3)] border border-white/60 w-full max-w-2xl text-center transform transition-all">
        
        {/* Ürək və ulduzlar - Birinci görünür */}
        <div className="flex justify-center mb-6 stagger-1">
          <div className="relative group cursor-pointer">
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 animate-heartbeat drop-shadow-xl" />
            <Sparkles className="w-10 h-10 text-yellow-500 absolute -top-3 -right-3 animate-spin-slow" />
          </div>
        </div>

        {/* Başlıq - İkinci görünür */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 tracking-tight stagger-2" style={{ fontFamily: 'Georgia, serif' }}>
          Ad Günün Mübarək,<br/>
          <span className="inline-block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 bg-[length:200%_auto] animate-shine pb-1">
            Sevgilim!
          </span>
        </h1>

        {/* Xətt - Üçüncü görünür */}
        <div className="w-32 h-1.5 bg-gradient-to-r from-rose-400 to-pink-500 mx-auto rounded-full mb-8 stagger-3 opacity-80"></div>

        {/* Əsas mətn - Dördüncü görünür */}
        <p className="text-lg md:text-xl text-gray-800 leading-relaxed mb-8 font-medium stagger-4 backdrop-blur-sm bg-white/40 p-6 rounded-2xl border border-white/50 shadow-inner">
          Sistemin şifrəsini tapdığın kimi, mənim də qəlbimin şifrəsini çoxdan tapmısan. 
          Həyatıma rəng qatan, məni hər gün daha xoşbəxt edən insan, yaxşı ki doğulmusan, yaxşı ki mənimləsən! 
          Səninlə keçirdiyim hər saniyə mənim üçün ən dəyərli xəzinədir.
        </p>

        {/* Alt buton - Beşinci görünür */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 items-center stagger-5">
          <div className="bg-gradient-to-r from-rose-400 to-pink-500 px-8 py-4 rounded-full shadow-lg shadow-pink-500/40 flex items-center gap-3 transform hover:scale-105 transition-transform duration-300 cursor-default">
            <Heart className="w-5 h-5 text-white fill-white animate-pulse" />
            <span className="text-white font-bold text-lg tracking-wide">Səni sonsuz sevirəm ♾️</span>
            <Heart className="w-5 h-5 text-white fill-white animate-pulse" />
          </div>
        </div>

      </div>

      <style>
        {`
          /* Hərəkətli gradient arxa plan */
          @keyframes gradientXY {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient-xy {
            background-size: 200% 200%;
            animation: gradientXY 10s ease infinite;
          }

          /* Yuxarıdan tökülən konfeti */
          @keyframes confettiFall {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
          }

          /* Ürək döyüntüsü */
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            15% { transform: scale(1.15); }
            30% { transform: scale(1); }
            45% { transform: scale(1.15); }
            60% { transform: scale(1); }
          }
          .animate-heartbeat {
            animation: heartbeat 2s ease-in-out infinite;
          }

          /* Yavaş fırlanan ulduzlar */
          @keyframes spinSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spinSlow 5s linear infinite;
          }

          /* Yazı üzərindən keçən işıq (Shine) */
          @keyframes shine {
            to { background-position: 200% center; }
          }
          .animate-shine {
            animation: shine 3s linear infinite;
          }

          /* Pilləli (Staggered) daxil olma animasiyaları */
          @keyframes slideUpFade {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .stagger-1 { opacity: 0; animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; }
          .stagger-2 { opacity: 0; animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards; }
          .stagger-3 { opacity: 0; animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards; }
          .stagger-4 { opacity: 0; animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.2s forwards; }
          .stagger-5 { opacity: 0; animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.5s forwards; }
        `}
      </style>
    </div>
  );
}
