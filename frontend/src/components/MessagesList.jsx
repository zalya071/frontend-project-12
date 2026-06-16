const MessagesList = ({ messages, messagesEndRef }) => (
  <div className="messages-list">
    {messages.map((message) => (
      <div key={message.id} className="message">
        <b>{message.username}</b>
        {': '}
        <span>{message.body}</span>
      </div>
    ))}
    <div ref={messagesEndRef} />
  </div>
);

export default MessagesList;