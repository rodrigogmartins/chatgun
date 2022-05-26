import { useEffect, useState, useReducer } from 'react'
import Gun, { SEA } from 'gun'

import { gun } from './db'
import { Message } from './message/Message'

const key = 'SECRET'
// create the initial state to hold the messages
const initialState = {
  messages: []
}

// Create a reducer that will update the messages array
function reducer(state, message) {
  return {
    messages: [message, ...state.messages]
  }
}

function Chat({ loggedUser }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    gun.get('chat')
      .map()
      .once(async (data, id) => {
        if(!data) {
          return;
        }
        
        const message = {
          name: gun.user(data).get('alias'),
          message: `${(await SEA.decrypt(data.message, key))}`,
          createdAt: Gun.state.is(data, 'message')
        }

        if (message.message) {
          dispatch(message)          
        }
      })
  }, [])

  async function sendMessage() {
    if (!newMessage) {
      return;
    }
    const secret = await SEA.encrypt(newMessage, key)
    const message = gun.get('all').set({ message: secret })
    const index = new Date().toISOString();
    
    gun.get('chat').get(index).put(message)
    setNewMessage('')
  }

  return (
    <div style={{ padding: 30 }}>
      <input
        placeholder="Message"
        name="message"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>
      { 
        state.messages?.map((message, index) => {
          return <Message key={index} message={message} loggedUser={loggedUser} />
        })
      }
    </div>
  );
}

export { Chat }