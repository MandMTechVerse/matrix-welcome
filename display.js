// --- Get category type from URL ---
const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get('type'); // "software", "games", or "tutorials"

const grid = document.getElementById('itemGrid');
const searchBox = document.getElementById('searchBox');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

let items = [];
let filteredItems = [];
let currentPage = 1;
const itemsPerPage = 15; // 3 rows × 5 columns

// --- Load data from data.json ---
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    // ✅ Use the exact category name
    if (type && data[type]) {
      items = data[type];
    } else {
      // If no valid type found, show an error or fallback
      grid.innerHTML = `<p style="text-align:center; color:#00ff00;">Invalid category or no data found.</p>`;
      return;
    }

    filteredItems = items;
    renderItems();
  })
  .catch(err => {
    console.error('Error loading JSON:', err);
    grid.innerHTML = `<p style="text-align:center; color:red;">Error loading data.json</p>`;
  });

// --- Render items into grid ---
function renderItems() {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filteredItems.slice(start, end);

  grid.innerHTML = pageItems
    .map(
      (item) => `
    <div class="card">
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <a href="${item.link}" class="download-btn" target="_blank">Download</a>
    </div>
  `
    )
    .join('');

  // Update pagination info
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

// --- Pagination buttons ---
prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderItems();
  }
});

nextBtn.addEventListener('click', () => {
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderItems();
  }
});

// --- Search filter ---
searchBox.addEventListener('input', () => {
  const searchTerm = searchBox.value.toLowerCase();
  filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm)
  );
  currentPage = 1;
  renderItems();
});
