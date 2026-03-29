import "./togel.css";

const togelList = [
  {
    title: "Togel",
    items: [
      {
        name: "HONGKONG POOLS",
        date: "Sabtu 21/03/2026",
        result: ["7", "6", "7", "6"],
        close: "22:30",
        open: "23:00",
      },
      {
        name: "SINGAPORE",
        date: "Sabtu 21/03/2026",
        result: ["1", "2", "3", "4"],
        close: "21:00",
        open: "21:30",
      },
    ],
  },
];

export default function TogelSection() {
  const handleClick = (item: any) => {
    alert(`Masuk ke ${item.name}`);
    // nanti bisa arahkan ke halaman togel
  };

  return (
    <div className="togel-wrapper">
      {togelList.map((section, i) => (
        <div key={i}>
          <h2 className="togel-title">{section.title}</h2>

          <div className="togel-scroll">
            {section.items.map((item, j) => (
              <div
                key={j}
                className="togel-card"
                onClick={() => handleClick(item)}
              >
                <div className="togel-header">
                  {item.name}
                  <span className="togel-sub">(Setiap Hari)</span>
                </div>

                <div className="togel-date">{item.date}</div>

                <div className="togel-result">
                  {item.result.map((num, k) => (
                    <span key={k}>{num}</span>
                  ))}
                </div>

                <div className="togel-time">
                  Tutup: {item.close} | Buka: {item.open}
                </div>

                <button className="togel-btn">PLAY NOW</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}