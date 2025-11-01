// display.js

// Number of items per page (2 rows × 5 columns)
const itemsPerPage = 10;

// Current page
let currentPage = 1;

// Store all items
let allItems = [];

// Default category
let currentCategory = "software";

// DOM elements
const itemGrid = document.getElementById("itemGrid");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

// ✅ Read category (type) from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const typeFromURL = urlParams.get("type");
if (typeFromURL) {
  currentCategory = typeFromURL;
}

// Fetch JSON data
fetch("data.json")
  .then(response => response.json())
  .then(data => {
    allItems = data; // store all categories
    renderItems();

    // Set active button after data is loaded
    const activeBtn = document.querySelector(`.category-btn[data-category="${currentCategory}"]`);
    if (activeBtn) activeBtn.classList.add("active");
  })
  .catch(err => console.error("Failed to load JSON:", err));

// Render items for current page & category
function renderItems() {
  const items = allItems[currentCategory];
  if (!items || items.length === 0) {
    itemGrid.innerHTML = "<p>No items found.</p>";
    pageInfo.textContent = "";
    return;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToShow = items.slice(startIndex, endIndex);

  // Generate cards
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

  // Update pagination
  const totalPages = Math.ceil(items.length / itemsPerPage);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

// Pagination button events
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderItems();
  }
});

nextBtn.addEventListener("click", () => {
  const items = allItems[currentCategory];
  const totalPages = Math.ceil(items.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderItems();
  }
});

// Switch category (when clicking category buttons)
function switchCategory(category) {
  if (allItems[category]) {
    currentCategory = category;
    currentPage = 1;
    renderItems();

    // Update active button
    const categoryButtons = document.querySelectorAll(".category-btn");
    categoryButtons.forEach(b => b.classList.remove("active"));
    const activeBtn = document.querySelector(`.category-btn[data-category="${category}"]`);
    if (activeBtn) activeBtn.classList.add("active");
  }
}

// Hide preloader after data loads
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  setTimeout(() => {
    preloader.classList.add("fade-out");
  }, 800); // wait a bit for smooth fade
});

// Category button click events
const categoryButtons = document.querySelectorAll(".category-btn");
categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const category = btn.getAttribute("data-category");
    switchCategory(category);
  });
});
