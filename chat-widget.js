// =============================================
// FLOATING CHAT WIDGET
// =============================================
(function () {

  // --- Inject toggle button + panel into body ---
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'chat-toggle-btn';
  toggleBtn.setAttribute('aria-label', 'Open contact form');
  toggleBtn.innerHTML = `
    <svg class="icon-chat" xmlns="http://www.w3.org/2000/svg" width="26" height="26"
      viewBox="0 0 24 24" fill="none" stroke="#050d1a" stroke-width="2.2"
      stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    <svg class="icon-close" xmlns="http://www.w3.org/2000/svg" width="22" height="22"
      viewBox="0 0 24 24" fill="none" stroke="#050d1a" stroke-width="2.5"
      stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  `;

  const panel = document.createElement('div');
  panel.className = 'floating-chat-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Contact Rutuja');
  panel.innerHTML = `
    <!-- Header -->
    <div class="chat-panel-header">
      <div class="chat-avatar">👩‍💻</div>
      <div class="chat-header-info">
        <h4>Rutuja Ghodake</h4>
        <div class="chat-online">
          <span class="chat-online-dot"></span>
          Available · Replies within 24h
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="chat-panel-body">
      <div class="chat-input-row">
        <div class="chat-field-group">
          <span class="chat-field-label">Name</span>
          <input type="text" id="chat-name" placeholder="Your name" autocomplete="name" />
        </div>
        <div class="chat-field-group">
          <span class="chat-field-label">Email</span>
          <input type="email" id="chat-email" placeholder="rutujaghodake082@gmail.com" autocomplete="email" />
        </div>
      </div>
      <div class="chat-field-group full">
        <span class="chat-field-label">Subject</span>
        <input type="text" id="chat-subject" placeholder="What's this about?" />
      </div>
      <div class="chat-field-group full">
        <span class="chat-field-label">Message</span>
        <textarea id="chat-message" placeholder="Tell me about your project or opportunity..."></textarea>
      </div>
    </div>

    <!-- Quick hint chips -->
    <div class="chat-quick-hints">
      <span class="chat-hint-chip" data-msg="I'm hiring a Java Developer">💼 Hiring</span>
    </div>

    <div class="chat-divider"></div>

    <!-- Status message -->
    <div class="chat-status-msg" id="chat-status"></div>

    <!-- Footer / Send -->
    <div class="chat-panel-footer">
      <button class="chat-send-btn" id="chat-send-btn" onclick="chatWidgetSend()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
        Send Message
      </button>
    </div>
  `;

  document.body.appendChild(toggleBtn);
  document.body.appendChild(panel);

  // --- Toggle open/close ---
  let isOpen = false;

  toggleBtn.addEventListener('click', () => {
    isOpen = !isOpen;
    toggleBtn.classList.toggle('active', isOpen);
    panel.classList.toggle('open', isOpen);
    toggleBtn.setAttribute('aria-label', isOpen ? 'Close contact form' : 'Open contact form');

    if (isOpen) {
      setTimeout(() => document.getElementById('chat-name').focus(), 350);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      isOpen = false;
      toggleBtn.classList.remove('active');
      panel.classList.remove('open');
    }
  });

  // --- Quick hint chips ---
  panel.querySelectorAll('.chat-hint-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const msgField = document.getElementById('chat-message');
      const current = msgField.value.trim();
      msgField.value = current ? current : chip.dataset.msg;
      msgField.focus();
    });
  });

  // --- Send logic ---
  window.chatWidgetSend = function () {
    const name    = document.getElementById('chat-name').value.trim();
    const email   = document.getElementById('chat-email').value.trim();
    const subject = document.getElementById('chat-subject').value.trim();
    const message = document.getElementById('chat-message').value.trim();
    const statusEl = document.getElementById('chat-status');
    const sendBtn  = document.getElementById('chat-send-btn');

    // Clear status
    statusEl.className = 'chat-status-msg';
    statusEl.textContent = '';

    // Validate
    if (!name) {
      showStatus('error', '⚠ Please enter your name.');
      document.getElementById('chat-name').focus();
      return;
    }
    if (!email || !validateEmail(email)) {
      showStatus('error', '⚠ Please enter a valid email address.');
      document.getElementById('chat-email').focus();
      return;
    }
    if (!message) {
      showStatus('error', '⚠ Please write a message before sending.');
      document.getElementById('chat-message').focus();
      return;
    }

    // Loading state
    sendBtn.classList.add('loading');
    sendBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
        style="animation: spin 1s linear infinite;">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      Sending…
    `;

    // Compose mailto fallback (works without backend)
    const mailtoSubject = encodeURIComponent(subject || `Portfolio Contact from ${name}`);
    const mailtoBody    = encodeURIComponent(
      `Hi Rutuja,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nSent via portfolio chat widget`
    );
    const mailtoLink = `mailto:rutujaghodake082@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    // Simulate brief sending delay, then open mailto
    setTimeout(() => {
      sendBtn.classList.remove('loading');
      sendBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
        Send Message
      `;

      // Try opening mailto
      try {
        window.location.href = mailtoLink;
        showStatus('success', '✅ Opening your email client… Thanks ' + name + '!');
        // Clear fields after success
        document.getElementById('chat-name').value    = '';
        document.getElementById('chat-email').value   = '';
        document.getElementById('chat-subject').value = '';
        document.getElementById('chat-message').value = '';
      } catch (err) {
        showStatus('error', '⚠ Something went wrong. Please email directly.');
      }
    }, 900);
  };

  function showStatus(type, msg) {
    const el = document.getElementById('chat-status');
    el.className = 'chat-status-msg ' + type;
    el.textContent = msg;
    // Auto clear after 5s
    setTimeout(() => { el.className = 'chat-status-msg'; el.textContent = ''; }, 5000);
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Inject spin keyframe for loading spinner
  const style = document.createElement('style');
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);

})();