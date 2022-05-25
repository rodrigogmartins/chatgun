import { useEffect, useState, useReducer } from 'react'
import Gun from 'gun'
import { SEA } from 'gun'

import Message from './Message'
import { gun } from './db'

const key = 'SECRET'

const initialState = {
  messages: []
}

function reducer(state, message) {
  return {
    messages: [...state.messages.slice(-50), message]
  }
}

function Chat() {
  const [formState, setForm] = useState({
    name: '', message: ''
  })
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    gun.get('messages')
      .map()
      .once(async (data, id) => {
        const message = {
          name: gun.user(data).get('alias'),
          message: `${(await SEA.decrypt(data.message, key))}`,
          createdAt: Gun.state.is(data, 'message')
        }

        if (message.message) {
          dispatch(message)
        }
      });
  }, [])

  async function sendMessage() {
    const newMessage = {
      name: formState.name,
      message: formState.message
    }
    const secret = await SEA.encrypt(newMessage, key)
    const message = user.get('all').set({ message: secret })
    const index = new Date().toISOString();
    
    gun.get('chat').get(index).put(message)
    setForm({
      name: '', message: ''
    })
  }

  // update the form state as the user types
  function onChange(e) {
    setForm({ ...formState, [e.target.name]: e.target.value  })
  }

  return (
    <div style={{ padding: 30 }}>
      <input
        onChange={onChange}
        placeholder="Name"
        name="name"
        value={formState.name}
      />
      <input
        onChange={onChange}
        placeholder="Message"
        name="message"
        value={formState.message}
      />
      <button onClick={sendMessage}>Send Message</button>
      { state.messages.map(message => <Message message={message} />) }
    </div>
  );
}

export { Chat }