import "./game1.css";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
const gameSections = [
  {
    title: "Slot",
    icon: "🎰",
    providers: [
      {
        name: "pragmatic",
        image: "https://i.postimg.cc/4dSRSJzH/j-LFiz37Ypq-PM3m-Lj-(1).png"
      },
      {
        name: "pgsoft",
        image: "https://i.postimg.cc/x8SMBpWz/Rq-H3JPihn-UEUZnbt.png"
      },
      {
      name: "jili",
        image: "https://i.postimg.cc/d1VhbP1D/b-B5p-Jw-PHpcw-M1dd-A.png"
      },
      {
        name: "microgaming",
        image: "https://i.postimg.cc/3Nwb0Rwh/w-YVzwcc-WYq-Bv-JLVv.png"
      },
      {
        name: "habanero",
        image: "https://i.postimg.cc/m2z8vKz1/GJ8Wysa5zj3lql-V3.png"
      }
    ]
  },
  {
    title: "Live Casino",
    icon: "🃏",
    providers: [
      {
        name: "evolution",
        image: "https://i.postimg.cc/90wPGpmX/UJ0lq-Xj8xt-EHXIRZ.png"
      },
      {
        name: "sexy",
        image: "https://i.postimg.cc/xxx-sexy.jpg"
      },
      {
        name: "playtech",
        image: "https://i.postimg.cc/xxx-sexy.jpg"
      },
      {
        name: "mikrogaming",
        image: "https://i.postimg.cc/xxx-sexy.jpg"
      },
      {
        name: "sa gaming",
        image: "https://i.postimg.cc/xxx-sexy.jpg"
      }
    ]
  },
  {
    title: "Sport",
    icon: "⚽",
    providers: [
      {
        name: "saba",
        image: "https://i.postimg.cc/T3W2W2yP/Ne1B9q97ZW6f-SA4P.png"
      },
      {
        name: "sbobet",
        image: "https://i.postimg.cc/xxx-sbobet.jpg"
      }
    ]
  },
  {
    title: "Tembak Ikan",
    icon: "🐟",
    providers: [
      {
        name: "cq9",
        image: "https://i.postimg.cc/mZM0Mcjq/q-B9EJ8LKx-Cbngwsy.png"
      },
      {
        name: "microgaming",
        image: "https://i.postimg.cc/26n2qWY9/Pe6Vug-Ufo-Xo-Xps-WX.png"
      }
    ]
  }
];
export default function Game1() {
  const [, setLocation] = useLocation();
  const [games, setGames] = useState<any[]>([]);
  
useEffect(() => {
    fetch("/api/games")
      .then((res) => res.json())
      .then((data) => {
        console.log("API DATA:", data); // WAJIB
        setGames(data.data || data.providers || data || []);
      })
      .catch(() => {
        setGames([]);
      });
  }, []);
  
  return (
    <div>
      {gameSections.map((section, i) => (
        <div key={i}>
          <h3 className="title">
            {section.icon} {section.title}
          </h3>

          <div className="scroll-container">
             {section.providers.map((item, j) => (
                <div
                  key={j}
                  className="provider-card"
                  onClick={() => setLocation(`/game/${item.name.toUpperCase()}`)}
                >
                  <img src={item.image} />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
    );
}
