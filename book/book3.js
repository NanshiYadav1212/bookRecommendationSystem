/*const API_KEY = 'key'; 
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resultsDiv = document.getElementById('results');
const wishlistItemsDiv = document.getElementById('wishlist-items');

let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Fetch books from Google Books API
async function fetchBooks(query) {
  try {
    const response = await fetch(`${BASE_URL}?q=${query}&key=${API_KEY}`);
    const data = await response.json();
    return data.items || [];
  } 
  catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

// Render books in the results section
function renderBooks(books) {
  resultsDiv.innerHTML = books
    .map(
      (book) => `
      <div class="book-card">
        <img src="${book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}" alt="${book.volumeInfo.title}">
        <h3>${book.volumeInfo.title}</h3>
        <p>${book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</p>
        <button class="add-to-wishlist" onclick="addToWishlist('${book.id}')">Add to Wishlist</button>
      </div>
    `
    )
    .join('');
}

// Add a book to the wishlist
function addToWishlist(bookId) {
  const book = wishlist.find((b) => b.id === bookId);
  if (!book) {
    const selectedBook = booksCache.find((b) => b.id === bookId);
    wishlist.push(selectedBook);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    renderWishlist();
  }
}

// Render the wishlist
function renderWishlist() {
  wishlistItemsDiv.innerHTML = wishlist
    .map(
      (book) => `
      <div class="book-card">
        <img src="${book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}" alt="${book.volumeInfo.title}">
        <h3>${book.volumeInfo.title}</h3>
        <p>${book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</p>
      </div>
    `
    )
    .join('');
}

// Event listener for search button
searchBtn.addEventListener('click', async () => {
  const query = searchInput.value.trim();
  if (query) {
    const books = await fetchBooks(query);
    booksCache = books; // Cache the books for wishlist functionality
    renderBooks(books);
  }
});

// Initial render of wishlist
renderWishlist();*/


const API_KEY = 'key';
    const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';
    
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const resultsDiv = document.getElementById('results');
    const wishlistItemsDiv = document.getElementById('wishlist-items');
    const historyItemsDiv = document.getElementById('history-items');
    const recommendationsDiv = document.getElementById('recommendations');
    const loadingDiv = document.getElementById('loading');
    const darkModeBtn = document.getElementById('toggle-dark-mode');
    
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    let booksCache = [];

    async function fetchBooks(query) {
      try {
        loadingDiv.style.display = 'block';
        const response = await fetch(`${BASE_URL}?q=${query}&key=${API_KEY}`);
        const data = await response.json();
        return data.items || [];
      } catch (error) {
        console.error('Error fetching books:', error);
        return [];
      } finally {
        loadingDiv.style.display = 'none';
      }
    }

    function renderBooks(books) {
      resultsDiv.innerHTML = books
        .map(book => `
          <div class="book-card">
            <img src="${book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}" alt="${book.volumeInfo.title}">
            <h3>${book.volumeInfo.title}</h3>
            <p>${book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</p>
            <button class="add-to-wishlist" onclick="addToWishlist('${book.id}')">Add to Wishlist</button>
          </div>
        `)
        .join('');
    }

    function addToWishlist(bookId) {
      if (!wishlist.some(b => b.id === bookId)) {
        const selectedBook = booksCache.find(b => b.id === bookId);
        if (selectedBook) {
          wishlist.push(selectedBook);
          localStorage.setItem('wishlist', JSON.stringify(wishlist));
          renderWishlist();
        }
      }
    }

    function removeFromWishlist(bookId) {
      wishlist = wishlist.filter(book => book.id !== bookId);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      renderWishlist();
    }

    function renderWishlist() {
      wishlistItemsDiv.innerHTML = wishlist
        .map(book => `
          <div class="book-card">
            <img src="${book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}" alt="${book.volumeInfo.title}">
            <h3>${book.volumeInfo.title}</h3>
            <p>${book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</p>
            <button class="remove-from-wishlist" onclick="removeFromWishlist('${book.id}')">Remove</button>
          </div>
        `)
        .join('');
    }

    function renderHistory() {
      historyItemsDiv.innerHTML = searchHistory
        .map(query => `<p class="history-item">${query}</p>`)
        .join('');
    }

    function updateHistory(query) {
      if (!searchHistory.includes(query)) {
        searchHistory.push(query);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        renderHistory();
      }
    }

    function renderRecommendations() {
      if (searchHistory.length > 0) {
        recommendationsDiv.innerHTML = `<p>Try searching for: ${searchHistory.slice(-3).join(', ')}</p>`;
      } else {
        recommendationsDiv.innerHTML = `<p>No recommendations available.</p>`;
      }
    }

    searchBtn.addEventListener('click', async () => {
      const query = searchInput.value.trim();
      if (query) {
        updateHistory(query);
        const books = await fetchBooks(query);
        booksCache = books;
        renderBooks(books);
        renderRecommendations();
      }
    });

    darkModeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark-mode');
    }

    renderWishlist();
    renderHistory();
    renderRecommendations();
