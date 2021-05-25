import { createServer } from 'miragejs'

// Mock server
// When running app with 'npm run dev'
// this server will start and mock calls as defined here
// useful to run trades without spending money
const testServer = () => {
  createServer({
    routes() {
      // Set everything as passthrough to later override only the endpoints we want
      // NOTE: If new origins are added, new passthroughs will be needed
      this.passthrough()
      this.passthrough('https://api.prod.dex.guru/**')
      this.passthrough('https://raw.githubusercontent.com/**')
      this.passthrough('https://api.0x.org/**')
      this.passthrough('https://api.coingecko.com/**')
      this.passthrough('https://gas.api.0x.org/')
      this.passthrough('https://gas.api.0x.org/**')

      // Mock the actual endpoints here
      this.get('/api/reminders', () => ({
        reminders: [],
      }))
    },
  })
}

export default testServer
