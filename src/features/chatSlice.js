import { createSlice } from "@reduxjs/toolkit";

const chatsSlice = createSlice({
    name: 'Chat',
    initialState: {
        value: []
    },
    reducers: {

        setChats : (state,action) => {
            // state.value = [...action.payload] || []
            const chats = Array.isArray(action.payload) ? action.payload : []
            state.value = chats.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
        },

        createNewChats : (state, action) => {
            state.value.unshift(action.payload)
        },

        renameChats : (state, action) => {
            const updatedchat = action.payload
            state.value = state.value.map(chat => (chat._id == updatedchat._id ? updatedchat : chat))
        },

        deleteChat : (state, action) => {
            state.value = state.value.filter(chat => chat._id !== action.payload)
        }
    }
})

export const { setChats,createNewChats,renameChats, deleteChat } = chatsSlice.actions
export default chatsSlice.reducer