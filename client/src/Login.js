import './login.css';

function Login() {
  return (
    <div className="container">
      <div>
        <label htmlFor="username">Username</label>
        <input name="username" autoFocus minLength="3" maxLength="16" />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input name="password" type="password" />
      </div>

      <div>
        <button>Login</button>
        <button>Sign Up</button>
      </div>
    </div> 
  )
}

export { Login }