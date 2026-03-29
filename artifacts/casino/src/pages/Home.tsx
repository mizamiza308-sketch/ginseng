import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { useGetMe } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Volume2, Trophy, Flame, ChevronRight, Play } from "lucide-react";
import { useLocation } from "wouter";
import Navbar from "../navbar.jsx";
import { formatCurrency } from "@/lib/utils";
import TogelSection from "../togel/TogelSection.tsx";
import Game1 from "../game1";

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: user } = useGetMe({ query: { retry: false } });
  
  // Fake jackpot counter effect
  const [jackpot, setJackpot] = useState(2780859860.79);

  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot((prev) => prev + Math.floor(Math.random() * 500));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let index = 0;

    const intervalSlider = setInterval(() => {
      if (sliderRef.current) {
        const width = sliderRef.current.clientWidth;

        index++;

        sliderRef.current.scrollTo({
          left: width * index,
          behavior: "smooth",
        });

        if (index >= 5) index = 0;
      }
    }, 3000);

    return () => clearInterval(intervalSlider);
    }, []);
  
  
  return (
    <Layout>

      <div className="relative w-full aspect-[18/9] rounded-2xl overflow-hidden shadow-2xl border border-border">
        <div
          ref={sliderRef}
          className="flex overflow-x-auto w-full h-full scroll-smooth snap-x snap-mandatory"
        >
          <img
            src="https://i.postimg.cc/kX3QPZdT/file-0000000032cc71fa8222d6eae940fc54.png"
            className="w-full h-full object-cover object-top flex-shrink-0 snap-start"
          />
          <img
            src="https://i.postimg.cc/43kk6XCK/file-0000000066f071fab6f522917dde15da.png"
            className="w-full h-full object-cover object-top flex-shrink-0 snap-start"
          />
          <img
            src="https://i.postimg.cc/brCdrsBQ/file-00000000d10871fa8ac6e846ec8d55ac.png"
            className="w-full h-full object-cover object-top flex-shrink-0 snap-start"
          />
          <img
            src="https://i.postimg.cc/hvrZdqLq/file-0000000055f471faa2b63a516e78862e.png"
            className="w-full h-full object-cover object-top flex-shrink-0 snap-start"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          
        </div>
      </div>
        

            {/* Ticker */}
      <div className="bg-card border-b border-border py-1 px-4 flex items-center gap-2 overflow-hidden">
        <Volume2 size={16} className="text-primary shrink-0" />
        <div className="relative flex-1 overflow-hidden whitespace-nowrap text-sm text-muted-foreground">
          <div className="inline-block animate-marquee">
            Selamat datang di KELENTET! Situs judi online terpercaya di Indonesia. Nikmati bonus new member 100% dan event freespin menarik setiap harinya!
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        
        {/* Auth / Action Buttons */}
        {!user ? (
          <div className="grid grid-cols-2 gap-3">
            <Link href="/login">
              <button className="w-full py-3 rounded-xl bg-card border border-primary/50 text-primary font-bold text-sm tracking-wide shadow-[0_0_15px_rgba(247,183,29,0.15)] hover:bg-primary/10 transition-all">
                MASUK
              </button>
            </Link>
            <Link href="/register">
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-yellow-500 text-black font-extrabold text-sm tracking-wide shadow-lg shadow-primary/25 hover:brightness-110 transition-all">
                DAFTAR
              </button>
            </Link>
          </div>
        ) : (
      <div className="grid grid-cols-2 gap-4 px-4 mt-3">
        <Link href="/user/deposit">
          <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-yellow-400 text-white font-bold">
            <img src="https://i.postimg.cc/VkbF2H48/deposit.png" className="w-8 h-8" />
            DEPOSIT
          </button>
        </Link>

        <Link href="/user/withdraw">
          <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-yellow-400 text-white font-bold">
            <img src="https://i.postimg.cc/4xFrQMyx/withdraw.png" className="w-8 h-8" />
            WITHDRAW
          </button>
        </Link>
      </div>
        )}

        {/* Hero Banner */}
        <div className="relative px-4">

          {/* tombol kiri */}
          <button className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/40 px-2 rounded-full">
            {"<"}
          </button>

          {/* list menu */}
          <div className="flex overflow-x-auto no-scrollbar px-2 gap-2">

            <div className="flex flex-col items-center min-w-[25%]">
              <img src="https://i.postimg.cc/G3SWntvx/game-2-mobile.png" className="w-9 h-9" />
              <span className="text-white text-[10px] mt-1 leading-tight">
                SLOT
              </span>
            </div>

            <div className="flex flex-col items-center min-w-[25%]">
              <img src="https://i.postimg.cc/wMTgfrKF/game-7-mobile.png" className="w-9 h-9" />
              <span className="text-white text-[10px] mt-1 leading-tight">
                TOGEL
              </span>
            </div>

            <div className="flex flex-col items-center min-w-[25%]">
              <img src="https://i.postimg.cc/fLPBp31Z/game-3-mobile.png" className="w-9 h-9" />
              <span className="text-white text-[10px] mt-1 leading-tight">
                LIVE CASINO
              </span>
            </div>

            <div className="flex flex-col items-center min-w-[25%]">
              <img src="https://i.postimg.cc/xjH4h5jH/game-5-mobile.png" className="w-9 h-9" />
              <span className="text-white text-[10px] mt-1 leading-tight">
                SPORT
              </span>
            </div>

            <div className="flex flex-col items-center min-w-[25%]">
              <img src="https://i.postimg.cc/9fm2FS05/game-8-mobile.png" className="w-9 h-9" />
              <span className="text-white text-[10px] mt-1 leading-tight">
                SAMBUNG AYAM
              </span>
            </div>
            
            <div className="flex flex-col items-center min-w-[25%]">
              <img src="https://i.postimg.cc/CKRgq8CV/game-4-mobile.png" className="w-9 h-9" />
              <span className="text-white text-[10px] mt-1 leading-tight">
                TEMBAK IKAN
              </span>
            </div>
          </div>

          {/* tombol kanan */}
          <button className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/40 px-2 rounded-full">
            {">"}
          </button>

        </div>

        {/* Jackpot Counter */}

        <div className="w-full flex flex-col items-center justify-center mt-2">
        <h2 className="text-white text-center font-black text-xl tracking-normal mb-1">
          JACKPOT PROGRESIF
        </h2>
          
          <div className="w-full flex justify-center">
        <motion.div 
           className="bg-gradient-to-br from-card to-background border border-primary/30 rounded-2xl p-1 text-center shadow-[0_0_20px_rgba(247,183,29,0.1)] relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 🔥 BORDER LUAR GLOW */}
          <div className="absolute inset-0 rounded-xl border border-green-400 shadow-[0_0_20px_#22c55e]"></div>

          {/* 🔥 BORDER DALAM */}
          <div className="absolute inset-1 rounded-lg border border-green-300 opacity-40"></div>

          {/* 🔥 EFEK SCAN LED */}
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-green-400/40 to-transparent animate-[scan_2s_linear_infinite]"></div>
          </div>
          <div
          className="relative z-10 text-green-400 text-2xl md:text-4xl tracking-widest"
          style={{
            fontFamily: "'Digital-7 Mono', monospace",
            textShadow: "0 0 10px #22c55e, 0 0 20px #22c55e"
          }}>
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(jackpot). replace("Rp", "IDR")}
          </div>
        </motion.div>
        </div>
        </div>
      </div>     
      <TogelSection />
      <Game1 />
    
      {/* BANK */}
      <div className="px-4 mt-6 text-white">
        <h2 className="mb-3 text-sm opacity-80">
          Bekerja sama dengan BANK :
        </h2>

        <div className="grid grid-cols-3 gap-3">
          {[
            "https://i.postimg.cc/pd1YQ0S7/ECsu-LWSup-Zten10M.png",
            "https://i.postimg.cc/Nf76CGVR/3am-RHJF8Ew-KSBVe2.png",
            "https://i.postimg.cc/hGwTQXzg/LKZNDc-Lk-KUZs-Yo-UV.png",
            "https://i.postimg.cc/gjyZ74Mx/we-Gvms-Nb-B6gwaoi-M.png",
            "https://i.postimg.cc/L8QZGJVv/r-VEHdclx-Lbl-S93Id.png",
            "https://i.postimg.cc/qRyhtjHb/L2opavb-Hl-As-Acnn-Y.png",
            "https://i.postimg.cc/tRdnpS5y/Kj2HNqebh-Gs-Xn-K2C.png",
            "https://i.postimg.cc/fRPJB6zz/Be-CJaz-G7PUn-DPE8I.png",
            "https://i.postimg.cc/MHzTnwDx/Lsi-Fq-FJz-Je-GLz7Jr.png",
            "https://i.postimg.cc/Y2x0J4rY/a-Hag8AI2fxg-VHy-Mp.png",
            "https://i.postimg.cc/9fTF10gW/2Bdt-Jpi-YQs-Tj-Ah-Si.png",
            "https://i.postimg.cc/XNxNsTLQ/pzj-Mm-Pq-Lq-Jo-B4Gxm.png",
          ].map((item, i) => (
            <div
              key={i}
              className="border border-yellow-500 rounded-lg p-1 bg-[#0b3d2e]"
            >
              <img
                src={item}
                className="h-8 mx-auto object-contain"
                onError={(e) =>
                  (e.currentTarget.src = "https://via.placeholder.com/50")
                }
              />
            </div>
          ))}
        </div>
      </div>
      {/* PROVIDER */}
            <div className="px-4 mt-6 text-white">
              <h2 className="mb-3 text-sm opacity-80">
                Bekerja sama dengan PROVIDER :
              </h2>

              <div className="grid grid-cols-3 gap-3">
                {[
                  "https://i.postimg.cc/MpFs6KDy/h-P4ua-W1j9K2Aly-Vv.png",
                  "https://i.postimg.cc/Ghk83MxT/w9D4o4h-XE6Ffxkct.png",
                  "https://i.postimg.cc/tTKJpP1k/Qn9ydbba5HAHVpqt.png",
                  "https://i.postimg.cc/JzrnrRh9/STgyif-Wgfx-ZX8Xdd.png",
                  "https://i.postimg.cc/QtTN4t6J/7Ny-F4s7q-BEf-Zdz-Yv.png",
                  "https://i.postimg.cc/wT0zkL6L/4qva-CEy-Po-RKn-So-RK.png",
                  "https://i.postimg.cc/VvzyqLpT/q-Vj2pc4tq5j-NTETa.png",
                  "https://i.postimg.cc/T3FZkcBH/2bx-Uoi-MZi-TUWITao.png",
                  "https://i.postimg.cc/HWzFGmfX/o-RI9UH3Pqlr-Vdkrc.png",
                  "https://i.postimg.cc/mDRpqpj9/PCIJf-HBob-XU23DYh.png",
                  "https://i.postimg.cc/vB3hKYcm/q-KNOBHGMC3Wg7d-UY-(2).png",
                  "https://i.postimg.cc/bNGg6jPK/z3JBu-C9gd-C8YRGi5.png",
                  "https://i.postimg.cc/9MFtZ6JV/Ox-RGZisx-Bcq-Aj8e-M.png",
                  "https://i.postimg.cc/440bHFc1/NQLOXa-Cr-M298Sx-MK.png",

      "https://i.postimg.cc/Kvd6fN6q/Pc-M0ND3RJmz-Owky-M.png",
            "https://i.postimg.cc/tTSfxtdt/gmmom-Xzs-Knwrcf-OJ.png",
            "https://i.postimg.cc/g2F780hS/TS5Hs0Er3b-KNf1Gm.png",
            "https://i.postimg.cc/PqKVgzR4/fn-DYsk-KRs-M11p1Uf.png",
            "https://i.postimg.cc/kgskCmVh/JMWGAw-RJou-C2hm-H6.png",
            "https://i.postimg.cc/MTM41fs8/Yp-Mis-Nvksb-UZnl9M.png",
            "https://i.postimg.cc/h4m6jxzc/4Q4HAv8VBYl-UHAj-Z.png",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="border border-yellow-500 rounded-lg p-1 bg-[#0b3d2e]"
                  >
                    <img
                      src={item}
                      className="h-8 mx-auto object-contain"
                      onError={(e) =>
                        (e.currentTarget.src = "https://via.placeholder.com/50")
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </Layout>
        );
      }


  
        
      
        

