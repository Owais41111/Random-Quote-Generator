const quoteEl = document.getElementById("quote");
const authorEl = document.getElementById("author");
const newQuoteBtn = document.getElementById("new-quote");
const copyBtn = document.getElementById("copy-quote");
const themeBtn = document.getElementById("toggle-theme");
const feedbackEl = document.getElementById("feedback");

const API_URL = "quotes.json";

const LONG_QUOTE_THRESHOLD = 120;

// Load stored theme preference
document.addEventListener("DOMContentLoaded", () => {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    document.documentElement.setAttribute("data-theme", storedTheme);
    themeBtn.textContent = storedTheme === "dark" ? "Light Mode" : "Dark Mode";
  }
  fetchQuote();
});

newQuoteBtn.addEventListener("click", fetchQuote);
themeBtn.addEventListener("click", toggleTheme);
copyBtn.addEventListener("click", copyQuote);


async function fetchQuote() {
  quoteEl.textContent = "Loading...";
  authorEl.textContent = "";
  feedbackEl.textContent = "";

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to load quotes.");

    const data = await response.json();

    // pick a random quote from local list
    const randomIndex = Math.floor(Math.random() * data.length);
    const selected = data[randomIndex];

    displayQuote({
      content: selected.quote,
      author: selected.author
    });

  } catch (error) {
    console.error(error);
    quoteEl.textContent = "Oops! Unable to fetch quote.";
    authorEl.textContent = "";
    feedbackEl.textContent = "Make sure you're running with Live Server.";
  }
}




/**
 * Displays quote and adjusts styling for long text.
 */
function displayQuote(data) {
  quoteEl.textContent = data.content;
  authorEl.textContent = `— ${data.author || "Unknown"}`;

  if (data.content.length > LONG_QUOTE_THRESHOLD) {
    quoteEl.style.fontSize = "1.2rem";
  } else {
    quoteEl.style.fontSize = "1.5rem";
  }
}

/**
 * Toggles dark/light mode and stores preference.
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  themeBtn.textContent = newTheme === "dark" ? "Light Mode" : "Dark Mode";
}

/**
 * Copies quote text to clipboard.
 */
async function copyQuote() {
  const textToCopy = `${quoteEl.textContent} ${authorEl.textContent}`.trim();
  try {
    await navigator.clipboard.writeText(textToCopy);
    showFeedback("Quote copied!");
  } catch (error) {
    console.error(error);
    showFeedback("Failed to copy. Please try again.");
  }
}

/**
 * Displays feedback message temporarily.
 */
function showFeedback(message) {
  feedbackEl.textContent = message;
  feedbackEl.style.opacity = 1;

  setTimeout(() => {
    feedbackEl.textContent = "";
  }, 2000);
}