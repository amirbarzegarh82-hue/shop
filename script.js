/**
 * =========================================
 * AMIRHOSSEIN BARZGAR STORE - JAVASCRIPT
 * Modern E-commerce Website Interactions
 * =========================================
 */

// =========================================
// GLOBAL VARIABLES & CONFIGURATION
// =========================================

// Product Database
const products = {
    1: {
        id: 1,
        name: 'iPhone 15 Pro',
        description: 'گوشی هوشمند اپل با دوربین حرفه‌ای',
        price: 25000000,
        oldPrice: 28000000,
        image: 'images/IMG_4892.PNG',
        badge: 'ویژه'
    },
    2: {
        id: 2,
        name: 'لپ‌تاپ گیمینگ ASUS',
        description: 'لپ‌تاپ حرفه‌ای برای گیمینگ و کار',
        price: 45000000,
        image: 'images/IMG_4899.PNG',
        badge: 'جدید'
    },
    3: {
        id: 3,
        name: 'AirPods Pro',
        description: 'هدفون بی‌سیم با کیفیت صدای عالی',
        price: 8500000,
        oldPrice: 10000000,
        image: 'images/airpods-1.jpg'
    },
    4: {
        id: 4,
        name: 'Apple Watch Series 9',
        description: 'ساعت هوشمند با قابلیت‌های پیشرفته',
        price: 15000000,
        image: 'images/IMG_4894.PNG',
        badge: 'پرفروش'
    },
    5: {
        id: 5,
        name: 'پاور بانک ۲۰۰۰۰ میلی‌آمپر',
        description: 'شارژ همراه با ظرفیت بالا',
        price: 550000,
        oldPrice: 750000,
        image: 'images/IMG_4895.PNG'
    },
    6: {
        id: 6,
        name: 'هدست گیمینگ RGB',
        description: 'هدست حرفه‌ای با نورپردازی RGB',
        price: 2800000,
        image: 'images/IMG_4896.PNG',
        badge: 'جدید'
    },
    7: {
        id: 7,
        name: 'ماوس گیمینگ حرفه‌ای',
        description: 'ماوس با دقت بالا برای گیمینگ',
        price: 1200000,
        oldPrice: 1500000,
        image: 'images/IMG_4897.PNG'
    },
    8: {
        id: 8,
        name: 'مانیتور ۲۷ اینچ ۴K',
        description: 'مانیتور حرفه‌ای با کیفیت تصویر عالی',
        price: 12000000,
        image: 'images/IMG_4898.PNG'
    }
};

// Shopping Cart Array
let cart = [];

// DOM Elements
const elements = {};

// =========================================
// UTILITY FUNCTIONS
// =========================================

/**
 * Format price to Persian currency
 * @param {number} price - Price in Rials
 * @returns {string} Formatted price
 */
function formatPrice(price) {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
}

/**
 * Get element by ID or selector
 * @param {string} selector - Element ID or selector
 * @returns {HTMLElement} DOM element
 */
function getElement(selector) {
    if (!elements[selector]) {
        elements[selector] = document.getElementById(selector) || document.querySelector(selector);
    }
    return elements[selector];
}

/**
 * Show notification to user
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        font-family: inherit;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto remove
    setTimeout(() => {
        closeNotification(notification);
    }, 4000);
}

/**
 * Close notification
 * @param {HTMLElement} notification - Notification element
 */
function closeNotification(notification) {
    notification.style.transform = 'translateX(-100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// =========================================
// CART MANAGEMENT
// =========================================

/**
 * Add product to cart
 * @param {number} productId - Product ID
 * @param {number} quantity - Quantity to add
 */
function addToCart(productId, quantity = 1) {
    const product = products[productId];
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    updateCartUI();
    showNotification(`${product.name} به سبد خرید اضافه شد`);
}

/**
 * Remove product from cart
 * @param {number} productId - Product ID
 */
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        const product = cart[itemIndex];
        cart.splice(itemIndex, 1);
        updateCartUI();
        showNotification(`${product.name} از سبد خرید حذف شد`, 'info');
    }
}

/**
 * Update product quantity in cart
 * @param {number} productId - Product ID
 * @param {number} quantity - New quantity
 */
function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            updateCartUI();
        }
    }
}

/**
 * Get total cart price
 * @returns {number} Total price
 */
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Get total cart items count
 * @returns {number} Total items count
 */
function getCartCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

/**
 * Clear entire cart
 */
function clearCart() {
    cart = [];
    updateCartUI();
    showNotification('سبد خرید خالی شد', 'info');
}

// =========================================
// UI UPDATE FUNCTIONS
// =========================================

/**
 * Update cart UI elements
 */
function updateCartUI() {
    updateCartCount();
    updateCartItems();
    updateCartTotal();
}

/**
 * Update cart count badge
 */
function updateCartCount() {
    const cartCountElement = getElement('cartCount');
    if (cartCountElement) {
        const count = getCartCount();
        cartCountElement.textContent = count;
        cartCountElement.style.display = count > 0 ? 'flex' : 'none';
    }
}

/**
 * Update cart items list
 */
function updateCartItems() {
    const cartItemsContainer = getElement('cartItems');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <p>سبد خرید شما خالی است</p>
            </div>
        `;
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-product-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})" aria-label="حذف محصول">&times;</button>
        </div>
    `).join('');
}

/**
 * Update cart total price
 */
function updateCartTotal() {
    const cartTotalElement = getElement('cartTotal');
    if (cartTotalElement) {
        cartTotalElement.textContent = formatPrice(getCartTotal());
    }
}

// =========================================
// SLIDER FUNCTIONS
// =========================================

let currentSlide = 0;
let slideInterval;

/**
 * Initialize hero slider
 */
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slides.length === 0) return;
    
    // Auto slide
    startAutoSlide();
    
    // Navigation buttons
    const prevBtn = getElement('prevSlide');
    const nextBtn = getElement('nextSlide');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });
    }
    
    // Indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            resetAutoSlide();
        });
    });
}

/**
 * Go to specific slide
 * @param {number} index - Slide index
 */
function goToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    currentSlide = index;
}

/**
 * Next slide
 */
function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    const nextIndex = (currentSlide + 1) % slides.length;
    goToSlide(nextIndex);
}

/**
 * Previous slide
 */
function prevSlide() {
    const slides = document.querySelectorAll('.slide');
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prevIndex);
}

/**
 * Start auto slide
 */
function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 5000);
}

/**
 * Reset auto slide
 */
function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

// =========================================
// PRODUCT SLIDER FUNCTIONS
// =========================================

let productSliderPosition = 0;
const productSliderItems = 4; // Number of items to show

/**
 * Initialize product slider
 */
function initProductSlider() {
    const sliderTrack = getElement('sliderTrack');
    if (!sliderTrack) return;
    
    // Add products to slider
    const sliderProducts = Object.values(products).slice(0, 8);
    sliderTrack.innerHTML = sliderProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price)}</span>
                    ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ''}
                </div>
                <button class="btn btn-add-cart" data-product-id="${product.id}">
                    افزودن به سبد خرید
                </button>
            </div>
        </div>
    `).join('');
    
    // Set initial position for RTL layout
    sliderTrack.style.transform = 'translateX(0px)';
    
    // Slider navigation
    const prevBtn = getElement('prevProduct');
    const nextBtn = getElement('nextProduct');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            moveProductSlider('prev');
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            moveProductSlider('next');
        });
    }
}

/**
 * Move product slider
 * @param {string} direction - Direction to move (prev/next)
 */
function moveProductSlider(direction) {
    const sliderTrack = getElement('sliderTrack');
    const items = sliderTrack.querySelectorAll('.product-card');
    const itemWidth = 280 + 32; // Card width + gap
    const maxPosition = Math.max(0, items.length - productSliderItems);
    
    if (direction === 'prev') {
        productSliderPosition = Math.max(0, productSliderPosition - 1);
    } else {
        productSliderPosition = Math.min(maxPosition, productSliderPosition + 1);
    }
    
    // For RTL layout, we use positive translateX
    sliderTrack.style.transform = `translateX(${productSliderPosition * itemWidth}px)`;
}

// =========================================
// MOBILE MENU FUNCTIONS
// =========================================

/**
 * Initialize mobile menu
 */
function initMobileMenu() {
    const mobileMenuToggle = getElement('mobileMenuToggle');
    const mobileMenu = getElement('mobileMenu');
    const closeMenu = getElement('closeMenu');
    const cartOverlay = getElement('cartOverlay');
    
    // Toggle mobile menu
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close mobile menu
    if (closeMenu && mobileMenu) {
        closeMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close on overlay click
    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            getElement('cartSidebar').classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Mobile dropdown toggles
    const dropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const dropdown = toggle.nextElementSibling;
            dropdown.classList.toggle('active');
        });
    });
}

// =========================================
// CART SIDEBAR FUNCTIONS
// =========================================

/**
 * Initialize cart sidebar
 */
function initCartSidebar() {
    const cartBtn = getElement('cartBtn');
    const cartSidebar = getElement('cartSidebar');
    const closeCart = getElement('closeCart');
    const cartOverlay = getElement('cartOverlay');
    const checkoutBtn = getElement('checkoutBtn');
    
    // Open cart sidebar
    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close cart sidebar
    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('سبد خرید شما خالی است', 'error');
                return;
            }
            
            // Simulate checkout process
            showNotification('در حال انتقال به صفحه پرداخت...', 'info');
            
            setTimeout(() => {
                alert('با تشکر از خرید شما!\nاین یک نمونه پیام برای تسویه حساب است.');
                clearCart();
                cartSidebar.classList.remove('active');
                cartOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }, 2000);
        });
    }
}

// =========================================
// EVENT LISTENERS
// =========================================

/**
 * Initialize all event listeners
 */
function initEventListeners() {
    // Add to cart buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-add-cart')) {
            const productId = parseInt(e.target.dataset.productId);
            addToCart(productId);
        }
    });
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            showNotification('با تشکر! ایمیل شما با موفقیت ثبت شد.');
            e.target.reset();
        });
    }
    
    // Search button
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            showNotification('امکان جستجو به زودی فعال خواهد شد', 'info');
        });
    }
    
    // User account button
    const userBtn = document.querySelector('.user-btn');
    if (userBtn) {
        userBtn.addEventListener('click', () => {
            showNotification('امکان ورود به حساب کاربری به زودی فعال خواهد شد', 'info');
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        });
    }
}

// =========================================
// INITIALIZATION
// =========================================

/**
 * Initialize all components when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Amirhossein Barzgar Store - Initializing...');
    
    // Initialize all components
    initHeroSlider();
    initProductSlider();
    initMobileMenu();
    initCartSidebar();
    initEventListeners();
    
    // Initialize cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCartUI();
        } catch (e) {
            console.error('Error loading cart from localStorage:', e);
        }
    }
    
    // Save cart to localStorage on changes
    const originalUpdateCartUI = updateCartUI;
    updateCartUI = function() {
        originalUpdateCartUI();
        localStorage.setItem('cart', JSON.stringify(cart));
    };
    
    // Initial UI update
    updateCartUI();
    
    // Add loading animation
    document.body.classList.add('loaded');
    
    console.log('Amirhossein Barzgar Store - Ready!');
});

// =========================================
// GLOBAL FUNCTIONS (for onclick handlers)
// =========================================

// Make functions globally available for onclick handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;

// =========================================
// END OF JAVASCR