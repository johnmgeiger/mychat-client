import React from 'react'
import { observer } from 'mobx-react'
import io from 'socket.io-client'

// local
import AppState from './state/Store'
import ChatApp from './components/ChatApp'
import MyChat from './util/MyChat'
import './App.scss'

const socketUrl = 'http://localhost:3001'
// const socketUrl = 'http://192.168.0.94:3001'

const SetUsername = observer(function () {
  let connectedAs = 'Connected as: '
  if (AppState && AppState.userInfo && AppState.userInfo.name)
    connectedAs += AppState.userInfo.name

  return (
    <div className="username-container">
      <h4>{connectedAs}</h4>
      <form action="return false;" onSubmit={e => {
          e.preventDefault()

          if (!AppState.chatSocket) {
            console.log('No connection established at this time..')
            return
          }
          if (!AppState.currentlySelectedUsername) {
            alert('Must enter a username')
            return
          }

          try {
            AppState.chatSocket.emit('updateUser', AppState.currentlySelectedUsername)
          } catch (e) {
            console.log(e)
          }
        }}>
        <span className="username-sub-container">Username:
          <input type="text" className="username-input" onChange={(event) => {
              AppState.setCurrentlySelectedUsername(event.target.value)
            }}></input>
          <button className="username-button" type='submit'>Update</button>
        </span>
      </form>
    </div>
  )
})

const App = observer( props => {

  const initChat = function () {
    if (!AppState.chatSocket) {
      const socket = io(socketUrl)
      AppState.setChatSocket(socket)
      AppState.setMyChat(MyChat)
      AppState.myChat(AppState, socket)
    }
  }

  initChat()

  return (
    <div className="App">
      <div className="app-container">
        <h1 className="app-header">MyChat Test Application</h1>
        <SetUsername></SetUsername>
        <ChatApp />
        <span>Status: <span style={{color: AppState.connectionState ? "green" : "red"}}>
          {AppState.connectionState ? "Connected" : "Disconnected"}
        </span>
        </span>
      </div>
    </div>
  );
})

export default App;
