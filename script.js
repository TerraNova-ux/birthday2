// Birthday Celebration Interactive Controller

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const stageIntro = document.getElementById('stage-intro');
  const stageCake = document.getElementById('stage-cake');
  const stageLetter = document.getElementById('stage-letter');

  const btnOpenSurprise = document.getElementById('btn-open-surprise');
  const candleInteract = document.getElementById('candle-interact');
  const flameCore = document.getElementById('flame-core');
  const flameHalo = document.getElementById('flame-halo');
  const flameSmoke = document.getElementById('flame-smoke');
  const wishInstruction = document.getElementById('wish-instruction');

  const cakeClickable = document.getElementById('cake-clickable-area');
  const envelopePopup = document.getElementById('envelope-popup');
  const btnOpenEnvelope = document.getElementById('btn-open-envelope');
  const btnReplay = document.getElementById('btn-replay');

  // Audio Elements
  const audioHb1 = document.getElementById('audio-hb1');
  const audioHb2 = document.getElementById('audio-hb2');
  const audioMadeInJapan = document.getElementById('audio-madeinjapan');

  // Music Player Elements
  const vinylDisc = document.getElementById('vinyl-disc');
  const btnPlayPause = document.getElementById('btn-play-pause');
  const playPauseIcon = document.getElementById('play-pause-icon');
  const currentTimeLabel = document.getElementById('current-time');
  const totalDurationLabel = document.getElementById('total-duration');
  const progressContainer = document.getElementById('progress-container');
  const progressFill = document.getElementById('progress-fill');
  const volumeSlider = document.getElementById('volume-slider');

  // State
  let candleBlown = false;
  let hb1Finished = false;

  // Setup Canvases
  const confettiCanvas = document.getElementById('confetti-canvas');
  const particlesCanvas = document.getElementById('particles-canvas');
  const cCtx = confettiCanvas.getContext('2d');
  const pCtx = particlesCanvas.getContext('2d');

  function resizeCanvases() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvases);
  resizeCanvases();

  // ==========================================
  // AMBIENT PARTICLES (Sparkles & Little Hearts)
  // ==========================================
  const ambientParticles = [];
  const AMBIENT_COUNT = 38;

  class AmbientParticle {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * particlesCanvas.width;
      this.y = initial ? Math.random() * particlesCanvas.height : particlesCanvas.height + 15;
      this.size = Math.random() * 4 + 2;
      this.speedY = Math.random() * 0.7 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.isHeart = Math.random() > 0.6;
      this.hue = Math.random() > 0.5 ? 340 : 45; // Pink or Gold
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      if (this.y < -20) this.reset();
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      if (this.isHeart) {
        ctx.fillStyle = `hsl(${this.hue}, 100%, 75%)`;
        ctx.font = `${this.size * 2.8}px serif`;
        ctx.fillText('❤', this.x, this.y);
      } else {
        ctx.fillStyle = `hsl(${this.hue}, 100%, 80%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < AMBIENT_COUNT; i++) {
    ambientParticles.push(new AmbientParticle());
  }

  function animateAmbient() {
    pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    for (const p of ambientParticles) {
      p.update();
      p.draw(pCtx);
    }
    requestAnimationFrame(animateAmbient);
  }
  animateAmbient();

  // ==========================================
  // CONFETTI PARTY BOMBERS ENGINE
  // ==========================================
  let confettiPieces = [];
  const CONFETTI_COLORS = ['#ff4071', '#ff9a3c', '#ffea60', '#3cd070', '#3ca9ff', '#ba54ff', '#ff69b4'];

  class ConfettiPiece {
    constructor(x, y, vx, vy, isRibbon = false) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.gravity = 0.22;
      this.drag = 0.982;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 12;
      this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      this.width = Math.random() * 8 + 6;
      this.height = isRibbon ? Math.random() * 22 + 12 : Math.random() * 8 + 6;
      this.opacity = 1;
      this.life = Math.random() * 80 + 120;
    }
    update() {
      this.vx *= this.drag;
      this.vy *= this.drag;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotSpeed;
      this.life--;
      if (this.life < 30) {
        this.opacity = this.life / 30;
      }
    }
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
      ctx.restore();
    }
  }

  function launchPartyBombers() {
    const cw = confettiCanvas.width;
    const ch = confettiCanvas.height;

    // Cannon 1: Bottom Left shooting upwards right
    for (let i = 0; i < 90; i++) {
      const angle = (Math.random() * 45 + 25) * (Math.PI / 180);
      const speed = Math.random() * 19 + 10;
      confettiPieces.push(new ConfettiPiece(0, ch * 0.9, Math.cos(angle) * speed, -Math.sin(angle) * speed, Math.random() > 0.5));
    }

    // Cannon 2: Bottom Right shooting upwards left
    for (let i = 0; i < 90; i++) {
      const angle = (Math.random() * 45 + 110) * (Math.PI / 180);
      const speed = Math.random() * 19 + 10;
      confettiPieces.push(new ConfettiPiece(cw, ch * 0.9, Math.cos(angle) * speed, -Math.sin(angle) * speed, Math.random() > 0.5));
    }

    // Center Explosion
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 14 + 5;
      confettiPieces.push(new ConfettiPiece(cw / 2, ch * 0.45, Math.cos(angle) * speed, Math.sin(angle) * speed - 5, Math.random() > 0.5));
    }
  }

  function launchHeartConfetti(x, y) {
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      const piece = new ConfettiPiece(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed - 3);
      piece.color = Math.random() > 0.5 ? '#ff4071' : '#ff758c';
      confettiPieces.push(piece);
    }
  }

  function animateConfetti() {
    cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    for (let i = confettiPieces.length - 1; i >= 0; i--) {
      const p = confettiPieces[i];
      p.update();
      p.draw(cCtx);
      if (p.life <= 0 || p.y > confettiCanvas.height + 50) {
        confettiPieces.splice(i, 1);
      }
    }
    requestAnimationFrame(animateConfetti);
  }
  animateConfetti();

  // ==========================================
  // STAGE NAVIGATION & AUDIO CHAINING
  // ==========================================

  // Step 1: Open Button clicked
  btnOpenSurprise.addEventListener('click', () => {
    // Transition to Stage 2 (Cake)
    stageIntro.classList.remove('active');
    setTimeout(() => {
      stageCake.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Party bomber celebration burst!
      launchPartyBombers();
      setTimeout(launchPartyBombers, 700);

      // Play audio sequence: hb1 then hb2
      playHbSequence();
    }, 400);
  });

  function playHbSequence() {
    audioHb1.currentTime = 0;
    const playPromise = audioHb1.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn('Playback error / gesture needed:', err);
      });
    }

    // When hb1 finishes, play hb2
    audioHb1.onended = () => {
      hb1Finished = true;
      audioHb2.currentTime = 0;
      audioHb2.play().catch(err => console.warn('HB2 playback failed:', err));
    };
  }

  // ==========================================
  // CANDLE BLOW INTERACTION
  // ==========================================
  function blowCandle(e) {
    if (candleBlown) return;
    if (e) e.stopPropagation();

    candleBlown = true;

    // Extinguish Flame
    flameCore.style.opacity = '0';
    flameCore.style.transform = 'scale(0)';
    flameHalo.style.opacity = '0';

    // Activate Smoke
    flameSmoke.classList.add('active');

    // Confetti & sparkles at candle position
    const rect = candleInteract.getBoundingClientRect();
    launchHeartConfetti(rect.left + rect.width / 2, rect.top + 10);

    // Update instruction text with animation
    wishInstruction.classList.remove('click-cake');
    wishInstruction.innerHTML = '✨ Click on the cake! 🎂 ✨';
    setTimeout(() => {
      wishInstruction.classList.add('click-cake');
    }, 50);

    // Make cake wiggle to invite click
    cakeClickable.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.06) rotate(-1.5deg)' },
      { transform: 'scale(1.06) rotate(1.5deg)' },
      { transform: 'scale(1)' }
    ], {
      duration: 600,
      iterations: 2
    });
  }

  candleInteract.addEventListener('click', blowCandle);

  // ==========================================
  // CAKE CLICK -> ENVELOPE POPUP
  // ==========================================
  cakeClickable.addEventListener('click', (e) => {
    if (!candleBlown) {
      // Gently remind user to blow candle first
      wishInstruction.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(0)' }
      ], { duration: 400 });
      return;
    }

    // Show envelope popup
    envelopePopup.classList.add('show');
    launchPartyBombers();
  });

  // ==========================================
  // ENVELOPE CLICK -> STAGE 3 (LETTER & SONG)
  // ==========================================
  btnOpenEnvelope.addEventListener('click', () => {
    envelopePopup.classList.remove('show');

    // Fade out stage 2 and reveal stage 3
    stageCake.classList.remove('active');
    setTimeout(() => {
      stageLetter.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Stop hb1 and hb2
      audioHb1.pause();
      audioHb2.pause();

      // Start playing madeinjapan.mp3
      audioMadeInJapan.currentTime = 0;
      audioMadeInJapan.volume = parseFloat(volumeSlider.value);
      audioMadeInJapan.play().then(() => {
        updatePlayState(true);
      }).catch(err => {
        console.warn('Made in Japan autoplay blocked:', err);
        updatePlayState(false);
      });

      // Celebration confetti for letter reveal
      launchPartyBombers();
    }, 450);
  });

  // ==========================================
  // CUSTOM MUSIC PLAYER CONTROLLER
  // ==========================================
  function updatePlayState(isPlaying) {
    if (isPlaying) {
      playPauseIcon.textContent = '❚❚';
      vinylDisc.classList.add('spinning');
    } else {
      playPauseIcon.textContent = '▶';
      vinylDisc.classList.remove('spinning');
    }
  }

  btnPlayPause.addEventListener('click', () => {
    if (audioMadeInJapan.paused) {
      audioMadeInJapan.play().then(() => {
        updatePlayState(true);
      });
    } else {
      audioMadeInJapan.pause();
      updatePlayState(false);
    }
  });

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  audioMadeInJapan.addEventListener('loadedmetadata', () => {
    totalDurationLabel.textContent = formatTime(audioMadeInJapan.duration);
  });

  audioMadeInJapan.addEventListener('timeupdate', () => {
    if (audioMadeInJapan.duration) {
      const progressPercent = (audioMadeInJapan.currentTime / audioMadeInJapan.duration) * 100;
      progressFill.style.width = `${progressPercent}%`;
      currentTimeLabel.textContent = formatTime(audioMadeInJapan.currentTime);
      totalDurationLabel.textContent = formatTime(audioMadeInJapan.duration);
    }
  });

  audioMadeInJapan.addEventListener('ended', () => {
    updatePlayState(false);
    progressFill.style.width = '0%';
  });

  progressContainer.addEventListener('click', (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (audioMadeInJapan.duration) {
      audioMadeInJapan.currentTime = pos * audioMadeInJapan.duration;
    }
  });

  volumeSlider.addEventListener('input', (e) => {
    audioMadeInJapan.volume = parseFloat(e.target.value);
  });

  // ==========================================
  // REPLAY BUTTON
  // ==========================================
  btnReplay.addEventListener('click', () => {
    // Pause made in Japan
    audioMadeInJapan.pause();
    updatePlayState(false);

    // Reset candle
    candleBlown = false;
    flameCore.style.opacity = '1';
    flameCore.style.transform = 'scale(1)';
    flameHalo.style.opacity = '1';
    flameSmoke.classList.remove('active');

    wishInstruction.classList.remove('click-cake');
    wishInstruction.innerHTML = 'Make a wish and click on the candle to blow it 🕯️✨';

    // Transition back to Intro Stage
    stageLetter.classList.remove('active');
    setTimeout(() => {
      stageIntro.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  });

});
