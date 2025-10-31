const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const letters = "アァイィウヴエェオカガキギクグケゲコゴサザシジスズセゼソゾタダチッヂツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤャユュヨョラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const lettersArr = letters.split("");
const fontSize = 14;
const columns = Math.floor(canvas.width / fontSize);

// Initialize drops with random starting positions for natural look
const drops = Array.from({ length: columns }, () => Math.random() * canvas.height / fontSize);

let hue = 0;

function draw() {
  // Slightly fade previous frame for smooth trailing effect
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = fontSize + "px monospace";

  hue = (hue + 1) % 360;

  for (let i = 0; i < drops.length; i++) {
    const text = lettersArr[Math.floor(Math.random() * lettersArr.length)];
    ctx.fillStyle = `hsl(${(hue + i * 10) % 360}, 100%, 50%)`;
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    // Slightly vary speed per column for natural fall
    drops[i] += Math.random() * 0.5 + 0.5;

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
  }
}

setInterval(draw, 33);
