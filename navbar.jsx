export default function Navbar() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#0b3d2e] flex justify-around items-center py-2">

      <div className="flex flex-col items-center text-yellow-400">
        <img src="https://i.postimg.cc/NM56nS5g/menu-1.png" className="w-6 h-6 mb-1" />
        <span className="text-xs">Beranda</span>
      </div>

      <div className="flex flex-col items-center text-white">
        <img src="/icons/rtp.png" className="w-6 h-6 mb-1" />
        <span className="text-xs">RTP</span>
      </div>

      <div className="flex flex-col items-center text-yellow-400">
        <img src="/icons/user.png" className="w-6 h-6 mb-1" />
        <span className="text-xs">Profil</span>
      </div>

      <div className="flex flex-col items-center text-white">
        <img src="/icons/promo.png" className="w-6 h-6 mb-1" />
        <span className="text-xs">Promo</span>
      </div>

      <div className="flex flex-col items-center text-white">
        <img src="/icons/chat.png" className="w-6 h-6 mb-1" />
        <span className="text-xs">Hubungi</span>
      </div>

    </div>
  );
}