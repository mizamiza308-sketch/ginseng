import { useEffect, useState } from "react";
import { useParams } from "wouter";


const supportedProviders = [
  "PRAGMATIC",
  "PGSOFT",
  "REELKINGDOM",
  "FATPANDA",
  "HABANERO",
  "CQ9",
];

export default function GamePage() {
  const [games, setGames] = useState<any[]>([]);
  const [result, setResult] = useState(null);
  const params = useParams();
  const provider = params?.provider?.toUpperCase();

  const isSupported = supportedProviders.includes(provider || "");
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const registerRes = await
fetch("https://api.nexusggr.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            method: "user_create",
            agent_code: "power123",
            agent_token: "8ee1977973b3644d2cc51bce67f95c13",
            user_code: "test123"
          }),
        });

        const registerText = await registerRes.text();
        console.log("REGISTER:", registerText);
        const res = await 
 fetch("https://api.nexusggr.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            method: "game_list_v2",
            agent_code: "power123",
            agent_token: "8ee1977973b3644d2cc51bce67f95c13",
            provider_code: provider,
          }),
        });
        const text = await res.text();
        alert(text);

        const result = JSON.parse(text);
        console.log("FULL RESULT:", result);

        console.log("RESULT:", result);
        
        setGames(
          result?.data?.games ||
          result?.data?.list ||
          result?.games ||
          result?.data ||
          []
        );
        
        setResult(result);
        // 🔥 ambil dari result.data

      } catch (err) {
        console.error(err);
      }
    };

    fetchGames();
    }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>HALAMAN GAME</h1>
      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}

      <h2>Provider: {provider}</h2>
      {games.length 
        === 0 ? (
        <p>Tidak ada game</p>
      ) : (
        games.map((game: any, i) => (
          <div key={i}>
            <p>{game.name}</p>
          </div>
        ))
      )}

      {!isSupported && (
        <p style={{ color: "red" }}>
          Provider ini belum support ❌
        </p>
      )}

      {isSupported && (
        <p style={{ color: "green" }}>
          Provider ini support ✅
        </p>
      )}
    </div>
  );
}