const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 8000;
const __path = path.resolve();

require('events').EventEmitter.defaultMaxListeners = 500;

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/server', require('./qr'));
app.use('/code', require('./pair'));

app.get('/pair', (req, res) => {
    res.sendFile(path.join(__path, 'pair.html'));
});
app.get('/qr', (req, res) => {
    res.sendFile(path.join(__path, 'qr.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__path, 'main.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).send("❌ Page not found");
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════╗
║ ZARYA~MD Server is Running ✅
╠══════════════════════════════╣
║ Local: http://localhost:${PORT}
╚══════════════════════════════╝
`);
});

module.exports = app;
