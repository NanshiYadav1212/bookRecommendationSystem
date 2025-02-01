const API_KEY = 'key'; 
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
renderWishlist();