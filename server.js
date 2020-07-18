const express = require('express');

const app = express();

app.use(express.static('./www'));

app.get('/*', (req, res) => res.sendFile('index.html', { root: 'www/' }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Listining on ${PORT}`);
});
