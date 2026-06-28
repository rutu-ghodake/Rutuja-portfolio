window.chatWidgetSend = function () {

  const name = document.getElementById('chat-name').value.trim();
  const email = document.getElementById('chat-email').value.trim();
  const subject = document.getElementById('chat-subject').value.trim();
  const message = document.getElementById('chat-message').value.trim();

  const statusEl = document.getElementById('chat-status');
  const sendBtn = document.getElementById('chat-send-btn');

  // Clear old status
  statusEl.className = 'chat-status-msg';
  statusEl.textContent = '';

  // Validation
  if (!name) {
    showStatus('error', '⚠ Please enter your name.');
    document.getElementById('chat-name').focus();
    return;
  }

  if (!email || !validateEmail(email)) {
    showStatus('error', '⚠ Please enter valid email.');
    document.getElementById('chat-email').focus();
    return;
  }

  if (!message) {
    showStatus('error', '⚠ Please enter message.');
    document.getElementById('chat-message').focus();
    return;
  }

  // Loading State
  sendBtn.classList.add('loading');

  sendBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      style="animation: spin 1s linear infinite;">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
    Sending...
  `;

  // EMAILJS SEND
  emailjs.send(
    "service_htmxfif",
    "template_uvm49hd",
    {
      name: name,
      email: email,
      subject: subject || "Portfolio Contact",
      message: message
    }
  )

  .then(function () {

    sendBtn.classList.remove('loading');

    sendBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
      Send Message
    `;

    showStatus('success', '✅ Message sent successfully!');

    // Clear Form
    document.getElementById('chat-name').value = '';
    document.getElementById('chat-email').value = '';
    document.getElementById('chat-subject').value = '';
    document.getElementById('chat-message').value = '';

  })

  .catch(function (error) {

    console.log('EMAIL ERROR:', error);

    sendBtn.classList.remove('loading');

    sendBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
      Send Message
    `;

    showStatus('error', '⚠ Failed to send message.');

  });

};
function showStatus(type, msg) {

  const el = document.getElementById('chat-status');

  el.className = 'chat-status-msg ' + type;

  el.textContent = msg;

  setTimeout(() => {
    el.className = 'chat-status-msg';
    el.textContent = '';
  }, 5000);
}

function validateEmail(email) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}

const chatToggleBtn = document.getElementById('chatToggleBtn');
const chatPanel = document.getElementById('chatPanel');

chatToggleBtn.addEventListener('click', () => {

  chatPanel.classList.toggle('open');

  chatToggleBtn.classList.toggle('active');

});