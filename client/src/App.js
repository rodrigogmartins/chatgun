import { useState, useEffect } from 'react'

import { gun } from './db'
import { Chat } from './Chat'
import { Login } from './login/Login'

function App() {
  const [errorMessage, setErrorMessage] = useState('')
  const [loggedUser, setLoggedUser] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const user = gun.user().recall({ sessionStorage: true });
  
  useEffect(() => {
    user.get('alias').on((username) => setLoggedUser(username))
  }, [])

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
    user.auth(username, password, ({ err }) => {
      if(err) {
        setErrorMessage(err)
      } else {
        user.get('alias').on((username) => setLoggedUser(username))
      }
    });
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
        : <Chat
            loggedUser={loggedUser}
          />
      }
    </>
  );
}

export { App }