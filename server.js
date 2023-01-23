const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()
const http = require('http').createServer(app)

// app config
app.use(express.json())
dotenv.config()

if (process.env.NODE_ENV === 'production') {
  // Express serve static files on production environment
  app.use(express.static(path.join(__dirname, 'dist')))
} else {
  // Configuring CORS
  const corsOptions = {
    // Make sure origin contains the url your frontend is running on
    origin: [
      'http://127.0.0.1:5173',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://localhost:3000',
      'http://127.0.0.1:4000',
      'http://localhost:4000',
    ],
    credentials: true,
  }
  app.use(cors(corsOptions))
}

// routes
const blockRoutes = require('./api/blocks/block.routes')
app.use('/api/blocks', blockRoutes)

// setting up sockets
const { setupSocketAPI } = require('./services/socket.service')
setupSocketAPI(http)

// Make every server-side-route to match the index.html
// so when requesting http://localhost:3030/index.html/car/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue-router to take it from there
app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const port = process.env.PORT || 3030

// listen
http.listen(port, () => console.log(`Server listening on port:${port}`))
