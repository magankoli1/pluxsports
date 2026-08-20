export default async function handler(req, res) {
  try {
    const token = process.env.SPORTMONKS_API_TOKEN;

    if (!token) {
      return res.status(500).json({
        success: false,
        error: "SPORTMONKS_API_TOKEN is not configured"
      });
    }

    const today = new Date();

    const start = new Date(today);
    start.setDate(today.getDate() - 1);

    const end = new Date(today);
    end.setDate(today.getDate() + 7);

    const formatDate = (date) => {
      return date.toISOString().slice(0, 19).replace("T", " ");
    };

    const url =
      "https://cricket.sportmonks.com/api/v2.0/fixtures" +
      "?api_token=" + encodeURIComponent(token) +
      "&include=localteam,visitorteam,venue,league,season" +
      "&filter[starts_between]=" +
      encodeURIComponent(formatDate(start) + "," + formatDate(end));

    const response = await fetch(url);

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: "Sportmonks API request failed",
        details: data
      });
    }

    const fixtures = Array.isArray(data.data) ? data.data : [];

    const matches = fixtures.map((match) => ({
      id: match.id,

      name: match.name || "Cricket Match",

      status:
        match.status ||
        match.stage?.name ||
        "Scheduled",

      starting_at: match.starting_at || null,

      localteam: {
        id: match.localteam?.id || null,
        name: match.localteam?.name || "Team A",
        short_code: match.localteam?.short_code || "TBA",
        image_path: match.localteam?.image_path || null
      },

      visitorteam: {
        id: match.visitorteam?.id || null,
        name: match.visitorteam?.name || "Team B",
        short_code: match.visitorteam?.short_code || "TBA",
        image_path: match.visitorteam?.image_path || null
      },

      venue: match.venue
        ? {
            name: match.venue.name || "",
            city: match.venue.city || ""
          }
        : null,

      league: match.league
        ? {
            name: match.league.name || ""
          }
        : null
    }));

    return res.status(200).json({
      success: true,
      count: matches.length,
      matches
    });

  } catch (error) {
    console.error("Sportmonks error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to fetch cricket data",
      message: error.message
    });
  }
}
