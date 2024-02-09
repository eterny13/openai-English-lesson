import {type ChatRequestMessage} from "@azure/openai"
import axios from 'axios'

const apiKey = import.meta.env.VITE_API_KEY || "<api_key>"
const lessonPrompt = { role: "system", content: "The User is an English learner. Please give him one easy and simple English conversation question from the following situation" }
const advicePrompt = { role: "system", content: "Can you give a advice to improve the user's English talk." }

const apiURL = 'http://localhost:3000'
const headers = {
  'Content-Type': 'application/json',
  'api-key': apiKey
}

export async function createAdvice(situationPrompt: ChatRequestMessage, questionPrompt: ChatRequestMessage, userTalks: ChatRequestMessage ) {
  const req = {
    messages: [lessonPrompt, situationPrompt, questionPrompt, userTalks, advicePrompt]
  }
  const { data } = await axios.post(apiURL + "/api/completion", req, {headers: headers})
  return String(data)
}

export async function createLesson(situationPrompt: ChatRequestMessage) {
  const req = {
    messages: [lessonPrompt, situationPrompt]
  }
  const { data } = await axios.post(apiURL + "/api/completion", req, {headers: headers})
  return String(data)
}
