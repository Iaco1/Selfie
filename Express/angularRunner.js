const express = require('express');
const path = require('path');
const app = express();
const https = require('https');
const fs = require('fs');

// Define paths for your SSL certificate and key
const sslKeyPath = path.join(__dirname, '../Angular/cert-key.pem');
const sslCertPath = path.join(__dirname, '../Angular/cert.pem');

// Read SSL certificate and key files
const sslKey = fs.readFileSync(sslKeyPath, 'utf8');
const sslCert = fs.readFileSync(sslCertPath, 'utf8');

// Serve static files from the Angular build directory
const staticPath = path.join(__dirname, '../Angular/dist/angular/browser');
console.log('Serving static files from:', staticPath);

// Serve static files
app.use(express.static(path.join(staticPath)));

// Handle all other routes and return the Angular index.html file
app.use((req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
});

// Create the HTTPS server
const httpsOptions = {
    key: sslKey,
    cert: sslCert,
};


const port = 4200;
https.createServer(httpsOptions, app).listen(port, () => {
    console.log(`Server running on https://localhost:${port}`);
});

