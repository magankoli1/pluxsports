export default async function handler(req, res) {
  try {
    const token = process.env.SPORTMONKS_API_TOKEN;

    if (!token) {
      return res.status(500).json({
        error: "Sportmonks API token not found"
      });
    }

    const response = await fetch(
      "https://cricket.sportmonks.com/api/v2.0/fixtures" +
      "?api_token=" + token +
      "&include=localteam,visitorteam,venue" +
      "&filter[starts_between]=2026-08-19%2000:00:00,2026-08-26%2023:59:59"
    );

    const data = await response.json();

    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
