const prompt_overlay = document.getElementById('prompt_overlay')

const first_prompt_time = 15 * 1000 // 15 seconds
const prompt_visibility_duration = 25 * 1000 // 25 seconds
const continous_promt_interval = 15 * 60 * 1000 // 15 minutes

let _showTimer = null;
let _hideTimer = null;
let _cycleTimer = null;

function showPromptOverlay() {
  prompt_overlay.style.opacity = '1';
  prompt_overlay.style.top = '0';
}

function hidePromptOverlay() {
  prompt_overlay.style.opacity = '0';
  prompt_overlay.style.top = '50px';
}

function startPropmtingUserWithOverlay() {
  stopPropmtingUserWithOverlay();

  function runCycle() {
    _showTimer = setTimeout(function () {
      showPromptOverlay();

      _hideTimer = setTimeout(function () {
        hidePromptOverlay();
      }, prompt_visibility_duration);

    }, first_prompt_time);
  }

  runCycle();
  _cycleTimer = setInterval(function () {
    runCycle();
  }, continous_promt_interval);
}

function stopPropmtingUserWithOverlay() {
  if (_showTimer) { clearTimeout(_showTimer); _showTimer = null; }
  if (_hideTimer) { clearTimeout(_hideTimer); _hideTimer = null; }
  if (_cycleTimer) { clearInterval(_cycleTimer); _cycleTimer = null; }
}
