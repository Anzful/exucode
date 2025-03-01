import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { language, code } = req.body;

    try {
      // Send code to Piston API (third-party execution service)
      const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
        language,
        source: code,
      });

      const { run } = response.data;
      res.status(200).json({ output: run.output });
    } catch (error) {
      res.status(500).json({ error: 'Execution failed' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}