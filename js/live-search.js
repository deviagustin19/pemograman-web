// Live Search Functionality
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const searchResultsContainer = document.getElementById('live-search-results');
    let debounceTimer = null;

    // Event listener untuk input
    searchInput.addEventListener('input', function () {
        clearTimeout(debounceTimer);
        const query = this.value.trim();

        // Debounce
        debounceTimer = setTimeout(() => {
            if (query.length === 0) {
                searchResultsContainer.innerHTML = '';
                searchResultsContainer.classList.remove('active');
                return;
            }

            if (query.length < 2) {
                searchResultsContainer.innerHTML = '';
                searchResultsContainer.classList.remove('active');
                return;
            }

            // Lakukan pencarian
            const results = performSearch(query);

            // Jika tidak ada hasil, tampilkan pesan dan tombol redirect
            if (results.length === 0) {
                displayNoResults(query);
            } else {
                displayLiveResults(results, query);
            }
        }, 300);
    });

    // Tutup hasil saat klik di luar
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.search-widget')) {
            searchResultsContainer.classList.remove('active');
        }
    });

    // Focus pada input
    searchInput.addEventListener('focus', function () {
        if (searchResultsContainer.children.length > 0) {
            searchResultsContainer.classList.add('active');
        }
    });

    // Enter key untuk submit ke halaman hasil
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearchSubmit(e);
        }
    });
});

// Fungsi pencarian
function performSearch(query) {
    const lowerQuery = query.toLowerCase();

    return articlesDatabase.filter(article =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.description.toLowerCase().includes(lowerQuery) ||
        article.category.toLowerCase().includes(lowerQuery)
    ).slice(0, 8); // Limit hasil ke 8 artikel
}

// Fungsi tampil hasil live search (KOTAK B)
function displayLiveResults(results, query) {
    const container = document.getElementById('live-search-results');

    let html = `
    <div class="live-search-header">
      <span>Ditemukan ${results.length} hasil</span>
    </div>
  `;

    results.forEach((article, index) => {
        const highlightedTitle = highlightKeyword(article.title, query);

        html += `
      <a href="${article.url}" class="live-search-item" data-index="${index}">
        <div class="live-search-item-image">
          <img src="${article.image}" alt="${article.title}">
        </div>
        <div class="live-search-item-content">
          <div class="live-search-item-title">${highlightedTitle}</div>
          <div class="live-search-item-category">${article.category}</div>
          <div class="live-search-item-desc">${article.description.substring(0, 60)}...</div>
        </div>
      </a>
    `;
    });

    // Tambahkan tombol "Lihat semua hasil"
    html += `
    <div class="live-search-footer">
      <a href="search-results.html?q=${encodeURIComponent(query)}" class="view-all-results">
        Lihat semua hasil <i class="bi bi-arrow-right"></i>
      </a>
    </div>
  `;

    container.innerHTML = html;
    container.classList.add('active');
}

// ✨ FUNGSI BARU: Tampil saat tidak ada hasil (KOTAK B → auto redirect ke KOTAK A)
function displayNoResults(query) {
    const container = document.getElementById('live-search-results');

    html = `
    <div class="live-search-no-results">
      <i class="bi bi-search"></i>
      <p>Tidak ada hasil untuk "<strong>${escapeHtml(query)}</strong>"</p>
      <p class="no-results-hint">Tekan Enter untuk melihat hasil lengkap</p>
    </div>
  `;

    container.innerHTML = html;
    container.classList.add('active');
}

// Fungsi highlight keyword
function highlightKeyword(text, keyword) {
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Fungsi escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Fungsi submit form (redirect ke KOTAK A)
function handleSearchSubmit(event) {
    event.preventDefault();
    const query = document.getElementById('search-input').value.trim();

    if (query === '') {
        alert('Masukkan kata kunci pencarian!');
        return;
    }

    // ✨ AUTO REDIRECT ke halaman search-results.html (KOTAK A)
    window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
}