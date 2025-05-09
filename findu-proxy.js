import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/findu/:call', async (req, res) => {
  const url = `http://www.findu.com/cgi-bin/wxpage.cgi?call=${req.params.call}&units=metric`;
  const { data } = await axios.get(url);

  const match = (label) => {
    const r = new RegExp(`${label}:\\s*([^<]+)<br>`, 'i');
    return data.match(r)?.[1].trim() || null;
  };

  res.json({
    stationId: req.params.call,
    temp: parseFloat(match("Temperature")),
    humidity: parseInt(match("Humidity")),
    wind_kph: parseFloat(match("Wind")?.match(/(\\d+(\\.\\d+)?)/)?.[1]),
    gust_kph: parseFloat(match("Gust")?.match(/(\\d+(\\.\\d+)?)/)?.[1]),
    pressure_hpa: parseFloat(match("Pressure"))
  });
});

app.listen(3000, () => console.log("Proxy running on port 3000"));