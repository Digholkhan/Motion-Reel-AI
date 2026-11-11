import { BaseAIAdapter } from './aiAdapter.js';

export class LocalHeuristicAdapter extends BaseAIAdapter {
  detectLanguage(text, explicitLang) {
    if (explicitLang === 'bn' || explicitLang === 'en') return explicitLang;
    const hasBengali = /[\u0980-\u09FF]/.test(text || '');
    return hasBengali ? 'bn' : 'en';
  }

  detectDomain(topic) {
    const lower = (topic || '').toLowerCase();
    // Use word-boundary matching to avoid false positives (e.g. "sust-ai-nable" matching "ai")
    const hasWord = (word) => new RegExp(`\\b${word}\\b`, 'i').test(lower);

    if (hasWord('crypto') || hasWord('defi') || hasWord('payment') || hasWord('pay') || hasWord('finance') || hasWord('fintech') || hasWord('money') || hasWord('banking') || lower.includes('টাকা') || lower.includes('বিনিয়োগ') || hasWord('settlement') || hasWord('trading')) {
      return 'fintech';
    }
    if (hasWord('saas') || hasWord('cloud') || hasWord('deploy') || hasWord('devops') || hasWord('infra') || hasWord('kubernetes') || hasWord('docker') || lower.includes('সফটওয়্যার')) {
      return 'saas';
    }
    if (hasWord('ai') || hasWord('artificial intelligence') || hasWord('machine learning') || hasWord('neural') || hasWord('agent') || hasWord('llm') || lower.includes('কৃত্রিম') || lower.includes('রোবট')) {
      return 'ai';
    }
    if (hasWord('freelance') || hasWord('career') || hasWord('growth') || hasWord('marketing') || hasWord('startup') || lower.includes('ফ্রিল্যান্সিং') || lower.includes('ক্যারিয়ার')) {
      return 'growth';
    }
    if (hasWord('motion') || hasWord('video') || hasWord('design') || hasWord('animation') || hasWord('graphics') || lower.includes('অ্যানিমেশন') || lower.includes('গ্রাফিক্স')) {
      return 'creative';
    }
    return 'general';
  }

  async generateScript({ topic, tone = 'energetic', targetAudience, durationInSeconds = 30, language }) {
    const cleanTopic = (topic || 'MotionForge Dynamic Video').trim();
    const lang = this.detectLanguage(cleanTopic, language);
    const domain = this.detectDomain(cleanTopic);

    if (lang === 'bn') {
      const hooks = {
        ai: `আপনি কি জানেন কৃত্রিম বুদ্ধিমত্তা কীভাবে আপনার কাজের গতি ১০ গুণ বাড়িয়ে দিতে পারে?`,
        fintech: `বিশ্বজুড়ে সেকেন্ডের মধ্যে লেনদেন করুন সম্পূর্ণ নিরাপদ ও আধুনিক প্রযুক্তিতে।`,
        growth: `ফ্রিল্যান্সিং ও অনলাইন ক্যারিয়ারে সফল হতে চান? সঠিক কৌশলেই রয়েছে আসল পরিবর্তন।`,
        saas: `ক্লাউড সফটওয়্যারের সাহায্যে নিজের কাজের সময় বাঁচান প্রতিদিন।`,
        creative: `সাধারণ ভিডিও নয়, তৈরি করুন প্রিমিয়াম মোশন গ্রাফিক্স খুব সহজেই।`,
        general: `${cleanTopic}: প্রযুক্তির নতুন দিগন্তে আপনাকে স্বাগতম।`
      };

      const hook = hooks[domain] || hooks.general;
      const scriptText = `[দৃশ্য ১ - হুক ও সূচনা]
${hook}

[দৃশ্য ২ - সমস্যার সমাধান ও মূল প্রযুক্তি]
সনাতন পদ্ধতির ধীরগতি পেছনে ফেলে বেছে নিন ফ্রেম-একুরেট মোশন ডিজাইন এবং রিয়েল-টাইম ডায়নামিক কন্টেন্ট।

[দৃশ্য ৩ - দৃশ্যমান অর্জন ও মেট্রিক্স]
উচ্চ গতির রেন্ডারিং এবং ৮৮% বেশি অডিয়েন্স রিটেনশন নিশ্চিত করুন প্রতিটি প্রজেক্টে।

[দৃশ্য ৪ - আহ্বান (কল টু অ্যাকশন)]
আজই শুরু করুন এবং আপনার বক্তব্য পৌঁছে দিন সবার কাছে।`;

      return {
        title: `${cleanTopic}: মোশন রিল`,
        topic: cleanTopic,
        language: 'bn',
        tone,
        targetAudience: targetAudience || 'ক্রিয়েটর এবং প্রযুক্তিপ্রেমী',
        durationInSeconds,
        hook,
        rawScript: scriptText,
        keyPoints: [
          'শক্তিশালী মনোযোগ আকর্ষণকারী হুক',
          'বাংলা টাইপোগ্রাফি ও গতিশীল ভিজ্যুয়াল',
          'বাস্তবসম্মত ফলাফল ও মেট্রিক্স ডেটা',
          'সুস্পষ্ট কল-টু-অ্যাকশন'
        ]
      };
    }

    // English Generation
    const hooks = {
      ai: `What if your digital workflows moved at the speed of autonomous neural thought?`,
      fintech: `Instant global settlement protocols with mathematical finality and zero friction.`,
      saas: `Stop burning engineering hours on fragile deployment pipelines.`,
      growth: `The unfair competitive advantage that scales creator engagement by 10x.`,
      creative: `Stop relying on static templates. This is programmatic generative motion graphics.`,
      general: `Welcome to the frontier of ${cleanTopic}.`
    };

    const hook = hooks[domain] || hooks.general;
    const scriptText = `[0:00 - Hook & Breakout]
${hook}

[Core Shift & Architecture]
Manual production is slow and fragmented. Autonomous procedural choreographies calculate vector paths at 60 frames per second.

[Empirical Proof & Metrics]
Achieving up to 10x faster production cycles with 99.9% frame-accurate audio alignment.

[Call To Action]
Ignite your motion reels today with MotionForge AI.`;

    return {
      title: `${cleanTopic}: Next-Gen Motion Narrative`,
      topic: cleanTopic,
      language: 'en',
      tone,
      targetAudience: targetAudience || 'Founders, Developers & Creators',
      durationInSeconds,
      hook,
      rawScript: scriptText,
      keyPoints: [
        'High-retention attention hook',
        'Frame-accurate kinetic typography choreography',
        'Empirical performance metric validation',
        'High-converting closing directive'
      ]
    };
  }

  async generateStoryboard({ script, topic = 'Dynamic Motion', durationInSeconds = 30, language, style }) {
    const cleanTopic = (topic || 'MotionForge AI').trim();
    const lang = this.detectLanguage(cleanTopic + ' ' + (script || ''), language);
    const domain = this.detectDomain(cleanTopic);

    // Calculate dynamic scene count based on duration and topic complexity
    // e.g. 15s -> 3 scenes; 20-25s -> 4 scenes; 30s -> 5 scenes; 40-45s -> 6 scenes; 50-60s -> 7-8 scenes
    let sceneCount;
    if (durationInSeconds <= 18) {
      sceneCount = 3;
    } else if (durationInSeconds <= 28) {
      sceneCount = 4;
    } else if (durationInSeconds <= 38) {
      sceneCount = 5;
    } else if (durationInSeconds <= 48) {
      sceneCount = 6;
    } else {
      sceneCount = Math.min(8, Math.max(6, Math.floor(durationInSeconds / 7)));
    }

    // Generate varying durations for each scene that add up exactly to durationInSeconds
    const sceneDurations = this.calculateDynamicSceneDurations(durationInSeconds, sceneCount);

    // Dynamically select archetypes based on domain
    const archetypeSequences = {
      fintech: ['KINETIC_TITLE', 'TECH_HUD', 'METRIC_COUNTER', 'ISOMETRIC_BADGE', 'FEATURE_CARDS', 'CALL_TO_ACTION'],
      saas: ['KINETIC_TITLE', 'FEATURE_CARDS', 'TECH_HUD', 'METRIC_COUNTER', 'ISOMETRIC_BADGE', 'CALL_TO_ACTION'],
      ai: ['KINETIC_TITLE', 'TECH_HUD', 'METRIC_COUNTER', 'FEATURE_CARDS', 'CALL_TO_ACTION', 'ISOMETRIC_BADGE'],
      growth: ['KINETIC_TITLE', 'METRIC_COUNTER', 'FEATURE_CARDS', 'ISOMETRIC_BADGE', 'CALL_TO_ACTION'],
      creative: ['KINETIC_TITLE', 'ISOMETRIC_BADGE', 'TECH_HUD', 'FEATURE_CARDS', 'CALL_TO_ACTION'],
      general: ['KINETIC_TITLE', 'TECH_HUD', 'METRIC_COUNTER', 'FEATURE_CARDS', 'CALL_TO_ACTION']
    };

    const domainSeq = archetypeSequences[domain] || archetypeSequences.general;
    const selectedArchetypes = [];
    for (let i = 0; i < sceneCount; i++) {
      if (i === sceneCount - 1) {
        selectedArchetypes.push('CALL_TO_ACTION');
      } else {
        selectedArchetypes.push(domainSeq[i % domainSeq.length]);
      }
    }

    // Build scenes
    let accumulatedStartTime = 0;
    const scenes = [];

    for (let i = 0; i < sceneCount; i++) {
      const archetype = selectedArchetypes[i];
      const duration = sceneDurations[i];
      const startTime = Math.round(accumulatedStartTime * 10) / 10;
      accumulatedStartTime += duration;

      const sceneContent = this.generateSceneContent({
        index: i,
        totalScenes: sceneCount,
        archetype,
        topic: cleanTopic,
        domain,
        lang,
        duration
      });

      scenes.push({
        id: `scene-${Date.now()}-${i + 1}-${Math.floor(Math.random() * 1000)}`,
        order: i,
        startTime,
        durationInSeconds: duration,
        archetype,
        
        // Voiceover
        voiceoverText: sceneContent.voiceoverText,
        voiceoverScript: sceneContent.voiceoverText,
        
        // On Screen Typography
        onScreenText: {
          heading: sceneContent.heading,
          subheading: sceneContent.subheading,
          badge: sceneContent.badge
        },
        heading: sceneContent.heading,
        subheading: sceneContent.subheading,
        badge: sceneContent.badge,
        caption: `Scene ${i + 1} • ${archetype.replace('_', ' ')}`,
        emphasizedKeywords: sceneContent.emphasizedKeywords,

        // Art Direction
        visualDescription: sceneContent.visualDescription,
        animationInstructions: sceneContent.animationInstructions,
        transitionType: sceneContent.transitionType,
        backgroundStyle: sceneContent.backgroundStyle,
        soundEffectSuggestions: sceneContent.soundEffectSuggestions,

        // Data arrays
        metrics: sceneContent.metrics,
        features: sceneContent.features,

        // Styling & Remotion params
        layout: sceneContent.layout,
        motionPreset: sceneContent.motionPreset,
        colorPalette: sceneContent.colorPalette,
        transition: {
          type: sceneContent.transitionType,
          durationInFrames: 15
        },
        visualElements: sceneContent.visualElements
      });
    }

    return {
      topic: cleanTopic,
      language: lang,
      totalDurationInSeconds: durationInSeconds,
      sceneCount: scenes.length,
      scenes
    };
  }

  calculateDynamicSceneDurations(totalSeconds, count) {
    // Distribute time naturally: introductory hooks & CTA are punchier (~3-5s), middle core scenes get more airtime (~5-7s)
    let remaining = totalSeconds;
    const durations = [];
    
    // Average base
    const base = Math.floor(totalSeconds / count);
    for (let i = 0; i < count; i++) {
      durations.push(base);
    }
    
    let remainder = totalSeconds - (base * count);
    // Give extra seconds to middle scenes first
    let midIdx = Math.floor(count / 2);
    while (remainder > 0) {
      durations[midIdx % count] += 1;
      midIdx++;
      remainder--;
    }

    return durations;
  }

  generateSceneContent({ index, totalScenes, archetype, topic, domain, lang, duration }) {
    const isFirst = index === 0;
    const isLast = index === totalScenes - 1;

    // Transitions
    const transitions = ['zoom', 'wipe', 'slide', 'fade', 'glitch'];
    const transitionType = isLast ? 'fade' : transitions[index % transitions.length];

    // Background styles
    const bgStyles = ['matrix-grid', 'cyber-haze', 'gradient-drift', 'particle-field', 'hud-grid', 'deep-navy'];
    const backgroundStyle = bgStyles[index % bgStyles.length];

    // Sound effects
    const sfxMap = {
      KINETIC_TITLE: ['cyber-whoosh', 'impact-sub', 'riser-spark'],
      TECH_HUD: ['digital-beeps', 'scanner-hum', 'tech-chirp'],
      METRIC_COUNTER: ['counter-tick', 'bass-impact', 'chime-ping'],
      FEATURE_CARDS: ['card-whoosh', 'switch-click', 'light-glance'],
      ISOMETRIC_BADGE: ['energy-pulse', 'hologram-shimmer', 'heavy-thud'],
      CALL_TO_ACTION: ['climax-riser', 'bright-spark', 'confirm-chime']
    };
    const soundEffectSuggestions = sfxMap[archetype] || ['whoosh', 'impact'];

    // BENGALI CONTENT
    if (lang === 'bn') {
      if (isFirst || archetype === 'KINETIC_TITLE') {
        return {
          heading: topic.toUpperCase(),
          subheading: 'ভবিষ্যতের নতুন প্রযুক্তি ও সম্ভাবনা',
          badge: '⚡ শীর্ষ প্রযুক্তি',
          voiceoverText: `স্বাগতম। আজ আমরা জানবো ${topic} সম্পর্কে যা বদলে দিচ্ছে আমাদের কর্মপদ্ধতি।`,
          emphasizedKeywords: [topic, 'প্রযুক্তি', 'ভবিষ্যৎ'],
          visualDescription: 'গাঢ় নীল ব্যাকগ্রাউন্ডে নিয়ন আলোর ছটা এবং গতিশীল বাংলা টাইপোগ্রাফির প্রবেশ।',
          animationInstructions: 'অক্ষরগুলো স্প্রিং ফিজিক্সের সাহায্যে কেন্দ্রবিন্দু থেকে বড় হয়ে সামনে আসবে।',
          transitionType,
          backgroundStyle,
          soundEffectSuggestions,
          metrics: [],
          features: [],
          layout: 'center',
          motionPreset: 'energetic',
          colorPalette: { bg: '#060B18', accent: '#3B82F6', textPrimary: '#FFFFFF', textSecondary: '#94A3B8', glow: 'rgba(59, 130, 246, 0.5)' },
          visualElements: { showGrid: true, showParticles: true, showOrb: true, shapeType: 'circles' }
        };
      }

      if (archetype === 'TECH_HUD') {
        return {
          heading: 'সঠিক বিশ্লেষণ ও প্রযুক্তি',
          subheading: 'আধুনিক ফ্রেমওয়ার্ক ও নির্ভুল সমন্বয়',
          badge: 'সিস্টেম স্ট্যাটাস // একটিভ',
          voiceoverText: 'প্রতিটি ধাপ নিয়ন্ত্রিত হয় উচ্চতর গাণিতিক নির্ভুলতা এবং রিয়েল-টাইম আর্কিটেকচারে।',
          emphasizedKeywords: ['বিশ্লেষণ', 'আধুনিক', 'সমন্বয়'],
          visualDescription: 'সাইবারনেটিক রেটিকল, স্ক্যানিং লেজার ও কোঅর্ডিনেট ডাটা বক্স সংবলিত ভবিষ্যৎমুখী ইন্টারফেস।',
          animationInstructions: 'চারপাশের ব্র্যাকেটগুলো লক-ইন হবে এবং একটি অনুভূমিক স্ক্যানার লাইন নিচে নেমে যাবে।',
          transitionType,
          backgroundStyle: 'hud-grid',
          soundEffectSuggestions,
          metrics: [],
          features: [],
          layout: 'hud-frame',
          motionPreset: 'cyber',
          colorPalette: { bg: '#080D1A', accent: '#06B6D4', textPrimary: '#FFFFFF', textSecondary: '#67E8F9', glow: 'rgba(6, 182, 212, 0.4)' },
          visualElements: { showGrid: true, showParticles: true, showOrb: true, shapeType: 'hexagons' }
        };
      }

      if (archetype === 'METRIC_COUNTER') {
        return {
          heading: 'বাস্তব সাফল্য ও ফলাফল',
          subheading: 'পরিমাপযোগ্য উন্নতি এবং উচ্চমান প্রবৃদ্ধি',
          badge: 'যাচাইকৃত মেট্রিক্স',
          voiceoverText: '১০ গুণ বেশি উৎপাদনশীলতা এবং ৯৮% গ্রাহক সন্তুষ্টি অর্জন সম্ভব সঠিক ব্যবহারে।',
          emphasizedKeywords: ['১০ গুণ', 'সাফল্য', '৯৮%'],
          visualDescription: 'অ্যানিমেটেড রেডিয়াল গজ ও কাউন্টিং সংখ্যা সমন্বিত উজ্জ্বল মেট্রিক কার্ড।',
          animationInstructions: 'কাউন্টারগুলো ০ থেকে লক্ষ্যমাত্রায় দ্রুত সংখ্যা গণনা শুরু করবে।',
          transitionType,
          backgroundStyle: 'gradient-drift',
          soundEffectSuggestions,
          metrics: [
            { label: 'গতির বৃদ্ধি', value: '১০x', targetNumber: 10, suffix: 'x', prefix: '' },
            { label: 'সফলতার হার', value: '৯৮%', targetNumber: 98, suffix: '%', prefix: '' },
            { label: 'নির্ভুলতা', value: '১০০%', targetNumber: 100, suffix: '%', prefix: '' }
          ],
          features: [],
          layout: 'split-left',
          motionPreset: 'dramatic',
          colorPalette: { bg: '#0B0918', accent: '#8B5CF6', textPrimary: '#FFFFFF', textSecondary: '#C4B5FD', glow: 'rgba(139, 92, 246, 0.45)' },
          visualElements: { showGrid: true, showParticles: true, showOrb: true, shapeType: 'circles' }
        };
      }

      if (archetype === 'FEATURE_CARDS') {
        return {
          heading: 'প্রধান সুবিধাসমূহ',
          subheading: 'সবকিছু আপনার হাতের মুঠোয় সহজে ব্যবহারযোগ্য',
          badge: 'ফিচার হাইলাইটস',
          voiceoverText: 'সহজ ইন্টারফেস, ক্লাউড সিঙ্ক এবং মাল্টি-প্ল্যাটফর্ম সুবিধা পাবেন একসাথে।',
          emphasizedKeywords: ['সুবিধা', 'সহজ ইন্টারফেস', 'ক্লাউড'],
          visualDescription: 'তিনটি গ্লাস-মরফিজম কার্ড পর্যায়ক্রমে স্ক্রিনে প্রবেশ করছে।',
          animationInstructions: 'প্রতিটি কার্ড বাম থেকে ডানে স্ট্যাগার্ড ড্রপ অ্যানিমেশনের মাধ্যমে ফুটবে।',
          transitionType,
          backgroundStyle: 'particle-field',
          soundEffectSuggestions,
          metrics: [],
          features: [
            { title: 'দ্রুত আউটপুট', description: 'কয়েক সেকেন্ডে ভিডিও প্রস্তুত', icon: 'zap' },
            { title: 'যেকোনো স্ক্রিন', description: 'ইউটিউব, রিলস ও পোস্ট রেডি', icon: 'monitor' },
            { title: 'সাউন্ড সিঙ্ক', description: 'শব্দ ও কথার নিখুঁত মিল', icon: 'volume-2' }
          ],
          layout: 'center',
          motionPreset: 'smooth',
          colorPalette: { bg: '#070B14', accent: '#3B82F6', textPrimary: '#FFFFFF', textSecondary: '#94A3B8', glow: 'rgba(59, 130, 246, 0.4)' },
          visualElements: { showGrid: true, showParticles: true, showOrb: true, shapeType: 'lines' }
        };
      }

      if (archetype === 'ISOMETRIC_BADGE') {
        return {
          heading: 'নিরাপদ ও নির্ভরযোগ্য',
          subheading: 'আধুনিক শিল্পমানের এনক্রিপশন ও ব্যাকআপ',
          badge: 'সার্টিফাইড কোয়ালিটি',
          voiceoverText: 'শিল্পমানের নিরাপত্তা এবং নির্ভরযোগ্যতার নিশ্চয়তা প্রদান করে আমাদের এই সমাধান।',
          emphasizedKeywords: ['নিরাপত্তা', 'নির্ভরযোগ্য', 'কোয়ালিটি'],
          visualDescription: 'ত্রিমাত্রিক কোণে ভাসমান সোনালী ও নীল আইসোমেট্রিক ব্যাজ কার্ড।',
          animationInstructions: 'ব্যাজটি হালকা দুলুনি দিয়ে ভেসে থাকবে এবং কক্ষপথের আংটি ঘুরবে।',
          transitionType,
          backgroundStyle: 'deep-navy',
          soundEffectSuggestions,
          metrics: [],
          features: [],
          layout: 'split-right',
          motionPreset: 'energetic',
          colorPalette: { bg: '#0A0815', accent: '#8B5CF6', textPrimary: '#FFFFFF', textSecondary: '#CBD5E1', glow: 'rgba(139, 92, 246, 0.5)' },
          visualElements: { showGrid: true, showParticles: true, showOrb: true, shapeType: 'hexagons' }
        };
      }

      // CALL TO ACTION
      return {
        heading: 'আজই শুরু করুন',
        subheading: 'আপনার স্বপ্ন বাস্তবে রূপ দিন এখনই',
        badge: '🚀 সময় এসেছে',
        voiceoverText: 'দেরি না করে আজই যোগ দিন এবং প্রযুক্তির নতুন সম্ভাবনার সুবিধা নিন।',
        emphasizedKeywords: ['শুরু', 'বাস্তব', 'যোগ দিন'],
        visualDescription: 'পালসিং অ্যাকশন বাটন এবং চারদিকে ছড়িয়ে পড়া আলোক কণা।',
        animationInstructions: 'বাটনটি উজ্জ্বল স্পন্দন দেবে এবং অ্যারো আইকন ডানদিকে অগ্রসর হবে।',
        transitionType,
        backgroundStyle: 'matrix-grid',
        soundEffectSuggestions,
        metrics: [],
        features: [],
        layout: 'center',
        motionPreset: 'energetic',
        colorPalette: { bg: '#060911', accent: '#3B82F6', textPrimary: '#FFFFFF', textSecondary: '#A78BFA', glow: 'rgba(59, 130, 246, 0.6)' },
        visualElements: { showGrid: true, showParticles: true, showOrb: true, shapeType: 'circles' }
      };
    }

    // ENGLISH CONTENT (Tailored dynamically by domain)
    if (isFirst || archetype === 'KINETIC_TITLE') {
      const titles = {
        fintech: ['GLOBAL SETTLEMENT', 'DECENTRALIZED CORE', 'FINANCIAL FINALITY'],
        saas: ['INFRASTRUCTURE AT SCALE', 'CLOUD VELOCITY', 'DEPLOY IN SECONDS'],
        ai: ['AUTONOMOUS INTELLIGENCE', 'NEURAL ORCHESTRATION', 'GENERATIVE FRONTIER'],
        growth: ['EXPONENTIAL VELOCITY', '10X RETENTION FORMULA', 'SCALE UNSTOPPABLE'],
        creative: ['PROGRAMMATIC MOTION', 'FRAME-ACCURATE VECTOR', 'GENERATIVE PRODUCTION']
      };
      const titleOptions = titles[domain] || ['NEXT-GEN REVOLUTION', 'THE FUTURE IS HERE'];
      const heading = titleOptions[index % titleOptions.length];

      return {
        heading: `${topic.toUpperCase()}: ${heading}`,
        subheading: 'TRANSFORMING COMPLEX NARRATIVES INTO KINETIC REALITY',
        badge: '⚡ GENERATIVE MOTION ENGINE',
        voiceoverText: `Welcome to ${topic}. The next generation of autonomous high-velocity production.`,
        emphasizedKeywords: [topic.split(' ')[0], 'AUTONOMOUS', 'VELOCITY'],
        visualDescription: 'Deep navy background with perspective vector grid, floating particle field, and kinetic typography.',
        animationInstructions: 'Each word enters with a staggered spring-physics drop and letter-spacing tracking expansion.',
        transitionType,
        backgroundStyle,
        soundEffectSuggestions,
        metrics: [],
        features: [],
        layout: 'center',
        motionPreset: 'energetic',
        colorPalette: { bg: '#070B14', accent: '#3B82F6', textPrimary: '#FFFFFF', textSecondary: '#94A3B8', glow: 'rgba(59, 130, 246, 0.5)' },
        visualElements: { showGrid: true, showParticles: true, showOrb: true, shapeType: 'circles' }
      };
    }

    if (archetype === 'TECH_HUD') {
      const hudHeadings = {
        fintech: 'SETTLEMENT PROTOCOL ENGINE',
        saas: 'CLOUD INFRASTRUCTURE MESH',
        ai: 'NEURAL PROCESSING MATRIX',
        growth: 'AUDIENCE ANALYTICS CORE',
        creative: 'RENDER PIPELINE TELEMETRY',
        general: `${topic.toUpperCase()} ARCHITECTURE`
      };
      const hudSubs = {
        fintech: 'Multi-corridor transaction routing with cryptographic finality',
        saas: 'Zero-downtime orchestration across containerized node clusters',
        ai: 'Sub-millisecond inference with distributed tensor processing',
        growth: 'Real-time engagement tracking and conversion funnel optimization',
        creative: 'Frame-accurate vector choreography with audio-locked timing',
        general: `High-precision engineering powering ${topic} at production scale`
      };

      return {
        heading: hudHeadings[domain] || hudHeadings.general,
        subheading: hudSubs[domain] || hudSubs.general,
        badge: 'ACTIVE TELEMETRY // 60 FPS',
        voiceoverText: `Engineered with mathematical precision for ${topic}. Dynamic vector curves and real-time telemetry.`,
        emphasizedKeywords: [topic.split(' ')[0].toUpperCase(), 'ARCHITECTURE', '60 FPS'],
        visualDescription: 'Cybernetic HUD corners, horizontal sweeping laser scanner, telemetry readouts, and rotating dials.',
        animationInstructions: 'Corner brackets snap into coordinates while equalizer bars fluctuate with audio frequency.',
        transitionType,
        backgroundStyle: 'hud-grid',
        soundEffectSuggestions,
        metrics: [],
        features: [],
        layout: 'hud-frame',
        motionPreset: 'cyber',
        colorPalette: { bg: '#080D1A', accent: '#06B6D4', textPrimary: '#FFFFFF', textSecondary: '#67E8F9', glow: 'rgba(6, 182, 212, 0.4)' },
        visualElements: { showGrid: true, showParticles: true, showOrb: true, shapeType: 'hexagons' }
      };
    }

    if (archetype === 'METRIC_COUNTER') {
      const metricConfigs = {
        fintech: [
          { label: 'LATENCY', value: '1.2ms', targetNumber: 1.2, suffix: 'ms', prefix: '' },
          { label: 'COST REDUCTION', value: '94%', targetNumber: 94, suffix: '%', prefix: '' },
          { label: 'SETTLEMENT', value: '100%', targetNumber: 100, suffix: '%', prefix: '' }
        ],
        saas: [
          { label: 'DEPLOY SPEED', value: '10x', targetNumber: 10, suffix: 'x', prefix: '' },
          { label: 'UPTIME SLA', value: '99.9%', targetNumber: 99.9, suffix: '%', prefix: '' },
          { label: 'INFRA SAVINGS', value: '62%', targetNumber: 62, suffix: '%', prefix: '' }
        ],
        ai: [
          { label: 'INFERENCE', value: '12x', targetNumber: 12, suffix: 'x', prefix: '' },
          { label: 'ACCURACY', value: '99.4%', targetNumber: 99.4, suffix: '%', prefix: '' },
          { label: 'TIME SAVED', value: '85%', targetNumber: 85, suffix: '%', prefix: '' }
        ],
        growth: [
          { label: 'ENGAGEMENT', value: '8.2x', targetNumber: 8.2, suffix: 'x', prefix: '' },
          { label: 'RETENTION', value: '92%', targetNumber: 92, suffix: '%', prefix: '' },
          { label: 'ROI UPLIFT', value: '340%', targetNumber: 340, suffix: '%', prefix: '' }
        ],
        creative: [
          { label: 'RENDER FPS', value: '60', targetNumber: 60, suffix: 'fps', prefix: '' },
          { label: 'EFFICIENCY', value: '15x', targetNumber: 15, suffix: 'x', prefix: '' },
          { label: 'FIDELITY', value: '100%', targetNumber: 100, suffix: '%', prefix: '' }
        ]
      };

      const metrics = metricConfigs[domain] || [
        { label: 'THROUGHPUT', value: '10x', targetNumber: 10, suffix: 'x', prefix: '' },
        { label: 'RETENTION', value: '88%', targetNumber: 88, suffix: '%', prefix: '+' },
        { label: 'PRECISION', value: '100%', targetNumber: 100, suffix: '%', prefix: '' }
      ];

      const metricHeadings = {
        fintech: 'TRANSACTION PERFORMANCE',
        saas: 'INFRASTRUCTURE METRICS',
        ai: 'INTELLIGENCE BENCHMARKS',
        growth: 'ENGAGEMENT ACCELERATION',
        creative: 'PRODUCTION THROUGHPUT',
        general: `${topic.toUpperCase()} METRICS`
      };

      return {
        heading: metricHeadings[domain] || metricHeadings.general,
        subheading: `Proven measurable performance delivered for ${topic}`,
        badge: 'VERIFIED METRICS',
        voiceoverText: `Delivering ${metrics[0].value} ${metrics[0].label.toLowerCase()} gains for ${topic}.`,
        emphasizedKeywords: [topic.split(' ')[0].toUpperCase(), 'PERFORMANCE', metrics[0].value],
        visualDescription: 'Three glowing metric glass cards featuring animated radial SVG progress rings and counting numbers.',
        animationInstructions: 'Circular gauges draw clockwise from 0 to target value as numbers increment smoothly.',
        transitionType,
        backgroundStyle: 'gradient-drift',
        soundEffectSuggestions,
        metrics,
        features: [],
        layout: 'split-left',
        motionPreset: 'dramatic',
        colorPalette: { bg: '#0A0E1D', accent: '#8B5CF6', textPrimary: '#FFFFFF', textSecondary: '#CBD5E1', glow: 'rgba(139, 92, 246, 0.45)' },
        visualElements: { showGrid: true, showParticles: true, showOrb: true, shapeType: 'circles' }
      };
    }

    if (archetype === 'FEATURE_CARDS') {
      const featConfigs = {
        fintech: [
          { title: 'Global Liquidity', description: 'Zero border constraints across 140+ corridors', icon: 'zap' },
          { title: 'Multi-Asset Vaults', description: 'Cryptographic security with real-time auditing', icon: 'shield' },
          { title: 'Automated Routing', description: 'Algorithmic lowest-cost path execution', icon: 'cpu' }
        ],
        saas: [
          { title: 'Zero Downtime', description: 'Blue-green rollouts executed instantaneously', icon: 'cloud' },
          { title: 'Universal SDKs', description: 'Native bindings for React, Node, and Python', icon: 'code' },
          { title: 'Observability', description: 'Continuous tracing with sub-second alert loops', icon: 'monitor' }
        ],
        ai: [
          { title: 'Auto Inference', description: 'Run models at edge with zero latency overhead', icon: 'cpu' },
          { title: 'Data Pipeline', description: 'Stream-process billions of tokens in real-time', icon: 'database' },
          { title: 'Model Registry', description: 'Version, deploy, and A/B test any architecture', icon: 'layers' }
        ],
        growth: [
          { title: 'Viral Loops', description: 'Automated referral and engagement mechanics', icon: 'share-2' },
          { title: 'A/B Optimization', description: 'Statistical significance in minutes, not weeks', icon: 'bar-chart-2' },
          { title: 'Cohort Analytics', description: 'Deep behavioral segmentation at user level', icon: 'users' }
        ],
        creative: [
          { title: 'Kinetic Typography', description: 'Per-word spring physics with tracking spread', icon: 'type' },
          { title: 'Audio Cadence', description: 'Visual beats locked to voiceover waveforms', icon: 'volume-2' },
          { title: 'Multi-Ratio Ready', description: 'Instant formatting for 16:9, 9:16 and 1:1', icon: 'monitor' }
        ]
      };

      const features = featConfigs[domain] || [
        { title: `${topic.split(' ')[0]} Engine`, description: `Core processing module for ${topic}`, icon: 'zap' },
        { title: 'Smart Automation', description: 'Autonomous workflow orchestration', icon: 'cpu' },
        { title: 'Universal Export', description: 'Multi-format output with zero quality loss', icon: 'download' }
      ];

      const featureHeadings = {
        fintech: 'FINANCIAL INFRASTRUCTURE',
        saas: 'PLATFORM CAPABILITIES',
        ai: 'INTELLIGENT MODULES',
        growth: 'GROWTH MECHANICS',
        creative: 'CREATIVE TOOLCHAIN',
        general: `${topic.toUpperCase()} FEATURES`
      };

      return {
        heading: featureHeadings[domain] || featureHeadings.general,
        subheading: `Engineered components powering ${topic} at scale`,
        badge: 'ENGINE SPECIFICATION',
        voiceoverText: `Experience modular architecture built specifically for ${topic} with zero compromise.`,
        emphasizedKeywords: [topic.split(' ')[0].toUpperCase(), 'MODULAR', 'ZERO COMPROMISE'],
        visualDescription: 'Staggered card trio suspended in 3D depth with top accent lighting borders.',
        animationInstructions: 'Cards cascade sequentially into view with subtle vertical elastic easing.',
        transitionType,
        backgroundStyle: 'particle-field',
        soundEffectSuggestions,
        metrics: [],
        features,
        layout: 'center',
        motionPreset: 'smooth',
        colorPalette: { bg: '#070B14', accent: '#3B82F6', textPrimary: '#FFFFFF', textSecondary: '#94A3B8', glow: 'rgba(59, 130, 246, 0.4)' },
        visualElements: { showGrid: true, showParticles: true, showOrb: true, shapeType: 'lines' }
      };
    }

    if (archetype === 'ISOMETRIC_BADGE') {
      const badgeHeadings = {
        fintech: 'BANK-GRADE CERTIFIED',
        saas: 'SOC2 ENTERPRISE GRADE',
        ai: 'NEURAL CERTIFIED CORE',
        growth: 'VERIFIED SCALE ENGINE',
        creative: 'PRODUCTION CERTIFIED',
        general: `${topic.toUpperCase()} CERTIFIED`
      };

      return {
        heading: badgeHeadings[domain] || badgeHeadings.general,
        subheading: `Battle-tested reliability trusted by teams building ${topic}`,
        badge: 'GOLD STANDARD',
        voiceoverText: `Built on industrial-grade foundations for ${topic}, certified for mission-critical deployments.`,
        emphasizedKeywords: [topic.split(' ')[0].toUpperCase(), 'CERTIFIED', 'GOLD STANDARD'],
        visualDescription: '3D angled floating shield card suspended in isometric space with rotating planetary orbit rings.',
        animationInstructions: 'Card floats gently along the Y-axis while the outer cyber ring rotates at 0.5 degrees per frame.',
        transitionType,
        backgroundStyle: 'deep-navy',
        soundEffectSuggestions,
        metrics: [],
        features: [],
        layout: 'split-right',
        motionPreset: 'energetic',
        colorPalette: { bg: '#090D1C', accent: '#8B5CF6', textPrimary: '#FFFFFF', textSecondary: '#94A3B8', glow: 'rgba(139, 92, 246, 0.5)' },
        visualElements: { showGrid: true, showParticles: true, showOrb: true, shapeType: 'hexagons' }
      };
    }

    // CALL TO ACTION
    const ctaHeadings = {
      fintech: 'START TRADING TODAY',
      saas: 'DEPLOY YOUR STACK NOW',
      ai: 'ACTIVATE INTELLIGENCE',
      growth: 'IGNITE YOUR GROWTH',
      creative: 'CREATE YOUR REEL NOW',
      general: `EXPERIENCE ${topic.split(' ')[0].toUpperCase()} NOW`
    };

    return {
      heading: ctaHeadings[domain] || ctaHeadings.general,
      subheading: `${topic} • Unlock the next frontier`,
      badge: 'PROMPT TO ACTION',
      voiceoverText: `Take the leap today. Step into the future of ${topic}.`,
      emphasizedKeywords: [topic.split(' ')[0].toUpperCase(), 'NOW', 'FUTURE'],
      visualDescription: 'High-contrast glowing CTA container button, expanding circular energy pulses, and urgency particles.',
      animationInstructions: 'Button pulses rhythmically with a scale oscillation while arrow icon beckons to the right.',
      transitionType,
      backgroundStyle: 'matrix-grid',
      soundEffectSuggestions,
      metrics: [],
      features: [],
      layout: 'center',
      motionPreset: 'energetic',
      colorPalette: { bg: '#0B0F19', accent: '#3B82F6', textPrimary: '#FFFFFF', textSecondary: '#A78BFA', glow: 'rgba(59, 130, 246, 0.6)' },
      visualElements: { showGrid: true, showParticles: true, showOrb: true, shapeType: 'circles' }
    };
  }

  async regenerateScene({ currentScene, instruction = '' }) {
    const isBengali = /[\u0980-\u09FF]/.test((currentScene.heading || '') + ' ' + (currentScene.voiceoverText || '') + ' ' + instruction);
    const lang = isBengali ? 'bn' : 'en';

    const archetypes = ['KINETIC_TITLE', 'TECH_HUD', 'METRIC_COUNTER', 'FEATURE_CARDS', 'ISOMETRIC_BADGE', 'CALL_TO_ACTION'];
    const currentIdx = archetypes.indexOf(currentScene.archetype);
    const nextArchetype = archetypes[(currentIdx + 1) % archetypes.length];

    const generated = this.generateSceneContent({
      index: currentScene.order || 0,
      totalScenes: 5,
      archetype: nextArchetype,
      topic: currentScene.heading || 'Motion Scene',
      domain: 'general',
      lang,
      duration: currentScene.durationInSeconds || 5
    });

    const updated = {
      ...currentScene,
      archetype: nextArchetype,
      heading: instruction && !isBengali ? `${currentScene.heading} (REFINED)` : generated.heading,
      subheading: instruction ? (isBengali ? `পুনর্বিন্যাস: ${instruction}` : `Refined: ${instruction}`) : generated.subheading,
      badge: isBengali ? '⚡ হালনাগাদ দৃশ্য' : 'REFINED CHOREOGRAPHY // V2',
      voiceoverText: generated.voiceoverText,
      voiceoverScript: generated.voiceoverText,
      onScreenText: {
        heading: generated.heading,
        subheading: generated.subheading,
        badge: isBengali ? '⚡ হালনাগাদ দৃশ্য' : 'REFINED CHOREOGRAPHY // V2'
      },
      emphasizedKeywords: generated.emphasizedKeywords,
      visualDescription: generated.visualDescription,
      animationInstructions: generated.animationInstructions,
      transitionType: generated.transitionType,
      backgroundStyle: generated.backgroundStyle,
      soundEffectSuggestions: generated.soundEffectSuggestions,
      metrics: generated.metrics,
      features: generated.features,
      colorPalette: generated.colorPalette,
      visualElements: generated.visualElements
    };

    return updated;
  }
}
