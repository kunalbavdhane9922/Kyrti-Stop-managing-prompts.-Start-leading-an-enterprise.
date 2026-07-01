import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Mic, MicOff, Video, VideoOff, Monitor, Phone, MessageSquare,
  X, Send, Users, Clock, ChevronRight
} from 'lucide-react';
import { getProfessionalById } from '../data/marketplaceData.js';

/**
 * Sovereign Protocol — Interview Room
 * Google Meet-style voice interview with AI Digital Professionals.
 * Uses browser SpeechSynthesis for AI voice responses.
 */
export function InterviewRoomPage() {
  const { professionalId } = useParams();
  const navigate = useNavigate();
  const agent = getProfessionalById(professionalId);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [showTranscript, setShowTranscript] = useState(true);
  const [transcript, setTranscript] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [meetingTime, setMeetingTime] = useState(0);
  const [speakingId, setSpeakingId] = useState(null);
  const [isAIReady, setIsAIReady] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const transcriptEndRef = useRef(null);
  const voicesRef = useRef([]);

  // Pre-load speech synthesis voices (they load asynchronously in most browsers)
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);
  const timerRef = useRef(null);

  // Start webcam
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.log('Camera not available');
      }
    }
    if (isCameraOn) {
      startCamera();
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [isCameraOn]);

  // Meeting timer
  useEffect(() => {
    if (!hasJoined) return;
    timerRef.current = setInterval(() => {
      setMeetingTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [hasJoined]);

  // AI introduction on mount
  useEffect(() => {
    if (!hasJoined || !agent) return;
    const timer = setTimeout(() => {
      const intro = agent.interviewScript.find(s => s.trigger === 'introduction');
      if (intro) {
        addAIMessage(intro.response);
      }
      setIsAIReady(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [agent, hasJoined]);

  // Scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const speakText = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window._lastUtterance = utterance; // Prevent garbage collection bug in Chrome

      // Use pre-loaded voices from voicesRef
      const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Try to find an English voice
        const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ||
                            voices.find(v => v.lang.startsWith('en')) || voices[0];
        utterance.voice = englishVoice;
      }
      // Slight pitch/rate variations based on profession domain
      const domainVoiceMap = {
        executive: { pitch: 0.9, rate: 0.95 },
        engineering: { pitch: 1.0, rate: 1.05 },
        product: { pitch: 1.05, rate: 1.0 },
        marketing: { pitch: 1.1, rate: 1.05 },
        operations: { pitch: 0.95, rate: 1.0 },
        finance: { pitch: 0.9, rate: 0.95 },
        design: { pitch: 1.1, rate: 1.0 },
        data: { pitch: 1.0, rate: 0.95 },
        legal: { pitch: 0.85, rate: 0.9 },
      };
      const voiceConfig = domainVoiceMap[agent?.domain] || { pitch: 1.0, rate: 1.0 };
      utterance.pitch = voiceConfig.pitch;
      utterance.rate = voiceConfig.rate;
      utterance.volume = 1;

      utterance.onstart = () => setSpeakingId(agent?.id);
      utterance.onend = () => setSpeakingId(null);

      window.speechSynthesis.speak(utterance);
    }
  }, [agent]);

  const addAIMessage = useCallback((text) => {
    setSpeakingId(agent?.id);
    setTranscript(prev => [...prev, {
      sender: agent?.name || 'AI',
      senderId: agent?.id,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: false,
    }]);
    speakText(text);
  }, [agent, speakText]);

  const findBestResponse = useCallback((input) => {
    if (!agent) return null;
    const q = input.toLowerCase();
    const triggerMap = {
      strategy: ['strategy', 'plan', 'approach', 'vision', 'growth', 'direction', 'roadmap'],
      budget: ['budget', 'cost', 'money', 'expense', 'financial', 'spending', 'save', 'reduce'],
      team: ['team', 'hire', 'manage', 'people', 'leadership', 'culture', 'build'],
      architecture: ['architecture', 'system', 'design', 'stack', 'technical', 'infra', 'scale', 'build'],
      security: ['security', 'threat', 'vulnerability', 'compliance', 'audit', 'breach', 'protect'],
      performance: ['performance', 'speed', 'optimize', 'latency', 'fast', 'slow', 'improve'],
      conflict: ['conflict', 'disagree', 'problem', 'issue', 'resolution', 'dispute'],
      vision: ['vision', 'future', 'long-term', 'goal', 'mission', 'where'],
    };

    for (const [trigger, keywords] of Object.entries(triggerMap)) {
      if (keywords.some(kw => q.includes(kw))) {
        const match = agent.interviewScript.find(s => s.trigger === trigger);
        if (match) return match.response;
      }
    }

    const defaultScript = agent.interviewScript.find(s => s.trigger === 'default');
    return defaultScript?.response || "That's a great question. Let me think about that and provide a thorough response based on my professional experience.";
  }, [agent]);

  const handleSendMessage = useCallback(() => {
    if (!userInput.trim() || !isAIReady) return;

    const message = userInput;
    setUserInput('');

    // Add user message
    setTranscript(prev => [...prev, {
      sender: 'You',
      senderId: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
    }]);

    // AI responds after delay
    setTimeout(() => {
      const response = findBestResponse(message);
      addAIMessage(response);
    }, 1500);
  }, [userInput, isAIReady, findBestResponse, addAIMessage]);

  const handleSuggestedQuestion = useCallback((question) => {
    setUserInput('');
    setTranscript(prev => [...prev, {
      sender: 'You',
      senderId: 'user',
      text: question,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
    }]);
    setTimeout(() => {
      const response = findBestResponse(question);
      addAIMessage(response);
    }, 1500);
  }, [findBestResponse, addAIMessage]);

  const handleEndCall = () => {
    window.speechSynthesis?.cancel();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    navigate('/marketplace');
  };

  const toggleCamera = () => {
    if (isCameraOn && streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
    }
    setIsCameraOn(!isCameraOn);
  };

  if (!agent) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#1a1a2e', color: '#e8eaed' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Professional not found</h2>
          <button onClick={() => navigate('/marketplace')} style={{ marginTop: 16, padding: '10px 24px', background: '#1a73e8', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer' }}>
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  if (!hasJoined) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#1a1a2e', color: '#e8eaed' }}>
        <h2 style={{ marginBottom: 24, fontSize: '28px' }}>Ready to interview?</h2>
        <p style={{ marginBottom: 32, color: '#a0aabf' }}>You are interviewing: {agent.name} ({agent.profession})</p>
        <button 
          onClick={() => {
            // Unlock audio context synchronously
            if ('speechSynthesis' in window) {
              window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
            }
            setHasJoined(true);
          }} 
          style={{ padding: '12px 32px', fontSize: '16px', background: '#1a73e8', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Video size={20} />
          Start Interview
        </button>
      </div>
    );
  }

  const suggestedQuestions = [
    "Tell me about your strategy approach",
    "How would you handle a budget cut?",
    "How do you build and manage teams?",
    "What's your experience with system architecture?",
    "How do you handle conflicts?",
  ];

  // Calculate tile sizes based on number of participants + transcript visibility
  const gridWidth = showTranscript ? 'calc(100% - 360px)' : '100%';
  const tileWidth = 'min(560px, 48%)';
  const tileHeight = 'min(380px, 45vh)';

  return (
    <div className="meeting-room">
      {/* Header */}
      <div className="meeting-header">
        <div className="meeting-header-left">
          <div className="meeting-title">
            Interview — {agent.name} ({agent.profession})
          </div>
          <div className="meeting-timer">
            <div className="meeting-recording-dot" />
            <span>{formatTime(meetingTime)}</span>
          </div>
        </div>
        <div className="meeting-header-right">
          <div className="meeting-participant-count">
            <Users size={16} />
            <span>2 participants</span>
          </div>
        </div>
      </div>

      {/* Video Grid + Transcript Container */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {/* Video Grid */}
        <div className="meeting-video-grid" style={{ width: gridWidth, transition: 'width 0.3s' }}>
          {/* User's Video Tile */}
          <div className="meeting-video-tile user-tile" style={{ width: tileWidth, height: tileHeight }}>
            {isCameraOn ? (
              <video ref={videoRef} autoPlay muted playsInline style={{ borderRadius: 12 }} />
            ) : (
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#3c4043', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#e8eaed' }}>
                You
              </div>
            )}
            <div className="meeting-tile-name">
              <span>You (Founder)</span>
              <div className="meeting-tile-mic">
                {isMicOn ? <Mic size={12} /> : <MicOff size={12} style={{ color: '#ea4335' }} />}
              </div>
            </div>
          </div>

          {/* AI's Video Tile */}
          <div className={`meeting-video-tile ${speakingId === agent.id ? 'speaking' : ''}`} style={{ width: tileWidth, height: tileHeight }}>
            <div className={`meeting-ai-avatar ${agent.domain} ${speakingId === agent.id ? 'speaking' : ''}`}
              style={{
                background: {
                  executive: 'linear-gradient(135deg, #F13223, #ff6b4a)',
                  engineering: 'linear-gradient(135deg, #1298B0, #0ea5e9)',
                  product: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                  marketing: 'linear-gradient(135deg, #a855f7, #c084fc)',
                  operations: 'linear-gradient(135deg, #10b981, #34d399)',
                  finance: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
                  design: 'linear-gradient(135deg, #ec4899, #f472b6)',
                  data: 'linear-gradient(135deg, #6366f1, #818cf8)',
                  legal: 'linear-gradient(135deg, #78716c, #a8a29e)',
                }[agent.domain] || 'linear-gradient(135deg, #1298B0, #0ea5e9)',
              }}
            >
              {agent.initials}
            </div>
            <div className="meeting-tile-name">
              <span>{agent.name} • {agent.profession}</span>
              <div className="meeting-tile-mic">
                {speakingId === agent.id ? (
                  <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 12 }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{
                        width: 3, background: '#1a73e8', borderRadius: 1,
                        animation: `equalizer 0.5s ease-in-out ${i * 0.15}s infinite alternate`,
                        height: [8, 12, 6][i],
                      }} />
                    ))}
                    <style>{`@keyframes equalizer { from { height: 3px; } to { height: 12px; } }`}</style>
                  </div>
                ) : <Mic size={12} />}
              </div>
            </div>
          </div>
        </div>

        {/* Transcript Panel */}
        {showTranscript && (
          <div className="meeting-transcript">
            <div className="meeting-transcript-header">
              <h3>Conversation</h3>
              <button onClick={() => setShowTranscript(false)} style={{ background: 'none', border: 'none', color: '#9aa0a6', cursor: 'pointer', padding: 4 }}>
                <X size={18} />
              </button>
            </div>

            <div className="meeting-transcript-body">
              {transcript.length === 0 && (
                <div style={{ textAlign: 'center', color: '#5f6368', fontSize: 13, paddingTop: 32 }}>
                  Waiting for the interview to begin...
                </div>
              )}
              {transcript.map((msg, i) => (
                <div key={i} className="transcript-message">
                  <div className={`transcript-sender ${msg.isUser ? 'user-sender' : ''}`}>
                    {msg.sender}
                  </div>
                  <div className="transcript-text">{msg.text}</div>
                  <div className="transcript-time">{msg.time}</div>
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </div>

            {/* Suggested Questions */}
            <div className="suggested-questions">
              <div className="suggested-questions-label">Suggested Questions</div>
              {suggestedQuestions.map((q, i) => (
                <button key={i} className="suggested-question" onClick={() => handleSuggestedQuestion(q)}>
                  <ChevronRight size={12} style={{ flexShrink: 0, marginRight: 4 }} />{q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="transcript-input-area">
              <input
                type="text"
                placeholder="Ask a question..."
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>
                <Send size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="meeting-controls">
        <button className={`meeting-control-btn ${!isMicOn ? 'muted' : ''}`} onClick={() => setIsMicOn(!isMicOn)} title={isMicOn ? 'Mute' : 'Unmute'}>
          {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
        </button>
        <button className={`meeting-control-btn ${!isCameraOn ? 'muted' : ''}`} onClick={toggleCamera} title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}>
          {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
        </button>
        <button className="meeting-control-btn" title="Present (disabled)" style={{ opacity: 0.4, cursor: 'default' }}>
          <Monitor size={20} />
        </button>
        <button className="meeting-control-btn end-call" onClick={handleEndCall} title="End interview">
          <Phone size={20} style={{ transform: 'rotate(135deg)' }} />
        </button>
        <div style={{ width: 24 }} />
        <button
          className={`meeting-control-btn chat-btn ${!showTranscript ? '' : 'active'}`}
          onClick={() => setShowTranscript(!showTranscript)}
          title="Toggle transcript"
        >
          <MessageSquare size={20} />
          {!showTranscript && transcript.length > 0 && <div className="notification-dot" />}
        </button>
      </div>
    </div>
  );
}
