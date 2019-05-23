import { action, observable } from 'mobx'

const initialUserInfo = {
  username: '',
  created: null
}

const initialConversation = []


const AppState = observable({
  chatSocket: null,
  composedMessageText: "",
  connectionState: false,
  conversations: initialConversation,
  currentlySelectedUsername: "",
  myChat: null,
  newMessageTo: "",
  selectedConversation: null,
  userInfo: initialUserInfo,
})

AppState.appendMessageToConversation = action((message, chatId) => {
  AppState.conversations.forEach(conversation => {
    if (conversation._id === chatId) {
      conversation.messages.push(message)
    }
  })
})

AppState.appendConversation = action(conversation => {AppState.conversations.push(conversation)})
AppState.setChatSocket = action(socket => {AppState.chatSocket = socket})
AppState.setComposedMessageText = action(text => {AppState.composedMessageText = text})
AppState.setConnectionState = action(isConnected => {AppState.connectionState = isConnected})
AppState.setConversations = action(conversations => {AppState.conversations = conversations})
AppState.setCurrentlySelectedUsername = action(val => {AppState.currentlySelectedUsername = val})
AppState.setNewMessageTo = action(name => {AppState.newMessageTo = name})
AppState.setMyChat = action(chat => {AppState.myChat = chat})
AppState.setSelectedConversation = action(id => {AppState.selectedConversation = id})
AppState.setUserInfo = action(info => {AppState.userInfo = info})

export default AppState
