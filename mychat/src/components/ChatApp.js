import React from 'react'
import { observer } from 'mobx-react'

// local
import AppState from '../state/Store'
import './ChatApp.scss'

const Conversations = observer(props => {
  const renderConversations = () => {

    if (!AppState.conversations)
      return null

    const conversationsList = [...AppState.conversations]
    .sort((a, b) => {
      return new Date(b.lastUpdated) - new Date(a.lastUpdated)
    }) // end sort
    .map((item, i) => {
      if (!item.members)
        return null

      let msgHead = ""
      item.members.forEach(member => {
        if (AppState.userInfo && member !== AppState.userInfo.name)
          msgHead += `${member}, `
      })
      msgHead = msgHead.substring(0, msgHead.length - 2)

      const isActiveItem = AppState.selectedConversation === `${item._id}`
      const liClass = `conversations-item ${isActiveItem ? 'active' : 'nah'}`
      const spanClass = `conversations-item-text ${isActiveItem ? 'active' : ''}`

      return(
        <li className={liClass} key={i} data-id={item._id} onClick={event => {
          AppState.setSelectedConversation(event.target.getAttribute('data-id')) }}>
          <span className={spanClass}>{msgHead}</span>
        </li>
      )
    }) // end map

    return (
      <ul className="conversations-item-container">
        <li className="add-conversation">
          <form action="return false;" onSubmit={e => {
            e.preventDefault();

            // create new conversation
            AppState.chatSocket.emit('createConversation', AppState.newMessageTo)

            // clear imput
            AppState.setNewMessageTo("")
          }}>
            <span>
              <span>New to:  </span>
              <input
                className="new-message-input"
                type="text"
                value={AppState.newMessageTo}
                onChange={e => {
                  AppState.setNewMessageTo(e.target.value)
                }}></input>
              <button className="new-message-button" type="submit">Create</button>
            </span>
          </form>
        </li>
        {conversationsList}
      </ul>)
  }

  return(
    <div className="conversations">
      {renderConversations()}
    </div>
  )
})

const ActiveConversation = observer( props => {
  const renderConversation = () => {

    if (!AppState.selectedConversation || !AppState.conversations)
      return (<div>Nothing Selected</div>)

    const activeConversation = AppState.conversations.find( element => {
        return element._id === AppState.selectedConversation
    })

    if (!activeConversation) {
      return (<div>No Chat Selected</div>)
    }


    const messagesList = activeConversation.messages.map((message, i) => (
        <li className="message-text" key={i}>
          <span className="message-sender">{message.sender ? `${message.sender}: ` : ""}</span>
          <span>{message.message ? message.message : ""}</span>
        </li>
      ))

    return (
      <ul className="active-conversation-list">
        {messagesList}
      </ul>
    )
  }

  return (
    <div className="active-conversation">
      <div className="conversation-container">
        {renderConversation()}
      </div>
      <form className="compose-message-container" action="return false;" onSubmit={(event) => {
        event.preventDefault();

        if (!AppState.userInfo) {
          alert('Sign in as a user first!')
        }

        if (!AppState.selectedConversation) {
          alert('Selected a conversation')
          return
        }

        const activeConversation = AppState.conversations.find( element => {
            return element._id === AppState.selectedConversation
        })

        // send message to server
        AppState.chatSocket.emit('sendMessage', {
          roomId: activeConversation._id,
          message: AppState.composedMessageText
        })

        // clear message input
        AppState.setComposedMessageText('')
      }}>
        <input  className="compose-message-input"
                type="text"
                onChange={(event => {
                  AppState.setComposedMessageText(event.target.value)
                })}
                value={AppState.composedMessageText}/>
        <button className="send-message" type="submit">SEND</button>
      </form>
    </div>
  )
})

const ChatApp = observer(props => {

  return (
    <div className="chat-app">
      <Conversations />
      <ActiveConversation />
    </div>
  )
})

export default ChatApp
