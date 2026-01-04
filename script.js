document.addEventListener('DOMContentLoaded', () => {
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

    // Mobile sub-menu toggle
    document.querySelectorAll('.nav-links > li.has-submenu > a').forEach(link => {
        link.addEventListener('click', (e) => {
            // Only prevent default on mobile
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parentLi = link.parentElement;
                parentLi.classList.toggle('active');
            }
        });
    });

    // Mobile nested sub-menu toggle
    document.querySelectorAll('.nav-links .submenu-parent').forEach(link => {
        link.addEventListener('click', (e) => {
            // Only prevent default on mobile
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parentLi = link.closest('.has-submenu-2');
                if (parentLi) {
                    parentLi.classList.toggle('active');
                }
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

    function switchTab(targetTab) {
        // Save current scroll position
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
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
                
                // Restore scroll position
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'instant'
                });
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

    // Service content data
    const serviceContents = {
        'miras': {
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
        'bosanma': {
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
            `
        },
        'ceza': {
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
        'is': {
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
        'ticaret': {
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
        'sozlesme': {
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
        'almanya-goc': {
            icon: '<i class="fa-solid fa-passport"></i>',
            title: 'Almanya Göç Danışmanlığı',
            content: '<p>Almanya göç danışmanlığı hizmetlerimiz hakkında detaylı bilgi yakında eklenecektir.</p>'
        },
        'ab-goc': {
            icon: '<i class="fa-solid fa-plane"></i>',
            title: 'Avrupa Birliği Göç Danışmanlığı',
            content: '<p>Avrupa Birliği göç danışmanlığı hizmetlerimiz hakkında detaylı bilgi yakında eklenecektir.</p>'
        },
        'aile-birlesimi': {
            icon: '<i class="fa-solid fa-users"></i>',
            title: 'Aile Birleşimi',
            content: '<p>Aile birleşimi hizmetlerimiz hakkında detaylı bilgi yakında eklenecektir.</p>'
        },
        'ogrenci-vizesi': {
            icon: '<i class="fa-solid fa-graduation-cap"></i>',
            title: 'Öğrenci Vizesi Danışmanlığı',
            content: '<p>Öğrenci vizesi danışmanlığı hizmetlerimiz hakkında detaylı bilgi yakında eklenecektir.</p>'
        },
        'is-vizesi': {
            icon: '<i class="fa-solid fa-building"></i>',
            title: 'İş Vizesi ve Çalışma İzni',
            content: '<p>İş vizesi ve çalışma izni hizmetlerimiz hakkında detaylı bilgi yakında eklenecektir.</p>'
        },
        'vatandaslik': {
            icon: '<i class="fa-solid fa-globe"></i>',
            title: 'Vatandaşlık Başvuruları',
            content: '<p>Vatandaşlık başvuruları hizmetlerimiz hakkında detaylı bilgi yakında eklenecektir.</p>'
        }
    };

    function openPopup(serviceId) {
        const service = serviceContents[serviceId];
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
    });

    // Service links from navigation menu
    const serviceLinks = document.querySelectorAll('.service-link');
    serviceLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceId = link.getAttribute('data-service');
            if (serviceId) {
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
