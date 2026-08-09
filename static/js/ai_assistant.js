/* ==========================================================================
   PRABU ARVIND M - REAL VOICE AI AGENT "JARVIS" MODULE
   Voice Synthesis (SpeechSynthesis) + Voice Input (SpeechRecognition) + Site Nav
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initJarvisVoiceAgent();
});

const JARVIS_KNOWLEDGE = {
  about: {
    text: "Hello! I am Jarvis, Prabu Arvind M's autonomous Voice AI Agent. Prabu is a 4th-year B.Tech Artificial Intelligence & Data Science student at Rajalakshmi Institute of Technology (RIT), Chennai. He specializes in Large Language Models, Generative AI, Computer Vision, and Python backend APIs.",
    actions: [{ label: "Explore About Section", target: "#about" }]
  },
  projects: {
    text: "Prabu has developed 4 production-grade AI & IoT projects: 1. PyMorph AI (AI Code Converter transpiling Python to Java, C, and Swift using AST analysis), 2. News Article Summarization System (PEGASUS Transformer & PaddleOCR), 3. Cancer Prediction Web App (ResNet-34 CNN on 270,000 histopathology images), 4. Traffic Signal Emergency Swift Passage System (YOLO + ESP32).",
    actions: [{ label: "View Projects Grid", target: "#projects" }]
  },
  patents: {
    text: "Prabu holds 4 published Indian Patents and Design Patents: 1. Fleet Fuel Management System (Patent No: 202441062036), 2. Smart Thermocouple Solar Monitor (Patent No: 202541056836), 3. Traffic Signal Emergency Swift Passage System (Patent No: 202541056837), 4. Agriculture Smart Pest Control Device (Design Patent No: 422077-001).",
    actions: [{ label: "Scroll to Patents", target: "#patents" }]
  },
  ocr: {
    text: "Optical Character Recognition (OCR) translates document image pixels into machine-encoded text. Prabu's complete guide covers the 4-stage pipeline (Preprocessing, Text Detection, Text Recognition, Post-processing) and benchmarks PaddleOCR, TrOCR, EasyOCR, Tesseract 5, and Gemini Document AI.",
    actions: [{ label: "Open OCR Guide", target: "#blog", modal: "ocr" }]
  },
  pegasus: {
    text: "PEGASUS (Pre-training with Extracted Gap-sentences for Abstractive Summarizing) is Google's flagship Transformer model for abstractive NLP summarization. Prabu implemented PEGASUS alongside PaddleOCR, RoBERTa, and PyTorch for multi-lingual news processing.",
    actions: [{ label: "Open PEGASUS Guide", target: "#blog", modal: "pegasus" }]
  },
  ainews: {
    text: "Today's top real-world AI developments include DeepSeek R2 671B MoE model release, OpenAI 45% faster vision inference, Google DeepMind Gemini 1.5 Pro 2M token context, and Anthropic Claude 3.5 Sonnet code execution canvas.",
    actions: [{ label: "Open AI Knowledge Hub", target: "#blog", modal: "newsletter" }]
  },
  resume: {
    text: "You can view Prabu Arvind M's complete verified resume directly on the website or click below to download the official PDF document.",
    actions: [{ label: "Download Resume PDF", url: "/api/resume/download" }]
  },
  contact: {
    text: "You can reach Prabu Arvind M via email at prabuarvind2005@gmail.com, phone (+91 6383516976), or LinkedIn at linkedin.com/in/prabuarvindm.",
    actions: [{ label: "Open Contact Form", target: "#contact" }]
  },
  career: {
    text: "Prabu's recommended AI Engineer roadmap focuses on Python 3.12, PyTorch, Linear Algebra, FastAPI REST architectures, Vector DBs, RAG pipelines, and containerized model deployment with Docker.",
    actions: [{ label: "View Knowledge Hub", target: "#blog" }]
  }
};

let recognition = null;
let isListening = false;

function initJarvisVoiceAgent() {
  const container = document.createElement('div');
  container.id = 'ai-assistant-wrapper';
  container.innerHTML = `
    <!-- Floating Trigger Button -->
    <button id="ai-assistant-btn" aria-label="Open Jarvis AI Agent">
      <i class="fas fa-robot"></i>
      <span class="ai-pulse"></span>
    </button>

    <!-- Chat Drawer -->
    <div id="ai-chat-window">
      <div class="ai-chat-header">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="ai-avatar" id="jarvis-avatar-ring" style="background: linear-gradient(135deg, #00f2fe, #7928ca); transition: transform 0.3s ease;">
            <i class="fas fa-brain"></i>
          </div>
          <div>
            <div style="font-weight: 700; font-size: 0.95rem; display: flex; align-items: center; gap: 6px;">
              <span>🤖 Jarvis</span>
              <span style="font-size: 0.7rem; background: rgba(0,242,254,0.15); color: var(--accent-cyan); padding: 2px 6px; border-radius: 4px;">Voice AI</span>
            </div>
            <div style="font-size: 0.72rem; color: var(--accent-cyan);" id="jarvis-status-text">
              <i class="fas fa-circle" style="font-size: 0.45rem; color: #00e676;"></i> Online & Ready
            </div>
          </div>
        </div>

        <!-- Equalizer Soundwave Indicator & Voice Toggle -->
        <div style="display: flex; align-items: center; gap: 8px;">
          <div class="jarvis-equalizer" id="jarvis-equalizer" style="display: none;">
            <div class="jarvis-bar"></div>
            <div class="jarvis-bar"></div>
            <div class="jarvis-bar"></div>
            <div class="jarvis-bar"></div>
          </div>
          <button id="jarvis-voice-toggle" class="btn btn-outline" style="padding: 4px 10px; font-size: 0.75rem; border-radius: 8px; border-color: var(--border-glow);" onclick="toggleJarvisVoiceMute()"><i class="fas fa-volume-up"></i> Voice ON</button>
          <button id="ai-chat-close"><i class="fas fa-times"></i></button>
        </div>
      </div>

      <!-- Live Messages -->
      <div class="ai-chat-messages" id="ai-messages">
        <div class="ai-msg bot">
          Hello! I am Jarvis, Prabu's autonomous Voice AI Agent. Speak or type your request below to explore projects, research, patents, or technical concepts.
        </div>
      </div>

      <!-- Quick Action Chips -->
      <div class="ai-chips-wrapper">
        <button class="ai-chip" onclick="handleJarvisQuery('about')">About Prabu</button>
        <button class="ai-chip" onclick="handleJarvisQuery('projects')">Show Projects</button>
        <button class="ai-chip" onclick="handleJarvisQuery('patents')">Show Patents</button>
        <button class="ai-chip" onclick="handleJarvisQuery('ocr')">OCR Guide</button>
        <button class="ai-chip" onclick="handleJarvisQuery('pegasus')">PEGASUS Guide</button>
        <button class="ai-chip" onclick="handleJarvisQuery('ainews')">Today's AI News</button>
        <button class="ai-chip" onclick="handleJarvisQuery('resume')">Download Resume</button>
        <button class="ai-chip" onclick="handleJarvisQuery('contact')">Contact Prabu</button>
        <button class="ai-chip" onclick="clearJarvisHistory()" style="color: var(--accent-pink); border-color: rgba(255,0,128,0.3);">Clear Chat</button>
      </div>

      <!-- Input Form with Voice Mic Button -->
      <form id="ai-chat-form">
        <button type="button" id="ai-mic-btn" aria-label="Voice Command Mic" style="width: 36px; height: 36px; border-radius: 50%; background: rgba(0,242,254,0.12); border: 1px solid var(--border-glow); color: var(--accent-cyan); cursor: pointer; transition: all 0.2s ease;">
          <i class="fas fa-microphone"></i>
        </button>
        <input type="text" id="ai-chat-input" placeholder="Speak or type to Jarvis..." required />
        <button type="submit" aria-label="Send message"><i class="fas fa-paper-plane"></i></button>
      </form>
    </div>
  `;

  document.body.appendChild(container);

  const btn = document.getElementById('ai-assistant-btn');
  const win = document.getElementById('ai-chat-window');
  const closeBtn = document.getElementById('ai-chat-close');
  const form = document.getElementById('ai-chat-form');
  const micBtn = document.getElementById('ai-mic-btn');

  btn.addEventListener('click', () => win.classList.toggle('active'));
  closeBtn.addEventListener('click', () => {
    win.classList.remove('active');
    stopSpeechSynthesis();
  });

  micBtn.addEventListener('click', toggleJarvisListening);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('ai-chat-input');
    const val = input.value.trim();
    if (!val) return;

    processUserInput(val);
    input.value = '';
  });

  // Voice Greeting on First Visit after 2 Seconds
  setTimeout(() => {
    if (!sessionStorage.getItem('jarvis_greeted')) {
      sessionStorage.setItem('jarvis_greeted', 'true');
      speakJarvis("Hello. I am Jarvis, Prabu Arvind's AI assistant. Welcome to the portfolio. How may I help you explore his projects and research today?");
    }
  }, 2000);

  initSpeechRecognition();
}

/* 1. Speech Recognition Engine */
function initSpeechRecognition() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    console.log("Speech recognition not natively supported by browser. Falling back to text mode.");
    return;
  }

  recognition = new SpeechRec();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    isListening = true;
    const micBtn = document.getElementById('ai-mic-btn');
    const statusText = document.getElementById('jarvis-status-text');
    if (micBtn) micBtn.classList.add('mic-listening');
    if (statusText) statusText.innerHTML = '<i class="fas fa-microphone" style="color: var(--accent-pink);"></i> Listening...';
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (transcript) {
      processUserInput(transcript);
    }
  };

  recognition.onerror = (event) => {
    console.log("Speech recognition error:", event.error);
    stopJarvisListening();
  };

  recognition.onend = () => {
    stopJarvisListening();
  };
}

function toggleJarvisListening() {
  if (!recognition) {
    showToast("Voice recognition is not supported in this browser. Please use text input.", "error");
    return;
  }

  if (isListening) {
    recognition.stop();
  } else {
    stopSpeechSynthesis();
    const win = document.getElementById('ai-chat-window');
    if (win) win.classList.add('active');
    recognition.start();
  }
}

function stopJarvisListening() {
  isListening = false;
  const micBtn = document.getElementById('ai-mic-btn');
  const statusText = document.getElementById('jarvis-status-text');
  if (micBtn) micBtn.classList.remove('mic-listening');
  if (statusText) statusText.innerHTML = '<i class="fas fa-circle" style="font-size: 0.45rem; color: #00e676;"></i> Online & Ready';
}

/* 2. Process Natural Language & Voice Commands */
function processUserInput(rawText) {
  appendUserMessage(rawText);
  const val = rawText.toLowerCase();

  let key = 'about';
  if (val.includes('project') || val.includes('work') || val.includes('pymorph')) {
    key = 'projects';
    smoothScrollTo('#projects');
  } else if (val.includes('patent') || val.includes('design')) {
    key = 'patents';
    smoothScrollTo('#patents');
  } else if (val.includes('ocr') || val.includes('reader')) {
    key = 'ocr';
    smoothScrollTo('#blog');
    if (typeof openOCRModal === 'function') openOCRModal();
  } else if (val.includes('pegasus') || val.includes('summariz')) {
    key = 'pegasus';
    smoothScrollTo('#blog');
    if (typeof openPegasusModal === 'function') openPegasusModal();
  } else if (val.includes('news') || val.includes('today')) {
    key = 'ainews';
    smoothScrollTo('#blog');
    if (typeof openNewsletterModal === 'function') openNewsletterModal();
  } else if (val.includes('resume') || val.includes('cv')) {
    key = 'resume';
    smoothScrollTo('#resume');
  } else if (val.includes('contact') || val.includes('email') || val.includes('hire')) {
    key = 'contact';
    smoothScrollTo('#contact');
  } else if (val.includes('github') || val.includes('repo')) {
    key = 'about';
    smoothScrollTo('#github');
  } else if (val.includes('internship') || val.includes('experience')) {
    key = 'about';
    smoothScrollTo('#internships');
  }

  setTimeout(() => handleJarvisQuery(key), 300);
}

function smoothScrollTo(selector) {
  const el = document.querySelector(selector);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

function appendUserMessage(text) {
  const container = document.getElementById('ai-messages');
  const msg = document.createElement('div');
  msg.className = 'ai-msg user';
  msg.textContent = text;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function handleJarvisQuery(key) {
  const resp = JARVIS_KNOWLEDGE[key] || JARVIS_KNOWLEDGE.about;
  const container = document.getElementById('ai-messages');

  const botMsg = document.createElement('div');
  botMsg.className = 'ai-msg bot';

  let actionHtml = '';
  if (resp.actions) {
    actionHtml = '<div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;">' +
      resp.actions.map(a => {
        if (a.target) return `<button onclick="document.querySelector('${a.target}').scrollIntoView({behavior:'smooth'});" class="btn btn-outline" style="padding: 4px 10px; font-size: 0.75rem;">${a.label}</button>`;
        if (a.url) return `<a href="${a.url}" target="_blank" class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;">${a.label}</a>`;
        return '';
      }).join('') + '</div>';
  }

  botMsg.innerHTML = `${resp.text.replace(/\n/g, '<br>')} ${actionHtml}`;
  container.appendChild(botMsg);
  container.scrollTop = container.scrollHeight;

  // Speak response via Voice Synthesis
  speakJarvis(resp.text);
}

let availableVoices = [];
let voiceEnabled = true;

function preloadVoices() {
  if ('speechSynthesis' in window) {
    availableVoices = window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        availableVoices = window.speechSynthesis.getVoices();
      };
    }
  }
}
preloadVoices();

// Unlock browser audio context on first user click/tap
document.addEventListener('click', unlockAudioContext, { once: true });
document.addEventListener('touchstart', unlockAudioContext, { once: true });

function unlockAudioContext() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
}

function toggleJarvisVoiceMute() {
  voiceEnabled = !voiceEnabled;
  const toggleBtn = document.getElementById('jarvis-voice-toggle');
  if (toggleBtn) {
    toggleBtn.innerHTML = voiceEnabled 
      ? '<i class="fas fa-volume-up"></i> Voice ON' 
      : '<i class="fas fa-volume-mute" style="color: var(--accent-pink);"></i> Muted';
  }
  if (!voiceEnabled) {
    stopSpeechSynthesis();
    showToast("Jarvis voice synthesis muted.", "info");
  } else {
    showToast("Jarvis voice synthesis enabled.", "success");
    speakJarvis("Jarvis voice enabled and online.");
  }
}

/* 3. Voice Synthesis (Text-to-Speech Engine) */
function speakJarvis(text) {
  if (!voiceEnabled || !('speechSynthesis' in window)) return;

  try {
    stopSpeechSynthesis();

    // Ensure Chrome speech synthesis is unpaused
    window.speechSynthesis.resume();

    const cleanText = text.replace(/<[^>]*>?/gm, '').replace(/https?:\/\/\S+/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.02;   // Clear, articulate speed
    utterance.pitch = 1.25;  // Cute, friendly female pitch
    utterance.volume = 1.0;

    if (availableVoices.length === 0) {
      availableVoices = window.speechSynthesis.getVoices();
    }

    // Select preferred cute & clear female English voice
    const selectedVoice = availableVoices.find(v => 
      v.lang.includes('en') && (
        v.name.includes('Female') || 
        v.name.includes('Samantha') || 
        v.name.includes('Victoria') || 
        v.name.includes('Karen') || 
        v.name.includes('Zira') || 
        v.name.includes('Jenny') || 
        v.name.includes('Aria') || 
        v.name.includes('Ava') ||
        v.name.includes('Nova') ||
        v.name.includes('Google US English') ||
        v.name.includes('Google UK English Female')
      )
    ) || availableVoices.find(v => v.lang.includes('en')) || availableVoices[0];

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    const equalizer = document.getElementById('jarvis-equalizer');
    const avatarRing = document.getElementById('jarvis-avatar-ring');

    utterance.onstart = () => {
      if (equalizer) equalizer.style.display = 'flex';
      if (avatarRing) avatarRing.style.transform = 'scale(1.15)';
    };

    utterance.onend = () => {
      stopSpeechVisuals();
    };

    utterance.onerror = (e) => {
      console.log("Speech synthesis event error:", e);
      stopSpeechVisuals();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error("Jarvis Speech Synthesis Exception:", err);
  }
}

function stopSpeechSynthesis() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  stopSpeechVisuals();
}

function stopSpeechVisuals() {
  const equalizer = document.getElementById('jarvis-equalizer');
  const avatarRing = document.getElementById('jarvis-avatar-ring');
  if (equalizer) equalizer.style.display = 'none';
  if (avatarRing) avatarRing.style.transform = 'scale(1)';
}

function clearJarvisHistory() {
  const container = document.getElementById('ai-messages');
  if (container) {
    container.innerHTML = `
      <div class="ai-msg bot">
        Chat history cleared. How can I assist you with Prabu's portfolio today?
      </div>
    `;
  }
  stopSpeechSynthesis();
}
