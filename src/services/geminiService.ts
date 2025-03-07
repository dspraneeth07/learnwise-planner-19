
import { Subject, TimeSlot, StudyGoal, StudySession } from "@/context/StudyContext";

const GEMINI_API_KEY = "AIzaSyDRuULswOC1iFSJr83VqRaeP1g8p0Vn4Lc";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

interface GeminiRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
}

export async function generateAIStudyPlan(
  goal: StudyGoal,
  goalDetails: string,
  subjects: Subject[],
  timeSlots: TimeSlot[]
): Promise<StudySession[]> {
  try {
    // Format the prompt with all study details
    const prompt = `
      Generate an optimized study plan based on the following information:
      
      Study Goal: ${goal} ${goalDetails ? `- ${goalDetails}` : ''}
      
      Subjects (with difficulty levels):
      ${subjects.map(subject => `- ${subject.name} (${subject.difficulty})`).join('\n')}
      
      Available Time Slots:
      ${timeSlots.map(slot => `- ${slot.day}: ${slot.startTime} to ${slot.endTime}`).join('\n')}
      
      Create a detailed study schedule that:
      1. Allocates more time to difficult subjects
      2. Distributes subjects across available time slots
      3. Includes appropriate breaks
      4. Optimizes learning efficiency
      
      Return the response as a structured JSON array of study sessions with the following format:
      [
        {
          "id": "unique-id",
          "subject": {"id": "subject-id", "name": "subject name", "difficulty": "difficulty level"},
          "day": "day of week",
          "startTime": "HH:MM",
          "endTime": "HH:MM",
          "duration": minutes
        }
      ]
      
      Only return the JSON array, no other text.
    `;

    // Prepare the request
    const request: GeminiRequest = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };

    // Call the Gemini API
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract the generated content
    const generatedContent = data.candidates[0].content.parts[0].text;
    
    // Try to parse the JSON response
    try {
      // Find JSON array in the response (Gemini might include additional text)
      const jsonMatch = generatedContent.match(/\[\s*\{.*\}\s*\]/s);
      if (jsonMatch) {
        const jsonString = jsonMatch[0];
        const parsedPlan = JSON.parse(jsonString) as Omit<StudySession, 'id'>[];
        
        // Add unique IDs
        return parsedPlan.map(session => ({
          ...session,
          id: `session-${Math.random().toString(36).substr(2, 9)}`
        }));
      } else {
        console.error("Could not extract JSON from Gemini response:", generatedContent);
        return [];
      }
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError, generatedContent);
      return [];
    }
  } catch (error) {
    console.error("Error generating AI study plan:", error);
    return [];
  }
}
