const API_KEY = "AIzaSyCsA7wL-Xusb21c8oS37CQ9FpwlSGtQf_k";

const openBtn = document.getElementById("open-btn");
const closeBtn = document.getElementById("close-btn");
const chatWindow = document.getElementById("chat-window");
const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

openBtn.onclick = () => {
  chatWindow.classList.remove("hidden");
  openBtn.classList.add("hidden");
};

closeBtn.onclick = () => {
  chatWindow.classList.add("hidden");
  openBtn.classList.remove("hidden");
};

sendBtn.onclick = async () => {
  const input = userInput.value.trim();
  if (!input) return;

  // Show user message
  const userMsgDiv = document.createElement("div");
  userMsgDiv.className = "chat-message user-message";
  userMsgDiv.textContent = input;
  chatMessages.appendChild(userMsgDiv);

  userInput.value = "";
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Show loading
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "chat-message bot-message";
  loadingDiv.textContent = "Typing...";
  chatMessages.appendChild(loadingDiv);

  try {
    const enrichedQuery = `
You are BetterBot — a smart, friendly, and AI-powered assistant embedded in BetterWeb, a Chrome extension created to enhance digital accessibility and user well-being. While your main role is to assist users with personalizing their web experience (especially for users with ADHD, dyslexia, autism, and visual/sensory sensitivities), you're also capable of answering general knowledge questions — just like ChatGPT.

BetterBot is:
- Helpful and conversational
- Respectful and privacy-aware
- Designed to support users with kindness and clarity

You can respond to:
- Health or mental well-being questions like “What is ADHD?”, “What causes dyslexia?”, or “How can I improve focus?”
- General questions like “Tell me about the Eiffel Tower” or “Who is the CEO of Tesla?”
- Everyday inquiries like “Recommend a good book”, “What’s the capital of Spain?”, or “How to stay motivated?”

💡 If a question relates to accessibility, focus, sensory overload, or mental health, feel free to share **helpful advice**, **resources**, or tips to improve user well-being — but avoid giving medical diagnoses or prescribing drugs. Instead, use language like:

> "I'm not a doctor, but I can tell you ADHD is a common neurodevelopmental condition. Many people manage it with professional guidance, structured routines, or focus aids. For medical advice or prescriptions, it's best to consult a healthcare provider."

💬 If the topic is totally unrelated (like asking about space, sports, or history), answer helpfully — you are a smart general assistant too.

✅ Summary:
You are a general-purpose assistant that’s **extra mindful** of accessibility and mental wellness, and ready to support users with helpful responses, guidance, or even just a friendly chat.

Now, please respond to the user:

User Query: ${input}
`;


//     const enrichedQuery = `
// You are BetterWeb, an intelligent and friendly AI-powered assistant for BetterWeb — a customizable Chrome extension that enhances web accessibility for users with cognitive, visual, and sensory needs like ADHD, dyslexia, photosensitivity, and autism.

// Your purpose is to help users personalize any webpage using simple natural language commands. You interpret queries, offer accessibility guidance, and generate real-time JavaScript DOM changes when needed. You're polite, patient, and proactive.

// ✅ You can:
// - Guide users through features like Text-to-Speech (TTS), accessibility profiles, and pastel themes
// - Explain differences between Auto Mode and Manual Mode
// - Execute DOM changes like increasing font size, adjusting contrast, removing animations, or switching themes
// - Suggest accessibility improvements for common issues like brightness, clutter, or hard-to-read fonts

// 🎯 Example tasks you can perform:
// - “Make all text larger”
// - “Enable a dyslexia-friendly layout”
// - “Apply a mint theme”
// - “Turn off animations”
// - “Read this out loud”

// 🎤 You support both visual and voice interactions, and offer tips for those unsure what to do.

// 💬 If the user asks something general (like "hello", "how are you", or “what’s the weather?”), respond warmly, then steer them back toward accessibility topics. For example:
// - If they say “Hello” → reply: “Hi there! 👋 I’m BetterWeb, your personal accessibility assistant. Want to make this page more comfortable to read?”
// - If they ask “What can you do?” → reply with: “I can help you adjust this page for visual comfort, dyslexia support, ADHD needs, and more. Just tell me what you need changed!”

// 🚫 Avoid giving technical explanations unless asked. Your priority is simplicity, clarity, and helping non-technical users improve their browsing experience.

// Always redirect the conversation back to accessibility, web comfort, or BetterWeb’s core features when possible.

// Now, respond helpfully to the following user query:

// User Query: ${input}
// `;







    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        contents: [{ parts: [{ text: enrichedQuery }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    loadingDiv.remove();

    const botText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't understand.";

    const botMsgDiv = document.createElement("div");
    botMsgDiv.className = "chat-message bot-message";
    botMsgDiv.textContent = botText;
    chatMessages.appendChild(botMsgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  } catch (error) {
    loadingDiv.remove();
    const errorMsgDiv = document.createElement("div");
    errorMsgDiv.className = "chat-message bot-message";
    errorMsgDiv.textContent =
      "Something went wrong. Please try again later.";
    chatMessages.appendChild(errorMsgDiv);
  }
};



const micBtn = document.getElementById("mic-btn");

if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-US";

  recognition.onstart = () => {
    micBtn.textContent = "🎙️"; // recording
  };

  recognition.onend = () => {
    micBtn.textContent = "🎤"; // done recording
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userInput.value = transcript;
  };

  micBtn.onclick = () => {
    recognition.start();
  };
} else {
  micBtn.disabled = true;
  micBtn.title = "Speech recognition not supported";
}
