/* ==========================================================================
   ShopZone — common.js
   Shared behaviour for every page: sticky header, mobile menu, search,
   cart badge (persisted via localStorage so it survives navigation between
   the catalog and product pages), toast, and back-to-top.
   Include this BEFORE the page-specific script (catalog.js / product.js).
   ========================================================================== */

const CART_KEY = "shopzone_cart_count";

function getCartCount(){
  const stored = localStorage.getItem(CART_KEY);
  const n = parseInt(stored, 10);
  return Number.isFinite(n) ? n : 0;
}

function setCartCount(n){
  const value = Math.max(0, n);
  localStorage.setItem(CART_KEY, String(value));
  const el = document.getElementById('cartCount');
  if (el) el.textContent = value;
  return value;
}

function addToCartCount(delta){
  const next = setCartCount(getCartCount() + delta);
  bumpCartIcon();
  return next;
}

function bumpCartIcon(){
  const el = document.getElementById('cartCount');
  if (!el) return;
  el.classList.add('is-bumped');
  setTimeout(() => el.classList.remove('is-bumped'), 250);
}

let toastTimer = null;
function showToast(message){
  const toast = document.getElementById('cartToast');
  const toastMessage = document.getElementById('toastMessage');
  if (!toast || !toastMessage) return;
  toastMessage.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
}

document.addEventListener('DOMContentLoaded', () => {

  // Sync cart badge on load
  setCartCount(getCartCount());

  /* Sticky header shadow */
  const siteHeader = document.getElementById('site-header');
  if (siteHeader){
    window.addEventListener('scroll', () => {
      siteHeader.classList.toggle('is-scrolled', window.scrollY > 4);
    }, { passive:true });
  }

  /* Mobile menu */
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeMobileMenuBtn = document.getElementById('closeMobileMenu');
  const allCategoriesBtn = document.getElementById('allCategoriesBtn');

  function openMobileMenu(){
    mobileMenu.classList.add('is-open');
    mobileMenuBackdrop.classList.add('is-visible');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
  }
  function closeMobileMenu(){
    mobileMenu.classList.remove('is-open');
    mobileMenuBackdrop.classList.remove('is-visible');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }
  if (mobileMenuBtn){
    mobileMenuBtn.addEventListener('click', openMobileMenu);
    closeMobileMenuBtn.addEventListener('click', closeMobileMenu);
    mobileMenuBackdrop.addEventListener('click', closeMobileMenu);
    if (allCategoriesBtn) allCategoriesBtn.addEventListener('click', openMobileMenu);
  }

  /* Search bar — always redirects to the catalog with a search query */
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  function runSearch(){
    const term = searchInput.value.trim();
    if (term.length === 0) return;
    window.location.href = `index.html?search=${encodeURIComponent(term)}`;
  }
  if (searchBtn){
    searchBtn.addEventListener('click', runSearch);
    searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') runSearch(); });
  }

  /* Back to top */
  const backToTop = document.getElementById('backToTop');
  const footerTop = document.getElementById('footerTop');
  function scrollToTop(){ window.scrollTo({ top: 0, behavior: 'smooth' }); }
  if (backToTop){
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 600);
    }, { passive:true });
    backToTop.addEventListener('click', scrollToTop);
  }
  if (footerTop) footerTop.addEventListener('click', scrollToTop);

});
