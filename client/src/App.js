import { useState, useEffect } from 'react'

import { gun } from './db'
import { Chat } from './Chat'
import { Login } from './Login'

function App() {
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const user = gun.user().recall({ sessionStorage: true });
  
  useEffect(() => {
    setPassword('')
    user.get('alias').on((username) => setUsername(username))
  }, [user])

  gun.on('auth', async(event) => {
    const alias = await user.get('alias');
    username.set(alias);
    console.log(`signed in as ${alias}`);
  });

  function signup() {
    user.create(username, password, ({ err }) => {
      if (err) {
        alert(err);
      } else {
        login();
      }
    });
  }

  function login() {
    user.auth(username, password, ({ err }) => err && alert(err));
  }

  return (
    <>
      { !username ? <Login /> : <Chat /> }
    </>
  );
}

export { App }