// Disable browser's automatic scroll restoration
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    const body = document.body;

    // Function to update theme icons
    function updateThemeIcons(isDark) {
        const icons = [];
        if (themeToggle) {
            icons.push(themeToggle.querySelector('i'));
        }
        if (mobileThemeToggle) {
            icons.push(mobileThemeToggle.querySelector('i'));
        }

        icons.forEach(icon => {
            if (icon) {
                if (isDark) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }
        });
    }

    // Function to toggle theme
    function toggleTheme() {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        updateThemeIcons(isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        updateThemeIcons(true);
    } else {
        updateThemeIcons(false);
    }

    // Add event listeners to both theme toggles
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }

    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Sub-menu toggle (all screen sizes)
    document.querySelectorAll('.nav-links > li.has-submenu > a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const parentLi = link.parentElement;
            parentLi.classList.toggle('active');
        });
    });

    // Nested sub-menu toggle (all screen sizes)
    document.querySelectorAll('.nav-links .submenu-parent').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const parentLi = link.closest('.has-submenu-2');
            if (parentLi) {
                parentLi.classList.toggle('active');
            }
        });
    });

    // Smooth scroll - CSS scroll-margin-top handles the offset automatically
    // No need for JavaScript scroll handling, browser will use CSS scroll-margin-top

    // Close mobile menu when clicking a link (but not sub-menu parent links)
    document.querySelectorAll('.nav-links > li:not(.has-submenu) > a, .nav-links .sub-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
            // Close all sub-menus
            document.querySelectorAll('.nav-links > li.has-submenu').forEach(li => {
                li.classList.remove('active');
            });
        });
    });

    // Close mobile menu when clicking a language link
    document.querySelectorAll('.mobile-language-links .language-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });

    // Tab Menu Functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    let currentTabIndex = 0;
    let autoTabInterval;

    function switchTab(targetTab, preserveScroll = true) {
        // Save current scroll position if we need to preserve it
        let scrollPosition = null;
        if (preserveScroll) {
            scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        }
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => {
            content.classList.remove('active');
            content.classList.remove('slide-out-left', 'slide-out-right');
        });

        // Find target tab index
        const targetIndex = Array.from(tabButtons).findIndex(btn => btn.dataset.tab === targetTab);
        
        // Add slide-out animation to current tab
        const currentContent = document.querySelector('.tab-content.active');
        if (currentContent) {
            const direction = targetIndex > currentTabIndex ? 'slide-out-right' : 'slide-out-left';
            currentContent.classList.add(direction);
            
            setTimeout(() => {
                currentContent.classList.remove('active', 'slide-out-left', 'slide-out-right');
            }, 250);
        }

        // Activate target tab
        setTimeout(() => {
            const targetButton = document.querySelector(`[data-tab="${targetTab}"]`);
            const targetContent = document.getElementById(`${targetTab}-tab`);
            
            if (targetButton && targetContent) {
                targetButton.classList.add('active');
                targetContent.classList.add('active');
                currentTabIndex = targetIndex;
                
                // Restore scroll position only if we need to preserve it
                if (preserveScroll && scrollPosition !== null) {
                    window.scrollTo({
                        top: scrollPosition,
                        behavior: 'instant'
                    });
                }
            }
        }, 250);
    }

    // Tab button click handlers
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            switchTab(targetTab);
            resetAutoTab(); // Reset auto-tab when user clicks
        });
    });

    // Auto-tab switching function
    function startAutoTab() {
        autoTabInterval = setInterval(() => {
            currentTabIndex = (currentTabIndex + 1) % tabButtons.length;
            const nextTab = tabButtons[currentTabIndex].dataset.tab;
            switchTab(nextTab);
        }, 30000); // 30 seconds
    }

    function resetAutoTab() {
        clearInterval(autoTabInterval);
        startAutoTab();
    }

    // Equalize tab content heights
    function equalizeTabHeights() {
        let maxHeight = 0;
        tabContents.forEach(content => {
            content.style.position = 'relative';
            content.style.visibility = 'visible';
            content.style.opacity = '1';
            const height = content.offsetHeight;
            if (height > maxHeight) {
                maxHeight = height;
            }
            content.style.position = '';
            content.style.visibility = '';
            content.style.opacity = '';
        });
        
        if (maxHeight > 0) {
            const tabWrapper = document.querySelector('.tab-content-wrapper');
            if (tabWrapper) {
                tabWrapper.style.minHeight = maxHeight + 'px';
            }
        }
    }

    // Equalize heights on load and resize
    if (tabButtons.length > 0) {
        equalizeTabHeights();
        window.addEventListener('resize', equalizeTabHeights);
        startAutoTab();
    }

    // Language Dropdown Functionality
    const languageDropdown = document.getElementById('languageDropdown');
    const languageDropdownCustom = document.querySelector('.language-dropdown-custom');
    const languageDropdownSelected = document.querySelector('.language-dropdown-selected');
    const languageOptions = document.querySelectorAll('.language-option');
    
    if (languageDropdown && languageDropdownCustom) {
        // Set current page as selected
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        languageDropdown.value = currentPage;
        
        // Update custom dropdown display
        const currentOption = Array.from(languageOptions).find(opt => opt.dataset.value === currentPage);
        if (currentOption) {
            const flag = currentOption.querySelector('.language-flag').src;
            const text = currentOption.querySelector('span').textContent;
            languageDropdownSelected.querySelector('.language-flag').src = flag;
            languageDropdownSelected.querySelector('.language-text').textContent = text;
        }

        // Toggle dropdown
        languageDropdownSelected.addEventListener('click', function(e) {
            e.stopPropagation();
            languageDropdownCustom.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!languageDropdownCustom.contains(e.target)) {
                languageDropdownCustom.classList.remove('active');
            }
        });

        // Handle option selection
        languageOptions.forEach(option => {
            option.addEventListener('click', function() {
                const value = this.dataset.value;
                const flag = this.querySelector('.language-flag').src;
                const text = this.querySelector('span').textContent;
                
                // Update display
                languageDropdownSelected.querySelector('.language-flag').src = flag;
                languageDropdownSelected.querySelector('.language-text').textContent = text;
                languageDropdown.value = value;
                
                // Close dropdown
                languageDropdownCustom.classList.remove('active');
                
                // Navigate
                window.location.href = value;
            });
        });
    }

    // Service Detail Popup
    const servicePopup = document.getElementById('servicePopup');
    const popupClose = document.querySelector('.popup-close');
    const popupOverlay = document.querySelector('.popup-overlay');
    const popupTitle = document.querySelector('.popup-title');
    const popupIcon = document.querySelector('.popup-icon');
    const popupContent = document.getElementById('popupContent');
    const detailButtons = document.querySelectorAll('.btn-detail');
    
    // Team popup elements
    const teamPopup = document.getElementById('teamPopup');
    const teamPopupClose = document.querySelector('.team-popup-close');
    const teamPopupOverlay = teamPopup ? teamPopup.querySelector('.popup-overlay') : null;
    const teamPopupImage = document.querySelector('.team-popup-image');
    const teamPopupName = document.querySelector('.team-popup-name');
    const teamPopupTitle = document.querySelector('.team-popup-title');
    const teamPopupContent = document.getElementById('teamPopupContent');
    const teamMembers = document.querySelectorAll('.team-member');

    // Detect page language
    function getPageLanguage() {
        const pathname = window.location.pathname;
        if (pathname.includes('index-en.html') || pathname.endsWith('/index-en.html')) return 'en';
        if (pathname.includes('index-de.html') || pathname.endsWith('/index-de.html')) return 'de';
        if (pathname.includes('index-ar.html') || pathname.endsWith('/index-ar.html')) return 'ar';
        return 'tr'; // default to Turkish
    }

    const currentLang = getPageLanguage();

    // Service content data - Multi-language
    const serviceContents = {
        tr: {
        'miras-hukuku': {
            icon: '<i class="fa-solid fa-scroll"></i>',
            title: 'Miras Hukuku',
            content: `
                <p>Miras hukuku, çoğu zaman insanların hayatında en hassas dönemlerden birinde gündeme gelir. İşin içine bir de iki farklı ülke, iki farklı hukuk sistemi girdiğinde süreç hem karmaşık hem de yorucu olabilir. Türk–Alman miras hukuku alanında sunduğumuz çalışmaların temel amacı, bu karmaşayı sadeleştirmek ve güvenli bir yol haritası sunmaktır.</p>
                
                <p>Almanya ile bağlantılı miras dosyalarında en sık karşılaşılan sorunlar; hangi ülke hukukunun uygulanacağı, mirasın hangi ülkede ve nasıl paylaşılacağı, taşınmazların durumu ve mirasçıların haklarının nasıl korunacağıdır. Bu soruların net cevapları olmadan atılan her adım, ileride ciddi hak kayıplarına yol açabilir.</p>
                
                <h3>Türk–Alman Miras Hukukunda Nasıl Çalışıyoruz?</h3>
                
                <p>Türk ve Alman hukuk sistemlerine hâkimiyet sayesinde, miras dosyalarını tek taraflı değil, bütüncül bir bakış açısıyla ele alıyoruz. Özellikle;</p>
                
                <ul>
                    <li>Almanya'da yaşayan Türk vatandaşlarının miras işlemleri</li>
                    <li>Türkiye'de malvarlığı bulunan, Almanya'da ikamet eden kişilerin mirası</li>
                    <li>Almanya'daki taşınmazların miras yoluyla devri</li>
                    <li>Hangi ülke hukukunun uygulanacağına ilişkin tespitler</li>
                    <li>Mirasçılık belgeleri, mirasın reddi ve paylaşım süreçleri</li>
                    <li>Uluslararası miras uyuşmazlıkları</li>
                </ul>
                
                <p>konularında hukuki destek sağlıyoruz.</p>
                
                <p>Her dosyada önceliğimiz, süreci gereksiz yere uzatmadan, mirasçıların haklarını koruyarak ve olası uyuşmazlıkları en baştan önleyerek ilerlemek.</p>
                
                <h3>Avrupa Birliği ve Alman Hukuku Perspektifi</h3>
                
                <p>Almanya bağlantılı miras dosyalarında, Avrupa Birliği Miras Tüzüğü (EU-Erbrechtsverordnung) ve Alman iç hukuku büyük önem taşır. Bu nedenle dosyalar yalnızca Türkiye'deki uygulamalarla değil, Almanya'daki güncel mevzuat ve uygulamalar ışığında değerlendirilir.</p>
                
                <p>Amaç, müvekkillerimizin "sonradan ortaya çıkan sürprizlerle" değil, öngörülebilir ve planlı bir süreçle karşılaşmasını sağlamaktır.</p>
                
                <h3>Neden Türk–Alman Miras Hukukunda Profesyonel Destek Önemlidir?</h3>
                
                <p>Miras hukuku, hataya açık bir alandır. Özellikle uluslararası dosyalarda yapılan küçük bir yanlış, yıllar sürecek davalara veya ciddi hak kayıplarına neden olabilir. Bu nedenle, hem Türk hem Alman hukukunu bilen bir hukukçu ile çalışmak, sürecin sağlıklı ilerlemesi açısından büyük avantaj sağlar.</p>
                
                <p>Bizim yaklaşımımız nettir: <strong>Anlaşılır iletişim, doğru hukuki tespit ve güvenli sonuç.</strong></p>
                
                <p>Türk–Alman miras hukuku alanında, süreci sizin adınıza yük olmaktan çıkarıyor; mümkün olduğunca sakin, şeffaf ve kontrollü bir şekilde ilerletiyoruz.</p>
            `
        },
        'bosanma-hukuku': {
            icon: '<i class="fa-solid fa-heart-crack"></i>',
            title: 'Boşanma Hukuku',
            content: `
                <p>Boşanma, çoğu insan için hayatın en zor kararlarından biridir. Bu süreçte yalnızca hukuki değil, duygusal olarak da yorucu bir dönem yaşanır. Bizim bu noktadaki yaklaşımımız nettir: <strong>Süreci daha sakin, daha kontrollü ve mümkün olduğunca yıpratmadan yönetmek.</strong></p>
                
                <p>Boşanma hukuku alanındaki çalışmalarımızda, her dosyayı kendi şartları içinde değerlendiriyor; tek tip çözümler yerine, kişiye özel ve gerçekçi bir yol haritası sunuyoruz.</p>
                
                <h3>Boşanma Sürecine Nasıl Yaklaşıyoruz?</h3>
                
                <p>Boşanma davalarında önceliğimiz, sürecin başından itibaren tarafları doğru şekilde bilgilendirmektir. Çünkü neyle karşı karşıya olduğunu bilmek, belirsizliği ve kaygıyı ciddi ölçüde azaltır.</p>
                
                <p>Bu kapsamda;</p>
                
                <ul>
                    <li>Anlaşmalı ve çekişmeli boşanma davaları</li>
                    <li>Nafaka, maddi ve manevi tazminat talepleri</li>
                    <li>Mal paylaşımı</li>
                    <li>Velayet ve çocukla kişisel ilişki düzenlemeleri</li>
                    <li>Almanya bağlantılı evlilik ve boşanma süreçleri</li>
                </ul>
                
                <p>konularında hukuki destek sunuyoruz.</p>
                
                <p>Amacımız, müvekkillerimizin haklarını korurken süreci gereksiz çatışmalara sürüklemeden ilerletmektir.</p>
                
                <h3>Çocuk Varsa, Öncelik Her Zaman Onlardır</h3>
                
                <p>Boşanma sürecinde çocukların durumu her zaman ayrı bir hassasiyet gerektirir. Bu nedenle velayet ve kişisel ilişki düzenlemelerinde yaklaşımımız nettir: <strong>Çocuğun üstün yararı.</strong></p>
                
                <p>Anne ve baba arasındaki anlaşmazlıkların, çocuklar üzerinde kalıcı bir yük oluşturmaması için hukuki süreci dikkatle ve dengeli şekilde yönetiyoruz.</p>
                
                <h3>Güven, Gizlilik ve Açık İletişim</h3>
                
                <p>Boşanma davalarında güven ve gizlilik esastır. Müvekkillerimizle aramızdaki ilişki; ön yargısız dinleme, açık iletişim ve mesleki gizlilik üzerine kuruludur.</p>
                
                <p>Süreci yalnızca hukuki yönüyle değil, insanî boyutuyla da ele alıyor; müvekkillerimizin kendilerini yalnız hissetmemelerini önemsiyoruz.</p>
                
                <h3>Boşanma Hukukunda Yaklaşımımız</h3>
                
                <p>Boşanma süreci bir mücadele alanı olmak zorunda değildir. Doğru hukuki yönlendirme ile bu süreci daha sağlıklı, daha hızlı ve daha az yıpratıcı şekilde tamamlamak mümkündür.</p>
                
                <p>Amacımız; bu süreci sizin adınıza yönetmek, belirsizliği azaltmak ve hayatınızın yeni dönemine daha sağlam adımlarla geçmenizi sağlamaktır.</p>
                
                <h3>Almanya Bağlantılı Boşanmalar: İki Hukuk Sistemi, Tek Süreç</h3>
                
                <p>Almanya bağlantılı evliliklerde boşanma süreci, klasik boşanma davalarından farklı olarak iki ülkenin hukuk sistemini ilgilendirebilir. Bu durum; sürecin nasıl yürütüleceği, hangi ülke mahkemelerinin yetkili olduğu ve hangi hukukun uygulanacağı gibi önemli soruları beraberinde getirir.</p>
                
                <p>Almanya bağlantılı boşanmalarda en sık karşılaşılan konular şunlardır:</p>
                
                <ul>
                    <li>Eşlerden birinin Almanya'da yaşıyor olması</li>
                    <li>Evliliğin Almanya'da yapılmış olması</li>
                    <li>Almanya'daki malvarlıkları</li>
                    <li>Çocukların Almanya'da ikamet etmesi</li>
                    <li>Almanya'da verilen boşanma kararlarının Türkiye'de tanınması ve tenfizi</li>
                </ul>
                
                <p>Bu tür dosyalarda yapılan küçük bir hata, sürecin uzamasına veya hak kayıplarına yol açabilir.</p>
                
                <h3>Almanya Bağlantılı Dosyalarda Nasıl Çalışıyoruz?</h3>
                
                <p>Türk ve Alman hukuk sistemlerine hâkimiyet sayesinde, dosyaları yalnızca Türkiye açısından değil, iki ülkeyi birlikte düşünerek ele alıyoruz. Amaç; müvekkillerimizin "sonradan ortaya çıkan sorunlarla" değil, öngörülebilir ve planlı bir süreçle karşılaşmasını sağlamaktır.</p>
                
                <p>Özellikle;</p>
                
                <ul>
                    <li>Yetkili mahkeme ve uygulanacak hukukun tespiti</li>
                    <li>Türkiye ve Almanya'daki boşanma süreçlerinin koordinasyonu</li>
                    <li>Velayet ve çocukla kişisel ilişki düzenlemeleri</li>
                    <li>Mal paylaşımı ve nafaka konuları</li>
                    <li>Tanıma ve tenfiz işlemleri</li>
                </ul>
                
                <p>konularında süreci baştan sona takip ediyoruz.</p>
                
                <h3>Yaklaşımımız</h3>
                
                <p>Almanya bağlantılı boşanmalarda yaklaşımımız nettir: <strong>Süreci gereksiz yere karmaşıklaştırmadan, açık iletişimle ve hukuki güven içinde yürütmek.</strong></p>
                
                <p>Boşanma süreci nerede ve nasıl başlarsa başlasın, amacımız müvekkillerimizin haklarını korumak ve bu süreci mümkün olduğunca sağlıklı şekilde tamamlamalarını sağlamaktır.</p>
            `
        },
        'ceza-hukuku': {
            icon: '<i class="fa-solid fa-gavel"></i>',
            title: 'Ceza Hukuku',
            content: `
                <h3>Türkiye'de Güvenilir, Kararlı ve İlkesel Savunma</h3>
                
                <p>Ceza hukuku, insanların en zor anlarında karşılaştıkları bir alandır. Suç isnadıyla karşı karşıya kalan kişi için çoğu zaman belirsizlik, korku ve yalnızlık duygusu ön plandadır. Bizim bu noktadaki yaklaşımımız nettir: <strong>Herkesin adil yargılanma ve etkili savunma hakkı vardır.</strong></p>
                
                <p>Türkiye'de yürütülen soruşturma ve kovuşturma süreçlerini hukuka uygun, disiplinli ve güvenilir bir şekilde takip ediyoruz. Dosyanın niteliği ne olursa olsun, savunma hakkının etkin biçimde kullanılmasını temel ilke olarak benimsiyoruz.</p>
                
                <h3>Savunma Hakkı Bir Tercih Değil, Hukukun Temelidir</h3>
                
                <p>Ceza hukukunda sıkça gözden kaçan ama en önemli nokta şudur: Bir kişinin hangi suçla itham edildiği değil, hukuk devletinin o kişiye nasıl davrandığı esastır.</p>
                
                <p>Bir avukat için savunma, suçun onaylanması değildir. Savunma; hukukun, adaletin ve usul güvencelerinin korunmasıdır.</p>
                
                <p>Bu nedenle yaklaşımımız şudur: <strong>Kişi neyle suçlanırsa suçlansın, savunulmayı hak eder.</strong> Bu hem Anayasa'nın hem de mesleğimizin bize yüklediği bir sorumluluktur.</p>
                
                <h3>Türkiye'de Ceza Süreçlerini Nasıl Yürütüyoruz?</h3>
                
                <p>Ceza hukuku dosyalarında süreci en başından itibaren titizlikle ele alıyoruz. Özellikle;</p>
                
                <ul>
                    <li>Soruşturma aşamasında ifade ve müdafilik</li>
                    <li>Gözaltı, tutuklama ve adli kontrol tedbirleri</li>
                    <li>Savcılık ve mahkeme aşamaları</li>
                    <li>Delil değerlendirmesi ve savunma stratejisinin kurulması</li>
                    <li>Hak ihlallerine karşı başvurular</li>
                </ul>
                
                <p>konularında süreci şeffaf ve kontrollü biçimde yürütüyoruz.</p>
                
                <p>Müvekkillerimizin, neyle karşı karşıya olduklarını net biçimde bilmelerini önemsiyoruz. Bu nedenle karmaşık ceza hukuku dili yerine, anlaşılır ve açık bir iletişim kuruyoruz.</p>
                
                <h3>Güvenilirlik ve Gizlilik</h3>
                
                <p>Ceza hukuku alanında güven, her şeyden önce gelir. Müvekkillerimizle aramızdaki ilişki;</p>
                
                <ul>
                    <li>Gizliliğe</li>
                    <li>Sadakate</li>
                    <li>Mesleki etik kurallara</li>
                </ul>
                
                <p>dayanır.</p>
                
                <p>Dosyanın içeriği ne olursa olsun, savunma görevi ciddiyetle, özenle ve ön yargısız şekilde yerine getirilir.</p>
                
                <h3>Ceza Hukukunda Yaklaşımımız</h3>
                
                <p>Bizim için ceza hukuku; yüksek sesle konuşmak değil, doğru yerde, doğru zamanda ve doğru argümanla konuşmaktır.</p>
                
                <p>Amaç; süreci gereksiz yere germek değil, hukuki zeminde güçlü ve dengeli bir savunma ortaya koymaktır.</p>
                
                <p>Türkiye'de yürütülen ceza soruşturmaları ve davalarında, müvekkillerimizin haklarını korumak ve süreci güvenilir şekilde yönetmek için buradayız.</p>
            `
        },
        'is-hukuku': {
            icon: '<i class="fa-solid fa-briefcase"></i>',
            title: 'İş Hukuku',
            content: `
                <p>Türkiye ve Almanya'da eş zamanlı faaliyet gösteren şirketler için iş hukuku, yalnızca mevzuat bilgisi değil; iki ülkenin çalışma kültürünü ve uygulama farklarını bilmek anlamına gelir.</p>
                
                <p>İş hukuku alanındaki çalışmalarımızda, Türkiye ve Almanya arasında personel istihdam eden, görevlendiren veya transfer eden şirketlere pratik ve uygulanabilir çözümler sunuyoruz. Amacımız; şirketlerin hukuki risklerini en baştan görmek ve yönetilebilir hale getirmektir.</p>
                
                <p>Özellikle;</p>
                
                <ul>
                    <li>Türkiye–Almanya arasında personel görevlendirmeleri</li>
                    <li>Almanya'da çalışacak personel için sözleşme ve izin süreçleri</li>
                    <li>İş sözleşmelerinin iki ülke hukukuna uyumlu hazırlanması</li>
                    <li>İşten ayrılma ve fesih süreçlerinin doğru planlanması</li>
                    <li>İş hukuku kaynaklı uyuşmazlıklar ve arabuluculuk süreçleri</li>
                </ul>
                
                <p>konularında şirketlerle yakın çalışıyoruz.</p>
                
                <p>Yaklaşımımız nettir: <strong>Hukuk işinizi yavaşlatmasın, güvenli şekilde ilerletsin.</strong></p>
            `
        },
        'ticaret-hukuku': {
            icon: '<i class="fa-solid fa-handshake"></i>',
            title: 'Ticaret Hukuku',
            content: `
                <p>Almanya ile iş yapan şirketler için ticaret hukuku, yalnızca sözleşme imzalamaktan ibaret değildir. Yanlış yapılandırılmış bir ticari ilişki, uzun vadede ciddi maddi ve hukuki riskler doğurabilir.</p>
                
                <p>Ticaret hukuku alanında, Türkiye ve Almanya'da faaliyet gösteren veya iki ülke arasında ticari ilişkiler kuran şirketlere;</p>
                
                <ul>
                    <li>Şirket kuruluşu ve yapılanma süreçleri</li>
                    <li>Ortaklık ve yatırım ilişkileri</li>
                    <li>Türkiye–Almanya arası ticari sözleşmeler</li>
                    <li>Şirketler arası uyuşmazlıklar</li>
                    <li>Alman hukuku ile temas eden ticari işlemler</li>
                </ul>
                
                <p>konularında danışmanlık sunuyoruz.</p>
                
                <p>Hedefimiz; şirketlerin Almanya pazarına girerken veya bu pazarda büyürken, hukuku koruyucu bir kalkan olarak kullanmalarını sağlamaktır.</p>
            `
        },
        'sozlesme-hukuku': {
            icon: '<i class="fa-solid fa-file-contract"></i>',
            title: 'Sözleşmeler Hukuku',
            content: `
                <p>Türkiye ve Almanya arasında yapılan sözleşmelerde en sık karşılaşılan sorunlardan biri şudur: Sözleşme bir ülkede "sorunsuz" görünürken, diğer ülkede ciddi riskler barındırabilir.</p>
                
                <p>Sözleşmeler hukuku çalışmalarımızda, iki ülke hukukunu birlikte değerlendiriyor; sözleşmeleri yalnızca bugünü değil, olası ihtilaf senaryolarını da düşünerek hazırlıyoruz.</p>
                
                <p>Bu kapsamda;</p>
                
                <ul>
                    <li>Türkiye–Almanya arası ticari sözleşmeler</li>
                    <li>İş sözleşmeleri ve yönetici sözleşmeleri</li>
                    <li>Distribütörlük, bayilik ve hizmet sözleşmeleri</li>
                    <li>Yetki, uygulanacak hukuk ve tahkim hükümleri</li>
                    <li>Sözleşme kaynaklı risk analizi</li>
                </ul>
                
                <p>konularında şirketlerle birebir çalışıyoruz.</p>
                
                <p>Amacımız çok net: <strong>İmza atmadan önce riskleri konuşmak, imzadan sonra sürpriz yaşamamak.</strong></p>
                
                <h3>Neden Türkiye–Almanya Arasında Faaliyet Gösteren Şirketler bizimle Çalışıyor?</h3>
                
                <p>Çünkü biz, dosyalara yalnızca "Türk hukuku" veya "Alman hukuku" penceresinden bakmıyoruz. Dosyalara iki sistemin kesiştiği noktadan bakıyoruz.</p>
                
                <ul>
                    <li>Türk ve Alman hukuk sistemlerine hâkimiyet</li>
                    <li>Almanya merkezli akademik ve mesleki altyapı</li>
                    <li>İş dünyasının hızına ayak uyduran pratik yaklaşım</li>
                    <li>Yönetici ve şirket sahipleriyle doğrudan, net iletişim</li>
                    <li>Hukuku, büyümeyi engelleyen değil büyümeyi güvence altına alan bir araç olarak gören bakış açısı</li>
                </ul>
                
                <p>Türkiye ve Almanya arasında iş yapan şirketler için amacımız; hukuki riskleri azaltmak, karar alma süreçlerini hızlandırmak ve uzun vadeli iş ilişkilerini sağlam zemine oturtmaktır.</p>
            `
        },
        'mesleki-denklik': {
            icon: '<i class="fa-solid fa-passport"></i>',
            title: 'Mesleki Denklik',
            content: `
                <p>Almanya'da çalışmak isteyen birçok kişi için en kritik adımlardan biri Anerkennung, yani mesleki denklik sürecidir. Bu süreç, çoğu zaman karmaşık görünür ve yanlış yönlendirmeler nedeniyle gereğinden fazla uzayabilir. Amacımız, bu süreci sizin için daha anlaşılır, planlı ve güvenli hale getirmektir.</p>
                
                <p>Anerkennung, yalnızca evrak tesliminden ibaret değildir. Hangi meslek grubuna başvurulacağı, hangi kurumun yetkili olduğu ve hangi yolun izleneceği baştan doğru belirlenmelidir. Aksi halde zaman ve motivasyon kaybı kaçınılmaz olur.</p>
                
                <h3>Denklik Sürecine Nasıl Yaklaşıyoruz?</h3>
                
                <p>Her adayın durumu farklıdır. Bu nedenle süreci tek tip bir şablonla değil, kişiye özel bir değerlendirme ile ele alıyoruz. İlk aşamada eğitim geçmişinizi, mesleki deneyiminizi ve hedeflerinizi inceliyoruz. Ardından Almanya'daki karşılığını ve izlenmesi gereken yolu netleştiriyoruz.</p>
                
                <p>Bu kapsamda;</p>
                
                <ul>
                    <li>Almanya'da denklik gerektiren mesleklerin tespiti</li>
                    <li>Yetkili denklik kurumunun belirlenmesi</li>
                    <li>Başvuru dosyasının hazırlanması</li>
                    <li>Eksik görülen alanlara ilişkin yol haritası</li>
                    <li>Uyum eğitimi (Anpassungslehrgang) veya bilgi sınavı süreçleri</li>
                </ul>
                
                <p>konularında danışmanlık sağlıyoruz.</p>
                
                <h3>Hangi Meslek Gruplarında Çalışıyoruz?</h3>
                
                <p>Anerkennung süreci özellikle sağlık, teknik ve akademik mesleklerde büyük önem taşır. Başlıca çalıştığımız alanlar arasında;</p>
                
                <ul>
                    <li>Hemşirelik ve sağlık meslekleri</li>
                    <li>Mühendislik alanları</li>
                    <li>Eczacılık</li>
                    <li>Öğretmenlik ve eğitim alanları</li>
                    <li>Diğer düzenlemeye tabi meslekler</li>
                </ul>
                
                <p>yer almaktadır.</p>
                
                <p>Her meslek grubunun denklik süreci farklıdır. Bu nedenle doğru başvuru yolunu baştan belirlemek, sürecin sağlıklı ilerlemesini sağlar.</p>
                
                <h3>Anerkennung ve Göç Süreci Birlikte Düşünülmeli</h3>
                
                <p>Denklik süreci çoğu zaman vize ve oturum süreçlerinden ayrı düşünülür. Oysa pratikte bu iki süreç birbirine doğrudan bağlıdır. Denklik sonucu, başvurulacak vize türünü ve Almanya'daki çalışma imkânlarını doğrudan etkiler.</p>
                
                <p>Bu nedenle Anerkennung sürecini, Almanya göç planınızın bir parçası olarak ele alıyoruz. Hedefimiz; yalnızca denklik almanızı değil, bu denklikle Almanya'da fiilen çalışabilir hale gelmenizi sağlamaktır.</p>
                
                <h3>Yaklaşımımız</h3>
                
                <p>Anerkennung sürecinde yaklaşımımız basittir: <strong>Doğru bilgi, doğru başvuru ve gerçekçi beklentiler.</strong></p>
                
                <p>Sizi gereksiz umutlara değil, somut ve ulaşılabilir bir yol haritasına yönlendiriyoruz. Süreci sizin adınıza takip ediyor, her aşamada sizi açık ve anlaşılır şekilde bilgilendiriyoruz.</p>
                
                <p>Almanya'da mesleğinizi icra edebilmeniz için gereken denklik sürecini, birlikte ve güvenle yönetmek için buradayız.</p>
            `
        },
        'ausbildung': {
            icon: '<i class="fa-solid fa-plane"></i>',
            title: 'Ausbildung',
            content: `
                <p>Almanya'da çalışmak ve kalıcı bir hayat kurmak isteyen birçok kişi için Ausbildung, en güvenli ve en gerçekçi yollardan biridir. Ausbildung; Almanya'da bir meslek öğrenirken aynı zamanda çalışmanızı ve maaş almanızı sağlayan resmî bir mesleki eğitim sistemidir.</p>
                
                <p>Bu süreçte hem teorik eğitim alırsınız hem de bir işyerinde pratik yaparsınız. Yani sadece okulda değil, gerçek iş hayatının içinde öğrenirsiniz.</p>
                
                <h3>Ausbildung Kimler İçin Uygundur?</h3>
                
                <p>Ausbildung özellikle;</p>
                
                <ul>
                    <li>Üniversite mezunu olup yaptığı işten memnun olmayanlar</li>
                    <li>Meslek sahibi olmak isteyenler</li>
                    <li>Almanya'da uzun vadeli kalmayı hedefleyenler</li>
                    <li>Gençler ve kariyerine yeni yön vermek isteyenler</li>
                    <li>Avrupa'da sıfırdan yeni bir hayata başlamak isteyenler</li>
                </ul>
                
                <p>için çok güçlü bir seçenektir.</p>
                
                <p>Birçok meslek için yüksek akademik şartlar aranmaz. Lise mezuniyeti yeterlidir. Açık öğretim liseleri dahi kabul edilir. Almanca seviyesi ve doğru başvuru planı çoğu zaman yeterlidir. Genellikle istenen Almanca seviyesi B1'dir. Bu konuda da Yabancı Dil Akademisiyle yaptığımız işbirliği sonucu sizlere yardımcı olmaktayız.</p>
                
                <h3>Ausbildung Sürecine Nasıl Yaklaşıyoruz?</h3>
                
                <p>Ausbildung başvurularını yalnızca "bir okul bulmak" olarak görmüyoruz. Süreci baştan sona planlıyoruz.</p>
                
                <p>Bu kapsamda;</p>
                
                <ul>
                    <li>Size uygun meslek alanlarının belirlenmesi</li>
                    <li>Almanca seviyenize göre doğru yolun seçilmesi</li>
                    <li>Başvuru dosyasının hazırlanması</li>
                    <li>Vize sürecinin planlanması</li>
                    <li>Almanya'ya uyum sürecinin yönetilmesi</li>
                </ul>
                
                <p>konularında adım adım destek sunuyoruz.</p>
                
                <p>Amacımız, süreci sizin için anlaşılır, güvenli ve sürdürülebilir hale getirmek.</p>
                
                <h3>Ausbildung ve Anpassungslehrgang Arasındaki Fark Nedir?</h3>
                
                <p>Bu iki kavram sıkça karıştırılır. Aslında çok net bir fark vardır.</p>
                
                <h3>Ausbildung Nedir?</h3>
                
                <ul>
                    <li>Sıfırdan meslek öğrenme sürecidir.</li>
                    <li>Almanya'da bir meslek eğitimi alırsınız.</li>
                    <li>Eğitim sırasında maaş alırsınız.</li>
                    <li>Eğitim süresi genellikle 2–3 yıl arasındadır.</li>
                    <li>Eğitim sonunda Almanya'da resmî bir meslek diploması elde edersiniz.</li>
                </ul>
                
                <p>Ausbildung, Almanya'da bir meslek sahibi olmak isteyen kişiler içindir.</p>
                
                <h3>Anpassungslehrgang Nedir?</h3>
                
                <ul>
                    <li>Zaten bir mesleğiniz varsa söz konusu olur.</li>
                    <li>Almanya, eğitiminizi kısmen tanır ama "tam eşdeğer" bulmaz.</li>
                    <li>Eksik görülen kısımları tamamlamanız istenir.</li>
                    <li>Bu süreç genellikle daha kısa sürelidir.</li>
                    <li>Amaç, mevcut mesleğinizi Almanya'ya uyarlamaktır.</li>
                </ul>
                
                <p>Anpassungslehrgang, "yeniden meslek öğrenmek" değil; mevcut mesleği Almanya standartlarına tamamlamak anlamına gelir.</p>
                
                <h3>Kısaca Özetlersek</h3>
                
                <ul>
                    <li>Mesleğiniz yoksa → Ausbildung</li>
                    <li>Mesleğiniz var ama denklik tam değilse → Anpassungslehrgang</li>
                </ul>
                
                <p>Doğru yolu seçmek, zaman ve emek kaybını önler.</p>
                
                <h3>Hangi Yolun Size Uygun Olduğunu Birlikte Belirliyoruz</h3>
                
                <p>Ausbildung mu, yoksa Anpassungslehrgang mı? Bu sorunun cevabı herkese göre değişir.</p>
                
                <p>Biz, baştan yanlış bir yola girmenizi değil; size gerçekten uygun olan yolu seçmenizi önemsiyoruz. Eğitim geçmişinizi, deneyiminizi ve hedeflerinizi birlikte değerlendiriyor; Almanya'da karşılığı olan en doğru planı oluşturuyoruz.</p>
                
                <p>Amacımız, Almanya'ya giden yolunuzu net, gerçekçi ve güvenli hale getirmek.</p>
            `
        },
        'aile-birlesimi-vizesi': {
            icon: '<i class="fa-solid fa-users"></i>',
            title: 'Aile Birleşimi Vizesi',
            content: `
                <p>Almanya'da yaşayan birçok kişi için en büyük ihtiyaçlardan biri, ailesiyle aynı ülkede yaşayabilmektir. Aile birleşimi vizesi, bu ihtiyaca yönelik olarak düzenlenmiş, ancak kendi içinde farklı türleri ve şartları olan bir vize türüdür.</p>
                
                <p>Aile birleşimi süreci, çoğu zaman duygusal olduğu kadar karmaşık da olabilir. Amacımız, bu süreci sizin için daha anlaşılır, planlı ve güvenli hale getirmektir.</p>
                
                <h3>Aile Birleşimi Vizesi Sadece Eş İçin mi?</h3>
                
                <p>Hayır. Aile birleşimi vizesi çoğu zaman sadece eş için bilinse de, belirli şartlar altında farklı aile üyeleri için de uygulanabilir. Ancak her aile üyesi için şartlar ve süreçler farklıdır.</p>
                
                <p>Bu nedenle başvuru türünün baştan doğru belirlenmesi büyük önem taşır.</p>
                
                <h3>Aile Birleşimi Vizesi Türleri</h3>
                
                <h3>1. Eş Üzerinden Aile Birleşimi</h3>
                
                <p>En sık karşılaşılan aile birleşimi türüdür. Almanya'da yasal olarak yaşayan kişinin, evli olduğu eşini Almanya'ya getirmesini kapsar.</p>
                
                <p>Genel olarak;</p>
                
                <ul>
                    <li>Resmî ve geçerli bir evlilik</li>
                    <li>Almanya'daki eşin yasal oturum izni</li>
                    <li>Yeterli konut ve gelir şartlarının sağlanması</li>
                    <li>Türkiye'den başvuran eş için temel Almanca (genellikle A1)</li>
                </ul>
                
                <p>aranır.</p>
                
                <p>Her dosya kendi özelinde değerlendirilir ve küçük detaylar sürecin sonucunu doğrudan etkileyebilir.</p>
                
                <h3>2. Çocuk Üzerinden Aile Birleşimi</h3>
                
                <p>Almanya'da yaşayan ebeveynin, çocuğunu Almanya'ya getirmesi ya da Almanya'daki çocuk üzerinden ebeveynin başvuruda bulunması mümkün olabilir.</p>
                
                <p>Bu tür başvurularda;</p>
                
                <ul>
                    <li>Çocuğun yaşı</li>
                    <li>Velayet durumu</li>
                    <li>Ebeveynin hukuki statüsü</li>
                </ul>
                
                <p>belirleyici rol oynar.</p>
                
                <p>Özellikle reşit olmayan çocuklar söz konusu olduğunda süreç daha hassas yürütülmelidir.</p>
                
                <h3>3. Ebeveyn Üzerinden Aile Birleşimi (İstisnai Haller)</h3>
                
                <p>Anne ve baba için aile birleşimi, genel kural olarak daha sınırlıdır. Ancak istisnai durumlarda mümkündür.</p>
                
                <p>Örneğin;</p>
                
                <ul>
                    <li>Almanya'daki kişinin küçük yaşta bir çocuk olması</li>
                    <li>Ebeveyn bakımına muhtaçlık</li>
                    <li>Ağır sağlık veya özel bakım gereksinimleri</li>
                </ul>
                
                <p>gibi durumlarda başvuru yolu açılabilir.</p>
                
                <p>Bu tür dosyalar, güçlü hukuki gerekçelendirme gerektirir.</p>
                
                <h3>4. Diğer Aile Üyeleri İçin Aile Birleşimi</h3>
                
                <p>Kardeşler veya diğer yakın akrabalar için aile birleşimi, genel olarak istisnai kabul edilir. Ancak çok özel ve zorlayıcı insani durumlarda değerlendirmeye alınabilir.</p>
                
                <p>Bu tür başvurularda, hukuki çerçevenin doğru kurulması ve dosyanın çok dikkatli hazırlanması gerekir.</p>
                
                <h3>Aile Birleşimi Sürecine Nasıl Yaklaşıyoruz?</h3>
                
                <p>Aile birleşimi başvurularını yalnızca evrak toplama süreci olarak görmüyoruz. Her dosyada;</p>
                
                <ul>
                    <li>Hangi aile birleşimi türünün uygun olduğunu</li>
                    <li>Şartların karşılanıp karşılanmadığını</li>
                    <li>Olası riskleri ve güçlü yönleri</li>
                </ul>
                
                <p>başından itibaren değerlendiriyoruz.</p>
                
                <p>Amacımız, süreci başlatmadan önce gerçekçi bir tablo ortaya koymak ve müvekkillerimizi doğru şekilde yönlendirmektir.</p>
                
                <h3>Yaklaşımımız</h3>
                
                <p>Aile birleşimi, hukuki olduğu kadar insani bir süreçtir. Bu nedenle yaklaşımımız her zaman açıktır: <strong>Net bilgi, gerçekçi beklenti ve güvenli ilerleme.</strong></p>
                
                <p>Sevdiklerinizle Almanya'da yeniden bir araya gelme sürecini, birlikte ve hukuka uygun şekilde yürütmek için buradayız.</p>
            `
        },
        'egitim-sureci': {
            icon: '<i class="fa-solid fa-graduation-cap"></i>',
            title: 'Eğitim Süreci',
            content: `
                <p>Almanya'ya giden yolun en önemli adımlarından biri doğru ve sürdürülebilir Almanca eğitimi almaktır. Vize, Ausbildung, denklik veya aile birleşimi süreçlerinin neredeyse tamamında dil yeterliliği belirleyici rol oynar. Bu nedenle Almanca eğitimini, göç sürecinden ayrı değil; bu sürecin temel bir parçası olarak ele alıyoruz.</p>
                
                <p>Bu kapsamda, uzun yıllardır dil eğitimi alanında faaliyet gösteren Yabancı Dil Akademisi ile yakın ve koordineli bir şekilde çalışıyoruz.</p>
                
                <h3>Neden Yabancı Dil Akademisi ile Çalışıyoruz?</h3>
                
                <p>Yabancı Dil Akademisi, Almanca eğitiminde tecrübeli eğitmen kadrosu, sistemli müfredatı ve sınav odaklı yaklaşımıyla öne çıkan bir kurumdur. Bizim için önemli olan, adayların yalnızca Almanca öğrenmesi değil; hedefledikleri sürece gerçekten hazır hale gelmeleridir.</p>
                
                <p>Bu iş birliği sayesinde;</p>
                
                <ul>
                    <li>Almanya göç planı ile uyumlu Almanca eğitim programları</li>
                    <li>Ausbildung, denklik ve aile birleşimi için gereken dil seviyelerine yönelik yönlendirme</li>
                    <li>Adayın mevcut seviyesine göre gerçekçi bir dil yol haritası</li>
                    <li>Sınav süreçlerine (A1–B1 ve üzeri) bilinçli hazırlık</li>
                </ul>
                
                <p>sağlıyoruz.</p>
                
                <h3>Hukuk ve Dil Eğitimi Birlikte Planlanıyor</h3>
                
                <p>En sık yapılan hatalardan biri, Almanca eğitimine hedef netleşmeden başlamaktır. Oysa dil seviyesi, hangi vize türüne başvurulacağını ve sürecin ne kadar süreceğini doğrudan etkiler.</p>
                
                <p>Yabancı Dil Akademisi ile yaptığımız ortak çalışmalarda;</p>
                
                <ul>
                    <li>Önce adayın hedefi belirlenir</li>
                    <li>Ardından gerekli Almanca seviyesi netleştirilir</li>
                    <li>Dil eğitimi ile hukuki süreçler eş zamanlı planlanır</li>
                </ul>
                
                <p>Böylece adaylar, gereksiz zaman ve motivasyon kaybı yaşamadan ilerler.</p>
                
                <h3>Kimler İçin Uygun?</h3>
                
                <p>Bu ortak danışmanlık modeli özellikle;</p>
                
                <ul>
                    <li>Almanya'ya gitmeyi hedefleyen öğrenciler</li>
                    <li>Ausbildung düşünen adaylar</li>
                    <li>Denklik sürecine girecek meslek sahipleri</li>
                    <li>Aile birleşimi vizesine başvuracak kişiler</li>
                </ul>
                
                <p>için büyük avantaj sağlar.</p>
                
                <p>Her adayın dili öğrenme hızı ve ihtiyacı farklıdır. Bu nedenle hazır paketler yerine, kişiye özel bir plan oluşturulur.</p>
                
                <h3>Amacımız</h3>
                
                <p>Amacımız, Almanca eğitimini yalnızca bir kurs süreci olmaktan çıkarıp, Almanya yolculuğunun sağlam bir temeli haline getirmektir.</p>
                
                <p>Hukuki danışmanlık ile dil eğitimini bir araya getirerek, adayların süreci daha bilinçli, daha güvenli ve daha hızlı ilerletmelerini sağlıyoruz.</p>
                
                <p>Almanya hedefiniz varsa, dili ve hukuku ayrı ayrı değil, birlikte planlamak için buradayız.</p>
            `
        },
        'calisma-ve-oturum-izni': {
            icon: '<i class="fa-solid fa-building"></i>',
            title: 'Çalışma ve Oturum İzni',
            content: `
                <p>Almanya'da çalışmak isteyen birçok kişi için en büyük soru şudur: <strong>"Benim için hangi oturum türü doğru?"</strong></p>
                
                <p>Mavi Kart (Blue Card) ve Aufenthaltsgesetz §18a ile §18b, Almanya'da çalışmak ve yaşamak isteyen nitelikli kişiler için düzenlenmiş farklı yollardır. Her biri farklı şartlara hitap eder ve doğru seçilmediğinde süreç uzayabilir veya olumsuz sonuçlanabilir.</p>
                
                <p>Amacımız, sizi karmaşık mevzuat içinde kaybettirmek değil; size gerçekten uygun olan yolu netleştirmektir.</p>
                
                <h3>Mavi Kart (EU Blue Card): Nitelikli Uzmanlar İçin</h3>
                
                <p>Mavi Kart, Almanya'da yüksek nitelikli çalışanlar için tasarlanmış bir oturum iznidir. Özellikle üniversite mezunları ve uzman meslek sahipleri için avantajlı bir yoldur.</p>
                
                <p>Genel olarak Mavi Kart için;</p>
                
                <ul>
                    <li>Üniversite diploması</li>
                    <li>Almanya'da tanınan (denk) bir eğitim</li>
                    <li>Almanya'dan alınmış bir iş sözleşmesi</li>
                    <li>Belirli bir asgari maaş şartı</li>
                </ul>
                
                <p>aranır.</p>
                
                <p>Mavi Kart'ın en önemli avantajları:</p>
                
                <ul>
                    <li>Daha hızlı ve güçlü bir oturum statüsü</li>
                    <li>Kalıcı oturuma geçişin daha kolay olması</li>
                    <li>Aile birleşiminde kolaylıklar</li>
                    <li>Almanya içinde iş değişikliğinde daha fazla esneklik</li>
                </ul>
                
                <p>Özetle Mavi Kart, Almanya'da kariyerini uzun vadeli planlayanlar için güçlü bir seçenektir.</p>
                
                <h3>Aufenthaltsgesetz §18a: Mesleki Eğitim Sahipleri İçin</h3>
                
                <p>§18a, üniversite mezunu olmayan ancak mesleki eğitime sahip kişiler için düzenlenmiştir.</p>
                
                <p>Bu kapsam özellikle;</p>
                
                <ul>
                    <li>Ausbildung mezunları</li>
                    <li>Teknik ve uygulamalı meslek sahipleri</li>
                    <li>Almanya'da talep gören ara elemanlar</li>
                </ul>
                
                <p>için uygundur.</p>
                
                <p>Bu yol, "akademik kariyerim yok ama mesleğim var" diyenler için Almanya'ya açılan kapıdır.</p>
                
                <h3>Aufenthaltsgesetz §18b: Akademik Eğitim Sahipleri İçin</h3>
                
                <p>§18b ise üniversite mezunları için düzenlenmiştir. Mavi Kart'a benzer şekilde akademik eğitim esas alınır; ancak her §18b başvurusu Mavi Kart olmak zorunda değildir.</p>
                
                <p>Kısaca;</p>
                
                <ul>
                    <li>Üniversite mezunları</li>
                    <li>Mavi Kart maaş şartını henüz karşılamayanlar</li>
                    <li>Almanya'da akademik bir meslekle çalışmak isteyenler</li>
                </ul>
                
                <p>için alternatif bir yoldur.</p>
                
                <p>§18b, özellikle kariyerinin başındaki profesyoneller için geçiş niteliğinde bir oturum izni olarak değerlendirilir.</p>
                
                <h3>Mavi Kart, §18a ve §18b Arasındaki Farkı Basitçe Özetlersek</h3>
                
                <ul>
                    <li>Mesleki eğitim varsa (Ausbildung) → §18a</li>
                    <li>Üniversite mezunuysan → §18b</li>
                    <li>Üniversite mezunu + yüksek maaşlı iş → Mavi Kart</li>
                </ul>
                
                <p>Doğru yol, sizin eğitiminize, mesleğinize ve Almanya'daki iş teklifinize göre belirlenir.</p>
                
                <h3>Sürece Nasıl Yaklaşıyoruz?</h3>
                
                <p>Bu başvuruları yalnızca "hangi maddeye başvuracağız?" diye ele almıyoruz. Her dosyada;</p>
                
                <ul>
                    <li>Eğitim ve mesleki geçmişinizi</li>
                    <li>Denklik durumunuzu</li>
                    <li>İş sözleşmesini</li>
                    <li>Uzun vadeli Almanya planınızı</li>
                </ul>
                
                <p>birlikte değerlendiriyoruz.</p>
                
                <p>Amacımız, bugün doğru başvuruyu yaparken; yarın kalıcı oturum ve vatandaşlık yolunu da açık bırakmak.</p>
                
                <h3>Yaklaşımımız</h3>
                
                <p>Almanya'da çalışma ve oturum, tek bir formdan ibaret değildir. Doğru maddeyle başvurmak, sürecin kaderini belirler.</p>
                
                <p>Biz sizi en kolay yola değil, en doğru ve sürdürülebilir yola yönlendiriyoruz.</p>
                
                <p>Almanya'da çalışmak ve yaşamak istiyorsanız, Mavi Kart, §18a ve §18b süreçlerini birlikte, güvenle ve bilinçli şekilde yönetmek için buradayız.</p>
            `
        },
        'sirket-kurulumu': {
            icon: '<i class="fa-solid fa-globe"></i>',
            title: 'Şirket Kurulumu',
            content: `
                <p>Almanya'da kendi işinizi kurmak isteyen birçok kişi için en büyük soru şudur: <strong>"Benim için hangi şirket türü doğru?"</strong></p>
                
                <p>GmbH (Gesellschaft mit beschränkter Haftung), UG (Unternehmergesellschaft) ve Şahıs Şirketi (Einzelunternehmen) Almanya'da girişimciler için en yaygın seçeneklerdir. Her biri farklı sermaye ve sorumluluk şartlarına sahiptir; doğru şirket türü tercih edilmediğinde süreç uzayabilir veya ileride mali riskler doğurabilir.</p>
                
                <p>Amacımız, sizi resmi prosedür karmaşasında kaybettirmek değil; sizin iş hedeflerinize gerçekten uygun yolu netleştirmek.</p>
                
                <h3>GmbH: Güçlü ve Kurumsal Bir Yapı</h3>
                
                <p>GmbH, Almanya'da orta ve büyük ölçekli iş fikirleri için tasarlanmış klasik bir şirket türüdür. Özellikle yatırımcılarla çalışmayı planlayan ve kurumsal bir imaj yaratmak isteyen girişimciler için avantajlıdır.</p>
                
                <p>Genel olarak GmbH için:</p>
                
                <ul>
                    <li>En az 25.000 € sermaye (başlangıçta 12.500 € yatırmak yeterli)</li>
                    <li>Resmi kuruluş sözleşmesi</li>
                    <li>Almanya'da geçerli bir adres</li>
                </ul>
                
                <p>gerekir.</p>
                
                <p>GmbH'nin avantajları:</p>
                
                <ul>
                    <li>Yatırımcı ve banka güveni açısından güçlü statü</li>
                    <li>Sınırlı sorumluluk: Şirket borçları kişisel malvarlığınızı etkilemez</li>
                    <li>Kurumsal imaj ve marka değeri yüksek</li>
                    <li>Büyük projelerde resmi olarak daha tercih edilen yapı</li>
                </ul>
                
                <p>Özetle GmbH, Almanya'da uzun vadeli ve kurumsal bir iş hedefleyenler için güçlü bir seçenektir.</p>
                
                <h3>UG: Başlangıç İçin Esnek ve Uygun</h3>
                
                <p>UG, yani "mini-GmbH", daha küçük sermaye ile hızlı bir şekilde iş kurmak isteyenler için ideal bir modeldir. "Start-up ruhu var ama sermaye sınırlı" diyen girişimciler için tasarlanmıştır.</p>
                
                <p>Bu kapsam özellikle:</p>
                
                <ul>
                    <li>İlk aşamada düşük maliyetle iş kurmak isteyenler</li>
                    <li>Riskleri minimumda tutmak isteyenler</li>
                    <li>Hızlı şekilde piyasaya girmeyi planlayan girişimciler</li>
                </ul>
                
                <p>için uygundur.</p>
                
                <p>UG, GmbH'ye dönüşebilir. Dolayısıyla başlangıçta esnek bir yapı kurarken, iş büyüdüğünde kurumsal yapıya geçiş şansı sunar.</p>
                
                <h3>Şahıs Şirketi (Einzelunternehmen): Hızlı ve Kolay Başlangıç</h3>
                
                <p>Şahıs şirketi, Almanya'da girişimciliğe en hızlı adımı atmanızı sağlayan yapıdır. Tek kişilik işletmeler için uygundur ve bürokratik süreçler GmbH veya UG'ye göre çok daha basittir.</p>
                
                <p>Özellikle:</p>
                
                <ul>
                    <li>Küçük çaplı hizmet veya ticari işler</li>
                    <li>Hızlı başlangıç ve düşük maliyet</li>
                    <li>Daha az resmi yükümlülük</li>
                </ul>
                
                <p>için idealdir.</p>
                
                <p>Avantajları:</p>
                
                <ul>
                    <li>Hemen faaliyete başlayabilirsiniz</li>
                    <li>Kuruluş maliyeti düşük</li>
                    <li>Vergi ve muhasebe işlemleri basit</li>
                </ul>
                
                <p><strong>Dikkat:</strong> Şahıs şirketlerinde sınırlı sorumluluk yoktur; yani şirket borçları doğrudan kişisel malvarlığınızı etkileyebilir.</p>
                
                <h3>Farkı Basitçe Özetlersek:</h3>
                
                <ul>
                    <li>Sermaye yüksek + kurumsal hedef → GmbH</li>
                    <li>Sermaye düşük + esnek başlangıç → UG</li>
                    <li>Tek kişi, hızlı ve basit → Şahıs Şirketi</li>
                </ul>
                
                <p>Doğru yol, sizin iş planınıza, sermayenize ve büyüme hedefinize göre belirlenir.</p>
                
                <h3>Sürece Nasıl Yaklaşıyoruz?</h3>
                
                <p>Bu süreçleri yalnızca "hangi şirket türü açacağız?" diye ele almıyoruz. Her dosyada:</p>
                
                <ul>
                    <li>İş fikrinizi ve sektörü</li>
                    <li>Sermaye durumunuzu</li>
                    <li>Almanya'daki adres ve resmi kayıt sürecinizi</li>
                    <li>Uzun vadeli büyüme ve vergi planınızı</li>
                </ul>
                
                <p>birlikte değerlendiriyoruz.</p>
                
                <p>Amacımız, bugün şirketinizi doğru şekilde kurarken; yarın yatırım, genişleme ve sürdürülebilirlik yollarını da açık bırakmak.</p>
                
                <h3>Yaklaşımımız</h3>
                
                <p>Almanya'da şirket kurmak sadece resmi belgeleri doldurmak değildir. Doğru şirket türünü seçmek, sürecin kaderini belirler.</p>
                
                <p>Biz sizi en kolay yola değil, en doğru ve sürdürülebilir yola yönlendiriyoruz.</p>
                
                <p>Almanya'da işinizi kurmak, büyütmek ve uzun vadede başarıya taşımak istiyorsanız, GmbH, UG ve Şahıs Şirketi süreçlerini birlikte, güvenle ve bilinçli şekilde yönetmek için buradayız.</p>
            `
        }
        },
        en: {
        'miras-hukuku': {
            icon: '<i class="fa-solid fa-scroll"></i>',
            title: 'Inheritance Law',
            content: '<p>Content will be added here.</p>'
        },
        'bosanma-hukuku': {
            icon: '<i class="fa-solid fa-heart-crack"></i>',
            title: 'Divorce Law',
            content: '<p>Content will be added here.</p>'
        },
        'ceza-hukuku': {
            icon: '<i class="fa-solid fa-gavel"></i>',
            title: 'Criminal Law',
            content: '<p>Content will be added here.</p>'
        },
        'is-hukuku': {
            icon: '<i class="fa-solid fa-briefcase"></i>',
            title: 'Labor Law',
            content: '<p>Content will be added here.</p>'
        },
        'ticaret-hukuku': {
            icon: '<i class="fa-solid fa-handshake"></i>',
            title: 'Commercial Law',
            content: '<p>Content will be added here.</p>'
        },
        'sozlesme-hukuku': {
            icon: '<i class="fa-solid fa-file-contract"></i>',
            title: 'Contract Law',
            content: '<p>Content will be added here.</p>'
        },
        'mesleki-denklik': {
            icon: '<i class="fa-solid fa-passport"></i>',
            title: 'Professional Recognition (ANERKENNUNG)',
            content: '<p>Content will be added here.</p>'
        },
        'ausbildung': {
            icon: '<i class="fa-solid fa-plane"></i>',
            title: 'Ausbildung: A Profession, A Future in Germany',
            content: '<p>Content will be added here.</p>'
        },
        'aile-birlesimi-vizesi': {
            icon: '<i class="fa-solid fa-users"></i>',
            title: 'Germany Family Reunification Visa: Together Again with Your Loved Ones',
            content: '<p>Content will be added here.</p>'
        },
        'egitim-sureci': {
            icon: '<i class="fa-solid fa-graduation-cap"></i>',
            title: 'German Language Education Process',
            content: '<p>Content will be added here.</p>'
        },
        'calisma-ve-oturum-izni': {
            icon: '<i class="fa-solid fa-building"></i>',
            title: 'Work and Residence Permit in Germany: Blue Card and Skilled Immigration Act',
            content: '<p>Content will be added here.</p>'
        },
        'sirket-kurulumu': {
            icon: '<i class="fa-solid fa-globe"></i>',
            title: 'Company Formation in Germany',
            content: '<p>Content will be added here.</p>'
        }
        },
        de: {
        'miras-hukuku': {
            icon: '<i class="fa-solid fa-scroll"></i>',
            title: 'Erbrecht',
            content: '<p>Inhalt wird hier hinzugefügt.</p>'
        },
        'bosanma-hukuku': {
            icon: '<i class="fa-solid fa-heart-crack"></i>',
            title: 'Scheidungsrecht',
            content: '<p>Inhalt wird hier hinzugefügt.</p>'
        },
        'ceza-hukuku': {
            icon: '<i class="fa-solid fa-gavel"></i>',
            title: 'Strafrecht',
            content: '<p>Inhalt wird hier hinzugefügt.</p>'
        },
        'is-hukuku': {
            icon: '<i class="fa-solid fa-briefcase"></i>',
            title: 'Arbeitsrecht',
            content: '<p>Inhalt wird hier hinzugefügt.</p>'
        },
        'ticaret-hukuku': {
            icon: '<i class="fa-solid fa-handshake"></i>',
            title: 'Handelsrecht',
            content: '<p>Inhalt wird hier hinzugefügt.</p>'
        },
        'sozlesme-hukuku': {
            icon: '<i class="fa-solid fa-file-contract"></i>',
            title: 'Vertragsrecht',
            content: '<p>Inhalt wird hier hinzugefügt.</p>'
        },
        'mesleki-denklik': {
            icon: '<i class="fa-solid fa-passport"></i>',
            title: 'Berufliche Anerkennung (ANERKENNUNG)',
            content: '<p>Inhalt wird hier hinzugefügt.</p>'
        },
        'ausbildung': {
            icon: '<i class="fa-solid fa-plane"></i>',
            title: 'Ausbildung: Ein Beruf, Eine Zukunft in Deutschland',
            content: '<p>Inhalt wird hier hinzugefügt.</p>'
        },
        'aile-birlesimi-vizesi': {
            icon: '<i class="fa-solid fa-users"></i>',
            title: 'Deutschland Familiennachzug Visum: Wieder Zusammen mit Ihren Liebsten',
            content: '<p>Inhalt wird hier hinzugefügt.</p>'
        },
        'egitim-sureci': {
            icon: '<i class="fa-solid fa-graduation-cap"></i>',
            title: 'Deutschsprachiger Bildungsprozess',
            content: '<p>Inhalt wird hier hinzugefügt.</p>'
        },
        'calisma-ve-oturum-izni': {
            icon: '<i class="fa-solid fa-building"></i>',
            title: 'Arbeits- und Aufenthaltserlaubnis in Deutschland: Blaue Karte und Fachkräfteeinwanderungsgesetz',
            content: '<p>Inhalt wird hier hinzugefügt.</p>'
        },
        'sirket-kurulumu': {
            icon: '<i class="fa-solid fa-globe"></i>',
            title: 'Unternehmensgründung in Deutschland',
            content: '<p>Inhalt wird hier hinzugefügt.</p>'
        }
        },
        ar: {
        'miras-hukuku': {
            icon: '<i class="fa-solid fa-scroll"></i>',
            title: 'قانون الميراث',
            content: '<p>سيتم إضافة المحتوى هنا.</p>'
        },
        'bosanma-hukuku': {
            icon: '<i class="fa-solid fa-heart-crack"></i>',
            title: 'قانون الطلاق',
            content: '<p>سيتم إضافة المحتوى هنا.</p>'
        },
        'ceza-hukuku': {
            icon: '<i class="fa-solid fa-gavel"></i>',
            title: 'القانون الجنائي',
            content: '<p>سيتم إضافة المحتوى هنا.</p>'
        },
        'is-hukuku': {
            icon: '<i class="fa-solid fa-briefcase"></i>',
            title: 'قانون العمل',
            content: '<p>سيتم إضافة المحتوى هنا.</p>'
        },
        'ticaret-hukuku': {
            icon: '<i class="fa-solid fa-handshake"></i>',
            title: 'القانون التجاري',
            content: '<p>سيتم إضافة المحتوى هنا.</p>'
        },
        'sozlesme-hukuku': {
            icon: '<i class="fa-solid fa-file-contract"></i>',
            title: 'قانون العقود',
            content: '<p>سيتم إضافة المحتوى هنا.</p>'
        },
        'mesleki-denklik': {
            icon: '<i class="fa-solid fa-passport"></i>',
            title: 'المعادلة المهنية (ANERKENNUNG)',
            content: '<p>سيتم إضافة المحتوى هنا.</p>'
        },
        'ausbildung': {
            icon: '<i class="fa-solid fa-plane"></i>',
            title: 'التدريب المهني: مهنة ومستقبل في ألمانيا',
            content: '<p>سيتم إضافة المحتوى هنا.</p>'
        },
        'aile-birlesimi-vizesi': {
            icon: '<i class="fa-solid fa-users"></i>',
            title: 'تأشيرة لم شمل الأسرة في ألمانيا: معاً مرة أخرى مع أحبائك',
            content: '<p>سيتم إضافة المحتوى هنا.</p>'
        },
        'egitim-sureci': {
            icon: '<i class="fa-solid fa-graduation-cap"></i>',
            title: 'عملية التعليم باللغة الألمانية',
            content: '<p>سيتم إضافة المحتوى هنا.</p>'
        },
        'calisma-ve-oturum-izni': {
            icon: '<i class="fa-solid fa-building"></i>',
            title: 'تصريح العمل والإقامة في ألمانيا: البطاقة الزرقاء وقانون الهجرة الماهرة',
            content: '<p>سيتم إضافة المحتوى هنا.</p>'
        },
        'sirket-kurulumu': {
            icon: '<i class="fa-solid fa-globe"></i>',
            title: 'تأسيس الشركة في ألمانيا',
            content: '<p>سيتم إضافة المحتوى هنا.</p>'
        }
        }
    };

    function openPopup(serviceId) {
        const langContents = serviceContents[currentLang] || serviceContents['tr'];
        const service = langContents[serviceId];
        if (service) {
            popupIcon.innerHTML = service.icon;
            popupTitle.textContent = service.title;
            popupContent.innerHTML = service.content;
            servicePopup.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closePopup() {
        servicePopup.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners
    detailButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const serviceId = button.getAttribute('data-service');
            openPopup(serviceId);
        });
    });

    if (popupClose) {
        popupClose.addEventListener('click', closePopup);
    }

    if (popupOverlay) {
        popupOverlay.addEventListener('click', closePopup);
    }

    // Close popup on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && servicePopup.classList.contains('active')) {
            closePopup();
        }
        if (e.key === 'Escape' && teamPopup && teamPopup.classList.contains('active')) {
            closeTeamPopup();
        }
    });

    // Team member data
    const teamMembersData = {
        tr: {
            'berkay-kan': {
                name: 'Av. Berkay Kan',
                title: 'Kurucu Ortak',
                image: 'images/BerkayKan.jpg',
                bio: `
                    <p>Türk Hukuk eğitimini Türk-Alman Hukuk Fakültesi'nde tamamlayan İstanbul barosuna kayıtlı bir avukat aynı zamanda genç girişimci. Almanya ile bağı sadece dosyalarla sınırlı değil; Bonn Üniversitesi'nde 'Rechtswissenschaft' eğitimi alarak Alman hukuk sistemini yakından tanıma fırsatı buldu.</p>
                    
                    <p>Mesleki kariyerini Almanya ile iç içe sürdürmeyi hedefliyor, bu doğrultuda Köln Barosu'na kayıt sürecini de eş zamanlı olarak yürütüyor.</p>
                    
                    <h3>Eğitim</h3>
                    <ul>
                        <li>Türk-Alman Hukuk Fakültesi - Türk Hukuku</li>
                        <li>Bonn Üniversitesi - Rechtswissenschaft (Alman Hukuku)</li>
                    </ul>
                    
                    <h3>Uzmanlık Alanları</h3>
                    <ul>
                        <li>Aile Hukuku ve Boşanma</li>
                        <li>Miras Hukuku</li>
                        <li>Almanya Göç Hukuku</li>
                        <li>Yabancılar Hukuku</li>
                        <li>İş Hukuku</li>
                        <li>Ticaret Hukuku</li>
                    </ul>
                `
            }
        },
        en: {
            'berkay-kan': {
                name: 'Atty. Berkay Kan',
                title: 'Founding Partner',
                image: 'images/BerkayKan.jpg',
                bio: '<p>Content will be added here.</p>'
            }
        },
        de: {
            'berkay-kan': {
                name: 'RA Berkay Kan',
                title: 'Gründungspartner',
                image: 'images/BerkayKan.jpg',
                bio: '<p>Inhalt wird hier hinzugefügt.</p>'
            }
        },
        ar: {
            'berkay-kan': {
                name: 'المحامي بيركاي كان',
                title: 'الشريك المؤسس',
                image: 'images/BerkayKan.jpg',
                bio: '<p>سيتم إضافة المحتوى هنا.</p>'
            }
        }
    };

    function openTeamPopup(memberId) {
        const langData = teamMembersData[currentLang] || teamMembersData['tr'];
        const member = langData[memberId];
        if (member && teamPopup) {
            // Set image
            if (teamPopupImage) {
                teamPopupImage.innerHTML = `<img src="${member.image}" alt="${member.name}" onerror="this.src='https://via.placeholder.com/300x400?text=${encodeURIComponent(member.name)}'">`;
            }
            // Set name and title
            if (teamPopupName) teamPopupName.textContent = member.name;
            if (teamPopupTitle) teamPopupTitle.textContent = member.title;
            // Set bio content
            if (teamPopupContent) teamPopupContent.innerHTML = member.bio;
            // Show popup
            teamPopup.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeTeamPopup() {
        if (teamPopup) {
            teamPopup.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Team member click events
    if (teamMembers.length > 0) {
        teamMembers.forEach(member => {
            member.addEventListener('click', () => {
                const memberId = member.getAttribute('data-member');
                if (memberId) {
                    openTeamPopup(memberId);
                }
            });
        });
    }

    // Team popup close events
    if (teamPopupClose) {
        teamPopupClose.addEventListener('click', closeTeamPopup);
    }

    if (teamPopupOverlay) {
        teamPopupOverlay.addEventListener('click', closeTeamPopup);
    }

    // Service links from navigation menu
    const serviceLinks = document.querySelectorAll('.service-link');
    serviceLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceId = link.getAttribute('data-service');
            if (serviceId) {
                // Determine which category the service belongs to
                const hukukServices = ['bosanma-hukuku', 'miras-hukuku', 'ceza-hukuku', 'is-hukuku', 'ticaret-hukuku', 'sozlesme-hukuku'];
                const gocServices = ['mesleki-denklik', 'ausbildung', 'aile-birlesimi-vizesi', 'egitim-sureci', 'calisma-ve-oturum-izni', 'sirket-kurulumu'];
                
                let targetTab = null;
                if (hukukServices.includes(serviceId)) {
                    targetTab = 'hukuk';
                } else if (gocServices.includes(serviceId)) {
                    targetTab = 'goc';
                }
                
                // Activate the appropriate tab if found (don't preserve scroll since we'll scroll to services)
                if (targetTab && tabButtons.length > 0) {
                    switchTab(targetTab, false);
                }
                
                // Scroll to services section first
                const servicesSection = document.getElementById('services');
                if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Wait a bit for scroll, then open popup
                    setTimeout(() => {
                        openPopup(serviceId);
                    }, 500);
                } else {
                    openPopup(serviceId);
                }
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-xmark');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });
});
