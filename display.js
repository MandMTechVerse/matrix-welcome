// ===== Matrix Rain Preloader =====
const preloaderCanvas = document.getElementById("preloaderMatrix");
if (preloaderCanvas) {
  const ctx = preloaderCanvas.getContext("2d");

  function resizeCanvas() {
    preloaderCanvas.width = window.innerWidth;
    preloaderCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const letters = "アァイィウヴエェオカガキギクグケゲコゴサザシジスズセゼソゾタダチッヂツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤャユュヨョラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const lettersArr = letters.split("");
  const fontSize = 14;
  const columns = Math.floor(preloaderCanvas.width / fontSize);
  const drops = Array.from({ length: columns }, () => Math.random() * preloaderCanvas.height / fontSize);
  let hue = 0;

  function drawMatrix() {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, preloaderCanvas.width, preloaderCanvas.height);
    ctx.font = fontSize + "px monospace";

    hue = (hue + 1) % 360;

    for (let i = 0; i < drops.length; i++) {
      const text = lettersArr[Math.floor(Math.random() * lettersArr.length)];
      ctx.fillStyle = `hsl(${(hue + i * 10) % 360}, 100%, 50%)`;
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      drops[i] += Math.random() * 0.5 + 0.5;
      if (drops[i] * fontSize > preloaderCanvas.height && Math.random() > 0.975) drops[i] = 0;
    }
  }

  const matrixInterval = setInterval(drawMatrix, 33);

  // Stop matrix after preloader fades
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.addEventListener("transitionend", () => clearInterval(matrixInterval));
  }
}

// ===== Items, Pagination, and Category =====
const itemsPerPage = 10;
let currentPage = 1;
let allItems = [];
let currentCategory = "software";
let currentSearch = ""; // store search query

// DOM elements
const itemGrid = document.getElementById("itemGrid");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");
const searchBox = document.getElementById("searchBox");

// Read category from URL
const urlParams = new URLSearchParams(window.location.search);
const typeFromURL = urlParams.get("type");
if (typeFromURL) currentCategory = typeFromURL;

// Fetch JSON data
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    allItems = data;
    renderItems();
    document.getElementById("preloader").classList.add("fade-out");
  })
  .catch(err => {
    console.error("Failed to load JSON:", err);
    document.getElementById("preloader").classList.add("fade-out");
  });

// ===== Render Items =====
function renderItems() {
  let items = allItems[currentCategory] || [];

  // Filter by search query
  if (currentSearch.trim() !== "") {
    const query = currentSearch.toLowerCase();
    items = items.filter(item => item.name.toLowerCase().includes(query));
  }

  if (items.length === 0) {
    itemGrid.innerHTML = "<p>No items found.</p>";
    pageInfo.textContent = "";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }

  const totalPages = Math.ceil(items.length / itemsPerPage);
  if (currentPage > totalPages) currentPage = 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToShow = items.slice(startIndex, endIndex);

  itemGrid.innerHTML = "";
  itemsToShow.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <a href="${item.link}" target="_blank" class="download-btn">Download</a>
    `;
    itemGrid.appendChild(card);
  });

  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

// ===== Pagination =====
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderItems();
  }
});

nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil((allItems[currentCategory] || []).length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderItems();
  }
});

// ===== Category Buttons =====
function switchCategory(category) {
  if (!allItems[category]) return;
  currentCategory = category;
  currentPage = 1;
  currentSearch = ""; // clear search
  searchBox.value = ""; // clear input
  renderItems();

  document.querySelectorAll(".category-btn").forEach(btn => btn.classList.remove("active"));
  const activeBtn = document.querySelector(`.category-btn[data-category="${category}"]`);
  if (activeBtn) activeBtn.classList.add("active");
}

document.querySelectorAll(".category-btn").forEach(btn => {
  btn.addEventListener("click", () => switchCategory(btn.getAttribute("data-category")));
});

// ===== Search =====
searchBox.addEventListener("input", () => {
  currentSearch = searchBox.value;
  currentPage = 1;
  renderItems();
});

// ===== Preloader fallback =====
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  setTimeout(() => preloader.classList.add("fade-out"), 800);
});
