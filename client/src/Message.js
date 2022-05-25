function Message({ message }) {
  return (
    <div key={message.createdAt}>
      <image src={`https://avatars.dicebear.com/api/initials/${message.name}.svg`} alt="avatar" title={message.name} />
      <div>
        <p>{message.message}</p>
        <time>{message.createdAt.toLocaleTimeString()}</time>
      </div>
    </div>
  )
}

export { Message }