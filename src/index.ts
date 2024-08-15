const express = require('express')
import { createProxyMiddleware } from 'http-proxy-middleware'
require('dotenv').config()

const TARGET = process.env.TARGET
if (!TARGET) {
    throw new Error('TARGET is not defined')
}
const app = express()

app.use(
    "/",
    createProxyMiddleware({
        target: TARGET,
        changeOrigin: true,
        on: {
            proxyReq: (proxyReq) => {
                // Enable CORS
                proxyReq.setHeader('Access-Control-Allow-Origin', '*')
                console.log(`Forwarded ${proxyReq.method} ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`)

                // Remove header
                proxyReq.removeHeader('User-Agent')
                proxyReq.removeHeader('Origin')
                proxyReq.removeHeader('Referer')
            },

            proxyRes: (proxyRes, req, res) => {
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            }
        },
    }),
)


const PORT = 5002
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})
