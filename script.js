// ---------- script.js (FINAL CLEAN VERSION) ----------

// Backend endpoint
const BACKEND_URL = "http://localhost:3000/generate";

// DOM elements
const form = document.getElementById("travel-form");
const loading = document.getElementById("loading");
const results = document.getElementById("results");
const itineraryDiv = document.getElementById("itinerary");

const showFlightsBtn = document.getElementById("show-flights");
const showTrainsBtn = document.getElementById("show-trains");
const showBusesBtn = document.getElementById("show-buses");

const flightsDiv = document.getElementById("flights");
const trainsDiv = document.getElementById("trains");
const busesDiv = document.getElementById("buses");

const showHotelsBtn = document.getElementById("show-hotels");
const hotelsDiv = document.getElementById("hotels");


// ---------- HELPER LINKS ----------
function flightLinks(destination) {
  destination = encodeURIComponent(destination);
  return `
    <div style="margin-top:12px;">
      <h3>Flight Search Links</h3>
      <a href="https://www.google.com/search?q=flights+to+${destination}" target="_blank">Google Flights</a><br>
      <a href="https://www.skyscanner.co.in/transport/flights-to/${destination}/" target="_blank">Skyscanner</a>
    </div>
  `;
}

function trainLinks() {
  return `
    <div style="margin-top:12px;">
      <h3>Train Search Links</h3>
      <a href="https://www.irctc.co.in/nget/train-search" target="_blank">IRCTC Official Train Search</a>
    </div>
  `;
}

function busLinks(destination) {
  destination = encodeURIComponent(destination);
  return `
    <div style="margin-top:12px;">
      <h3>Bus Search Links</h3>
      <a href="https://www.redbus.in/search?to=${destination}" target="_blank">RedBus</a>
    </div>
  `;
}


// =========================================================
//  1) GENERATE ITINERARY  (NO FLIGHTS / TRAINS / BUSES INSIDE)
// =========================================================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  loading.style.display = "block";
  results.style.display = "none";
  itineraryDiv.innerHTML = "";

  const destination = document.getElementById("destination").value;
  const budget = document.getElementById("budget").value;
  const preferences = document.getElementById("preferences").value;
  const days = document.getElementById("days").value;

  const prompt = `
You are a senior professional travel planner. Create a premium-quality ${days}-day itinerary for ${destination} in clean HTML only.

### RULES:
- STRICT HTML ONLY (<h2>, <h3>, <p>, <ul>, <li>, <strong>)
- NO flights, trains, or buses here.
- Itinerary ONLY.
- Expert tone, realistic timings, culture-aware.
- Focus on local travel, sightseeing, food, and experiences.
- Follow user's preferences: ${preferences}
- The total trip cost MUST NOT exceed the given budget.
- Treat the budget as a hard limit, not an estimate.
- If an activity, hotel, or transport does not fit the budget, DO NOT include it.
- Prefer budget-friendly options over luxury ones.
- If the budget is very low, reduce activities instead of increasing cost.
- Clearly mention cost-saving tips when needed.
- Strictly follow preferred activities.
All costs, budgets, and prices MUST be in Indian Rupees (₹). Never use USD.


<h2>Overview</h2>
<p>Give a short 3–4 line introduction to the trip.</p>

<h2>Weather</h2>
<p>Describe typical weather in ${destination}.</p>

<h2>Estimated Cost Breakdown</h2>
<ul>
<li><strong>Stay:</strong> realistic estimate</li>
<li><strong>Food:</strong> typical daily spend</li>
<li><strong>Sightseeing:</strong> average activity cost</li>
<li><strong>Transport:</strong> local travel cost</li>
<li><strong>Total:</strong> trip estimate</li>
</ul>

<h2>${days}-Day Itinerary</h2>
${Array.from({ length: days }, (_, i) => `
<h3>Day ${i + 1}</h3>
<ul>
  <li><strong>Morning:</strong> activity + timing</li>
  <li><strong>Afternoon:</strong> activity + reason</li>
  <li><strong>Evening:</strong> culture/food local experience</li>
</ul>`).join("")}

<h2>Food & Local Cuisine</h2>
<ul>
<li><strong>Must-try dishes:</strong> 4–5 items</li>
<li><strong>Restaurants/Cafés:</strong> 2–3 picks</li>
<li><strong>Street Food:</strong> popular items</li>
</ul>

<h2>Local Tips</h2>
<ul>
<li>Timing + cultural tips</li>
<li>Money-saving tips</li>
<li>Safety advice</li>
</ul>
  `;

  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    itineraryDiv.innerHTML = data.text;

    loading.style.display = "none";
    results.style.display = "block";

  } catch (err) {
    itineraryDiv.innerHTML = `<p style="color:red;">Error: ${err}</p>`;
    loading.style.display = "none";
    results.style.display = "block";
  }
});


// =========================================================
//  2) FLIGHTS SECTION
// =========================================================
showFlightsBtn.addEventListener("click", async () => {
  flightsDiv.innerHTML = "⏳ Loading flights...";

  const destination = document.getElementById("destination").value;

  const flightPrompt = `
You are a travel expert. Provide exactly 3 FLIGHT options to ${destination}.
ALL COSTS MUST BE IN INDIAN RUPEES (₹). Never use USD.


STRICT HTML ONLY.

<h2>Flights to ${destination}</h2>

<h3>Option Title</h3>
<ul>
<li><strong>Airline:</strong> ...</li>
<li><strong>Duration:</strong> ...</li>
<li><strong>Price Range:</strong> ...</li>
<li><strong>Tip:</strong> ...</li>
</ul>
<hr>
  `;

  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: flightPrompt })
  });

  const data = await res.json();
  flightsDiv.innerHTML = data.text + flightLinks(destination);
});


// =========================================================
//  3) TRAINS SECTION
// =========================================================
showTrainsBtn.addEventListener("click", async () => {
  trainsDiv.innerHTML = "⏳ Loading trains...";

  const destination = document.getElementById("destination").value;

  const trainPrompt = `
You are a travel expert. Provide exactly 3 TRAIN options to reach ${destination}.
ALL COSTS MUST BE IN INDIAN RUPEES (₹). Never use USD.


STRICT HTML ONLY.

<h2>Trains to ${destination}</h2>

<h3>Train Name</h3>
<ul>
<li><strong>Type:</strong> Express / Superfast</li>
<li><strong>Duration:</strong> ...</li>
<li><strong>Price Range:</strong> ...</li>
<li><strong>Tip:</strong> ...</li>
</ul>
<hr>
  `;

  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: trainPrompt })
  });

  const data = await res.json();
  trainsDiv.innerHTML = data.text + trainLinks();
});


// =========================================================
//  4) BUSES SECTION
// =========================================================
showBusesBtn.addEventListener("click", async () => {
  busesDiv.innerHTML = "⏳ Loading buses...";

  const destination = document.getElementById("destination").value;

  const busPrompt = `
You are a travel expert. Provide exactly 3 BUS options to reach ${destination}.
ALL COSTS MUST BE IN INDIAN RUPEES (₹). Never use USD.


STRICT HTML ONLY.

<h2>Buses to ${destination}</h2>

<h3>Bus Name</h3>
<ul>
<li><strong>Operator:</strong> ...</li>
<li><strong>Type:</strong> AC / Sleeper / Seater</li>
<li><strong>Duration:</strong> ...</li>
<li><strong>Price Range:</strong> ...</li>
<li><strong>Tip:</strong> ...</li>
</ul>
<hr>
  `;

  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: busPrompt })
  });

  const data = await res.json();
  busesDiv.innerHTML = data.text + busLinks(destination);
});


// =========================================================
//  5) HOTELS SECTION
// =========================================================
showHotelsBtn.addEventListener("click", async () => {
  hotelsDiv.innerHTML = "⏳ Loading hotels...";

  const destination = document.getElementById("destination").value;
  const budget = document.getElementById("budget").value;

  const hotelPrompt = `
You are a travel expert. Suggest exactly 3 hotels in ${destination}, based strictly on the user's budget: ${budget}.
ALL COSTS MUST BE IN INDIAN RUPEES (₹). Never use USD.


STRICT HTML ONLY.

<h2>Hotels</h2>
<h3>Hotel Name</h3>
<ul>
<li><strong>Area:</strong> ...</li>
<li><strong>Price Range:</strong> ...</li>
<li><strong>Why it fits the budget:</strong> ...</li>
</ul>
<hr>
  `;

  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: hotelPrompt })
  });

  const data = await res.json();
  hotelsDiv.innerHTML = data.text;
});
// =====================
// TRAVEL CHAT FEATURE
// =====================

const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");

chatSend.addEventListener("click", async () => {
    const userMsg = chatInput.value.trim();
    if (!userMsg) return;

    // show user message
    chatBox.innerHTML += `<p class="message-user"><strong>You:</strong> ${userMsg}</p>`;
    chatInput.value = "";
    
    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;

    // prepare travel-smart prompt
    const chatPrompt = `
You are a senior professional travel planner with deep local knowledge.

Your task is to create a realistic, practical, and well-structured travel itinerary.

IMPORTANT RULES (MUST FOLLOW STRICTLY):
- Output ONLY clean HTML (use only: <h2>, <h3>, <p>, <ul>, <li>, <strong>)
- Do NOT include flights, trains, or long-distance buses.
- Focus only on local travel, sightseeing, food, and experiences.
- The total trip cost MUST NOT exceed the given budget.
- Treat the budget as a hard limit, not an estimate.
- If something does not fit the budget, do NOT include it.
- Prefer practical, commonly used options over luxury or unrealistic ones.
- All prices and costs MUST be in Indian Rupees (₹). Never use USD.
- Avoid generic or vague descriptions. Be specific and realistic.

User question: "${userMsg}"
`;

    try {
        const res = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: chatPrompt })
        });

        const data = await res.json();
        const aiResponse = data.text || "No reply from assistant.";

        chatBox.innerHTML += `<p class="message-ai"><strong>Assistant:</strong> ${aiResponse}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (err) {
        chatBox.innerHTML += `<p style="color:red;">Error: ${err}</p>`;
    }
});
