
import React, { useState, useEffect } from 'react';

const mainWishesPool = [
  "Chúc bạn một năm đầy sức khỏe, hạnh phúc và thành công!",
  "Chúc mừng năm mới, vạn sự như ý, tỷ sự như mơ!",
  "Năm mới thắng lợi mới, công thành danh toại, gia đạo bình an!",
  "Chúc một năm mới an khang thịnh vượng, phát tài phát lộc!",
  "Mừng Xuân Ất Tỵ, dồi dào sức khỏe, vạn dặm bình an!",
  "Chúc mừng năm mới! Tiền vào cửa trước, vàng vào cửa sau, hai cái gặp nhau chui vào két sắt!",
  "Năm mới chúc bạn: Đau đầu vì giàu, mệt mỏi vì học giỏi, buồn phiền vì nhiều tiền!",
  "Chúc bạn năm mới: 12 tháng phú quý, 365 ngày phát tài, 8760 giờ sung túc!"
];

const extraWishesPool = [
  "🧧 Vạn sự như ý - An khang thịnh vượng!",
  "💰 Tấn tài tấn lộc - Tiền vào như nước!",
  "🌸 Mai đào khoe sắc - Xuân về ngập lối!",
  "🐲 Rồng bay phượng múa - Cả năm hanh thông!",
  "🏠 Gia đình sum họp - Trọn vẹn niềm vui!",
  "🌟 Hạnh phúc đong đầy - Gói trọn lộc tài!",
  "🍬 Tiền đầy túi - Tim đầy tình - Xăng đầy bình!",
  "🎊 Một năm mới với những khởi đầu mới rực rỡ!",
  "🚀 Sự nghiệp thăng tiến - Công danh rạng rỡ!",
  "🧧 Sống cho thỏa chí - Phúc lộc đầy nhà!",
  "🌈 Tình duyên phơi phới - Hạnh phúc ngất ngây!",
  "🍀 May mắn bủa vây - Quý nhân phù trợ!",
  "💎 Sức khỏe dẻo dai - Tinh thần sảng khoái!"
];

const GreetingMessage: React.FC = () => {
  const [showExtras, setShowExtras] = useState(false);
  const [randomMainWish, setRandomMainWish] = useState("");
  const [randomExtras, setRandomExtras] = useState<string[]>([]);

  useEffect(() => {
    setRandomMainWish(mainWishesPool[Math.floor(Math.random() * mainWishesPool.length)]);
    const shuffled = [...extraWishesPool].sort(() => 0.5 - Math.random());
    setRandomExtras(shuffled.slice(0, 6)); // Lấy 6 câu ngẫu nhiên
  }, []);

  return (
    <div 
      className="relative z-10 max-w-2xl w-full p-8 md:p-12 bg-black bg-opacity-40 backdrop-blur-lg rounded-3xl border-2 border-yellow-400 border-dashed shadow-[0_0_50px_rgba(255,215,0,0.3)] animate-fadeIn text-center cursor-pointer transition-all duration-500 hover:shadow-[0_0_80px_rgba(255,215,0,0.5)]"
      onClick={() => setShowExtras(!showExtras)}
    >
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-6xl animate-bounce">🧧</div>
      
      <h1 className="text-4xl md:text-7xl font-cursive text-yellow-300 mb-6 drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">
        Chúc Mừng Năm Mới!
      </h1>
      
      <p className="text-xl md:text-2xl text-white font-medium mb-8 leading-relaxed italic drop-shadow-md">
        "{randomMainWish}"
      </p>

      {showExtras && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 animate-slideDown">
          {randomExtras.map((wish, idx) => (
            <p 
              key={idx} 
              className="text-base md:text-lg text-yellow-100 font-semibold italic drop-shadow-sm bg-red-900 bg-opacity-30 p-2 rounded-lg border border-yellow-700"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {wish}
            </p>
          ))}
          <p className="col-span-full text-sm text-yellow-400 mt-4 animate-pulse uppercase tracking-widest font-bold">
            (Chạm để thu gọn)
          </p>
        </div>
      )}

      {!showExtras && (
        <div className="flex flex-col items-center gap-4">
          <button className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all border-2 border-yellow-400 animate-pulse hover:scale-110">
            NHẬN LỘC ĐẦU NĂM 🧧
          </button>
          <p className="text-yellow-200 text-xs opacity-70">Bấm vào đây để xem thêm nhiều lời chúc!</p>
        </div>
      )}
    </div>
  );
};

export default GreetingMessage;
