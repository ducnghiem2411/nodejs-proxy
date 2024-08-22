const express = require('express')
import { createProxyMiddleware } from 'http-proxy-middleware'
var cors = require('cors')
const axios = require('axios')
const bodyParser = require('body-parser')
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
if (!TARGET_2) throw new Error('TARGET_2 is not defined')
if (!PORT_2) throw new Error('PORT_2 is not defined')

const app2 = express()
app2.use(cors())

app2.use(bodyParser.json())

app2.use((req, res) => {
    axios({
        method: req.method,
        url: TARGET_2 + req.originalUrl,
        data: req.body,
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            res.status(response.status).send(response.data)
        })
        .catch(error => {
            res.status(error.response?.status || 500).send(error.message)
        })
})

app2.listen(PORT_2, () => {
    console.log(`App_2 running on PORT ${PORT_2}`)
})

