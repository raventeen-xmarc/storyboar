export const CAMERA_MOTIONS = [
  { id: 'push-in', label: 'Cinematic Push-in (Dolly In)', desc: 'Kamera perlahan bergerak mendekati subjek utama untuk efek dramatis' },
  { id: 'drone-orbit', label: 'FPV Drone Aerial Orbit', desc: 'Gerakan drone melingkar tinggi dari udara dengan perspektif luas' },
  { id: 'tracking', label: 'Lateral Tracking Shot', desc: 'Kamera meluncur sejajar mengikuti pergerakan aksi subjek' },
  { id: 'crane-tilt', label: 'Jib Crane Tilt-Up', desc: 'Kamera naik dari bawah mengarah ke atas membuka pemandangan megah' },
  { id: 'macro-slow', label: 'Macro 120fps Slow-Motion', desc: 'Jarak dekat ultra tajam dengan gerakan lambat sangat detail' },
  { id: 'handheld', label: 'Dynamic Handheld Gimbal', desc: 'Gerakan kamera realistis berenergi tinggi layaknya film dokumenter laga' },
  { id: 'dutch-angle', label: 'Dramatic Dutch Angle', desc: 'Sudut kamera miring sinematik memberi rasa tegang dan misteri' },
];

export const STYLE_PRESETS = [
  {
    id: 'hollywood',
    name: 'Hollywood 35mm Film',
    badge: 'Cinematic',
    promptAddon: 'shot on 35mm anamorphic Arri Alexa, masterclass cinematography, shallow depth of field, warm cinematic color grade, subtle film grain, dramatic volumetric lighting',
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon 4K',
    badge: 'Sci-Fi',
    promptAddon: 'cyberpunk neon aesthetic, wet asphalt reflections, volumetric magenta and cyan fog, high-tech holographic overlays, futuristic cinematic lighting, 8k octane render realism',
    color: 'from-fuchsia-500/20 to-cyan-500/20 border-fuchsia-500/30'
  },
  {
    id: 'ghibli',
    name: 'Studio Ghibli Anime',
    badge: 'Anime',
    promptAddon: 'vibrant Studio Ghibli anime style, painted whimsical backgrounds, soft natural sunlight, floating dandelion seeds, peaceful melancholic anime atmosphere, hand-drawn detailing',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30'
  },
  {
    id: 'nature',
    name: 'BBC Earth Wildlife',
    badge: 'Nature',
    promptAddon: 'BBC Earth national geographic documentary style, natural golden hour sunlight, RED Helium 8k camera, crisp wildlife macro detail, ultra-fluid natural motion',
    color: 'from-green-500/20 to-emerald-500/20 border-green-500/30'
  },
  {
    id: 'pixar',
    name: 'Pixar 3D Animation',
    badge: '3D Render',
    promptAddon: 'charming 3D animated film render, Pixar Disney character style, expressive emotive eyes, soft subsurface scattering skin, warm whimsical rim lighting, raytraced shadows',
    color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30'
  },
  {
    id: 'commercial',
    name: 'Luxury Brand Commercial',
    badge: 'Commercial',
    promptAddon: 'high-end luxury commercial advertisement, pristine product lighting, studio softbox illumination, glossy reflective surfaces, minimalist elegant aesthetic, 100fps slow motion',
    color: 'from-purple-500/20 to-violet-500/20 border-purple-500/30'
  },
  {
    id: 'vintage',
    name: 'Vintage 1970s Kodachrome',
    badge: 'Retro',
    promptAddon: '1970s vintage 16mm film footage, nostalgic Kodachrome color science, warm sun flare, organic scratch artifacts, retro cinematic feel',
    color: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30'
  }
];

export const INSPIRATION_IDEAS = [
  {
    title: 'Naga Purba di Atas Candi Borobudur',
    concept: 'Seekor naga bermahkota emas terbang anggun di atas kabut fajar Candi Borobudur dengan cahaya matahari terbit menembus awan tipis.',
    style: 'Hollywood 35mm Film',
    motion: 'FPV Drone Aerial Orbit'
  },
  {
    title: 'Mobil Terbang Meluncur di Jakarta 2099',
    concept: 'Kendaraan aero meluncur di antara gedung pencakar langit futuristik berhologram di Jakarta tahun 2099 saat hujan gerimis neon.',
    style: 'Cyberpunk Neon 4K',
    motion: 'Lateral Tracking Shot'
  },
  {
    title: 'Kucing Astronot Menyentuh Bintang',
    concept: 'Kucing oranye memakai helm astronot mini melayang di dalam kokpit pesawat luar angkasa dengan latar belakang galaksi nebula berkilau.',
    style: 'Pixar 3D Animation',
    motion: 'Cinematic Push-in (Dolly In)'
  },
  {
    title: 'Iklan Kopi Gayo Single Origin',
    concept: 'Tetesan pertama kopi hitam kental dari corong kaca kayu menetes ke cangkir keramik kerajinan tangan dengan kepulan uap hangat di kafe kayu.',
    style: 'Luxury Brand Commercial',
    motion: 'Macro 120fps Slow-Motion'
  },
  {
    title: 'Anak Gadis Berlari di Padang Bunga Sakura',
    concept: 'Seorang gadis mengenakan yukata berlari gembira melintasi jembatan kayu kuno saat kelopak bunga sakura merah muda berguguran ditiup angin.',
    style: 'Studio Ghibli Anime',
    motion: 'Dynamic Handheld Gimbal'
  }
];

export const SAMPLE_IMAGE_FRAMES = [
  {
    id: 'frame-scifi',
    title: 'Cosmic Nebula Astronaut',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    suggestedPrompt: 'The astronaut slowly raises a gloved hand towards a shimmering cosmic anomaly as star dust gently swirls around the visor.'
  },
  {
    id: 'frame-nature',
    title: 'Misty Alpine Lake',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    suggestedPrompt: 'Camera smoothly glides across the glass-like water while morning mist rises slowly off the lake surface.'
  },
  {
    id: 'frame-neon',
    title: 'Rainy Cyber Alley',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&auto=format&fit=crop&q=80',
    suggestedPrompt: 'Raindrops ripple across neon puddle reflections while steam billows gently from sewer grates in slow motion.'
  }
];
