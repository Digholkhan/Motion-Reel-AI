import React, { useState } from 'react';
import { useProject } from '../../store/ProjectContext';
import { api } from '../../services/api';
import {
  Sparkles,
  FileText,
  Clock,
  Send,
  Film,
  CheckCircle2,
  Copy,
  Loader2,
  Flame,
  Cpu,
  Target,
  Globe,
  Tag
} from 'lucide-react';

export const AIScriptGenerator = () => {
  const { currentProject, setCurrentProject, setActiveModule, showToast } = useProject();

  const [language, setLanguage] = useState(currentProject?.language || 'en');
  const [topic, setTopic] = useState(
    currentProject?.topic || (language === 'bn' ? 'কৃত্রিম বুদ্ধিমত্তা ও ভবিষ্যতের প্রযুক্তি' : 'Next-Gen Autonomous AI Agents')
  );
  const [tone, setTone] = useState('energetic');
  const [targetAudience, setTargetAudience] = useState(language === 'bn' ? 'ক্রিয়েটর ও প্রযুক্তিপ্রেমী' : 'Founders, Creators & Tech Enthusiasts');
  const [durationInSeconds, setDurationInSeconds] = useState(currentProject?.durationInSeconds || 30);
  const [scriptData, setScriptData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBuildingStoryboard, setIsBuildingStoryboard] = useState(false);

  // Auto-detect Bengali characters
  const handleTopicChange = (val) => {
    setTopic(val);
    if (/[\u0980-\u09FF]/.test(val) && language !== 'bn') {
      setLanguage('bn');
      showToast('বাংলা ভাষা শনাক্ত করা হয়েছে', 'info');
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (newLang === 'bn') {
      if (!topic || topic.includes('Next-Gen')) {
        setTopic('কৃত্রিম বুদ্ধিমত্তা ও ফ্রিল্যান্সিং ক্যারিয়ারে প্রবৃদ্ধি');
      }
      setTargetAudience('ক্রিয়েটর ও ফ্রিল্যান্সার');
    } else {
      if (!topic || topic.includes('কৃত্রিম')) {
        setTopic('Autonomous Cloud Infrastructure & High-Speed Deployment');
      }
      setTargetAudience('Founders, Creators & Tech Enthusiasts');
    }
  };

  const handleGenerateScript = async () => {
    if (!topic.trim()) {
      showToast(language === 'bn' ? 'অনুগ্রহ করে একটি বিষয় বা প্রম্পট লিখুন' : 'Please provide a topic or prompt', 'warning');
      return;
    }

    try {
      setIsGenerating(true);
      showToast(language === 'bn' ? 'স্ক্রিপ্ট তৈরি হচ্ছে...' : 'Generating AI script...', 'info');
      const data = await api.generateScript({
        topic,
        tone,
        targetAudience,
        durationInSeconds,
        language
      });
      setScriptData(data);
      showToast(language === 'bn' ? 'স্ক্রিপ্ট সফলভাবে প্রস্তুত!' : 'AI Script generated successfully', 'success');
    } catch (err) {
      console.error('Script generation error:', err);
      showToast(`Script generation failed: ${err.message}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyToStoryboard = async () => {
    if (!scriptData || !scriptData.rawScript) {
      showToast('Generate a script first', 'warning');
      return;
    }

    try {
      setIsBuildingStoryboard(true);
      showToast(language === 'bn' ? 'স্টোরিবোর্ড দৃশ্য তৈরি হচ্ছে...' : 'Translating script into Remotion motion scenes...', 'info');

      const storyboard = await api.generateStoryboard({
        script: scriptData.rawScript,
        topic,
        durationInSeconds,
        language
      });

      if (currentProject) {
        const updated = {
          ...currentProject,
          topic,
          language,
          durationInSeconds,
          scenes: storyboard.scenes
        };
        const saved = await api.saveProject(updated);
        setCurrentProject(saved);
      } else {
        const newProj = {
          id: `proj-${Date.now()}`,
          title: scriptData.title || `${topic} Motion Reel`,
          topic,
          language,
          aspectRatio: '16:9',
          fps: 30,
          durationInSeconds,
          theme: {
            preset: 'electric-blue',
            primaryColor: '#3B82F6',
            secondaryColor: '#8B5CF6',
            bgColor: '#070B14',
            fontHeading: 'Space Grotesk',
            fontBody: 'Inter'
          },
          scenes: storyboard.scenes
        };
        const saved = await api.saveProject(newProj);
        setCurrentProject(saved);
      }

      showToast(language === 'bn' ? 'স্টোরিবোর্ড প্রস্তুত! এডিটরে যাওয়া হচ্ছে...' : 'Storyboard generated! Opening Storyboard Editor...', 'success');
      setActiveModule('storyboard');
    } catch (err) {
      console.error('Storyboard build error:', err);
      showToast(`Failed to build storyboard: ${err.message}`, 'error');
    } finally {
      setIsBuildingStoryboard(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-electric-blue" />
            <span>AI Script Generator</span>
          </h1>
          <p className="text-xs text-slate-400">
            {language === 'bn'
              ? 'বাংলা এবং ইংরেজিতে মোশন গ্রাফিক্সের জন্য উপযোগী স্ক্রিপ্ট ও দৃশ্য পরিকল্পনা তৈরি করুন।'
              : 'Transform prompts into high-retention motion scripts structured for scene pacing.'}
          </p>
        </div>

        {/* Language Switcher Pill */}
        <div className="flex items-center bg-studio-900 border border-studio-800 rounded-lg p-1 gap-1 text-xs">
          <div className="flex items-center gap-1.5 px-2 text-slate-400 font-mono">
            <Globe className="w-3.5 h-3.5 text-electric-blue" />
            <span>Language:</span>
          </div>
          <button
            onClick={() => handleLanguageChange('en')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              language === 'en'
                ? 'bg-electric-blue text-white shadow-glow-blue'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => handleLanguageChange('bn')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              language === 'bn'
                ? 'bg-electric-purple text-white shadow-glow-purple'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            বাংলা (Bangla)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Inputs & Configuration */}
        <div className="lg:col-span-5 bg-studio-900 border border-studio-800 rounded-xl p-5 space-y-5">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              {language === 'bn' ? 'ভিডিওর বিষয় বা প্রম্পট' : 'Video Topic or Prompt Brief'}
            </label>
            <textarea
              rows={3}
              value={topic}
              onChange={(e) => handleTopicChange(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'যেমন: কৃত্রিম বুদ্ধিমত্তা কীভাবে ২০২৬ সালে ফ্রিল্যান্সিংয়ে কাজের গতি বাড়িয়ে দেবে...'
                  : 'e.g. Why autonomous motion graphics convert 3x better than static video ads in 2026...'
              }
              className="w-full bg-studio-950 border border-studio-800 focus:border-electric-blue rounded-lg px-3 py-2.5 text-xs text-white outline-none resize-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
              {language === 'bn' ? 'টোন ও গতিধারা' : 'Tone & Pacing'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'energetic', label: language === 'bn' ? 'উদ্যমী ও গতিশীল' : 'Energetic & Hype', icon: Flame },
                { id: 'cyber', label: language === 'bn' ? 'ভবিষ্যৎমুখী টেক' : 'Tech & Futuristic', icon: Cpu },
                { id: 'authoritative', label: language === 'bn' ? 'প্রফেশনাল এক্সিকিউটিভ' : 'Executive SaaS', icon: Target },
                { id: 'dramatic', label: language === 'bn' ? 'সিনেমাটিক ড্রামা' : 'Cinematic Drama', icon: Sparkles }
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = tone === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id)}
                    className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-electric-blue/15 border-electric-blue text-white'
                        : 'bg-studio-950 border-studio-800 text-slate-400 hover:border-studio-700'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-electric-blue' : 'text-slate-500'}`} />
                    <span className="text-xs font-medium">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              {language === 'bn' ? 'টার্গেট অডিয়েন্স' : 'Target Audience'}
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder={language === 'bn' ? 'যেমন: ক্রিয়েটর, ডেভেলপার, উদ্যোক্তা' : 'e.g. Founders, Tech Enthusiasts, Marketers'}
              className="w-full bg-studio-950 border border-studio-800 focus:border-electric-blue rounded-lg px-3 py-2 text-xs text-white outline-none transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                {language === 'bn' ? 'মোট দৈর্ঘ্য' : 'Duration'}
              </label>
              <span className="text-xs font-mono text-electric-cyan font-semibold">
                {durationInSeconds} {language === 'bn' ? 'সেকেন্ড' : 'seconds'}
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={60}
              step={5}
              value={durationInSeconds}
              onChange={(e) => setDurationInSeconds(Number(e.target.value))}
              className="w-full accent-electric-blue bg-studio-950 cursor-pointer"
            />
          </div>

          <button
            onClick={handleGenerateScript}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-electric-blue hover:bg-blue-600 text-white text-xs font-bold shadow-glow-blue transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{language === 'bn' ? 'স্ক্রিপ্ট রচনা হচ্ছে...' : 'Crafting Motion Script...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{language === 'bn' ? 'স্ক্রিপ্ট তৈরি করুন' : 'Generate Script'}</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output: Script Preview & Conversion */}
        <div className="lg:col-span-7 bg-studio-900 border border-studio-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-studio-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-electric-purple" />
                <h3 className="text-sm font-bold text-white">
                  {scriptData?.title || (language === 'bn' ? 'প্রস্তুতকৃত মোশন স্ক্রিপ্ট' : 'Generated Motion Script')}
                </h3>
              </div>
              {scriptData && (
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span>~{scriptData.rawScript?.split(' ').length || 0} {language === 'bn' ? 'শব্দ' : 'words'}</span>
                  <span>•</span>
                  <span>{durationInSeconds}s pace</span>
                </div>
              )}
            </div>

            {scriptData ? (
              <div className="space-y-4">
                {/* Visual Hook Highlight */}
                <div className="p-3.5 rounded-lg bg-studio-950 border border-electric-blue/30 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-electric-blue font-mono">
                    {language === 'bn' ? 'মনোযোগ আকর্ষণকারী হুক' : 'Attention Hook'}
                  </div>
                  <p className="text-xs text-slate-200 font-medium italic">
                    "{scriptData.hook}"
                  </p>
                </div>

                {/* Key Points */}
                {scriptData.keyPoints && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      {language === 'bn' ? 'মূল বক্তব্য ও বিষয়বস্তু' : 'Narrative Beats'}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {scriptData.keyPoints.map((kp, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-studio-950 border border-studio-800 text-[11px] text-slate-300"
                        >
                          <CheckCircle2 className="w-3 h-3 text-electric-emerald flex-shrink-0" />
                          <span className="truncate">{kp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Full Script Text */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    {language === 'bn' ? 'সম্পূর্ণ স্ক্রিপ্ট ও দৃশ্য নির্দেশনা' : 'Full Narrative & Visual Intent'}
                  </div>
                  <textarea
                    rows={8}
                    value={scriptData.rawScript}
                    onChange={(e) =>
                      setScriptData((prev) => ({ ...prev, rawScript: e.target.value }))
                    }
                    className="w-full bg-studio-950 border border-studio-800 rounded-lg p-3 text-xs text-slate-200 font-mono leading-relaxed outline-none focus:border-electric-blue transition-colors resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-studio-800 rounded-xl space-y-2">
                <FileText className="w-8 h-8 text-slate-600" />
                <p className="text-xs font-medium text-slate-400">
                  {language === 'bn'
                    ? 'এখনো কোনো স্ক্রিপ্ট তৈরি হয়নি। বিষয় লিখে "স্ক্রিপ্ট তৈরি করুন" বাটনে ক্লিক করুন।'
                    : 'No script generated yet. Enter a topic and click "Generate Script".'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {language === 'bn'
                    ? 'স্ক্রিপ্ট ইঞ্জিন স্বয়ংক্রিয়ভাবে বাংলা এবং ইংরেজিতে ফ্রেম-একুরেট সময়সীমা হিসাব করে।'
                    : 'The script generator calculates optimal pacing for kinetic typography scenes.'}
                </p>
              </div>
            )}
          </div>

          {/* Bottom Conversion Bar */}
          {scriptData && (
            <div className="pt-3 border-t border-studio-800 flex items-center justify-between">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(scriptData.rawScript);
                  showToast('Script copied to clipboard', 'info');
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-studio-850 hover:bg-studio-800 text-slate-300 text-xs font-medium border border-studio-750 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Script</span>
              </button>

              <button
                onClick={handleApplyToStoryboard}
                disabled={isBuildingStoryboard}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-electric-blue to-electric-purple hover:from-blue-600 hover:to-purple-600 text-white text-xs font-bold shadow-glow-blue transition-all disabled:opacity-50"
              >
                {isBuildingStoryboard ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Storyboard...</span>
                  </>
                ) : (
                  <>
                    <Film className="w-4 h-4" />
                    <span>Build Storyboard from Script</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
