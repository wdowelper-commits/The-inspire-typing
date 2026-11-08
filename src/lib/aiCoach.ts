import { GoogleGenAI } from '@google/genai';

export const isAICoachAvailable = Boolean(
  import.meta.env.VITE_GEMINI_API_KEY && import.meta.env.VITE_GEMINI_API_KEY.trim() !== ''
);

interface CoachAnalysisRequest {
  language: string;
  wpm: number;
  accuracy: number;
  mistakes: number;
  weakKeys?: string[];
  goal: string;
}

export interface CoachAnalysisResponse {
  diagnosis: string;
  keyInsights: string[];
  recommendedDrills: string[];
  generatedDrillText: string;
}

export async function requestAICoachAnalysis(
  req: CoachAnalysisRequest
): Promise<CoachAnalysisResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (process as any).env?.GEMINI_API_KEY || '';

  if (!apiKey) {
    // Graceful fallback with high-value heuristic coaching
    return generateHeuristicFeedback(req);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are the master typing coach at Inspire Typing.
Analyze this typist's performance and generate targeted practice sentences.
Data:
- Language: ${req.language}
- Speed: ${req.wpm} Words Per Minute
- Accuracy: ${req.accuracy}%
- Mistakes: ${req.mistakes}
- Weak keys: ${req.weakKeys?.join(', ') || 'Various common transitions'}
- User Goal: ${req.goal}

Provide your response strictly in JSON format with these exact keys:
{
  "diagnosis": "Detailed 2-3 sentence assessment of their rhythm, muscle memory, and finger cadence",
  "keyInsights": ["Insight 1", "Insight 2", "Insight 3"],
  "recommendedDrills": ["Drill 1", "Drill 2"],
  "generatedDrillText": "A custom 40-60 word practice text specifically exercising their weak points in ${req.language}"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-argon',
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingLevel: 'HIGH' as any,
        },
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '';
    return JSON.parse(text);
  } catch (err) {
    console.warn('AI Coach generation error, using fallback:', err);
    return generateHeuristicFeedback(req);
  }
}

function generateHeuristicFeedback(req: CoachAnalysisRequest): CoachAnalysisResponse {
  const isUrdu = req.language.includes('urdu');

  if (isUrdu) {
    return {
      diagnosis: `آپ کی رفتار ${req.wpm} الفاظ فی منٹ اور درستگی ${req.accuracy}% ہے۔ نستعلیق ٹائپنگ میں الف، ب اور ت کی ترتیب کو یاد رکھ کر اور شفٹ کیز پر قابو پا کر آپ کی اسپیڈ میں تیزی سے اضافہ ہو سکتا ہے۔`,
      keyInsights: [
        'کی بورڈ پر ہاتھ رکھنے کی درست پوزیشن برقرار رکھیں',
        'اردو کے مرکب حروف جیسے ٹ، ڈ، ڑ کے لیے بائیں اور دائیں شفٹ کا متوازن استعمال کریں',
        'شروع میں تیز لکھنے کے بجائے درستگی پر توجہ دیں',
      ],
      recommendedDrills: [
        'ہوم رو کے بنیادی حروف کی روزانہ ۵ منٹ مشق',
        'روزمرہ کے جملوں اور اقوال زریں کی ریڈنگ اور ٹائپنگ',
      ],
      generatedDrillText:
        'علم ایک ایسی لازوال دولت ہے جو بانٹنے سے بڑھتی ہے۔ محنت اور مستقل مزاجی سے ہر مشکل ہنر آسان بن جاتا ہے۔ اردو ٹائپنگ میں روزانہ کی تھوڑی سی ریاضت آپ کو ایک باکمال ٹائپسٹ بنا سکتی ہے۔',
    };
  }

  return {
    diagnosis: `Your performance shows a solid foundation at ${req.wpm} WPM with ${req.accuracy}% accuracy. To break past your current threshold, prioritize maintaining an even cadence without sudden bursts and pauses.`,
    keyInsights: [
      'Maintain continuous rhythmic keystrokes instead of rushing and braking',
      'Keep your wrists floating gently above the desk to prevent fatigue',
      'Look ahead two to three words in advance while typing',
    ],
    recommendedDrills: [
      'Top and bottom row reach drills for index fingers',
      'High-frequency ngram pairs (th, he, in, er, an, re)',
    ],
    generatedDrillText:
      'The quiet craftsman perfected his rhythm with mindful patience. Every steady stroke connected ideas smoothly across the screen without hesitation. Great typing flows like music when your fingers know their exact home on the keys.',
  };
}
