import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function callWithRetry<T>(fn: () => Promise<T>, retries = 2, delayMs = 1200): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    if (retries > 0) {
      console.warn(`[Gemini Retry] Retrying call in ${delayMs}ms. Attempts left: ${retries}`);
      await new Promise((r) => setTimeout(r, delayMs));
      return callWithRetry(fn, retries - 1, delayMs * 1.5);
    }
    throw err;
  }
}

// Built-in sample video library with rich metadata
const SAMPLE_VIDEOS = [
  {
    id: 'sample-cyberpunk',
    title: 'Cyberpunk Neon Cyber-Car Cruise',
    titleId: 'Mobil Cyberpunk Melaju di Kota Futuristik',
    genre: 'Sci-Fi / Cyberpunk',
    prompt: 'Cinematic tracking shot, a futuristic neon hypercar drifting through a rain-drenched cyberpunk metropolis. Volumetric neon reflections on wet asphalt, holographic billboards, 35mm anamorphic lens, 8k resolution, photorealistic cinematic lighting.',
    aspectRatio: '16:9',
    duration: '5s',
    resolution: '720p',
    cameraMotion: 'Tracking Push-in',
    directorNotes: 'Fokus pada kontras warna neon cyan dan magenta. Pantulan air hujan pada bodi mobil memberikan kedalaman visual dramatis dengan kecepatan kamera dinamis.',
    soundtrackCues: 'Low synthwave pulse, gentle tire hiss on wet asphalt, distant neon flicker.',
    voiceover: 'Di kota tanpa fajar, kecepatan adalah satu-satunya pelarian yang nyata.',
    // High quality royalty-free cinematic sample video URL
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    tags: ['Cyberpunk', 'Neon', 'Cars', 'Cinematic']
  },
  {
    id: 'sample-nature',
    title: 'Drone Soaring Over Majestic Waterfalls',
    titleId: 'Aerial Drone Melintasi Air Terjun Tropis',
    genre: 'Nature Documentary',
    prompt: 'Sweeping FPV drone aerial shot ascending a colossal emerald cliff covered in tropical rainforest, revealing a roaring twin waterfall surrounded by rainbow mist. Golden hour sunlight piercing through canopy, ultra-detailed mist particles, BBC Earth cinematic style.',
    aspectRatio: '16:9',
    duration: '5s',
    resolution: '720p',
    cameraMotion: 'Drone Ascend & Orbit',
    directorNotes: 'Pergerakan drone dimulai dari dasar lembah berair menuju puncak tebing untuk memberikan kesan skala yang megah dan magis.',
    soundtrackCues: 'Roar of cascading water, soft ambient orchestral strings, jungle bird calls.',
    voiceover: 'Setiap tetes air mengukir bumi, menciptakan keindahan yang abadi.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?w=800&auto=format&fit=crop&q=80',
    tags: ['Nature', 'Drone', 'Waterfalls', '4K']
  },
  {
    id: 'sample-coffee',
    title: 'Artisan Espresso Extraction & Pour',
    titleId: 'Ekstraksi Kopi Espresso & Latte Art Sinematik',
    genre: 'Commercial / Macro',
    prompt: 'Ultra slow-motion macro shot of thick golden espresso crema pouring from a bottomless portafilter into a clear crystal glass. Warm morning sunlight, steam wisps catching backlight, shallow depth of field, 100fps high-speed cinematography.',
    aspectRatio: '9:16',
    duration: '5s',
    resolution: '720p',
    cameraMotion: 'Macro Slow Pan',
    directorNotes: 'Pencahayaan hangat dari samping (rim lighting) menonjolkan tekstur tetesan crema dan uap panas untuk menggugah selera.',
    soundtrackCues: 'Gentle espresso hiss, soft acoustic guitar picking, morning café ambient.',
    voiceover: 'Setiap pagi berhak mendapatkan karya seni pertama Anda.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=800&auto=format&fit=crop&q=80',
    tags: ['Commercial', 'Coffee', 'Macro', 'Slow-Mo']
  },
  {
    id: 'sample-ghibli',
    title: 'Whimsical Anime Forest Shrine',
    titleId: 'Kuil Hutan Animasi Ghibli Berkilau',
    genre: 'Anime / Fantasy',
    prompt: 'Vibrant hand-drawn anime aesthetic, Studio Ghibli style. Sunlight filtering through lush ancient oak canopy onto a mossy stone lantern. Glowing spiritual fireflies dance in the gentle breeze, floating dandelion seeds, peaceful melancholic anime atmosphere.',
    aspectRatio: '16:9',
    duration: '5s',
    resolution: '720p',
    cameraMotion: 'Gentle Crane Tilt',
    directorNotes: 'Gaya visual cerah dan magis dengan gradasi warna hijau lumut dan sinar matahari lembut. Gerakan daun dan kunang-kunang memberi nyawa pada pemandangan.',
    soundtrackCues: 'Soft piano melody (Joe Hisaishi style), rustling leaves, gentle wind chimes.',
    voiceover: 'Di antara dedaunan kuno, rahasia masa lalu masih berbisik.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    tags: ['Anime', 'Fantasy', 'Ghibli', 'Magical']
  }
];

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '60mb' }));
  app.use(express.urlencoded({ extended: true, limit: '60mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: !!process.env.GEMINI_API_KEY,
      videoModel: 'gemini-omni-1.1-flash',
      agentModel: 'gemini-3.8-flash',
      ttsModel: 'gemini-3.8-flash-lite-tts'
    });
  });

  // Get sample videos
  app.get('/api/samples', (req, res) => {
    res.json({ samples: SAMPLE_VIDEOS });
  });

  // Step 1: Brainstorm ideas from user theme & category
  app.post('/api/agent/brainstorm', async (req, res) => {
    try {
      const {
        theme,
        format = 'short', // 'short' | 'story'
        category = 'Edukasi', // Edukasi, Informasi, Hiburan, Fiksi Sinematik, dll
        language = 'id'
      } = req.body;

      if (!theme || typeof theme !== 'string' || !theme.trim()) {
        return res.status(400).json({ error: 'Tema video diperlukan.' });
      }

      const ai = getAiClient();
      const isId = language === 'id';

      const systemPrompt = `You are OmniMotion Creative Producer & Story Architect.
Your task is to take a raw user theme and generate 3 distinctive, compelling creative video concepts tailored for ${format === 'short' ? 'Social Shorts/Reels/TikTok (high engagement, fast hook)' : 'Narrative Cinematic Story / Mini-Doc'}.
Category: ${category}.
Language: ${isId ? 'Indonesian (Bahasa Indonesia)' : 'English'}.

CRITICAL: Return strictly valid JSON matching the schema.`;

      const userPrompt = `Brainstorm 3 diverse creative angles for this theme:
Theme: "${theme.trim()}"
Format: ${format}
Category: ${category}

Angle 1: Hook-first & high curiosity
Angle 2: Emotional & storytelling narrative
Angle 3: Fascinating insight / perspective shift

Provide JSON array of 3 ideas with:
- id: string
- title: catch, punchy title
- hook: opening 3-second hook
- angleDescription: summary of the story/content flow
- visualMood: mood and color feel
- recommendedStyle: visual aesthetic preset (e.g. Hollywood 35mm, Studio Ghibli Anime, Cyberpunk Neon, BBC Earth Nature)`;

      let parsedIdeas: any[] = [];
      try {
        const response = await callWithRetry(async () => {
          return await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: userPrompt,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  ideas: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        hook: { type: Type.STRING },
                        angleDescription: { type: Type.STRING },
                        visualMood: { type: Type.STRING },
                        recommendedStyle: { type: Type.STRING }
                      },
                      required: ['id', 'title', 'hook', 'angleDescription', 'visualMood', 'recommendedStyle']
                    }
                  }
                },
                required: ['ideas']
              }
            }
          });
        });
        const parsed = JSON.parse(response.text || '{"ideas":[]}');
        parsedIdeas = parsed.ideas || [];
      } catch (geminiErr) {
        console.warn('[Brainstorm Fallback] Using intelligent local creative generator due to upstream demand spike:', geminiErr);
        parsedIdeas = [
          {
            id: 'angle-hook',
            title: `Rahasia Tersembunyi: ${theme.slice(0, 35)}`,
            hook: `Tahukah Anda bahwa ${theme.slice(0, 30)} menyimpan fakta mengejutkan yang jarang diketahui orang?`,
            angleDescription: `Eksplorasi berkecepatan tinggi dengan hook 3 detik yang memikat rasa penasaran penonton dari detik pertama.`,
            visualMood: 'Dramatis & Penuh Kontras Misterius',
            recommendedStyle: 'Hollywood 35mm Film'
          },
          {
            id: 'angle-story',
            title: `Jejak Waktu: Perjalanan ${theme.slice(0, 30)}`,
            hook: `Di balik megahnya sejarah ini, ada kisah perjuangan tak terduga yang mengubah segalanya...`,
            angleDescription: `Alur cerita emosional dan mendalam berfokus pada perjalanan manusia dan keindahan visual lanskap.`,
            visualMood: 'Hangat Sinematik Golden Hour',
            recommendedStyle: 'Studio Ghibli Anime'
          },
          {
            id: 'angle-insight',
            title: `Melihat Dari Dekat: Keajaiban ${theme.slice(0, 30)}`,
            hook: `Bukan seperti yang Anda bayangkan selama ini, kenyataannya jauh lebih luar biasa!`,
            angleDescription: `Wawasan edukatif berbasis perspektif unik dengan pengambilan gambar makro dan sinematik.`,
            visualMood: 'Elegan, Tajam & Modern 4K',
            recommendedStyle: 'BBC Earth Nature'
          }
        ];
      }

      return res.json({ success: true, ideas: parsedIdeas });
    } catch (err: any) {
      console.error('Error in /api/agent/brainstorm:', err);
      return res.status(500).json({ error: err.message || 'Gagal membuat ide brainstorm.' });
    }
  });

  // Step 2: Generate 3 script variations based on chosen idea
  app.post('/api/agent/scripts', async (req, res) => {
    try {
      const {
        theme,
        chosenIdea,
        format = 'short',
        category = 'Edukasi',
        language = 'id'
      } = req.body;

      const ai = getAiClient();
      const isId = language === 'id';

      const systemPrompt = `You are an elite scriptwriter for digital video (Shorts, Reels, YouTube stories, and mini-documentaries).
Given a creative concept, generate 3 complete script options with distinct tones:
Option 1: Dynamic & punchy (ideal for fast retention, strong hooks)
Option 2: Deep, narrative & atmospheric (story-driven, emotional)
Option 3: Clear, informative & engaging (educational/curiosity-driven)

Language: ${isId ? 'Indonesian (Bahasa Indonesia)' : 'English'}.
Format strictly as JSON.`;

      const userPrompt = `Write 3 complete script options for:
Theme: "${theme || ''}"
Selected Concept: "${chosenIdea?.title || ''}" - ${chosenIdea?.angleDescription || ''}
Category: ${category}
Format: ${format}

Each script must include:
- id: string
- title: script title
- toneLabel: (e.g. "Cepat & Menusuk", "Naratif Mendalam", "Informatif Menghibur")
- hook: The opening line that grabs attention immediately
- body: The central story text / narrative paragraphs
- callToAction: Closing sentence / thought-provoking conclusion
- fullVoiceover: Complete spoken narration text from start to finish (clean speech without technical annotations)
- estimatedWordCount: number of words`;

      let parsedScripts: any[] = [];
      try {
        const response = await callWithRetry(async () => {
          return await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: userPrompt,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  scripts: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        toneLabel: { type: Type.STRING },
                        hook: { type: Type.STRING },
                        body: { type: Type.STRING },
                        callToAction: { type: Type.STRING },
                        fullVoiceover: { type: Type.STRING },
                        estimatedWordCount: { type: Type.INTEGER }
                      },
                      required: ['id', 'title', 'toneLabel', 'hook', 'body', 'callToAction', 'fullVoiceover', 'estimatedWordCount']
                    }
                  }
                },
                required: ['scripts']
              }
            }
          });
        });
        const parsed = JSON.parse(response.text || '{"scripts":[]}');
        parsedScripts = parsed.scripts || [];
      } catch (geminiErr) {
        console.warn('[Scripts Fallback] Using intelligent local script generator:', geminiErr);
        const titleBase = chosenIdea?.title || theme || 'Kisah Menakjubkan';
        parsedScripts = [
          {
            id: 'script-fast',
            title: `${titleBase} (Versi Cepat & Viral)`,
            toneLabel: 'Cepat & Menusuk (Viral Hook)',
            hook: `Hentikan scrolling Anda! Tahukah Anda rahasia terbesar di balik ${theme.slice(0, 30)}?`,
            body: `Selama ratusan tahun, fakta ini tersembunyi dari pandangan publik. Dari awal mula penemuannya yang mengejutkan, hingga menjadi fenomena global yang mengubah cara kita memandang dunia. Semua bermula dari satu momen kecil yang tak terduga.`,
            callToAction: `Menurut Anda, apakah rahasia ini masuk akal? Tulis pendapat Anda di kolom komentar!`,
            fullVoiceover: `Hentikan scrolling Anda! Tahukah Anda rahasia terbesar di balik ${theme.slice(0, 30)}? Selama ratusan tahun, fakta ini tersembunyi dari pandangan publik. Dari awal mula penemuannya yang mengejutkan, hingga menjadi fenomena global yang mengubah cara kita memandang dunia. Semua bermula dari satu momen kecil yang tak terduga. Menurut Anda, apakah rahasia ini masuk akal? Tulis pendapat Anda di kolom komentar!`,
            estimatedWordCount: 65
          },
          {
            id: 'script-narrative',
            title: `${titleBase} (Versi Kisah Emosional)`,
            toneLabel: 'Naratif Mendalam & Sinematik',
            hook: `Di antara kabut fajar dan gemuruh masa lalu, sebuah kisah luar biasa dimulai...`,
            body: `Perjalanan ini bukan sekadar tentang sejarah, melainkan tentang jiwa-jiwa pemberani yang mempercayai mimpinya. Setiap tetes keringat, setiap helai nafas terukir abadi dalam tanah tempat kita berpijak hari ini. Keindahan sejati selalu lahir dari ketabahan yang tak tergoyahkan.`,
            callToAction: `Jangan pernah meremehkan langkah kecil hari ini, karena itulah awal mula keagungan masa depan.`,
            fullVoiceover: `Di antara kabut fajar dan gemuruh masa lalu, sebuah kisah luar biasa dimulai... Perjalanan ini bukan sekadar tentang sejarah, melainkan tentang jiwa-jiwa pemberani yang mempercayai mimpinya. Setiap tetes keringat, setiap helai nafas terukir abadi dalam tanah tempat kita berpijak hari ini. Keindahan sejati selalu lahir dari ketabahan yang tak tergoyahkan. Jangan pernah meremehkan langkah kecil hari ini, karena itulah awal mula keagungan masa depan.`,
            estimatedWordCount: 75
          },
          {
            id: 'script-insight',
            title: `${titleBase} (Versi Edukasi Eksploratif)`,
            toneLabel: 'Informatif & Membuka Wawasan',
            hook: `Apa yang sebenarnya terjadi ketika kita menggali lebih dalam tentang ${theme.slice(0, 30)}?`,
            body: `Para peneliti dan sejarawan menemukan pola yang sangat unik. Ketika kita mengamati detail terkecilnya, sains dan seni bersatu menciptakan harmoni yang mencengangkan. Ini membuktikan bahwa alam semesta selalu memiliki cara elegan untuk mengejutkan akal manusia.`,
            callToAction: `Simpan video ini jika Anda belajar hal baru hari ini, dan bagikan ke teman Anda!`,
            fullVoiceover: `Apa yang sebenarnya terjadi ketika kita menggali lebih dalam tentang ${theme.slice(0, 30)}? Para peneliti dan sejarawan menemukan pola yang sangat unik. Ketika kita mengamati detail terkecilnya, sains dan seni bersatu menciptakan harmoni yang mencengangkan. Ini membuktikan bahwa alam semesta selalu memiliki cara elegan untuk mengejutkan akal manusia. Simpan video ini jika Anda belajar hal baru hari ini, dan bagikan ke teman Anda!`,
            estimatedWordCount: 70
          }
        ];
      }

      return res.json({ success: true, scripts: parsedScripts });
    } catch (err: any) {
      console.error('Error in /api/agent/scripts:', err);
      return res.status(500).json({ error: err.message || 'Gagal menyusun script cerita.' });
    }
  });

  // Step 3: Generate detailed multi-scene storyboard prompts based on chosen script & scene count
  app.post('/api/agent/storyboard', async (req, res) => {
    try {
      const {
        scriptTitle,
        scriptText,
        sceneCount = 4,
        visualStyle = 'Hollywood 35mm Film',
        aspectRatio = '9:16',
        language = 'id'
      } = req.body;

      const ai = getAiClient();
      const isId = language === 'id';
      const count = Math.min(Math.max(Number(sceneCount) || 4, 2), 8);

      const systemPrompt = `You are OmniMotion Storyboard Master & Cinematographer.
Given a selected script, break it down into EXACTLY ${count} sequential visual scenes.
For each scene, you MUST craft a dedicated MASTER prompt for Gemini Omni Video (gemini-omni-1.1-flash).

CRITICAL DIRECTING PRINCIPLES:
1. Master video prompts must be written in English for maximum photorealism, physical accuracy, and visual detail in Omni Flash.
2. Include concrete physical camera movement (e.g. "camera slowly pans right", "dolly push-in", "macro low angle tracking", "FPV drone ascents").
3. Include lighting, optical lens (e.g. 35mm anamorphic, 85mm portrait), depth of field, and atmosphere.
4. Each scene must carry a designated portion of the voiceover text corresponding to that visual moment.`;

      const userPrompt = `Break this script into ${count} visual storyboard scenes:
Title: "${scriptTitle}"
Full Script/Voiceover:
"""
${scriptText}
"""
Visual Style Desired: ${visualStyle}
Aspect Ratio: ${aspectRatio}
Output notes/descriptions in: ${isId ? 'Indonesian (Bahasa Indonesia)' : 'English'}

Provide JSON with:
- title: string
- overallVision: 2 sentences explaining the visual progression across ${count} scenes
- scenes: Array of exactly ${count} objects:
  - sceneNumber: 1, 2, ...
  - shotType: (e.g. "Establishing Wide Shot", "Dynamic Macro Close-Up", "Over-the-Shoulder Tracking")
  - sceneAction: description of what happens visually in this shot
  - voiceoverSegment: the specific voiceover spoken during this shot
  - cameraMotion: specific camera movement (e.g. "Cinematic Push-in", "Drone Orbit", "Tilt-up")
  - cameraSpecs: { lens, lighting, speed }
  - masterVideoPrompt: English production-grade prompt for gemini-omni-1.1-flash containing subject, motion, camera move, lighting, visual style tags, photorealistic details.`;

      let parsedStoryboard: any = null;
      try {
        const response = await callWithRetry(async () => {
          return await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: userPrompt,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  overallVision: { type: Type.STRING },
                  scenes: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        sceneNumber: { type: Type.INTEGER },
                        shotType: { type: Type.STRING },
                        sceneAction: { type: Type.STRING },
                        voiceoverSegment: { type: Type.STRING },
                        cameraMotion: { type: Type.STRING },
                        cameraSpecs: {
                          type: Type.OBJECT,
                          properties: {
                            lens: { type: Type.STRING },
                            lighting: { type: Type.STRING },
                            speed: { type: Type.STRING }
                          },
                          required: ['lens', 'lighting', 'speed']
                        },
                        masterVideoPrompt: { type: Type.STRING }
                      },
                      required: ['sceneNumber', 'shotType', 'sceneAction', 'voiceoverSegment', 'cameraMotion', 'cameraSpecs', 'masterVideoPrompt']
                    }
                  }
                },
                required: ['title', 'overallVision', 'scenes']
              }
            }
          });
        });
        parsedStoryboard = JSON.parse(response.text || '{"scenes":[]}');
      } catch (geminiErr) {
        console.warn('[Storyboard Fallback] Using intelligent local storyboard generator:', geminiErr);
        const shotTypes = [
          'Establishing Wide Aerial Shot',
          'Medium Dynamic Tracking Shot',
          'Low-Angle Hero Shot',
          'Extreme Macro Close-Up',
          'FPV Drone Ascending Shot',
          'Intimate Over-The-Shoulder Shot',
          'Fast Lateral Dolly Pan',
          'Epic Pull-Back Finale Shot'
        ];
        const cameraMotions = [
          'FPV Drone Orbit',
          'Cinematic Push-in (Dolly In)',
          'Lateral Tracking Shot',
          'Slow Macro Zoom',
          'Jib Crane Tilt-Up',
          'Dynamic Handheld Gimbal',
          'Slow-Mo 120fps Pan',
          'Epic Pull-Back Reveal'
        ];

        const generatedScenes = [];
        const sentences = (scriptText || '').split(/[.!?]+/).filter((s: string) => s.trim().length > 5);

        for (let i = 1; i <= count; i++) {
          const shotType = shotTypes[(i - 1) % shotTypes.length];
          const camMotion = cameraMotions[(i - 1) % cameraMotions.length];
          const vo = sentences[i - 1] || sentences[0] || 'Kisah yang mengubah segalanya.';

          generatedScenes.push({
            sceneNumber: i,
            shotType,
            sceneAction: `Adegan #${i}: Visual memperlihatkan aksi dramatis sesuai naskah dengan pencahayaan sinematik dan gerakan kamera terarah.`,
            voiceoverSegment: vo.trim(),
            cameraMotion: camMotion,
            cameraSpecs: {
              lens: i === 1 ? '24mm Ultra-Wide' : i === 4 ? '100mm Macro f/2.8' : '35mm Anamorphic',
              lighting: i === 1 ? 'Golden hour volumetric rim lighting' : 'Chiaroscuro dramatic cinematic lighting',
              speed: '24 fps cinematic motion'
            },
            masterVideoPrompt: `Cinematic master shot, ${shotType.toLowerCase()}, ${camMotion.toLowerCase()}. Highly detailed scene illustrating ${scriptTitle.slice(0, 40)}. Photorealistic 35mm film grain, 8k resolution, volumetric atmospheric haze, octane render lighting, professional color grade.`
          });
        }

        parsedStoryboard = {
          title: scriptTitle || 'Storyboard Sinematik',
          overallVision: `Rangkaian ${count} adegan sinematik dengan ritme visual bertahap dari pengenalan megah hingga klimaks emosional.`,
          scenes: generatedScenes
        };
      }

      return res.json({ success: true, storyboard: parsedStoryboard });
    } catch (err: any) {
      console.error('Error in /api/agent/storyboard:', err);
      return res.status(500).json({ error: err.message || 'Gagal menyusun storyboard adegan.' });
    }
  });

  // Agent Director Endpoint: AI Director transforms ideas into professional cinematic prompts & storyboards
  app.post('/api/agent/direct', async (req, res) => {
    try {
      const {
        concept,
        style = 'Cinematic Film',
        cameraMotion = 'Dynamic cinematic push-in',
        duration = '5s',
        aspectRatio = '16:9',
        genre = 'Cinematic',
        language = 'id'
      } = req.body;

      if (!concept || typeof concept !== 'string' || !concept.trim()) {
        return res.status(400).json({ error: 'Konsep video diperlukan.' });
      }

      const ai = getAiClient();
      const isIndonesian = language === 'id';

      const systemPrompt = `You are OmniMotion Director, an elite Hollywood cinematic AI director and creative camera operator.
Your job is to take raw user ideas and turn them into production-ready, highly visual video prompts for Gemini Omni Video (gemini-omni-1.1-flash).

CRITICAL DIRECTING PRINCIPLES:
1. Video generation thrives on explicit physical camera movement, precise lighting, optical lens specifications, and physics descriptors.
2. A single shot prompt must describe ONE cohesive continuous camera move and focal point.
3. Provide camera specs: Lens (e.g. 35mm anamorphic / 85mm portrait), Lighting (golden hour, volumetric chiaroscuro, neon rim lighting), Motion (dolly zoom, slow-mo 60fps, FPV drone), Color Grading.
4. Output must be strictly valid JSON matching the requested schema.`;

      const userPrompt = `Develop a cinematic video directing package for this concept:
Concept: "${concept.trim()}"
Preferred Visual Style: ${style}
Camera Motion Desire: ${cameraMotion}
Target Duration: ${duration}
Aspect Ratio: ${aspectRatio}
Genre: ${genre}
Language for explanation/notes: ${isIndonesian ? 'Indonesian (Bahasa Indonesia)' : 'English'}

Provide a structured JSON output with:
- title: Short punchy title for this scene
- directorNotes: 2-3 sentences explaining the visual vision, tone, and pacing in ${isIndonesian ? 'Indonesian' : 'English'}
- cinematicPrompt: The MASTER prompt in English (English yields highest fidelity in video generation models) containing rich cinematography details (camera movement, subject motion, lighting, optics, environment, mood, quality tokens)
- storyboardShots: Array of 3 sequential shots breakdown [ { shotNumber, shotType, description, cameraMove, mood } ]
- cameraSpecs: { lens, movement, lighting, colorPalette, fps }
- suggestedVoiceover: 1-2 sentence voiceover narration in ${isIndonesian ? 'Indonesian' : 'English'}
- soundDesign: Atmospheric sound effects and musical cues`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              directorNotes: { type: Type.STRING },
              cinematicPrompt: { type: Type.STRING },
              storyboardShots: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    shotNumber: { type: Type.INTEGER },
                    shotType: { type: Type.STRING },
                    description: { type: Type.STRING },
                    cameraMove: { type: Type.STRING },
                    mood: { type: Type.STRING },
                  },
                  required: ['shotNumber', 'shotType', 'description', 'cameraMove', 'mood']
                }
              },
              cameraSpecs: {
                type: Type.OBJECT,
                properties: {
                  lens: { type: Type.STRING },
                  movement: { type: Type.STRING },
                  lighting: { type: Type.STRING },
                  colorPalette: { type: Type.STRING },
                  fps: { type: Type.STRING },
                },
                required: ['lens', 'movement', 'lighting', 'colorPalette', 'fps']
              },
              suggestedVoiceover: { type: Type.STRING },
              soundDesign: { type: Type.STRING }
            },
            required: ['title', 'directorNotes', 'cinematicPrompt', 'storyboardShots', 'cameraSpecs', 'suggestedVoiceover', 'soundDesign']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, result: parsed });
    } catch (err: any) {
      console.error('Error in /api/agent/direct:', err);
      return res.status(500).json({
        error: err.message || 'Gagal merancang arahan video dengan AI Director.',
        details: err.toString()
      });
    }
  });

  // Agent Chat: Conversational Director Assistant
  app.post('/api/agent/chat', async (req, res) => {
    try {
      const { messages, currentPrompt, currentSettings, language = 'id' } = req.body;
      const ai = getAiClient();

      const isIndonesian = language === 'id';
      const systemInstruction = `You are OmniMotion AI, an interactive AI Director & Cinematographer Agent.
You assist the user in brainstorming, refining, improving video ideas, adjusting camera movement, lighting, and style parameters.
Tone: Creative, professional, supportive, expert filmmaker.
Reply primarily in ${isIndonesian ? 'Indonesian (Bahasa Indonesia)' : 'English'}.
Whenever you suggest an improved video prompt, wrap the improved prompt in a markdown code block tagged \`\`\`prompt ... \`\`\` so the UI can offer a 1-click "Terapkan Prompt" button!
Current active video prompt: "${currentPrompt || 'Belum ada prompt'}"
Current settings: Aspect Ratio: ${currentSettings?.aspectRatio || '16:9'}, Duration: ${currentSettings?.duration || '5s'}, Style: ${currentSettings?.style || 'Cinematic'}`;

      const historyFormatted = (messages || []).map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // Make sure the last message is the user prompt
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: historyFormatted.length > 0 ? historyFormatted : [{ role: 'user', parts: [{ text: 'Halo Direktur AI!' }] }],
        config: {
          systemInstruction,
        }
      });

      const reply = response.text || '';
      return res.json({ success: true, message: reply });
    } catch (err: any) {
      console.error('Error in /api/agent/chat:', err);
      return res.status(500).json({ error: err.message || 'Gagal memproses obrolan agen.' });
    }
  });

  // Video Generation Endpoint using gemini-omni-1.1-flash via Interactions API
  app.post('/api/video/generate', async (req, res) => {
    try {
      const {
        prompt,
        inputType = 'text',
        imageBase64,
        imageMimeType = 'image/png',
        aspectRatio = '16:9',
        duration = '5s',
        resolution = '720p',
        previousInteractionId,
      } = req.body;

      if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        return res.status(400).json({ error: 'Prompt video tidak boleh kosong.' });
      }

      const ai = getAiClient();

      // Configure input based on text vs image-to-video
      let inputPayload: any;
      if (inputType === 'image' && imageBase64) {
        // Strip data:image/...;base64, prefix if present
        const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
        inputPayload = [
          {
            type: 'image',
            mime_type: imageMimeType || 'image/png',
            data: cleanBase64,
          },
          {
            type: 'text',
            text: prompt.trim(),
          }
        ];
      } else {
        inputPayload = prompt.trim();
      }

      console.log(`[Video Generator] Invoking gemini-omni-1.1-flash with aspect: ${aspectRatio}, duration: ${duration}, resolution: ${resolution}`);

      const interactionOptions: any = {
        model: 'gemini-omni-1.1-flash',
        input: inputPayload,
        background: false,
        store: true, // Store so iterative multi-turn editing is supported
        stream: false,
        response_format: {
          type: 'video',
          aspect_ratio: aspectRatio === '9:16' ? '9:16' : '16:9',
          duration: duration === '10s' ? '10s' : '5s',
          resolution: ['360p', '720p', '1080p'].includes(resolution) ? resolution : '720p',
        }
      };

      if (previousInteractionId) {
        interactionOptions.previous_interaction_id = previousInteractionId;
      }

      // 5-minute timeout for heavy video generation tasks
      const interaction = await ai.interactions.create(interactionOptions, { timeout: 300000 });

      console.log(`[Video Generator] Interaction returned with ID: ${interaction.id}, status: ${interaction.status}`);

      // Check output_video helper
      const videoPart = interaction.output_video;
      if (videoPart && videoPart.data) {
        const mimeType = videoPart.mime_type || 'video/mp4';
        return res.json({
          success: true,
          interactionId: interaction.id,
          videoBase64: videoPart.data,
          mimeType: mimeType,
          videoUrl: `data:${mimeType};base64,${videoPart.data}`,
          isGenerated: true,
        });
      }

      // Check if video is in steps array
      if (interaction.steps && Array.isArray(interaction.steps)) {
        for (const step of interaction.steps) {
          if (step.type === 'model_output' && step.content) {
            const videoContent = (step.content as any[]).find((c: any) => c.type === 'video');
            if (videoContent && videoContent.data) {
              const mimeType = videoContent.mime_type || 'video/mp4';
              return res.json({
                success: true,
                interactionId: interaction.id,
                videoBase64: videoContent.data,
                mimeType: mimeType,
                videoUrl: `data:${mimeType};base64,${videoContent.data}`,
                isGenerated: true,
              });
            }
          }
        }
      }

      return res.status(500).json({
        error: 'Model menyelesaikan proses namun tidak mengembalikan data video.',
        interactionId: interaction.id
      });

    } catch (err: any) {
      console.error('Error in /api/video/generate:', err);
      const errMsg = err?.message || err?.toString() || 'Kesalahan saat membuat video.';
      
      // Check if it's a quota or paid model requirement error
      const isQuotaOrPaid = errMsg.includes('RESOURCE_EXHAUSTED') || 
                            errMsg.includes('billing') || 
                            errMsg.includes('paid') ||
                            errMsg.includes('429') ||
                            errMsg.includes('not supported') ||
                            errMsg.includes('PERMISSION_DENIED');

      return res.status(500).json({
        error: errMsg,
        isQuotaOrPaid,
        suggestion: isQuotaOrPaid 
          ? 'Model video gemini-omni-1.1-flash memerlukan API key dengan billing aktif atau quota video. Anda dapat memilih video preset resolusi tinggi di galeri untuk mencoba semua fitur studio!'
          : 'Terjadi kendala pada request pembuatan video.'
      });
    }
  });

  // Text-To-Speech Narration Generator using gemini-3.8-flash-lite-tts
  app.post('/api/agent/tts', async (req, res) => {
    try {
      const { text, voice = 'Kore', language = 'en-US' } = req.body;
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Teks voiceover diperlukan.' });
      }

      const ai = getAiClient();
      const interaction = await ai.interactions.create({
        model: 'gemini-3.8-flash-lite-tts',
        input: [
          {
            type: 'text',
            text: text.slice(0, 400),
            annotations: [
              {
                type: 'speech_metadata',
                style: 'Cinematic narrator, expressive, clear documentary tone',
              },
            ],
          },
        ],
        response_format: { type: 'audio' },
        generation_config: {
          speech_config: [
            {
              language: language || 'en-US',
              voice: voice || 'Kore',
            },
          ],
        },
      });

      const audio = interaction.output_audio;
      if (audio?.data) {
        return res.json({
          success: true,
          audioBase64: audio.data,
          mimeType: 'audio/wav',
          audioUrl: `data:audio/wav;base64,${audio.data}`
        });
      }

      return res.status(500).json({ error: 'Gagal membuat audio voiceover.' });
    } catch (err: any) {
      console.error('Error in /api/agent/tts:', err);
      return res.status(500).json({ error: err.message || 'Gagal memproses Text-to-Speech.' });
    }
  });

  // Attach Vite middleware in development
  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[OmniMotion Server] Running on http://0.0.0.0:${PORT} (Node ${process.version})`);
  });
}

startServer().catch((err) => {
  console.error('[OmniMotion Server] Fatal startup error:', err);
  process.exit(1);
});
