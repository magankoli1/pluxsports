export default async function handler(req, res) {
  try {
    const token = process.env.SPORTMONKS_API_TOKEN;

    if (!token) {
      return res.status(500).json({
        error: "Sportmonks API token not found"
      });
    }

    const today = new Date().toISOString().split("T")[0];

    const response = await fetch(
      `https://cricket.sportmonks.com/api/v2.0/fixtures?api_token=${token}&include=localteam,visitorteam,venue&filter[starting_at]=${today}`
    );

    const data = await response.json();

    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch current fixtures"
    });
  }
}
