import './login.css';

function Login({
  login,
  signUp, 
  username, 
  setUsername,
  password,
  setPassword,
  errorMessage
}) {
  return (
    <div className="container">
      {  
        errorMessage && <div className="error-message">
          <span>{errorMessage}</span>
        </div>
      }
      <div>
        <label htmlFor="username">Username</label>
        <input 
          name="username"
          value={username}
          onChange={(e) => setUsername((e.target.value))}
          autoFocus
          minLength="3" 
          maxLength="16"
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input 
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword((e.target.value))}
        />
      </div>

      <div>
        <button onClick={login}>Login</button>
        <button onClick={signUp}>Sign Up</button>
      </div>
    </div> 
  )
}

export { Login }