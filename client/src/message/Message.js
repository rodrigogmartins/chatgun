import './message.css';

function Message({ message }) {
  const messageSide = (message.isFromLoggedUser) ? 'right' : 'left'

  return (
    <div className={`messageContainer ${messageSide}`}>
      <img className="userPicture" src={`https://avatars.dicebear.com/api/initials/${message.name}.svg`} width="48" height="48" alt="avatar" title={message.name} />
      <div className={`messageContent ${messageSide}`}>
        <p>{message.message}</p>
        <time>{new Date(message.createdAt).toLocaleString()}</time>
      </div>
    </div>
  )
}

export { Message }