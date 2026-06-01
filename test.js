const express = require('express');
const app = express();
const path = require('path');

app.use(require('helmet')());
app.use('/uploads', express.static(path.join(__dirname, 'backend/uploads'), {
  setHeaders: (res) => res.set('Content-Type', 'image/jpeg')
}));

app.listen(5001, () => console.log('test server running'));
