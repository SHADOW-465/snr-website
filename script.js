// Smooth scroll for internal anchors
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Chat functionality
document.addEventListener('DOMContentLoaded', function() {
  const chatOpen = document.getElementById('chatOpen');
  const chatPanel = document.getElementById('chatPanel');
  const micBtn = document.getElementById('micBtn');
  const chatInput = document.getElementById('chatInput');
  const qList = document.getElementById('qList');
  
  // Chat open/close
  if (chatOpen && chatPanel) {
    chatOpen.addEventListener('click', function() {
      chatPanel.classList.toggle('open');
    });
  }
  
  // Question click handlers
  if (qList) {
    qList.addEventListener('click', function(e) {
      if (e.target.classList.contains('q')) {
        const question = e.target.getAttribute('data-q');
        if (chatInput) {
          chatInput.value = question;
        }
      }
    });
  }
  
  // Quick start "Ask in chat" button handlers
  document.querySelectorAll('[data-question]').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const card = this.closest('.card');
      const question = card.querySelector('h3').textContent;
      
      // Open chat panel if it exists
      if (chatPanel) {
        chatPanel.classList.add('open');
      }
      
      // Populate chat input with the question
      if (chatInput) {
        chatInput.value = question;
        chatInput.focus();
      }
    });
  });
  
  // Voice functionality for chat
  if (micBtn && chatInput) {
    let isRecording = false;
    let mediaRecorder;
    let audioChunks = [];
    
    micBtn.addEventListener('click', function() {
      if (!isRecording) {
        startVoiceRecording();
      } else {
        stopVoiceRecording();
      }
    });
    
    function startVoiceRecording() {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaRecorder = new MediaRecorder(stream);
          audioChunks = [];
          
          mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
          };
          
          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            
            // Add voice message indicator to chat input
            const currentText = chatInput.value;
            const voiceNote = currentText ? currentText + ' [Voice message recorded: ' + new Date().toLocaleTimeString() + ']' : '[Voice message recorded: ' + new Date().toLocaleTimeString() + ']';
            chatInput.value = voiceNote;
            
            // Update button state
            micBtn.innerHTML = '🎙 Voice';
            micBtn.style.background = '#ffd700';
            micBtn.style.color = '#000';
            isRecording = false;
            
            // Stop all audio tracks
            stream.getTracks().forEach(track => track.stop());
          };
          
          mediaRecorder.start();
          isRecording = true;
          
          // Update button appearance
          micBtn.innerHTML = '⏹️ Stop';
          micBtn.style.background = '#ff4444';
          micBtn.style.color = '#fff';
          
        })
        .catch(err => {
          console.error('Error accessing microphone:', err);
          alert('Microphone access denied. Please allow microphone access to use voice features.');
        });
    }
    
    function stopVoiceRecording() {
      if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
      }
    }
  }
  
  // Voice message functionality
  const voiceMessageBtn = document.getElementById('voiceMessageBtn');
  const messageTextarea = document.getElementById('saas-message');
  
  if (voiceMessageBtn && messageTextarea) {
    let isRecording = false;
    let mediaRecorder;
    let audioChunks = [];
    
    voiceMessageBtn.addEventListener('click', function() {
      if (!isRecording) {
        startRecording();
      } else {
        stopRecording();
      }
    });
    
    function startRecording() {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaRecorder = new MediaRecorder(stream);
          audioChunks = [];
          
          mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
          };
          
          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Add voice message indicator to textarea
            const currentText = messageTextarea.value;
            const voiceNote = '\n\n🎙️ Voice message recorded: ' + new Date().toLocaleTimeString();
            messageTextarea.value = currentText + voiceNote;
            
            // Update button state
            voiceMessageBtn.innerHTML = '<span class="voice-icon">🎙️</span>';
            voiceMessageBtn.title = 'Record voice message';
            isRecording = false;
            
            // Stop all audio tracks
            stream.getTracks().forEach(track => track.stop());
          };
          
          mediaRecorder.start();
          isRecording = true;
          
          // Update button appearance
          voiceMessageBtn.innerHTML = '<span class="voice-icon">⏹️</span>';
          voiceMessageBtn.title = 'Stop recording';
          voiceMessageBtn.style.background = '#ff4444';
          
        })
        .catch(err => {
          console.error('Error accessing microphone:', err);
          alert('Microphone access denied. Please allow microphone access to record voice messages.');
        });
    }
    
    function stopRecording() {
      if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
      }
    }
  }
});
