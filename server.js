require('dotenv').config({
  path: '.env.local'
});
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

if(!process.env.STAGE) {
  console.error('STAGE environment variable is required')
  process.exit(1)
}

if(!process.env.HOSTNAME) {
  console.error('HOSTNAME environment variable is required')
  process.exit(1)
}

if(!process.env.PORT) {
  console.error('PORT environment variable is required')
  process.exit(1)
}

if(!process.env.NEXTAUTH_URL) {
  console.error('NEXTAUTH_URL environment variable is required')
  process.exit(1)
}

if(!process.env.NEXTAUTH_SECRET) {
  console.error('NEXTAUTH_SECRET environment variable is required')
  process.exit(1)
}

if(!process.env.REMOTE_CHECKOUT_DIRECTORY) {
  console.error('REMOTE_CHECKOUT_DIRECTORY environment variable is required')
  process.exit(1)
}

if(!process.env.LOCAL_STORAGE_DIRECTORY) {
  console.error('LOCAL_STORAGE_DIRECTORY environment variable is required')
  process.exit(1)
}

const dev = process.env.STAGE !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = parseInt(process.env.PORT, 10) || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
  .once('error', (err) => {
    console.error(err)
    process.exit(1)
  })
  .listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})