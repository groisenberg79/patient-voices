const axios = require('axios');

const searchDiseases = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  try {
    const response = await axios.get(
      'https://clinicaltables.nlm.nih.gov/api/conditions/v3/search',
      {
        params: {
          terms: name
        }
      }
    );

    const data = response.data;

    if (!Array.isArray(data) || data.length < 4) {
      throw new Error('Unexpected response format');
    }

    const namesArray = data[3]; // 4th item: [[name], [name], ...]
    const ids = data[1];        // 2nd item: ['366', '30572', ...]

    const results = namesArray.map((item, index) => ({
      name: item[0],          // unwrap from array
      id: ids[index] || null  // optional ID
    }));

    res.json(results);
  } catch (err) {
    console.error('Error fetching ClinicalTables data:', err.message);
    res.status(500).json({ error: 'Failed to fetch condition data' });
  }
};

module.exports = { searchDiseases };