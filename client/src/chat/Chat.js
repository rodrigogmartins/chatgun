import './Chat.css';

import { useEffect, useState, useReducer, useRef } from 'react'
import Gun, { SEA } from 'gun'
import debounce from 'lodash.debounce';

import { gun } from '../db'
import { Message } from '../message/Message'

const key = 'SECRET'
const initialState = {
  messages: []
}

function reducer(state, message) {
  return {
    messages: [...state.messages.slice(-50), message].sort((a, b) => a.createdAt - b.createdAt)
  }
}

function Chat({ loggedUser, logoutFunction }) {
  const scrollBottom = useRef(null);
  const [lastScrollTop, setLastScrollTop] = useState(Infinity)
  const [canAutoScroll, setCanAutoScroll] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [loggedUserAlias, setLoggedUserAlias] = useState('')
  const [state, dispatch] = useReducer(reducer, initialState)
  
  const watchScroll = debounce((e) => {
    const scrollOffset = 796;
    if (e.target.scrollTop === e.target.scrollHeight - scrollOffset) {
      setCanAutoScroll(false);
    } else {
      setCanAutoScroll((e.target.scrollTop || Infinity) > lastScrollTop);
    }
    setLastScrollTop(e.target.scrollTop)
  }, 200);

  function autoScroll() {
    scrollBottom?.current?.scrollIntoView({ behavior: 'smooth' });
    setCanAutoScroll(false)
  }

  const newMessagesArray = () => {
    const formattedMessages = state.messages.filter((value, index) => {
      const _value = JSON.stringify(value)
      return (index === state.messages.findIndex(obj => JSON.stringify(obj) === _value))
    })

    return formattedMessages
  }

  useEffect(() => {
    (async () => {
      await gun.get('chat')
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
            autoScroll()
          }
        })
      setLoggedUserAlias(await gun.get(`~${loggedUser.alias}`).get('alias'))
      autoScroll()
    })()
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
    setCanAutoScroll(true);
    autoScroll();
  }

  return (
    <div className="chat">
      <div className="chat-header">
        <div></div>
        {!!loggedUserAlias && <h3>Hi, <span className="username">{loggedUserAlias}</span>!</h3> }
        <button onClick={logoutFunction}>Logout</button>
      </div>
      <div className="messages-container" onScroll={watchScroll}>
        { 
          newMessagesArray().map((message, index) => {
            return <Message key={index} message={message} />
          })
        }
        <div ref={scrollBottom}></div>
      </div>
      { canAutoScroll &&
        <div className="scroll-button">
          <button onClick={autoScroll}>👇</button>
        </div>
      }
      <form className={canAutoScroll ? 'message-sender back-to-top' : 'message-sender'} onSubmit={sendMessage}>
        <input
          placeholder="Message"
          name="message"
          value={newMessage}
          autoComplete="off" 
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" disabled={!newMessage}>›</button>
      </form>
    </div>
  );
}

export { Chat }