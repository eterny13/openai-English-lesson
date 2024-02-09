const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { OpenAIClient, AzureKeyCredential } = require('@azure/openai')

const app = express()
const port = 3000
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
}


require('dotenv').config()

app.use(cors(corsOptions))
app.use(bodyParser.json())

const endpoint = process.env.ENDPOINT || "<endpoint>"
const apiKey = process.env.API_KEY || "<apikey>"

const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey))

app.post('/api/completion', async(req, res) => {
  const prompt = req.body.messages

  const { choices } = await client.getChatCompletions(
    "gpt-4-32k",
    prompt 
  )
  
  for (const choice of choices) {
    res.send(choice.message?.content)
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
