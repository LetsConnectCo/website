(function(){
  'use strict';

  // TICKER (devre dışı — element kaldırıldı)

  // CURSOR
  var mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
  var smoothX = mouseX, smoothY = mouseY;
  var cursorGlow = document.getElementById('cursorGlow');
  var cursorDot  = document.getElementById('cursorDot');
  document.addEventListener('mousemove', function(e){
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.left = mouseX+'px'; cursorDot.style.top = mouseY+'px';
  });
  var glowRafId = null;
  function glowLoop(){
    smoothX += (mouseX-smoothX)*0.08; smoothY += (mouseY-smoothY)*0.08;
    cursorGlow.style.left = smoothX+'px'; cursorGlow.style.top = smoothY+'px';
    glowRafId = requestAnimationFrame(glowLoop);
  }
  glowLoop();

  // LETTERS
  var text = 'LETS CONNECT';
  var container = document.getElementById('mainText');
  var BASE_DELAY = 1.0, INTERVAL = 0.09;
  var letterEls = [];
  text.split('').forEach(function(ch, i){
    var el = document.createElement('span');
    el.className = 'main-letter' + (ch===' ' ? ' space' : '');
    el.textContent = ch===' ' ? '' : ch;
    el.style.animationDelay = (BASE_DELAY + i*INTERVAL)+'s, 0s';
    container.appendChild(el);
    letterEls.push({el:el, isSpace:ch===' '});
  });
  var totalTime = (BASE_DELAY + text.length*INTERVAL + 1)*1000;
  var lettersReady = false;
  setTimeout(function(){
    letterEls.forEach(function(item){
      if(!item.isSpace) item.el.classList.add('letter-revealed');
    });
    lettersReady = true;
  }, totalTime);

  // LETTER PHRASES
  var phrases = {
    0:  { initial:'L', text:'Ladies first — always.\nIn Web3, women lead the way. Always have, always will. 🌸' },
    1:  { initial:'E', text:'Early is everything.\nYou found us before the crowd. That makes you OG. ✨' },
    2:  { initial:'T', text:'Together we glow.\nThe real alpha? Community. Build together, win together. 💫' },
    3:  { initial:'S', text:'She who connects, wins.\nEvery great Web3 project starts with the right people. 🚀' },
    5:  { initial:'C', text:'Community is the real alpha.\nNot a wallet. Not a token. The people. Always. 💜' },
    6:  { initial:'O', text:'On-chain and unstoppable.\nEvery step you take is forever on the blockchain. ⛓️' },
    7:  { initial:'N', text:'NGMI? Not here — WAGMI.\nWe All Gonna Make It. Especially us. 🩷' },
    8:  { initial:'N', text:'NFTs, DAOs, DeFi — yours.\nThis space was built for everyone. Own it. 👑' },
    9:  { initial:'E', text:'Empowered women empower women.\nThat\'s the LetsConnect way. Always. 🌍' },
    10: { initial:'C', text:'Connect & grow, every day.\nYour next collab is one click away. Find her here. ✦' },
    11: { initial:'T', text:'The future is feminine & onchain.\nWe\'re not coming — we\'re already here. 💅' },
  };

  var overlay      = document.getElementById('popupOverlay');
  var popupInitial = document.getElementById('popupInitial');
  var popupText    = document.getElementById('popupText');
  var popupTimer   = document.getElementById('popupTimer');
  var popupOpen = false, autoClose = null;

  function openPopup(idx, el){
    var d = phrases[idx]; if(!d || popupOpen) return;
    popupOpen = true;
    el.classList.add('letter-clicked');
    popupInitial.textContent = d.initial;
    popupText.innerHTML = d.text.replace(/\n/g,'<br>');
    popupTimer.style.animation = 'none';
    void popupTimer.offsetWidth;
    popupTimer.style.animation = 'timerShrink 4s linear forwards';
    overlay.classList.remove('closing');
    overlay.classList.add('active');
    var r = el.getBoundingClientRect();
    for(var i=0; i<10; i++) burst(r.left+r.width/2, r.top+r.height/2);
    clearTimeout(autoClose);
    autoClose = setTimeout(function(){ closePopup(el); }, 4000);
  }

  function closePopup(el){
    if(!popupOpen) return;
    clearTimeout(autoClose);
    overlay.classList.add('closing');
    if(el && el.classList) el.classList.remove('letter-clicked');
    setTimeout(function(){
      overlay.classList.remove('active','closing');
      popupOpen = false;
    }, 400);
  }

  overlay.addEventListener('click', function(){
    var clicked = container.querySelector('.letter-clicked');
    closePopup(clicked);
  });

  setTimeout(function(){
    letterEls.forEach(function(item, i){
      if(item.isSpace) return;
      item.el.addEventListener('click', function(e){
        e.stopPropagation(); openPopup(i, item.el);
      });
    });
  }, totalTime);

  // LETTER MOUSE REPEL
  var letterRafId = null;
  var REPEL_R = 150, PUSH_S = 18;
  function letterLoop(){
    if(lettersReady){
      letterEls.forEach(function(item){
        if(item.isSpace) return;
        var r = item.el.getBoundingClientRect();
        var cx = r.left+r.width/2, cy = r.top+r.height/2;
        var dx = mouseX-cx, dy = mouseY-cy;
        var dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < REPEL_R){
          var intensity = (1-dist/REPEL_R); intensity *= intensity;
          var angle = Math.atan2(dy,dx);
          var px = -Math.cos(angle)*intensity*PUSH_S;
          var py = -Math.sin(angle)*intensity*PUSH_S;
          var sc = 1+intensity*0.2;
          item.el.style.transform = 'translate('+px.toFixed(1)+'px,'+py.toFixed(1)+'px) scale('+sc.toFixed(3)+')';
          item.el.classList.add('letter-hover');
        } else {
          item.el.style.transform = '';
          item.el.classList.remove('letter-hover');
        }
      });
    }
    letterRafId = requestAnimationFrame(letterLoop);
  }
  letterLoop();



  // PARTICLES — Retina optimized
  var canvas = document.getElementById('particleCanvas');
  var ctx = canvas.getContext('2d');
  function resize(){
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
  resize(); window.addEventListener('resize', resize);

  var pColors = [[160,80,220],[200,100,180],[100,60,180],[220,100,200],[140,80,200],[180,60,240],[210,120,200]];
  var particles = [];
  for(var i=0; i<80; i++){
    var c = pColors[Math.floor(Math.random()*pColors.length)];
    particles.push({
      x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight,
      r:Math.random()*2.5+0.8, color:c,
      alpha:Math.random()*0.55+0.15,
      bvx:(Math.random()-0.5)*0.38, bvy:(Math.random()-0.5)*0.28-0.05,
      vx:0, vy:0, aDir:Math.random()>0.5?1:-1, aSpd:Math.random()*0.004+0.001,
    });
  }

  var pRafId = null;
  function pLoop(){
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for(var i=0; i<particles.length; i++){
      var p = particles[i];
      var dx=p.x-mouseX, dy=p.y-mouseY, d=Math.sqrt(dx*dx+dy*dy);
      if(d<160&&d>0){ var f=(1-d/160)*1.8; p.vx+=(dx/d)*f; p.vy+=(dy/d)*f; }
      p.vx=p.vx*0.95+p.bvx; p.vy=p.vy*0.95+p.bvy;
      p.x+=p.vx; p.y+=p.vy;
      p.alpha+=p.aDir*p.aSpd;
      if(p.alpha>=0.5) p.aDir=-1; else if(p.alpha<=0.03) p.aDir=1;
      if(p.x<-20) p.x=window.innerWidth+20;
      if(p.x>window.innerWidth+20) p.x=-20;
      if(p.y<-20) p.y=window.innerHeight+20;
      if(p.y>window.innerHeight+20) p.y=-20;

      var g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4);
      g.addColorStop(0,'rgba('+p.color[0]+','+p.color[1]+','+p.color[2]+','+(p.alpha*0.7).toFixed(3)+')');
      g.addColorStop(0.4,'rgba('+p.color[0]+','+p.color[1]+','+p.color[2]+','+(p.alpha*0.2).toFixed(3)+')');
      g.addColorStop(1,'rgba('+p.color[0]+','+p.color[1]+','+p.color[2]+',0)');
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r*4,0,Math.PI*2);
      ctx.fillStyle=g; ctx.fill();
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r*0.5,0,Math.PI*2);
      ctx.fillStyle='rgba('+Math.min(p.color[0]+50,255)+','+Math.min(p.color[1]+50,255)+','+Math.min(p.color[2]+50,255)+','+p.alpha.toFixed(3)+')';
      ctx.fill();
    }
    // Connections
    for(var ci=0; ci<particles.length; ci++){
      for(var cj=ci+1; cj<particles.length; cj++){
        var dx=particles[ci].x-particles[cj].x, dy=particles[ci].y-particles[cj].y;
        var d=Math.sqrt(dx*dx+dy*dy);
        if(d<130){
          var lo=(1-d/130)*0.22;
          var mx=(particles[ci].x+particles[cj].x)/2, my=(particles[ci].y+particles[cj].y)/2;
          var md=Math.sqrt((mx-mouseX)*(mx-mouseX)+(my-mouseY)*(my-mouseY));
          if(md<200) lo*=1+(1-md/200)*3.5;
          ctx.beginPath(); ctx.moveTo(particles[ci].x,particles[ci].y);
          ctx.lineTo(particles[cj].x,particles[cj].y);
          ctx.strokeStyle='rgba(192,132,252,'+lo.toFixed(4)+')';
          ctx.lineWidth=0.7; ctx.stroke();
        }
      }
    }
    pRafId = requestAnimationFrame(pLoop);
  }
  pLoop();

  // BURST
  function burst(ox, oy){
    var p = document.createElement('div'); p.className='burst-particle';
    var angle=Math.random()*Math.PI*2, speed=Math.random()*100+40;
    var tx=Math.cos(angle)*speed, ty=Math.sin(angle)*speed;
    var size=Math.random()*5+2, dur=Math.random()*800+400;
    var colors=['#C084FC','#F0ABFC','#A855F7','#E879F9','#D946EF'];
    var col=colors[Math.floor(Math.random()*colors.length)];
    p.style.cssText='left:'+ox+'px;top:'+oy+'px;width:'+size+'px;height:'+size+'px;background:'+col+';box-shadow:0 0 '+(size*2)+'px '+col+';transform:translate(-50%,-50%);';
    document.body.appendChild(p);
    var a=p.animate([
      {transform:'translate(-50%,-50%) scale(1)',opacity:1},
      {transform:'translate(calc(-50% + '+tx+'px),calc(-50% + '+ty+'px)) scale(0)',opacity:0}
    ],{duration:dur,easing:'cubic-bezier(0.23,1,0.32,1)',fill:'forwards'});
    a.onfinish=function(){ p.remove(); };
  }
  document.addEventListener('click', function(e){
    for(var i=0; i<12; i++) burst(e.clientX, e.clientY);
  });

  // GAME — scoped state, no global pollution
  var gameState = { open: false };

  function pauseAllLoops(){
    cancelAnimationFrame(glowRafId);
    cancelAnimationFrame(letterRafId);
    cancelAnimationFrame(pRafId);
    letterEls.forEach(function(item){
      if(!item.isSpace){ item.el.style.transform=''; item.el.classList.remove('letter-hover'); }
    });
  }

  function resumeAllLoops(){
    cancelAnimationFrame(glowRafId);
    cancelAnimationFrame(letterRafId);
    cancelAnimationFrame(pRafId);
    glowLoop();
    letterLoop();
    pLoop();
  }

  window.openGame = function(){
    if(gameState.open) return;
    gameState.open = true;
    pauseAllLoops();
    document.body.classList.add('game-open');
    document.getElementById('game-iframe').src = 'game.html';
    document.getElementById('game-modal').style.display = 'flex';
  };

  window.closeGame = function(){
    if(!gameState.open) return;
    gameState.open = false;
    document.getElementById('game-iframe').src = '';
    document.getElementById('game-modal').style.display = 'none';
    document.body.classList.remove('game-open');
    resumeAllLoops();
  };

  document.getElementById('game-modal').addEventListener('click', function(e){
    if(e.target === this) window.closeGame();
  });

})();

// Pause letter effects when scrolled past hero
(function(){
  var hero = document.getElementById('hero');
  window.addEventListener('scroll', function(){
    if(!hero) return;
    var heroBottom = hero.getBoundingClientRect().bottom;
    if(heroBottom < 0){
      // scrolled past hero — reset all letters
      letterEls.forEach(function(item){
        if(!item.isSpace){
          item.el.style.transform = '';
          item.el.classList.remove('letter-hover');
        }
      });
    }
  }, { passive:true });
})();

// Hide navbar when scrolled past hero
(function(){
  var hero = document.getElementById('hero');
  var navbar = document.getElementById('navbar');

  window.addEventListener('scroll', function(){
    if(!hero) return;
    var heroBottom = hero.getBoundingClientRect().bottom;
    if(heroBottom <= 0){
      if(navbar) navbar.style.opacity = '0';
      if(navbar) navbar.style.pointerEvents = 'none';
    } else {
      if(navbar) navbar.style.opacity = '1';
      if(navbar) navbar.style.pointerEvents = 'auto';
    }
  }, { passive:true });
})();


// AUDIO PLAYER
var audio = null;
var audioInterval = null;

function toggleAudio(){
  if(!audio) audio = document.getElementById('storyAudio');
  var playBtn = document.getElementById('audioPlayBtn');
  var playIcon = document.getElementById('playIcon');
  var pauseIcon = document.getElementById('pauseIcon');
  var bars = document.getElementById('audioBars');

  if(audio.paused){
    audio.play();
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
    bars.classList.add('playing');
    audioInterval = setInterval(updateProgress, 500);
  } else {
    audio.pause();
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    bars.classList.remove('playing');
    clearInterval(audioInterval);
  }
}

function updateProgress(){
  if(!audio) return;
  var fill = document.getElementById('audioFill');
  var timeEl = document.getElementById('audioTime');
  var pct = (audio.currentTime / audio.duration) * 100;
  if(fill) fill.style.width = pct + '%';
  if(timeEl){
    var m = Math.floor(audio.currentTime/60);
    var s = Math.floor(audio.currentTime%60);
    timeEl.textContent = m + ':' + (s<10?'0':'')+s;
  }
}

function seekAudio(e){
  if(!audio) return;
  var bar = e.currentTarget;
  var rect = bar.getBoundingClientRect();
  var pct = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
  updateProgress();
}

function setVolume(val){
  if(!audio) audio = document.getElementById('storyAudio');
  audio.volume = val;
  var slider = document.querySelector('.volume-slider');
  if(slider){
    var pct = val * 100;
    slider.style.background = 'linear-gradient(to right, #8B5EC8 ' + pct + '%, rgba(255,255,255,0.15) ' + pct + '%)';
  }
}

// ─── APPLY FORM MODAL ────────────────────────────────────────────────────────
var web3Choice = 'yes';

function selectWeb3(val) {
  web3Choice = val;
  var yesBtn = document.getElementById('web3-yes');
  var noBtn  = document.getElementById('web3-no');
  if (!yesBtn || !noBtn) return;
  if (val === 'yes') {
    yesBtn.style.background = '#7c3aed'; yesBtn.style.color = '#fff'; yesBtn.style.borderColor = '#7c3aed';
    noBtn.style.background  = '#fff';    noBtn.style.color  = '#9d8bb0'; noBtn.style.borderColor = '#e5d8f7';
  } else {
    noBtn.style.background  = '#7c3aed'; noBtn.style.color  = '#fff'; noBtn.style.borderColor = '#7c3aed';
    yesBtn.style.background = '#fff';    yesBtn.style.color = '#9d8bb0'; yesBtn.style.borderColor = '#e5d8f7';
  }
}

function openApplyForm() {
  var modal = document.getElementById('apply-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  // reset form
  document.getElementById('apply-x').value = '';
  document.getElementById('apply-email').value = '';
  document.getElementById('apply-bio').value = '';
  document.getElementById('apply-error').style.display = 'none';
  document.getElementById('apply-form-wrap').style.display = 'block';
  document.getElementById('apply-success').style.display = 'none';
  web3Choice = 'yes';
  selectWeb3('yes');
  document.body.style.overflow = 'hidden';
}

function closeApplyForm() {
  var modal = document.getElementById('apply-modal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

// Close on backdrop click
document.addEventListener('DOMContentLoaded', function() {
  var modal = document.getElementById('apply-modal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeApplyForm();
    });
  }
});

async function submitApply() {
  var x     = document.getElementById('apply-x').value.trim();
  var email = document.getElementById('apply-email').value.trim();
  var bio   = document.getElementById('apply-bio').value.trim();
  var errEl = document.getElementById('apply-error');
  var btn   = document.getElementById('apply-submit-btn');

  // Validation
  if (!x) { showApplyError('Please enter your X username.'); return; }
  if (!email || !email.includes('@')) { showApplyError('Please enter a valid email address.'); return; }
  if (!bio) { showApplyError('Please tell us a bit about yourself.'); return; }

  btn.textContent = 'Sending...';
  btn.disabled = true;
  btn.style.opacity = '0.7';
  errEl.style.display = 'none';

  try {
    var res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: '04693a1b-c4c4-410f-b891-0b8fc24d4056',
        subject: '✦ New LetsConnect Application — ' + x,
        from_name: 'LetsConnect Apply Form',
        'X Username': x,
        'Email': email,
        'About': bio,
        'Web3 Experience': web3Choice === 'yes' ? 'Yes' : 'No'
      })
    });
    var data = await res.json();
    if (data.success) {
      document.getElementById('apply-form-wrap').style.display = 'none';
      document.getElementById('apply-success').style.display = 'block';
      setTimeout(function() { closeApplyForm(); }, 3500);
    } else {
      showApplyError('Something went wrong. Please try again.');
      btn.textContent = 'Send Application →';
      btn.disabled = false; btn.style.opacity = '1';
    }
  } catch(err) {
    showApplyError('Network error. Please check your connection.');
    btn.textContent = 'Send Application →';
    btn.disabled = false; btn.style.opacity = '1';
  }
}

function showApplyError(msg) {
  var el = document.getElementById('apply-error');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
}
