import './Chat.css';

import { useEffect, useState, useReducer } from 'react'
import Gun, { SEA } from 'gun'

import { gun } from '../db'
import { Message } from '../message/Message'

const key = 'SECRET'
// create the initial state to hold the messages
const initialState = {
  messages: []
}

// Create a reducer that will update the messages array
function reducer(state, message) {
  return {
    messages: [...state.messages.slice(-50), message]
  }
}

function Chat({ loggedUser }) {
  const [newMessage, setNewMessage] = useState('')
  const [state, dispatch] = useReducer(reducer, initialState)

  const newMessagesArray = () => {
    const formattedMessages = state.messages.filter((value, index) => {
      const _value = JSON.stringify(value)

      return (index === state.messages.findIndex(obj => JSON.stringify(obj) === _value))
    })

    return formattedMessages
  }

  useEffect(() => {
    gun.get('chat')
      .map({
        // lexical queries are kind of like a limited RegEx or Glob.
        '.': {
          // property selector
          '>': new Date(+new Date() - 1 * 1000 * 60 * 60 * 3).toISOString(), // find any indexed property larger ~3 hours ago
        },
        '-': 1, // filter in reverse
      })
      .once(async (data, id) => {
        if(!data) {
          return;
        }
        const fromName = await gun.get(`~${data.user}`).get('alias')
        const message = {
          name: fromName,
          message: `${(await SEA.decrypt(data.message, key))}`,
          createdAt: Gun.state.is(data, 'message'),
          isFromLoggedUser: loggedUser.alias === data.user
        }

        if (message.message) {
          dispatch(message)          
        }
      })
  }, [])

  async function sendMessage(e) {
    e.preventDefault()
    if (!newMessage) {
      return;
    }
    const secret = await SEA.encrypt(newMessage, key)
    const message = gun.get('all').set({ message: secret, user: loggedUser.alias })
    const index = new Date().toISOString();
    
    gun.get('chat').get(index).put(message)
    setNewMessage('')
  }

  return (
    <div className="chat">
      <div className="messagesContainer">
        { 
          newMessagesArray().map((message, index) => {
            return <Message key={index} message={message} />
          })
        }
      </div>
      <form className="messageSender" onSubmit={sendMessage}>
        <input
          placeholder="Message"
          name="message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">›</button>
      </form>
    </div>
  );
}

export { Chat }