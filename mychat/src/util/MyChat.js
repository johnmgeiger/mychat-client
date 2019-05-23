export default function (AppState) {
  const socket = AppState.chatSocket

  socket.on('appendedConversation', data => {
    AppState.appendConversation(data)
    socket.emit('subscribe', data._id)
  })

  socket.on('connect', function () {
    AppState.setConnectionState(AppState.chatSocket.connected)
  })

  socket.on('canversationHasChanged', () => {
    console.log('May have recieved a message. Time to update.')
    socket.emit('updateUser', AppState.currentlySelectedUsername)
  })

  socket.on('disconnect', () => {
    AppState.setConnectionState(AppState.chatSocket.connected)
  })

  socket.on('errorMessage', msg => {alert(msg)})

  socket.on('newMessage', data => {
    AppState.appendMessageToConversation(data.message, data.chatId)
  })

  socket.on('updatedConversations', data => {
    AppState.setConversations(data)

    for (const i in data) {
      const conversation = data[i]
      socket.emit('subscribe', conversation._id);
    }
  })

  socket.on('updatedUser', data => {
    AppState.setUserInfo(data)
    socket.emit('getAllConversations')
  })
}
