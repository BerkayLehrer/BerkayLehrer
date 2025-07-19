// Modern JavaScript with enhanced features
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupMobileNavigation();
    setupSmoothScrolling();
    setupNavbarEffects();
    setupIntersectionObserver();
    setupFormHandling();
    setupCounterAnimations();
    setupParallaxEffects();
    setupLoadingAnimations();
    setupHoverEffects();
    setupTypingEffect();
    setupScrollProgress();
    setupBackToTop();
    setupServiceCardEffects();
    setupSocialMediaEffects();
    setupPerformanceOptimizations();
    setupInstagramFeed();
}

// Mobile Navigation
function setupMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Add body scroll lock when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Smooth Scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar Effects
function setupNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add/remove background based on scroll position
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }

        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
    });
}

// Intersection Observer for Animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Add staggered animation for service cards
                if (entry.target.classList.contains('service-card')) {
                    const cards = entry.target.parentElement.querySelectorAll('.service-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('fade-in-up');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .benefit, .step, .stat, .contact-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Form Handling
function setupFormHandling() {
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
        
        // Add real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearValidation);
        });
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Validate all fields
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Lütfen tüm alanları doğru şekilde doldurun.', 'error');
        return;
    }
    
    // Simulate form submission
    submitBtn.textContent = 'Gönderiliyor...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    
    // Show loading animation
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
    
    setTimeout(() => {
        showNotification('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }, 2000);
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.getAttribute('placeholder') || field.name;
    
    // Remove existing validation classes
    field.classList.remove('valid', 'invalid');
    
    // Check if field is required
    if (field.hasAttribute('required') && !value) {
        field.classList.add('invalid');
        showFieldError(field, `${fieldName} alanı zorunludur.`);
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('invalid');
            showFieldError(field, 'Geçerli bir e-posta adresi girin.');
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            field.classList.add('invalid');
            showFieldError(field, 'Geçerli bir telefon numarası girin.');
            return false;
        }
    }
    
    if (value) {
        field.classList.add('valid');
    }
    
    return true;
}

function clearValidation(e) {
    const field = e.target;
    field.classList.remove('invalid');
    hideFieldError(field);
}

function showFieldError(field, message) {
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function hideFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// Counter Animations
function setupCounterAnimations() {
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat h3');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
}

// Parallax Effects
function setupParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        // Parallax for other elements
        const parallaxElements = document.querySelectorAll('.parallax');
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Loading Animations
function setupLoadingAnimations() {
    window.addEventListener('load', () => {
        const loadingElements = document.querySelectorAll('.loading');
        loadingElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('loaded');
            }, index * 100);
        });
        
        // Add entrance animation to hero elements
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
        
        // Force show images
        const images = document.querySelectorAll('.hero-banner, .about-photo');
        images.forEach(img => {
            img.style.opacity = '1';
            img.style.visibility = 'visible';
            img.style.display = 'block';
            img.classList.add('loaded');
        });
    });
}

// Hover Effects
function setupHoverEffects() {
    // Service card hover effects
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
            card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';
        });
    });

    // Benefit card hover effects
    document.querySelectorAll('.benefit').forEach(benefit => {
        benefit.addEventListener('mouseenter', () => {
            benefit.style.transform = 'translateY(-5px)';
            benefit.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
        });
        
        benefit.addEventListener('mouseleave', () => {
            benefit.style.transform = 'translateY(0)';
            benefit.style.boxShadow = '';
        });
    });

    // Step card hover effects
    document.querySelectorAll('.step').forEach(step => {
        step.addEventListener('mouseenter', () => {
            step.style.transform = 'translateY(-5px)';
            step.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
        });
        
        step.addEventListener('mouseleave', () => {
            step.style.transform = 'translateY(0)';
            step.style.boxShadow = '';
        });
    });
}

// Typing Effect
function setupTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 150);
    }
}

function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Scroll Progress Indicator
function setupScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(45deg, #2563eb, #1d4ed8);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Back to Top Button
function setupBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    `;
    document.body.appendChild(backToTopBtn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    backToTopBtn.addEventListener('mouseenter', () => {
        backToTopBtn.style.transform = 'translateY(-3px) scale(1.1)';
        backToTopBtn.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
    });
    
    backToTopBtn.addEventListener('mouseleave', () => {
        backToTopBtn.style.transform = 'translateY(0) scale(1)';
        backToTopBtn.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
    });
}

// Service Card Effects
function setupServiceCardEffects() {
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
            // Add click animation
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });
    });
}

// Social Media Effects
function setupSocialMediaEffects() {
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-5px) scale(1.1)';
            link.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0) scale(1)';
            link.style.boxShadow = '';
        });
    });
}

// Performance Optimizations
function setupPerformanceOptimizations() {
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Handle scroll events here
        }, 16); // 60fps
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            break;
        case 'warning':
            notification.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Instagram Feed Setup
function setupInstagramFeed() {
    const instagramFeed = document.getElementById('instagramFeed');
    if (!instagramFeed) return;
    
    // Instagram API'si için proxy kullanımı (CORS sorununu çözmek için)
    loadInstagramPosts();
}

async function loadInstagramPosts() {
    const instagramFeed = document.getElementById('instagramFeed');
    const username = 'berkaylehrer';
    
    try {
        // Gerçek Instagram API'si kullanıyoruz
        const posts = await getRealInstagramPosts(username);
        displayInstagramPosts(posts);
    } catch (error) {
        console.error('Instagram posts yüklenirken hata:', error);
        // Hata durumunda mock data göster
        const posts = await getMockInstagramPosts();
        displayInstagramPosts(posts);
    }
}

async function getRealInstagramPosts(username) {
    try {
        // Önce ücretsiz Instagram scraper deneyelim
        const posts = await getInstagramPostsFree(username);
        if (posts && posts.length > 0) {
            return posts;
        }
        
        // Eğer ücretsiz scraper çalışmazsa, RapidAPI kullan
        return await getInstagramPostsRapidAPI(username);
    } catch (error) {
        console.error('Gerçek Instagram API hatası:', error);
        throw error;
    }
}

async function getInstagramPostsFree(username) {
    try {
        // Ücretsiz Instagram scraper (CORS proxy ile)
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const instagramUrl = `https://www.instagram.com/${username}/?__a=1&__d=1`;
        
        const response = await fetch(proxyUrl + encodeURIComponent(instagramUrl));
        
        if (!response.ok) {
            throw new Error('Ücretsiz scraper çalışmadı');
        }
        
        const data = await response.json();
        
        if (data && data.graphql && data.graphql.user && data.graphql.user.edge_owner_to_timeline_media) {
            const posts = data.graphql.user.edge_owner_to_timeline_media.edges.slice(0, 5);
            return posts.map(post => ({
                id: post.node.id,
                image: post.node.display_url,
                caption: post.node.edge_media_to_caption?.edges[0]?.node?.text || 'Instagram gönderisi',
                likes: post.node.edge_media_preview_like?.count || 0,
                comments: post.node.edge_media_to_comment?.count || 0,
                timestamp: formatTimestamp(post.node.taken_at_timestamp)
            }));
        }
        
        throw new Error('Instagram verisi bulunamadı');
    } catch (error) {
        console.error('Ücretsiz scraper hatası:', error);
        return null;
    }
}

async function getInstagramPostsRapidAPI(username) {
    try {
        // RapidAPI Instagram Scraper kullanıyoruz
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY', // Buraya RapidAPI key'inizi ekleyin
                'X-RapidAPI-Host': 'instagram-bulk-profile-scrapper.p.rapidapi.com'
            }
        };

        const response = await fetch(`https://instagram-bulk-profile-scrapper.p.rapidapi.com/clients/api/ig/media_by_username/${username}`, options);
        
        if (!response.ok) {
            throw new Error('Instagram API yanıt vermedi');
        }
        
        const data = await response.json();
        
        if (data && data.response && data.response.posts) {
            return data.response.posts.slice(0, 5).map(post => ({
                id: post.id,
                image: post.display_url,
                caption: post.caption || 'Instagram gönderisi',
                likes: post.likes || 0,
                comments: post.comments || 0,
                timestamp: formatTimestamp(post.timestamp)
            }));
        } else {
            throw new Error('Instagram verisi bulunamadı');
        }
    } catch (error) {
        console.error('RapidAPI hatası:', error);
        throw error;
    }
}

function formatTimestamp(timestamp) {
    if (!timestamp) return 'Yakın zamanda';
    
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes} dakika önce`;
    if (hours < 24) return `${hours} saat önce`;
    if (days < 7) return `${days} gün önce`;
    
    return date.toLocaleDateString('tr-TR');
}

async function getMockInstagramPosts() {
    // Mock Instagram posts - gerçek API için değiştirilecek
    return [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
            caption: 'Almanya\'da eğitim fırsatları hakkında bilgi almak isteyenler için özel danışmanlık hizmeti veriyorum. 🇩🇪 #AlmanyaEğitimi #EğitimDanışmanlığı',
            likes: 45,
            comments: 12,
            timestamp: '2 saat önce'
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=400&fit=crop',
            caption: 'Hukuki danışmanlık hizmetlerimizle haklarınızı koruyoruz. Profesyonel çözümler için bize ulaşın. ⚖️ #HukukiDanışmanlık #Avukat',
            likes: 38,
            comments: 8,
            timestamp: '1 gün önce'
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=400&fit=crop',
            caption: 'Almanca dersleri ile dil becerilerinizi geliştirin. Birebir ve grup dersleri mevcuttur. 📚 #AlmancaDersleri #DilEğitimi',
            likes: 52,
            comments: 15,
            timestamp: '2 gün önce'
        },
        {
            id: 4,
            image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop',
            caption: 'Başarılı öğrencilerimizle gurur duyuyoruz! Almanya\'da eğitim hayallerinizi gerçekleştirmek için yanınızdayız. 🎓 #BaşarıHikayeleri',
            likes: 67,
            comments: 23,
            timestamp: '3 gün önce'
        },
        {
            id: 5,
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop',
            caption: 'Vize süreçlerinde uzman danışmanlık. Almanya\'ya gitmek isteyenler için kapsamlı rehberlik hizmeti. 🛂 #VizeDanışmanlığı',
            likes: 41,
            comments: 11,
            timestamp: '4 gün önce'
        }
    ];
}

function displayInstagramPosts(posts) {
    const instagramFeed = document.getElementById('instagramFeed');
    if (!instagramFeed) return;
    
    instagramFeed.innerHTML = '';
    
    posts.forEach(post => {
        const postElement = createInstagramPost(post);
        instagramFeed.appendChild(postElement);
    });
}

function createInstagramPost(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'instagram-post';
    postDiv.innerHTML = `
        <div class="instagram-post-image">
            <img src="${post.image}" alt="Instagram Post" loading="lazy" onerror="this.style.display='none'">
        </div>
        <div class="instagram-post-content">
            <div class="instagram-post-header">
                <div class="instagram-post-avatar">
                    <i class="fab fa-instagram"></i>
                </div>
                <div class="instagram-post-info">
                    <h4>@berkaylehrer</h4>
                    <span>${post.timestamp}</span>
                </div>
            </div>
            <div class="instagram-post-caption">
                ${post.caption}
            </div>
            <div class="instagram-post-stats">
                <div class="instagram-post-stat">
                    <i class="fas fa-heart"></i>
                    <span>${post.likes}</span>
                </div>
                <div class="instagram-post-stat">
                    <i class="fas fa-comment"></i>
                    <span>${post.comments}</span>
                </div>
            </div>
        </div>
    `;
    
    // Post'a tıklama efekti
    postDiv.addEventListener('click', () => {
        window.open(`https://instagram.com/berkaylehrer`, '_blank');
    });
    
    return postDiv;
}

function showInstagramError() {
    const instagramFeed = document.getElementById('instagramFeed');
    if (!instagramFeed) return;
    
    instagramFeed.innerHTML = `
        <div class="instagram-error">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Instagram gönderileri yüklenemedi</h3>
            <p>Lütfen daha sonra tekrar deneyin veya Instagram profilinizi ziyaret edin.</p>
            <a href="https://instagram.com/berkaylehrer" target="_blank" class="btn btn-primary">
                <i class="fab fa-instagram"></i>
                <span>Instagram'a Git</span>
            </a>
        </div>
    `;
}

// Add CSS for form validation
const style = document.createElement('style');
style.textContent = `
    .field-error {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        display: none;
    }
    
    .form-group input.valid,
    .form-group textarea.valid {
        border-color: #10b981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
    
    .form-group input.invalid,
    .form-group textarea.invalid {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .notification {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
`;
document.head.appendChild(style); 