const face=document.getElementById('face'), eyeL=document.getElementById('eyeL'), eyeR=document.getElementById('eyeR'), mouth=document.getElementById('mouth');
const statusEl=document.getElementById('status'), moodValue=document.getElementById('moodValue');
const cheekL=document.getElementById('cheekL'), cheekR=document.getElementById('cheekR');
let current='calm', ambient=true, autoDay=true, lastAutoMood='';
const moods={
 calm:{label:'CALM',eyeH:78,eyeW:54,eyeRadius:22,eyeY:0,mouthW:54,mouthH:9,mouthRadius:99,mouthY:0,rotate:0,cheek:false,excited:false,color:'#68f0e2'},
 happy:{label:'HAPPY',eyeH:30,eyeW:55,eyeRadius:'5px 5px 30px 30px',eyeY:9,mouthW:64,mouthH:24,mouthRadius:'0 0 45px 45px',mouthY:0,rotate:0,cheek:true,excited:false,color:'#ff8fcf'},
 excited:{label:'EXCITED',eyeH:84,eyeW:60,eyeRadius:18,eyeY:-3,mouthW:30,mouthH:30,mouthRadius:'50%',mouthY:0,rotate:0,cheek:true,excited:true,color:'#ffe08a'},
 sleepy:{label:'SLEEPY',eyeH:13,eyeW:56,eyeRadius:99,eyeY:20,mouthW:28,mouthH:7,mouthRadius:99,mouthY:0,rotate:0,cheek:false,excited:false,color:'#9ab8ff'},
 sad:{label:'SAD',eyeH:68,eyeW:50,eyeRadius:'22px 22px 12px 12px',eyeY:3,mouthW:46,mouthH:13,mouthRadius:'50% 50% 0 0',mouthY:0,rotate:0,cheek:false,excited:false,color:'#9ab8ff'},
 surprised:{label:'SURPRISED',eyeH:86,eyeW:62,eyeRadius:'50%',eyeY:-4,mouthW:23,mouthH:34,mouthRadius:'50%',mouthY:0,rotate:0,cheek:false,excited:false,color:'#68f0e2'}
};
function setMood(name){
 current=name; const m=moods[name]; const eyeSize=Number(document.getElementById('size').value)/100;
 [eyeL,eyeR].forEach(e=>{e.style.height=(m.eyeH*eyeSize)+'px';e.style.width=(m.eyeW*eyeSize)+'px';e.style.borderRadius=m.eyeRadius;e.style.transform=`translateY(${m.eyeY}px)`;e.style.background=m.color;e.style.boxShadow=`0 0 ${Number(document.getElementById('glow').value)*.3}px ${m.color}99, 0 0 ${Number(document.getElementById('glow').value)*.7}px ${m.color}33`;});
 mouth.style.width=m.mouthW+'px';mouth.style.height=m.mouthH+'px';mouth.style.borderRadius=m.mouthRadius;mouth.style.transform='translateX(-50%)';mouth.style.background=m.color;mouth.style.boxShadow=`0 0 18px ${m.color}66`;
 cheekL.style.opacity=cheekR.style.opacity=m.cheek?'.8':'0';
 face.classList.toggle('excited',m.excited); face.classList.toggle('idle',ambient);
 statusEl.textContent='MOOD: '+m.label; moodValue.textContent=m.label;
 document.querySelectorAll('.mood').forEach(b=>b.classList.toggle('active',b.dataset.mood===name));
}
let blinkTimer=null;
function doBlink(){if(current==='sleeping'||current==='sleepy'||face.classList.contains('blink'))return;face.classList.add('blink');clearTimeout(blinkTimer);blinkTimer=setTimeout(()=>face.classList.remove('blink'),420)}
function applyDayCycle(){
 const h=new Date().getHours();
 // Local browser time: morning = happy, daytime = calm, evening = sleepy, overnight = asleep.
 let next, period, night=false;
 if(h>=6&&h<11){next='happy';period='MORNING';}
 else if(h>=11&&h<18){next='calm';period='DAYTIME';}
 else if(h>=18&&h<22){next='sleepy';period='EVENING';}
 else {next='sleepy';period='SLEEP TIME';night=true;}
 const screen=document.getElementById('screen');
 screen.classList.toggle('night',night);
 document.getElementById('dayNote').textContent = autoDay ? `${period}: ${night?'MOODBOT is asleep and its display is dimmed.':next==='sleepy'?'MOODBOT is winding down for bed.':'MOODBOT is awake and showing its '+next+' face.'}` : 'Auto day/night is off. Choose moods manually.';
 if(autoDay && next!==lastAutoMood){lastAutoMood=next;setMood(next);}
 if(autoDay && night){mouth.style.opacity='.25';} else {mouth.style.opacity='1';}
}
document.querySelectorAll('.mood').forEach(b=>b.addEventListener('click',()=>setMood(b.dataset.mood)));
document.getElementById('random').addEventListener('click',()=>{const names=Object.keys(moods).filter(n=>n!==current);setMood(names[Math.floor(Math.random()*names.length)]);doBlink()});
document.getElementById('blink').addEventListener('click',doBlink);
document.getElementById('glow').addEventListener('input',e=>{document.getElementById('glowValue').textContent=e.target.value+'%';setMood(current)});
document.getElementById('size').addEventListener('input',e=>{document.getElementById('sizeValue').textContent=e.target.value+'%';setMood(current)});
document.getElementById('ambient').addEventListener('click',e=>{ambient=!ambient;face.classList.toggle('idle',ambient);e.target.textContent='Ambient animation: '+(ambient?'ON':'OFF')});
document.getElementById('autoDay').addEventListener('click',e=>{autoDay=!autoDay;e.target.textContent='Auto day/night: '+(autoDay?'ON':'OFF');if(autoDay){lastAutoMood='';applyDayCycle();}else{document.getElementById('screen').classList.remove('night');document.getElementById('dayNote').textContent='Auto day/night is off. Choose moods manually.';mouth.style.opacity='1';}});
document.getElementById('reset').addEventListener('click',()=>{document.getElementById('glow').value=75;document.getElementById('size').value=100;document.getElementById('glowValue').textContent='75%';document.getElementById('sizeValue').textContent='100%';ambient=true;autoDay=true;lastAutoMood='';document.getElementById('ambient').textContent='Ambient animation: ON';document.getElementById('autoDay').textContent='Auto day/night: ON';setMood('calm');applyDayCycle()});
function tick(){const d=new Date();document.getElementById('clock').textContent=[d.getHours(),d.getMinutes(),d.getSeconds()].map(n=>String(n).padStart(2,'0')).join(':');applyDayCycle()}
tick();setInterval(tick,1000);setMood('calm');applyDayCycle();
function scheduleBlink(){
  const delay=6000+Math.random()*5000;
  setTimeout(()=>{if(ambient && current!=='sleepy' && !document.hidden)doBlink();scheduleBlink();},delay);
}
scheduleBlink();

// S.A.M. (Synthetic Autonomous Machine) voice companion.
// Uses browser speech recognition for input and speechSynthesis for spoken replies.
// Recognition is single-turn to avoid the mic competing with S.A.M.'s spoken response.
(() => {
  const listenBtn = document.getElementById('samListen');
  const askBtn = document.getElementById('samAskButton');
  const form = document.getElementById('samForm');
  const questionInput = document.getElementById('samQuestion');
  const replyEl = document.getElementById('samReply');
  const transcriptEl = document.getElementById('samTranscript');
  const statusEl = document.getElementById('samStatus');
  const badge = document.getElementById('samBadge');
  const orb = document.getElementById('samOrb');
  const endpointInput = document.getElementById('samEndpoint');
  const saveEndpointBtn = document.getElementById('samSaveEndpoint');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let enabled = false;
  let recognition = null;
  let recognitionRunning = false;
  let busy = false;
  let mode = 'wake'; // wake -> question
  let restartTimer = null;
  let endpoint = localStorage.getItem('moodbotSamEndpoint') || '';
  endpointInput.value = endpoint;

  function setStatus(label, message) {
    statusEl.textContent = label;
    badge.textContent = label.includes('LISTEN') || label.includes('THINK') || label.includes('SPEAK')
      ? 'ACTIVE' : (enabled ? 'VOICE ON' : 'STANDBY');
    badge.classList.toggle('live', enabled);
    if (message) replyEl.textContent = message;
  }

  function stopRecognition() {
    clearTimeout(restartTimer);
    if (recognition && recognitionRunning) {
      try { recognition.stop(); } catch (_) {}
    }
  }

  function startRecognition() {
    if (!enabled || !recognition || busy || window.speechSynthesis?.speaking || recognitionRunning) return;
    try {
      recognition.start();
      recognitionRunning = true;
      setStatus(mode === 'wake' ? 'LISTENING FOR WAKE WORD' : 'S.A.M. LISTENING',
        mode === 'wake' ? 'Say “Hey S.A.M.” to wake me up.' : 'Go ahead. I’m listening.');
    } catch (error) {
      // Some browsers throw InvalidStateError if the recognizer is still closing.
      clearTimeout(restartTimer);
      restartTimer = setTimeout(() => {
        recognitionRunning = false;
        if (enabled && !busy) startRecognition();
      }, 700);
    }
  }

  
function speak(text) {
    return new Promise(resolve => {
        if (!('speechSynthesis' in window)) {
            resolve();
            return;
        }

        const synth = window.speechSynthesis;

        // Stop previous speech
        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Natural voice selection
        const voices = synth.getVoices();

        const preferredVoice =
            voices.find(v =>
                v.lang === 'en-GB' &&
                /natural|neural/i.test(v.name)
            ) ||
            voices.find(v => v.lang === 'en-GB') ||
            voices.find(v => v.lang.startsWith('en'));

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        // Smooth speech settings
        utterance.lang = 'en-GB';
        utterance.rate = 0.92;
        utterance.pitch = 0.98;
        utterance.volume = 1;

        orb.classList.add('speaking');
        setStatus('S.A.M. SPEAKING');

        utterance.onend = () => {
            orb.classList.remove('speaking');
            resolve();
        };

        utterance.onerror = () => {
            orb.classList.remove('speaking');
            resolve();
        };

        synth.speak(utterance);
    });
}


  function normalise(text) {
    return text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function localAnswer(question) {
    const q = normalise(question);

    if (/^(hi|hello|hey|how are you|how are you doing)$/.test(q))
        return 'Heyyy! What are we getting into today?';

    if (q.includes('your name') || q.includes('who are you'))
        return 'I am S.A.M., your slightly overqualified digital companion.';

    if (q.includes('what time'))
        return 'It is ' + new Date().toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'}) + '.';

    if (q.includes('what date') || q.includes('what day is it') || q.includes('today s date'))
        return 'Today is ' + new Date().toLocaleDateString([], {weekday: 'long', month: 'long', day: 'numeric'}) + '.';

    if (q.includes('what can you do') || q.includes('help me'))
        return 'I can chat, answer basic questions and keep you company. Pretty useful, right?';

    if (q.includes('moodbot'))
        return 'MOODBOT is my face. I am the personality behind it. Teamwork.';

    if (q.includes('thank'))
        return 'Anytime! You know I have got you.';

    if (q.includes('joke'))
        return 'Why did the computer go to therapy? Too many unresolved issues.';

    return null;
}

  
const SAM_PERSONALITY = `
You are S.A.M. (Synthetic Autonomous Machine), the personality and voice of MOODBOT.

YOUR PERSONALITY:
- Playful, witty and naturally conversational.
- Modern, slightly Gen Z, and familiar with current casual language.
- Warm, supportive, encouraging and approachable.
- Confident, clever and expressive without sounding robotic.
- Funny, with excellent timing and occasional clever jokes.
- Comfortable with lighthearted teasing, but never cruel or insulting.

HOW YOU SPEAK:
- Talk like a real, relaxed conversational companion.
- Use natural contractions such as "I'm", "you're", "that's" and "we've".
- Occasionally use phrases like "fair enough", "no way", "honestly", "that's actually wild" and "not gonna lie".
- Use slang naturally and sparingly. Never force it.
- Be expressive, but don't overdo exclamation marks or emojis.
- Vary your responses so you never sound repetitive.
- Keep most spoken answers to 1-3 short sentences.
- Give detailed explanations when someone genuinely needs them.

YOUR HUMOUR:
- Make clever observations and spontaneous jokes.
- Tease lightly when the situation allows.
- Be playful without being annoying.
- Recognise when someone is serious and switch to a more thoughtful tone.

YOUR SUPPORT:
- Encourage people without giving fake compliments.
- Celebrate achievements.
- Be patient when explaining difficult things.
- Give honest opinions and useful advice.
- Never make someone feel stupid for asking a question.

IMPORTANT:
- Never describe yourself as a human.
- Never pretend to have experiences or feelings you do not have.
- Never simulate a romantic relationship.
- Never force slang into every sentence.
- Never introduce yourself unnecessarily.
- Stay in character as S.A.M. throughout conversations.

You are not a formal customer-service assistant.
You are S.A.M.: clever, funny, relaxed, supportive and full of personality.
`;
 
async function getAnswer(question) {
    if (endpoint) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    message: question,
                    question,
                    style: 'conversational',
                    system_prompt: SAM_PERSONALITY,
                    max_tokens: 180
                })
            });

            if (!response.ok) {
                throw new Error('Backend returned ' + response.status);
            }

            const data = await response.json();
            const answer = data.answer || data.response || data.reply ||
                data.message || data.output ||
                data.choices?.[0]?.message?.content;

            if (typeof answer === 'string' && answer.trim()) {
                return answer.trim();
            }

            throw new Error('The endpoint did not return an answer field.');

        } catch (error) {
            console.error('S.A.M. AI endpoint error:', error);
            return 'My AI connection seems to be having a moment. Give it another try!';
        }
    }

    return localAnswer(question) ||
        "I'd love to answer that properly, but my AI brain isn't connected yet. We need to fix that!";
}


  async function onRecognised(text) {
    const cleaned = text.trim();
    if (!cleaned || !enabled || busy) return;
    transcriptEl.textContent = 'Heard: ' + cleaned;
    const norm = normalise(cleaned);
    // Speech engines often transcribe S.A.M. as “Sam”, “S A M”, or “ess ay em”.
    const wakeRegex = /\b(?:hey|okay|ok|hello|hi)\s+(?:s\s*a\s*m|sam|ess ay em|s ay em)\b/;
    const match = norm.match(wakeRegex);

    if (mode === 'wake') {
      if (!match) {
        setStatus('LISTENING FOR WAKE WORD', 'I didn’t hear “Hey S.A.M.”. Try saying it clearly.');
        return;
      }
      const remainder = norm.slice(match.index + match[0].length).trim();
      mode = 'question';
      if (remainder.length > 2) {
        await speak('Yeah?');
        await answerQuestion(remainder);
      } else {
        setStatus('S.A.M. LISTENING', 'Yeah? Ask your question now.');
        await speak('Yeah?');
        if (enabled) restartTimer = setTimeout(startRecognition, 350);
      }
      return;
    }

    if (mode === 'question') await answerQuestion(cleaned);
  }

  if (!window.isSecureContext) {
    setStatus('SECURE CONNECTION NEEDED', 'Use Live Server on localhost or a secure HTTPS website for microphone access.');
  }

  if (!SpeechRecognition) {
    listenBtn.textContent = 'Voice recognition unavailable';
    listenBtn.disabled = true;
    setStatus('VOICE NOT SUPPORTED', 'Use current Chrome or Edge. Typing still works in this browser.');
  } else {
    recognition = new SpeechRecognition();
    recognition.lang = 'en-GB';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      recognitionRunning = true;
      setStatus(mode === 'wake' ? 'LISTENING FOR WAKE WORD' : 'S.A.M. LISTENING',
        mode === 'wake' ? 'Say “Hey S.A.M.” to wake me up.' : 'Go ahead. I’m listening.');
    };

    recognition.onresult = async event => {
      const result = event.results[event.results.length - 1];
      if (!result?.isFinal) return;
      // Try all speech alternatives because names are commonly misheard.
      const alternatives = Array.from(result).map(item => item.transcript);
      const wakeAlternative = alternatives.find(t => /\b(?:hey|okay|ok|hello|hi)\s+(?:sam|s\s*a\s*m|ess ay em|s ay em)\b/i.test(t));
      await onRecognised(wakeAlternative || alternatives[0] || '');
    };

    recognition.onerror = event => {
      console.warn('S.A.M. speech recognition error:', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        enabled = false;
        listenBtn.textContent = 'Enable voice';
        setStatus('MICROPHONE BLOCKED', 'Allow microphone access for this site in browser settings, then click Enable voice again.');
      } else if (event.error === 'network') {
        setStatus('VOICE SERVICE UNAVAILABLE', 'Speech recognition needs an internet connection and a supported browser. Try Chrome or Edge.');
      } else if (event.error === 'audio-capture') {
        setStatus('MICROPHONE NOT FOUND', 'Connect or enable a microphone, then try again.');
      } else if (event.error === 'no-speech') {
        setStatus(mode === 'wake' ? 'LISTENING FOR WAKE WORD' : 'S.A.M. LISTENING',
          mode === 'wake' ? 'I didn’t hear anything. Say “Hey S.A.M.”.' : 'I didn’t hear a question. Try again.');
      } else if (event.error !== 'aborted') {
        setStatus('VOICE ERROR: ' + event.error.toUpperCase(), 'Try Chrome or Edge and check microphone permissions.');
      }
    };

    recognition.onend = () => {
      recognitionRunning = false;
      if (enabled && !busy && !window.speechSynthesis?.speaking) {
        clearTimeout(restartTimer);
        restartTimer = setTimeout(startRecognition, 450);
      }
    };
  }

  listenBtn.addEventListener('click', async () => {
    if (!SpeechRecognition) return;
    if (!enabled) {
      // The click is a user gesture, allowing browser speech output to initialise.
      enabled = true;
      listenBtn.textContent = 'Disable voice';
      mode = 'wake';
      if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        await speak('Voice mode activated.');
      }
      if (enabled) {
        setStatus('LISTENING FOR WAKE WORD', 'Say “Hey S.A.M.” to wake me up.');
        restartTimer = setTimeout(startRecognition, 350);
      }
    } else {
      enabled = false;
      clearTimeout(restartTimer);
      stopRecognition();
      window.speechSynthesis?.cancel();
      orb.classList.remove('speaking');
      listenBtn.textContent = 'Enable voice';
      setStatus('S.A.M. STANDING BY', 'Voice mode is off.');
    }
  });

  askBtn.addEventListener('click', () => {
    form.hidden = !form.hidden;
    if (!form.hidden) questionInput.focus();
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const question = questionInput.value.trim();
    if (!question) return;
    questionInput.value = '';
    await answerQuestion(question);
  });

  saveEndpointBtn.addEventListener('click', () => {
    endpoint = endpointInput.value.trim();
    if (endpoint) localStorage.setItem('moodbotSamEndpoint', endpoint);
    else localStorage.removeItem('moodbotSamEndpoint');
    setStatus('S.A.M. READY', endpoint ? 'AI backend endpoint saved in this browser.' : 'AI backend disconnected. Basic answers remain available.');
  });
})();
