var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.session.loggedin){
      const https = require('https');

      https.get('https://api.darksky.net/forecast/f54fa35918d8224632c548e17c835047/25.2048, 55.2708?units=uk2', (resp) => {
      let data = '';
  
      resp.on('data', (chunk) => {
        data += chunk;
      });
  
      resp.on('end', () => {
        console.log(JSON.parse(data).currently.windSpeed);
        console.log(JSON.parse(data).currently.precipProbability);
        console.log("YES");
        res.render('home', ({ title: 'Express' },{user:req.session.nickname , timezone: JSON.parse(data).timezone, time: 
          JSON.parse(data).currently.time, summary: JSON.parse(data).currently.summary, precipProbability: JSON.parse(data).currently.precipProbability,
          precipType: JSON.parse(data).currently.precipType, temperature: JSON.parse(data).currently.temperature, windSpeed: JSON.parse(data).currently.windSpeed}));
      });
  
      }).on("error", (err) => {
        console.log("Error: " + err.message);
        console.log("NO");
      });

      } else {
        res.render('index', { title: 'Express' });
    }
});
module.exports = router;
