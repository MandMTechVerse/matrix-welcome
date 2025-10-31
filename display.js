// display.js

// Number of items per page (2 rows × 5 columns)
const itemsPerPage = 10;

// Current page
let currentPage = 1;

// Store all items
let allItems = [];

// Selected category (default: software)
let currentCategory = "software";

// DOM elements
const itemGrid = document.getElementById("itemGrid");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

// Fetch JSON data
fetch("data.json")
  .then(response => response.json())
  .then(data => {
    allItems = data; // store all categories
    renderItems();
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

  // Generate HTML
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

  // Category buttons
const categoryButtons = document.querySelectorAll(".category-btn");

categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    // Remove 'active' from all buttons
    categoryButtons.forEach(b => b.classList.remove("active"));
    // Add 'active' to clicked button
    btn.classList.add("active");

    // Switch category
    const category = btn.getAttribute("data-category");
    switchCategory(category);
  });
});

// Set default active button
document.querySelector(`.category-btn[data-category="${currentCategory}"]`).classList.add("active");

  // Update pagination info
  const totalPages = Math.ceil(items.length / itemsPerPage);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  // Disable buttons if needed
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

// Optional: Function to switch category
function switchCategory(category) {
  if (allItems[category]) {
    currentCategory = category;
    currentPage = 1;
    renderItems();
  }
}

// Category buttons
const categoryButtons = document.querySelectorAll(".category-btn");

categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const category = btn.getAttribute("data-category");
    switchCategory(category);
  });
});

// Set default active button
document.querySelector(`.category-btn[data-category="${currentCategory}"]`).classList.add("active");
