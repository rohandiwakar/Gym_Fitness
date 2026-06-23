import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Serve static assets from Vite build output folder 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize Google Gen AI
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

if (!apiKey) {
  console.warn('⚠️ WARNING: GEMINI_API_KEY environment variable is not defined. AI features will operate in mock mode.');
} else {
  console.log('✅ Gemini Gen AI successfully initialized.');
}

// Workout Generation API Endpoint
app.post('/api/generate-workout', async (req, res) => {
  const { goal, durationWeeks, fitnessLevel, focusCategory, extraNotes } = req.body;

  if (!goal) {
    return res.status(400).json({ error: 'Goal is a required field.' });
  }

  // If Gemini client is not initialized, return a simulated response explaining how to configure it
  if (!ai) {
    return res.json({
      isMock: true,
      message: 'Configure GEMINI_API_KEY in server environment to enable live AI generation.',
      plan: {
        id: `mock_ai_work_${Date.now()}`,
        name: `AI generated: ${goal} (${durationWeeks || 8} Weeks)`,
        goal: goal,
        durationWeeks: durationWeeks || 8,
        exercises: [
          {
            exerciseId: 'e1',
            exerciseName: 'Barbell Back Squat',
            sets: 4,
            reps: '8-12',
            restSeconds: 90,
            category: 'Legs',
            bgImage: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=400&q=80'
          },
          {
            exerciseId: 'e2',
            exerciseName: 'Flat Bench Dumbbell Press',
            sets: 4,
            reps: '10',
            restSeconds: 75,
            category: 'Chest',
            bgImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80'
          },
          {
            exerciseId: 'e3',
            exerciseName: 'Bent-Over Dumbbell Row',
            sets: 3,
            reps: '12',
            restSeconds: 60,
            category: 'Back',
            bgImage: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=400&q=80'
          }
        ]
      }
    });
  }

  try {
    const prompt = `
      You are an elite fitness personal trainer. Generate a highly detailed, professional workout plan in JSON format.
      The parameters requested by the user are:
      - Goal: "${goal}"
      - Duration: ${durationWeeks || 8} Weeks
      - Fitness Level: "${fitnessLevel || 'Intermediate'}"
      - Focus Category: "${focusCategory || 'All'}"
      - Additional Notes: "${extraNotes || 'None'}"

      Respond ONLY with a JSON object that matches the following TypeScript interface structure (do not wrap in markdown or add notes outside the JSON block):
      {
        "name": "String (a creative name for the plan, e.g. 'Spartan Strength Grid' or 'Sculpt & Burn HIIT')",
        "goal": "String",
        "durationWeeks": Number,
        "exercises": [
          {
            "exerciseId": "String (pick one from: e1, e2, e3, e4, e5, e6, e7 or generate a new unique slug like ai-ex-pushup)",
            "exerciseName": "String",
            "sets": Number,
            "reps": "String (e.g. '8-12', '12', 'AMRAP')",
            "restSeconds": Number,
            "category": "String (e.g. Chest, Back, Legs, Shoulders, Core, Cardio)",
            "bgImage": "String (a valid unsplash image url representing the exercise)"
          }
        ]
      }

      Choose relevant, realistic exercises based on the goal. Return exactly the JSON object, nothing else.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '{}';
    const plan = JSON.parse(text);
    
    // Assign a unique id to the plan
    plan.id = `ai_work_${Date.now()}`;
    
    res.json({ isMock: false, plan });
  } catch (error: any) {
    console.error('Error generating workout with Gemini:', error);
    res.status(500).json({ error: 'Failed to generate workout plan via Gemini API.', details: error.message });
  }
});

// Diet Generation API Endpoint
app.post('/api/generate-diet', async (req, res) => {
  const { goal, dailyCalories, targetProtein, dietaryRestrictions } = req.body;

  if (!goal) {
    return res.status(400).json({ error: 'Goal is a required field.' });
  }

  if (!ai) {
    return res.json({
      isMock: true,
      message: 'Configure GEMINI_API_KEY in server environment to enable live AI generation.',
      plan: {
        id: `mock_ai_diet_${Date.now()}`,
        name: `AI Diet: ${goal}`,
        goal: goal,
        meals: [
          {
            mealName: 'Egg White & Avocado Toast',
            description: '3 scrambled egg whites, 1 slice whole wheat bread toasted, 1/4 mashed avocado.',
            calories: 320,
            protein: 24,
            carbs: 22,
            fats: 11,
            time: '08:00 AM'
          },
          {
            mealName: 'Glazed Salmon Bowl',
            description: 'Grilled salmon fillet (150g), 1/2 cup quinoa, steamed asparagus spears.',
            calories: 550,
            protein: 38,
            carbs: 45,
            fats: 18,
            time: '01:30 PM'
          },
          {
            mealName: 'Micellar Whey Shake',
            description: '1 scoop whey protein isolate mixed in water or almond milk, 1 small banana.',
            calories: 220,
            protein: 26,
            carbs: 28,
            fats: 2,
            time: '05:00 PM'
          }
        ]
      }
    });
  }

  try {
    const prompt = `
      You are an elite sports nutritionist. Generate a highly detailed, professional diet plan in JSON format.
      The parameters requested by the user are:
      - Goal: "${goal}" (e.g. Weight Loss, Muscle Gain, Maintenance)
      - Daily Calories target: ${dailyCalories || 2000} kcal
      - Target Protein: ${targetProtein || 140} grams
      - Dietary Restrictions: "${dietaryRestrictions || 'None'}"

      Respond ONLY with a JSON object that matches the following TypeScript interface structure (do not wrap in markdown or add notes outside the JSON block):
      {
        "name": "String (a creative name for the diet plan, e.g. 'Lean Mass Fuel Matrix' or 'Keto Shred Outline')",
        "goal": "String (must be exactly 'Weight Loss', 'Muscle Gain', or 'Maintenance')",
        "meals": [
          {
            "mealName": "String",
            "description": "String",
            "calories": Number,
            "protein": Number,
            "carbs": Number,
            "fats": Number,
            "time": "String (e.g. '08:30 AM', '01:00 PM')"
          }
        ]
      }

      Generate appropriate meals that sum up approximately to the target calories and macros. Return exactly the JSON object, nothing else.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '{}';
    const plan = JSON.parse(text);
    
    // Assign a unique id
    plan.id = `ai_diet_${Date.now()}`;
    
    res.json({ isMock: false, plan });
  } catch (error: any) {
    console.error('Error generating diet with Gemini:', error);
    res.status(500).json({ error: 'Failed to generate diet plan via Gemini API.', details: error.message });
  }
});

// Wildcard route to serve the SPA frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
