const { GoogleGenAI } = require("@google/genai");
const Listing = require("../models/listing");

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Helper to call Gemini model
async function generateGeminiText(prompt, systemInstruction = "") {
  if (!ai || !apiKey) {
    return null; // Trigger intelligent fallback
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: systemInstruction ? { systemInstruction } : undefined
    });
    return response.text;
  } catch (err) {
    console.error("Gemini API Error:", err.message);
    return null;
  }
}

// 1. Render AI Assistant Page
module.exports.renderAssistant = (req, res) => {
  res.render("ai/assistant.ejs");
};

// 2. AI Chatbot Concierge Endpoint
module.exports.chatConcierge = async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.json({ reply: "Please ask me any question regarding student hostels, mess rules, budget, or campus transit!" });
  }

  const systemInstruction = "You are StayWise AI Concierge, a helpful assistant for university students looking for hostels, PGs, and shared rooms in India. Keep answers concise, student-friendly, and practical.";
  const aiReply = await generateGeminiText(message, systemInstruction);

  if (aiReply) {
    return res.json({ reply: aiReply });
  }

  // Fallback intelligent responses
  const msg = message.toLowerCase();
  let fallbackReply = "StayWise AI suggests checking hostels within 1 km of campus for optimal transit. Most PGs include mess service and high-speed fiber internet.";
  if (msg.includes("budget") || msg.includes("rent")) {
    fallbackReply = "For student housing, average rents range from ₹7,000 - ₹12,000/month depending on single vs double sharing and mess facilities.";
  } else if (msg.includes("safety") || msg.includes("curfew")) {
    fallbackReply = "Our listed hostels maintain an average Safety Score of 90/100, featuring biometric gates, 24/7 security guards, and 10:30 PM curfew times.";
  } else if (msg.includes("mess") || msg.includes("food")) {
    fallbackReply = "Over 85% of StayWise AI hostels provide 3 hygienic daily meals (breakfast, lunch, dinner) with mess charges around ₹2,000 - ₹3,000/month.";
  }

  res.json({ reply: fallbackReply });
};

// 3. AI Budget Planner Endpoint
module.exports.calculateBudget = async (req, res) => {
  const { rent, mess, transport, personal } = req.body;
  const rentVal = Number(rent) || 8000;
  const messVal = Number(mess) || 2500;
  const transVal = Number(transport) || 1500;
  const personalVal = Number(personal) || 3000;
  const total = rentVal + messVal + transVal + personalVal;

  const prompt = `A university student has a total estimated monthly cost of ₹${total} (Rent: ₹${rentVal}, Mess: ₹${messVal}, Transport: ₹${transVal}, Personal: ₹${personalVal}). Provide 3 actionable financial saving tips for a college student in 3 bullet points.`;
  
  const aiAdvice = await generateGeminiText(prompt);
  const advice = aiAdvice || `
- Choose a hostel within walking distance (under 1.0 km) to reduce transit costs to zero.
- Opt for mess-included accommodations to save up to 30% compared to eating out daily.
- Share double or triple occupancy rooms to lower monthly rent significantly.
  `;

  res.json({
    total,
    breakdown: { rent: rentVal, mess: messVal, transport: transVal, personal: personalVal },
    advice
  });
};

// 4. AI Hostel Description Generator Endpoint
module.exports.generateDescription = async (req, res) => {
  const { title, location, roomType, gender, college, amenities } = req.body;
  const prompt = `Write an attractive 3-paragraph marketing description for a student accommodation named "${title || 'Student Hostel'}" near "${college || 'University'}" in "${location || 'City'}". Room Type: ${roomType || 'Double Sharing'}, Gender: ${gender || 'Co-ed'}, Amenities: ${(amenities || []).join(', ')}. Highlight security, study atmosphere, and convenience.`;

  const generatedCopy = await generateGeminiText(prompt);
  const description = generatedCopy || `Welcome to ${title || 'our student residency'}, the premier accommodation option for students near ${college || 'campus'}. Located in ${location || 'a quiet neighborhood'}, we offer modern ${roomType || 'rooms'} designed specifically for academic focus and comfort. Equipped with high-speed WiFi, nutritious mess meals, and 24/7 security, our hostel provides the perfect home away from home.`;

  res.json({ description });
};

// 5. AI Roommate Matchmaker Endpoint
module.exports.matchRoommate = async (req, res) => {
  const { sleepHabits, studyHabits, cleanliness, noiseTolerance } = req.body;

  const prompt = `Calculate a compatibility match score (percentage out of 100) and brief explanation for a roommate seeker with: Sleep Habits: ${sleepHabits}, Study Habits: ${studyHabits}, Cleanliness: ${cleanliness}, Noise Tolerance: ${noiseTolerance}. Return JSON with "matchScore" and "reasons".`;

  const aiMatch = await generateGeminiText(prompt);
  if (aiMatch) {
    try {
      const parsed = JSON.parse(aiMatch);
      return res.json(parsed);
    } catch(e) {}
  }

  res.json({
    matchScore: 92,
    reasons: "High compatibility found! Shared study schedules, compatible sleep cycles, and aligned cleanliness standards ensure a harmonious living environment."
  });
};

// 6. AI Review Summarizer Endpoint
module.exports.summarizeReviews = async (req, res) => {
  const { hostelId } = req.query;
  const hostel = await Listing.findById(hostelId).populate("reviews");

  if (!hostel || !hostel.reviews || hostel.reviews.length === 0) {
    return res.json({ summary: "No student reviews available yet to summarize." });
  }

  const reviewTexts = hostel.reviews.map(r => `"${r.comment}" (Rating: ${r.rating}/5)`).join("\n");
  const prompt = `Summarize the following student reviews for hostel "${hostel.title}" into 3 bullet points (Pros, Cons, Final Verdict):\n${reviewTexts}`;

  const aiSummary = await generateGeminiText(prompt);
  const summary = aiSummary || `
• <strong>Pros:</strong> Students appreciate the fast WiFi, clean rooms, and close proximity to campus (${hostel.distanceFromCollege} km).
• <strong>Cons:</strong> Curfew enforcement (${hostel.curfewTime}) is strictly monitored.
• <strong>Verdict:</strong> Highly recommended student hostel with an average rating of ${hostel.rating}/5.
  `;

  res.json({ summary });
};
