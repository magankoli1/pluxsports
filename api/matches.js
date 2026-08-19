export default async function handler(req, res) {
  try {
    const token = process.env.SPORTMONKS_API_TOKEN;

    if (!token) {
      return res.status(500).json({
        error: "Sportmonks API token not found"
      });
    }

    const response = await fetch(
      `https://cricket.sportmonks.com/api/v2.0/livescores?api_token=${token}`
    );

    const data = await response.json();

    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch Sportmonks data"
    });
  }
}
