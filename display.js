// Get query (e.g., ?type=software)
const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get('type') || 'software'; // default to software

const grid = document.getElementById('itemGrid');
const searchBox = document.getElementById('searchBox');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

let items = [];
let currentPage = 1;
const itemsPerPage = 15; // 3 rows × 5 columns

// Load data
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    items = data[type] || [];
    renderItems();
  });

// Render items
function renderItems(filteredItems = items) {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filteredItems.slice(start, end);

  grid.innerHTML = pageItems.map(item => `
    <div class="card">
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <a href="${item.link}" class="download-btn">Download</a>
    </div>
  `).join('');

  pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(filteredItems.length / itemsPerPage)}`;

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = end >= filteredItems.length;

  prevBtn.onclick = () => {
    currentPage--;
    renderItems(filteredItems);
  };
  nextBtn.onclick = () => {
    currentPage++;
    renderItems(filteredItems);
  };
}

// Search filter
searchBox.addEventListener('input', () => {
  const searchTerm = searchBox.value.toLowerCase();
  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm) ||
    item.description.toLowerCase().includes(searchTerm)
  );
  currentPage = 1;
  renderItems(filtered);
});
