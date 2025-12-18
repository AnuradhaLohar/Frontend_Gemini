import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import { marked } from "marked";
import conf from "../config/conf";

// const GEMINI_API_KEY = 'AIzaSyCG4lniixCeCpOcxg52iPLYqlpO231NhEM'
const GEMINI_API_KEY = conf.geminiApiKey
const BANKEND_URL = conf.backendUrl
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const getGeminiResponse = async (question) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: question,
    });
    const output = response.text;

    const parserdResponce = await marked.parse(output)
    // console.log(parserdResponce);

    return parserdResponce;

}

export const createNewChatinDB = async (name) => {
    let token = localStorage.getItem('token')
    let user = JSON.parse(localStorage.getItem('user'))
    if (!token || !user) return false;

    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    let data = {
        name,
        userId: user._id
    }


    try {
        const res = await axios.post(`${BANKEND_URL}/api/v1/chat/create-chat`, data, config);
        if (res.data.status == 'success') {
            return res.data.data;
        } else {
            console.log(res.data.message);
            return false;
        }
    } catch (error) {
        console.log('ERROR: ' + error.message);
        return false;
    }
    
}

export const renameChatinDB = async (id,name) => {
    let token = localStorage.getItem('token')
    let user = JSON.parse(localStorage.getItem('user'))

    if (!token || !user) return false;

    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    }

    let data = {
        id,
        name,
        // userId: user._id
    }


    try {
        const res = await axios.put(`${BANKEND_URL}/api/v1/chat/rename-chat`, data, config);
        if (res.data.status == 'success') {
            return res.data.data;
        } else {
            console.log(res.data.message);
            return false;
        }
    } catch (error) {
        console.log('ERROR: ' + error.message);
        return false;
    }
    
}


export const createNewMessageinDB = async (text, chatId, isGeminiResponse) => {
    let token = localStorage.getItem('token')
    if (!token) return false;

    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    let data = {text, chatId, isGeminiResponse }

    try {
        const res = await axios.post(`${BANKEND_URL}/api/v1/message/create-message`, data, config);
        if (res.data.status == 'success') {
            return res.data.data;
        } else {
            console.log(res.data.message);
            return false;
        }
    } catch (error) {
        console.log('ERROR: ' + error.message);
        return false;
    }
}

export const getChatsofUser = async () => {
    let token = localStorage.getItem('token')
    if (!token) return false
    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    try {
        const res = await axios.get(`${BANKEND_URL}/api/v1/chat/get-chats`, config)
        if (res.data.status == 'success') {
            return res.data.data
        } else {

            return false
        }
    } catch (error) {
        console.log('ERROR: ' + error.message);
        return false
    }
}

export const getMessagesofChat = async (chatId) => {
    let token = localStorage.getItem('token')
    
    if (!token) return []

    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    try {
        const res = await axios.get(`${BANKEND_URL}/api/v1/message/get-all-messages/${chatId}`, config)
        if (res.data.status == 'success') {
            return res.data.data
        } else {

            return false
        }
    } catch (error) {
        console.log('ERROR: ' + error.messages);
        return false
    }
}

export const deleteChatAndMessagsinDB = async (chatId) => {
    let token = localStorage.getItem('token')
    
    if (!token) return []

    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    try {
        const res = await axios.delete(`${BANKEND_URL}/api/v1/chat/delete-chat/${chatId}`, config)
        if (res.data.status == 'success') {
            return res.data.data
        } else {

            return false
        }
    } catch (error) {
        console.log('ERROR: ' + error.messages);
        return false
    }
}