// Modern JavaScript with enhanced features
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupLoadingScreen();
    setupMobileNavigation();
    setupSmoothScrolling();
    setupNavbarEffects();
    setupIntersectionObserver();
    setupFormHandling();
    setupCounterAnimations();
    setupParallaxEffects();
    setupCursorTrail();
    setupTypingEffect();
    setupScrollProgress();
    setupBackToTop();
    setupServiceCardEffects();
    setupSocialMediaEffects();
    setupPerformanceOptimizations();
    setupInstagramEmbeds();
    setupYouTubeEmbeds();
    
    console.log('🚀 Berkay Kan Website - All features initialized successfully!');
}

// Loading Screen
function setupLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (!loadingScreen) return;
    
    // Simulate loading progress
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
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
    const animateElements = document.querySelectorAll('.service-card, .stat-item, .contact-item, .about-content');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Form Handling
function setupFormHandling() {
    const contactForm = document.querySelector('#contactForm');
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
    const originalText = submitBtn.innerHTML;
    
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
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    
    setTimeout(() => {
        showNotification('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
        form.reset();
        submitBtn.innerHTML = originalText;
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
        showFieldError(field, `${fieldName} alanı zorunludur.`);
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Geçerli bir e-posta adresi giriniz.');
            return false;
        }
    }
    
    // Show success state
    field.classList.add('valid');
    hideFieldError(field);
    return true;
}

function clearValidation(e) {
    const field = e.target;
    field.classList.remove('valid', 'invalid');
    hideFieldError(field);
}

function showFieldError(field, message) {
    field.classList.add('invalid');
    const errorDiv = field.parentElement.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function hideFieldError(field) {
    const errorDiv = field.parentElement.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// Counter Animations
function setupCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            counter.textContent = Math.floor(current) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = target + '+';
        }
    };
    
    updateCounter();
}

// Parallax Effects
function setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero-background, .floating-card');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const rate = scrolled * (0.1 + index * 0.05);
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Cursor Trail Effect
function setupCursorTrail() {
    const cursorTrail = document.querySelector('.cursor-trail');
    if (!cursorTrail) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateTrail() {
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        
        cursorTrail.style.left = trailX + 'px';
        cursorTrail.style.top = trailY + 'px';
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}

// Typing Effect
function setupTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const titleLines = heroTitle.querySelectorAll('.title-line');
    titleLines.forEach((line, index) => {
        const text = line.textContent;
        line.textContent = '';
        
        setTimeout(() => {
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    line.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 100);
        }, index * 1000);
    });
}

// Scroll Progress
function setupScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--gradient-primary);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Back to Top
function setupBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--gradient-primary);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    document.body.appendChild(backToTop);
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
}

// Service Card Effects
function setupServiceCardEffects() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Social Media Effects
function setupSocialMediaEffects() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-3px) scale(1.1)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0) scale(1)';
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
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Handle scroll events
        }, 16);
    });
}

// Instagram Embeds
function setupInstagramEmbeds() {
    const instagramFeed = document.getElementById('instagramFeed');
    if (!instagramFeed) return;
    
    const instagramPosts = [
        {
            id: 'DMCmnEfMjyF',
            type: 'reel',
            embedUrl: 'https://www.instagram.com/reel/DMCmnEfMjyF/embed/',
            caption: 'Almanya\'da eğitim fırsatları hakkında bilgi almak isteyenler için özel danışmanlık hizmeti veriyorum. 🇩🇪 #AlmanyaEğitimi #EğitimDanışmanlığı',
            likes: 45,
            comments: 12,
            timestamp: '2 saat önce'
        },
        {
            id: 'DLzrIHJMIQq',
            type: 'reel',
            embedUrl: 'https://www.instagram.com/reel/DLzrIHJMIQq/embed/',
            caption: 'Almanya\'da üniversite eğitimi için gerekli belgeler ve başvuru süreçleri hakkında detaylı bilgi. 🎓 #AlmanyaÜniversite #EğitimDanışmanlığı',
            likes: 52,
            comments: 18,
            timestamp: '4 saat önce'
        },
        {
            id: 'DLw5Znws0dP',
            type: 'reel',
            embedUrl: 'https://www.instagram.com/reel/DLw5Znws0dP/embed/',
            caption: 'Almanca dil sınavları ve sertifika programları ile kariyerinizi geliştirin. 📚 #AlmancaSınavları #DilEğitimi',
            likes: 38,
            comments: 9,
            timestamp: '6 saat önce'
        },
        {
            id: 'DMNPRHbs_li',
            type: 'reel',
            embedUrl: 'https://www.instagram.com/reel/DMNPRHbs_li/embed/',
            caption: 'Almanya\'da çalışma vizesi ve iş bulma süreçleri hakkında uzman danışmanlık. 💼 #AlmanyaVizesi #İşDanışmanlığı',
            likes: 67,
            comments: 25,
            timestamp: '1 gün önce'
        },
        {
            id: 'DMKwOmAsw1_',
            type: 'reel',
            embedUrl: 'https://www.instagram.com/reel/DMKwOmAsw1_/embed/',
            caption: 'Hukuki danışmanlık hizmetlerimizle haklarınızı koruyoruz. Profesyonel çözümler için bize ulaşın. ⚖️ #HukukiDanışmanlık #Avukat',
            likes: 41,
            comments: 11,
            timestamp: '2 gün önce'
        },
        {
            id: 'DMIMLdJM7L9',
            type: 'reel',
            embedUrl: 'https://www.instagram.com/reel/DMIMLdJM7L9/embed/',
            caption: 'Başarılı öğrencilerimizle gurur duyuyoruz! Almanya\'da eğitim hayallerinizi gerçekleştirmek için yanınızdayız. 🎓 #BaşarıHikayeleri #EğitimBaşarısı',
            likes: 73,
            comments: 31,
            timestamp: '3 gün önce'
        }
    ];
    
    instagramPosts.forEach(post => {
        const postElement = createInstagramEmbedPost(post);
        instagramFeed.appendChild(postElement);
    });
}

function createInstagramEmbedPost(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'instagram-post';
    postDiv.setAttribute('data-type', post.type);
    
    postDiv.innerHTML = `
        <div class="instagram-post-media">
            <iframe 
                src="${post.embedUrl}" 
                class="instagram-embed"
                frameborder="0"
                scrolling="no"
                allowtransparency="true"
                allowfullscreen="true">
            </iframe>
            <div class="instagram-embed-overlay">
                <div class="embed-loading">
                    <div class="loading-spinner"></div>
                    <p>Instagram içeriği yükleniyor...</p>
                </div>
            </div>
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
                <p>${post.caption}</p>
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
    
    // Handle iframe load events
    const iframe = postDiv.querySelector('.instagram-embed');
    const overlay = postDiv.querySelector('.instagram-embed-overlay');
    
    // Set iframe attributes for better compatibility
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('frameborder', '0');
    
    iframe.addEventListener('load', () => {
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }, 1000); // Give more time for Instagram to load
    });
    
    iframe.addEventListener('error', () => {
        overlay.innerHTML = `
            <div class="embed-error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>İçerik yüklenemedi</p>
                <button class="btn btn-primary" onclick="this.parentElement.parentElement.style.display='none'">
                    Tekrar Dene
                </button>
            </div>
        `;
    });
    
    // Fallback for slow loading
    setTimeout(() => {
        if (overlay.style.display !== 'none') {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    }, 5000); // Hide overlay after 5 seconds if still visible
    
    return postDiv;
}

// YouTube Embed Setup
function setupYouTubeEmbeds() {
    const youtubeFeed = document.getElementById('youtubeFeed');
    if (!youtubeFeed) return;

    const youtubeVideos = [
        {
            videoId: 'h2seO_TI4B8',
            title: 'Almanya\'da Eğitim Rehberi - Bölüm 1',
            description: 'Almanya\'da eğitim almak isteyenler için kapsamlı rehber. Üniversite seçimi ve başvuru süreçleri.',
            views: 1250,
            likes: 89,
            timeAgo: '1 hafta önce'
        },
        {
            videoId: 'T-wx3MsCavA',
            title: 'Almanya Vize Başvurusu Nasıl Yapılır?',
            description: 'Almanya öğrenci vizesi başvuru süreci, gerekli belgeler ve püf noktaları hakkında detaylı bilgi.',
            views: 2100,
            likes: 156,
            timeAgo: '2 hafta önce'
        },
        {
            videoId: 'h2seO_TI4B8',
            title: 'Almanca Öğrenme Teknikleri',
            description: 'Almanca öğrenmek isteyenler için etkili teknikler ve pratik yöntemler paylaşıyorum.',
            views: 890,
            likes: 67,
            timeAgo: '3 hafta önce'
        },
        {
            videoId: 'T-wx3MsCavA',
            title: 'Almanya\'da Yaşam Maliyetleri',
            description: 'Almanya\'da öğrenci olarak yaşamanın maliyetleri ve bütçe planlaması hakkında gerçekçi bilgiler.',
            views: 1800,
            likes: 134,
            timeAgo: '1 ay önce'
        },
        {
            videoId: 'h2seO_TI4B8',
            title: 'Almanya\'da Hukuki Danışmanlık',
            description: 'Almanya\'da hukuki konularda danışmanlık hizmetleri ve yasal süreçler hakkında bilgi.',
            views: 950,
            likes: 78,
            timeAgo: '1 ay önce'
        },
        {
            videoId: 'T-wx3MsCavA',
            title: 'Almanya\'da Kariyer Fırsatları',
            description: 'Almanya\'da kariyer yapmak isteyenler için iş piyasası analizi ve fırsatlar.',
            views: 1500,
            likes: 112,
            timeAgo: '2 ay önce'
        }
    ];

    youtubeVideos.forEach(video => {
        const videoDiv = createYouTubePost(video);
        youtubeFeed.appendChild(videoDiv);
    });
}

function createYouTubePost(video) {
    const postDiv = document.createElement('div');
    postDiv.className = 'youtube-post';
    
    postDiv.innerHTML = `
        <div class="youtube-post-media">
            <iframe 
                class="youtube-embed" 
                src="https://www.youtube.com/embed/${video.videoId}?rel=0&modestbranding=1&controls=1&showinfo=0" 
                title="${video.title}"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
            <div class="youtube-embed-overlay">
                <div class="embed-loading">
                    <div class="loading-spinner"></div>
                    <p>Video yükleniyor...</p>
                </div>
            </div>
        </div>
        <div class="youtube-post-content">
            <div class="youtube-post-header">
                <div class="youtube-post-avatar">
                    <i class="fab fa-youtube"></i>
                </div>
                <div class="youtube-post-info">
                    <h4>Berkay Kan</h4>
                    <span>${video.timeAgo}</span>
                </div>
            </div>
            <div class="youtube-post-caption">
                <p><strong>${video.title}</strong></p>
                <p>${video.description}</p>
            </div>
            <div class="youtube-post-stats">
                <div class="youtube-post-stat">
                    <i class="fas fa-eye"></i>
                    <span>${video.views}</span>
                </div>
                <div class="youtube-post-stat">
                    <i class="fas fa-thumbs-up"></i>
                    <span>${video.likes}</span>
                </div>
            </div>
        </div>
    `;
    
    // Handle iframe load events
    const iframe = postDiv.querySelector('.youtube-embed');
    const overlay = postDiv.querySelector('.youtube-embed-overlay');
    
    // Set iframe attributes for better compatibility
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('frameborder', '0');
    
    iframe.addEventListener('load', () => {
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }, 1000);
    });
    
    iframe.addEventListener('error', () => {
        overlay.innerHTML = `
            <div class="embed-error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Video yüklenemedi</p>
                <button class="btn btn-primary" onclick="this.parentElement.parentElement.style.display='none'">
                    Tekrar Dene
                </button>
            </div>
        `;
    });
    
    // Fallback for slow loading
    setTimeout(() => {
        if (overlay.style.display !== 'none') {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    }, 5000);
    
    return postDiv;
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Scroll Functions
function scrollToServices() {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
        servicesSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Service Navigation
function navigateToService(url) {
    // Add loading animation
    document.body.style.cursor = 'wait';
    
    // Add transition effect
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(37, 99, 235, 0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.2rem;
        font-weight: 600;
    `;
    overlay.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yönlendiriliyor...';
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        window.location.href = url;
    }, 1000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Remove loading screen when page is loaded
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 2000);
    }
}); 