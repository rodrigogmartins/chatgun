import { useState, useEffect } from 'react'

import { gun } from './db'
import { Chat } from './Chat'

function App() {
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const user = gun.user().recall({ sessionStorage: true });

  useEffect(() => {
    user.get('alias').on((username) => setUsername(username))
  }, [])

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
      { !!username 
        ? <div>
            <label for="username">Username</label>
            <input name="username"  minlength="3" maxlength="16" />

            <label for="password">Password</label>
            <input name="password"  type="password" />

            <button class="login" on:click={login}>Login</button>
            <button class="login"  on:click={signup}>Sign Up</button>
          </div> 
        : <Chat />
      }
    </>
  );
}

export { App }