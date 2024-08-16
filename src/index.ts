const express = require('express')
import { createProxyMiddleware } from 'http-proxy-middleware'
require('dotenv').config()

const TARGET_1 = process.env.TARGET_1
const PORT_1 = process.env.PORT_1

if (!TARGET_1) {
    throw new Error('TARGET_1 is not defined')
}
if (!PORT_1) {
    throw new Error('PORT_1 is not defined')
}

const app = express()

app.use(
    "/",
    createProxyMiddleware({
        target: TARGET_1,
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


app.listen(PORT_1, () => {
    console.log(`App_1 running on PORT ${PORT_1}`)
})

const TARGET_2 = process.env.TARGET_2
const PORT_2 = process.env.PORT_2

if (!TARGET_2) {
    throw new Error('TARGET_2 is not defined')
}
if (!PORT_2) {
    throw new Error('PORT_2 is not defined')
}

const app2 = express()

app2.use(
    "/",
    createProxyMiddleware({
        target: TARGET_2,
        changeOrigin: true,
        on: {
            proxyReq: (proxyReq, req, res) => {
                proxyReq.setHeader('Access-Control-Allow-Origin', '*')
                console.log(`Forwarded ${proxyReq.method} ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`)

                // Remove header
                proxyReq.removeHeader('User-Agent')
                proxyReq.removeHeader('Origin')
                proxyReq.removeHeader('Referer')

                proxyReq.setHeader('User-Agent', 'Server/1.0')
                proxyReq.setHeader('X-Server-Name', 'MyProxyServer')
                proxyReq.setHeader('Content-Type', 'application/json')
            },

            proxyRes: (proxyRes, req, res) => {
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            }
        },
    }),
)


app2.listen(PORT_2, () => {
    console.log(`App_2 running on PORT ${PORT_2}`)
})

