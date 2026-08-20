export default async function handler(req, res) {
  try {
    const token = process.env.SPORTMONKS_API_TOKEN;

    if (!token) {
      return res.status(500).json({
        success: false,
        error: "SPORTMONKS_API_TOKEN not configured"
      });
    }

    const url =
      "https://cricket.sportmonks.com/api/v2.0/fixtures" +
      "?api_token=" + encodeURIComponent(token) +
      "&include=localteam,visitorteam,venue,league";

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: "Sportmonks API request failed",
        details: data
      });
    }

    const fixtures = Array.isArray(data.data)
      ? data.data
      : [];

    const matches = fixtures.map(match => ({
      id: match.id,
      name: match.name || "Cricket Match",
      status: match.status || "Scheduled",
      starting_at: match.starting_at || null,

      localteam: {
        name: match.localteam?.name || "Team A",
        short_code: match.localteam?.short_code || "TBA",
        image_path: match.localteam?.image_path || null
      },

      visitorteam: {
        name: match.visitorteam?.name || "Team B",
        short_code: match.visitorteam?.short_code || "TBA",
        image_path: match.visitorteam?.image_path || null
      },

      venue: match.venue?.name || null,

      league: match.league?.name || null
    }));

    return res.status(200).json({
      success: true,
      count: matches.length,
      matches
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
