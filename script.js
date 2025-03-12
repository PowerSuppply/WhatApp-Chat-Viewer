// Global variables
let currentFileContent = null;
let isSwapped = false;

// File input handler
document.getElementById('file-input').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    currentFileContent = e.target.result;
    processFile();
  };

  reader.onerror = () => alert("Error reading file!");
  reader.readAsText(file);
});

// Swap toggle handler
document.getElementById('swap-toggle').addEventListener('click', () => {
  if (!currentFileContent) return alert("Please upload a file first");
  isSwapped = !isSwapped;
  processFile();
});

// Central processing function
function processFile() {
  if (currentFileContent) {
    displayChat(currentFileContent);
  }
}

// Chat display function
function displayChat(text) {
  const chatContainer = document.getElementById('chat-container');
  chatContainer.innerHTML = '';
  const fragment = document.createDocumentFragment();
  const lines = text.split('\n');
  let firstSender = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cleanLine = line.replace(/[\u200e\u200f]/g, '');

    if (line.includes('end-to-end encrypted') || line.includes('Messages and calls are end-to-end encrypted')) {
      const systemMessage = createSystemMessage("🔒 Messages are end-to-end encrypted. No one outside of this page, not even WhatsApp, can read or listen to them.");
      fragment.appendChild(systemMessage);
    } else {
      const standardMatch = cleanLine.match(/\[(.*?)\]\s+(.*?):\s*(.*)/);
      if (standardMatch) {
        const [_, datetime, sender, message] = standardMatch;
        
        // Detect first sender
        if (!firstSender) {
          firstSender = sender.trim().toLowerCase();
        }

        const messageBubble = createMessageBubble(sender, datetime, message, firstSender);
        fragment.appendChild(messageBubble);
      }
    }
  }

  chatContainer.appendChild(fragment);
}

// Message bubble creation with swap logic
function createMessageBubble(sender, datetime, message, firstSender) {
  const messageElement = document.createElement('div');
  const isUser = sender.trim().toLowerCase() === firstSender;
  
  // Determine message side with swap logic
  const messageType = isSwapped ? 
    (isUser ? 'receiver' : 'sender') : 
    (isUser ? 'sender' : 'receiver');
  
  messageElement.classList.add('message', messageType);

  const bubble = document.createElement('div');
  bubble.classList.add('bubble');

  // Media handling
  if (message.trim() === "image omitted") {
    bubble.textContent = "📷 [Image]";
    bubble.classList.add('image-bubble');
  } else if (message.trim() === "audio omitted") {
    bubble.textContent = "► ······||||lllll|||||||lll···|||lll·· 🎤 [Audio]";
    bubble.classList.add('audio-bubble');
  } else if (message.trim() === "sticker omitted") {
    bubble.textContent = "✧(•̀ω•́)✧ [Sticker]";
    bubble.classList.add('sticker-bubble');
  } else if (message.trim() === "GIF omitted") {
    bubble.textContent = "👾 [GIF]";
    bubble.classList.add('gif-bubble');
  } else if (message.trim() === "video omitted") {
    bubble.textContent = "🎞️ [video]";
    bubble.classList.add('video-bubble');
  } else {
    const formattedMessage = insertLineBreaks(message.trim(), 100);
    bubble.textContent = formattedMessage;
  }

  // Timestamp
  const timestamp = document.createElement('div');
  timestamp.classList.add('timestamp');
  timestamp.textContent = `${sender} • ${datetime}`;
  bubble.appendChild(timestamp);
  messageElement.appendChild(bubble);

  return messageElement;
}

// Line break formatter
function insertLineBreaks(text, maxChars) {
  let result = '';
  let currentLength = 0;
  const words = text.split(' ');

  for (const word of words) {
    if (word.length > maxChars) {
      for (let i = 0; i < word.length; i += maxChars) {
        const chunk = word.slice(i, i + maxChars);
        result += chunk + '\n';
        currentLength = 0;
      }
    } else {
      if (currentLength + word.length > maxChars) {
        result += '\n';
        currentLength = 0;
      }
      result += word + ' ';
      currentLength += word.length + 1;
    }
  }

  return result.trim();
}

// System message creator
function createSystemMessage(message) {
  const systemMessageElement = document.createElement('div');
  systemMessageElement.classList.add('message', 'system-message');

  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  bubble.textContent = message;

  systemMessageElement.appendChild(bubble);
  return systemMessageElement;
}

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.setAttribute('data-theme', 'dark');
  themeToggle.checked = true;
}

// Theme change handler
themeToggle.addEventListener('change', () => {
  const newTheme = themeToggle.checked ? 'dark' : 'light';
  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});