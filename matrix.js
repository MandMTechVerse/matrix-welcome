// Get canvas
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

// Make canvas full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Ensure it stays behind all content
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '-1'; // always behind
canvas.style.pointerEvents = 'none'; // allows clicks through canvas

// Custom characters
const letters = "アァイィウヴエェオカガキギクグケゲコゴサザシジスズセゼソゾタダチッヂツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤャユュヨョラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const lettersArray = letters.split('');

const fontSize = 16;
const columns = canvas.width / fontSize;

// Store y positions for each column
const drops = [];
for (let x = 0; x < columns; x++) {
  drops[x] = Math.random() * canvas.height;
}

// Draw function
function draw() {
  // Semi-transparent background for fading effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#00FF00';
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = lettersArray[Math.floor(Math.random() * lettersArray.length)];
    ctx.fillText(text, i * fontSize, drops[i]);

    drops[i] += fontSize;
    if (drops[i] > canvas.height) drops[i] = 0;
  }
}

// Animate
setInterval(draw, 50);

// Handle window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
