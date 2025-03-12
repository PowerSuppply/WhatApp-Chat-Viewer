document.getElementById('file-input').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    const content = e.target.result;
    if (content) {
      displayChat(content);
    } else {
      alert("The file is empty or could not be read.");
    }
  };

  reader.onerror = () => alert("Error reading file!");
  reader.readAsText(file);
});

/**
 * Handles the display of WhatsApp chat messages from a text file
 * @param {string} text - The content of the chat file
 */
function displayChat(text) {
  const chatContainer = document.getElementById('chat-container');
  chatContainer.innerHTML = ''; // Clear the container

  const fragment = document.createDocumentFragment(); // Use a DocumentFragment for batch appending
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const cleanLine = line.replace(/[\u200e\u200f]/g, '');

    if (line.includes('end-to-end encrypted') || line.includes('Messages and calls are end-to-end encrypted')) {
      const systemMessage = createSystemMessage("Messages are end-to-end encrypted. No one outside of this page, not even WhatsApp, can read or listen to them.");
      fragment.appendChild(systemMessage);
    } else {
      const standardMatch = cleanLine.match(/\[(.*?)\]\s+(.*?):\s*(.*)/);
      if (standardMatch) {
        const [_, datetime, sender, message] = standardMatch;
        const messageBubble = createMessageBubble(sender, datetime, message);
        fragment.appendChild(messageBubble);
      }
    }
  }

  chatContainer.appendChild(fragment); // Append all messages at once
}

/**
 * Creates a message bubble element
 * @param {string} sender - Name of message sender
 * @param {string} datetime - Timestamp of the message
 * @param {string} message - Content of the message
 * @returns {HTMLElement} - The message bubble element
 */
function createMessageBubble(sender, datetime, message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender.toLowerCase().includes('james') ? 'receiver' : 'sender');

  const bubble = document.createElement('div');
  bubble.classList.add('bubble');

  // Replace "sticker omitted", "audio omitted", "image omitted", "gif omitted" and "video omitted" with custom placeholders
  if (message.trim() === "image omitted") {
    bubble.textContent = "📷 [Image]"; // Image placeholder
    bubble.classList.add('image-bubble'); // Add class for image
  } else if (message.trim() === "audio omitted") {
    bubble.textContent = "► ······||||lllll|||||||lll···|||lll·· 🎤 [Audio]"; // Audio placeholder
    bubble.classList.add('audio-bubble'); // Add class for audio
  } else if (message.trim() === "sticker omitted") {
    bubble.textContent = "✧(•̀ω•́)✧ [Sticker]"; // Sticker placeholder
    bubble.classList.add('sticker-bubble'); // Add class for sticker
  } else if (message.trim() === "GIF omitted") {
    bubble.textContent = "👾 [GIF]"; // gif placeholder
    bubble.classList.add('gif-bubble'); // Add class for gif
  } else if (message.trim() === "video omitted") {
    bubble.textContent = "🎞️ [video]"; // video placeholder
    bubble.classList.add('video-bubble'); // Add class for video
  } else {
    // Add line breaks for long messages
    const formattedMessage = insertLineBreaks(message.trim(), 100); // 100 characters per line
    bubble.textContent = formattedMessage; // Regular message with line breaks
  }

  const timestamp = document.createElement('div');
  timestamp.classList.add('timestamp');
  timestamp.textContent = `${sender} • ${datetime}`;
  bubble.appendChild(timestamp);
  messageElement.appendChild(bubble);

  return messageElement;
}

/**
 * Inserts line breaks into a long string after a specified number of characters
 * @param {string} text - The input text
 * @param {number} maxChars - Maximum characters per line
 * @returns {string} - The formatted text with line breaks
 */
function insertLineBreaks(text, maxChars) {
  let result = '';
  let currentLength = 0;

  // Split the text into words
  const words = text.split(' ');

  for (const word of words) {
    // If the word itself is longer than maxChars, split it
    if (word.length > maxChars) {
      for (let i = 0; i < word.length; i += maxChars) {
        const chunk = word.slice(i, i + maxChars);
        result += chunk + '\n';
        currentLength = 0; // Reset length after a line break
      }
    } else {
      // If adding the next word exceeds the maxChars limit, add a line break
      if (currentLength + word.length > maxChars) {
        result += '\n';
        currentLength = 0;
      }

      // Add the word to the result
      result += word + ' ';
      currentLength += word.length + 1; // +1 for the space
    }
  }

  return result.trim(); // Remove the trailing space
}

/**
 * Creates a system message element
 * @param {string} message - Content of the system message
 * @returns {HTMLElement} - The system message element
 */
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

// Check for saved theme in localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.setAttribute('data-theme', 'dark');
  themeToggle.checked = true; // Set the toggle to the "on" position
}

// Toggle theme on switch click
themeToggle.addEventListener('change', () => {
  const newTheme = themeToggle.checked ? 'dark' : 'light';
  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});