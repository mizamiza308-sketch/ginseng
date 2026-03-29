import { Router } from "express";

const router = Router();

router.get("/providers", async (req, res) => {
  try {
    
    const response = await fetch("https://api.nexusggr.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "provider_list",
        agent_code: "power123",
        agent_token: "8ee1977973b3644d2cc51bce67f95c13",
       
      }),
    });
    const data: any = await response.json();
      res.json(data.data || []);
    } catch (err: any) {   // ✅ INI YANG KURANG
      console.error(err);
      res.status(500).json({ error: "Failed to fetch provider API" });
  }
    });

router.get("/games/:provider", async (req, res) => {
  try {
  const provider = req.params.provider;

  const response = await fetch("https://api.nexusggr.com", {
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

  const data: any = await response.json();
  const games = data?.data || [];

  const formatted = games.map((g: any) => ({
    name: g.game_name || g.name,
    image: g.image || g.icon,
  }));
    
    
    res.json(formatted);
  } catch (err: any) {   // ✅ FIX
      console.error(err);
      res.status(500).json({ error: "Failed to fetch game API" });
    }
  });

export default router;