import { useState, useEffect } from 'react'

import { gun } from './db'
import { Chat } from './Chat'
import { Login } from './Login'

function App() {
  const [errorMessage, setErrorMessage] = useState('')
  const [loggedUser, setLoggedUser] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const user = gun.user().recall({ sessionStorage: true });
  
  useEffect(() => {
    setPassword('')
    user.get('alias').on((username) => setLoggedUser(username))
  }, [user])

  gun.on('auth', async(event) => {
    const alias = await user.get('alias');
    loggedUser.set(alias);
    console.log(`signed in as ${alias}`);
  });

  function signUp() {
    user.create(username, password, ({ err }) => {
      if (err) {
        setErrorMessage(err);
      } else {
        login();
      }
    });
  }

  function login() {
    user.auth(username, password, ({ err }) => err && setErrorMessage(err));
  }

  return (
    <>
      { !loggedUser 
        ? <Login 
            login={login}
            signUp={signUp}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            errorMessage={errorMessage}
          />
        : <Chat /> }
    </>
  );
}

export { App }