const express = require('express');
const path = require('path');
const app = express();



// Serve static files from the Angular build directory
// Assuming your Angular build output is in the 'dist' folder
const staticPath = path.join(__dirname, '../Angular/dist/angular/browser');
console.log('Serving static files from:', staticPath);

// Serve static files
app.use(express.static(path.join(staticPath)));

// Handle all other routes and return the Angular index.html file
app.use((req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
});

const port = 4200;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
