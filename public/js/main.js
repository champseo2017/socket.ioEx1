const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector('.chat-messages');
const socket = io();

// Message from server
socket.on("message", (message) => {
  outputMessage(message);
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const { target } = e
  // Get message text
  const msg = target.elements.msg.value;
  // Emit message to server
  socket.emit("chatMessage", msg);
  // Clear input
  target.elements.msg.value = ''
  target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">
  Brad <span>9:12pm</span>
  </p> 
  <p class="text">
    ${message}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}
