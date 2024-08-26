const express = require('express')
const TronWeb = require('tronweb')
const multer = require('multer')
var cors = require('cors')
import axios from 'axios'
const bodyParser = require('body-parser')
require('dotenv').config()


const TARGET_1 = process.env.TARGET_1
const PORT_1 = process.env.PORT_1

const btfsUploadMessage = "704639b728e6edfcc94988bd2ef7edb8f3aa3163574df9b282ec3d7a282aea89" // nft.btfs.io upload message

const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    headers: { "TRON-PRO-API-KEY": 'your api key' },
    privateKey: '704639b728e6edfcc94988bd2ef7edb8f3aa3163574df9b282ec3d7a282aea89'
})


if (!TARGET_1) {
    throw new Error('TARGET_1 is not defined')
}
if (!PORT_1) {
    throw new Error('PORT_1 is not defined')
}

const app = express()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' })
    }
    if (!req.body?.signature) {
        return res.status(400).json({ message: 'Signature is required' })
    }
    const signature = req.body.signature
    if (!req.body?.address) {
        return res.status(400).json({ message: 'Address is required' })
    }
    const address = req.body.address

    let isCorrectSigner = false
    try {
        isCorrectSigner = await tronWeb.trx.verifyMessage(btfsUploadMessage, signature, address)
    } catch (error) {
        return res.status(400).json({ message: 'Invalid signature' })
    }

    if (!isCorrectSigner) {
        return res.status(400).json({ message: 'Invalid signature' })
    }

    const uploadBody = {
        content: Array.from(req.file.buffer),
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
        address,
        signature,
    }

    const headers = {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json;charset=UTF-8',
        'origin': 'https://nft.btfs.io',
        'priority': 'u=1, i',
        'referer': 'https://nft.btfs.io/',
        'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
    }

    const { data } = await axios.post("https://nft-backend.btfs.io/api/upload", uploadBody, { headers: headers })

    res.json(data)
})

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

