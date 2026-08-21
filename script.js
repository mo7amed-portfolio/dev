        const offersData = [{
            id: 1,
            name: { ar: 'متجر إلكتروني', en: 'E-commerce Store' },
            priceLabel: { ar: '5000 جنيه / 100 دولار', en: '$100 / 5000 EGP' },
            badge: null,
            feats: {
                ar: ['متجر كامل بعربة شراء ونظام منتجات', 'تصميم متجاوب بالكامل', 'ربط وسائل الدفع والتواصل', 'دعم فني بعد التسليم'],
                en: ['Full store with cart & product system', 'Fully responsive design', 'Payment & contact integration', 'Post-delivery technical support']
            }
        }, {
            id: 2,
            name: { ar: 'منصة تعليمية', en: 'Educational Platform' },
            priceLabel: { ar: '9000 جنيه / 180 دولار', en: '$180 / 9000 EGP' },
            badge: { ar: 'الأكثر طلبًا', en: 'Most Popular' },
            feats: {
                ar: ['نظام كورسات ومحتوى تعليمي', 'حسابات مستخدمين وتسجيل دخول', 'لوحة تحكم لإدارة المحتوى', 'دعم فني بعد التسليم'],
                en: ['Courses & educational content system', 'User accounts & login', 'Content management dashboard', 'Post-delivery technical support']
            }
        }, {
            id: 3,
            name: { ar: 'موقع مختلف؟', en: 'Something Different?' },
            priceLabel: { ar: 'السعر حسب الميزانية والطلبات', en: 'Price based on budget & requirements' },
            badge: null,
            feats: {
                ar: ['فكرة أو مشروع مخصص لك', 'نتناقش في التفاصيل والميزانية', 'تصميم وتنفيذ حسب احتياجك', 'دعم فني بعد التسليم'],
                en: ['A custom idea or project just for you', "We'll discuss the details & budget", 'Design & build tailored to your needs', 'Post-delivery technical support']
            }
        }];

        const checkSvg =
            `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12l5 5L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

        let currentLang = 'en';

        function renderOffers(lang) {
            const wrap = document.getElementById('offersWrap');
            wrap.innerHTML = '';
            offersData.forEach((o, idx) => {
                const isAr = lang === 'ar';
                const name = isAr ? o.name.ar : o.name.en;
                const badge = o.badge ? (isAr ? o.badge.ar : o.badge.en) : null;
                const feats = isAr ? o.feats.ar : o.feats.en;
                const priceLabel = isAr ? o.priceLabel.ar : o.priceLabel.en;

                const el = document.createElement('div');
                el.className = 'glass-card offer-card' + (badge ? ' featured' : '');
                el.setAttribute('data-reveal', idx % 2 === 0 ? 'left' : 'right');
                el.innerHTML = `
              ${badge ? `<span class="offer-badge">${badge}</span>` : ''}
              <div class="offer-name">${name}</div>
              <div class="offer-price-row">
                <span class="offer-price">${priceLabel}</span>
              </div>
              <ul class="offer-feats">
                ${feats.map(f => `<li>${checkSvg}<span>${f}</span></li>`).join('')}
              </ul>
              <button class="offer-btn" data-id="${o.id}" data-i18n="offer-btn">${isAr ? 'اختر هذه الباقة' : 'Choose This Package'}</button>
            `;
                wrap.appendChild(el);
            });
            document.querySelectorAll('.offer-btn[data-id]').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    const id = parseInt(this.dataset.id);
                    const offer = offersData.find(o => o.id === id);
                    if (offer) openModal(offer);
                });
            });
        }

        const modal = document.getElementById('modal');
        const modalClose = document.getElementById('modalClose');
        const selectedBanner = document.getElementById('selectedBanner');
        const sendOrderBtn = document.getElementById('sendOrder');
        const sendingOverlay = document.getElementById('sendingOverlay');
        let currentOffer = null;

        function openModal(offer) {
            currentOffer = offer;
            const isAr = currentLang === 'ar';
            const name = isAr ? offer.name.ar : offer.name.en;
            const priceLabel = isAr ? offer.priceLabel.ar : offer.priceLabel.en;
            selectedBanner.innerHTML =
                `${isAr ? 'الباقة المختارة' : 'Selected Package'}:<b>${name} — ${priceLabel}</b>`;
            modal.style.display = 'flex';
            document.getElementById('custName').value = '';
            document.getElementById('custPhone').value = '';
            document.getElementById('custEmail').value = '';
            document.getElementById('custDetails').value = '';
        }

        modalClose.addEventListener('click', () => { modal.style.display = 'none'; });
        modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

        function waitForFirebase() {
            return new Promise(resolve => {
                if (window.FB) { resolve(window.FB); return; }
                window.addEventListener('firebase-ready', () => resolve(window.FB), { once: true });
            });
        }

        sendOrderBtn.addEventListener('click', async function() {
            const name = document.getElementById('custName').value.trim();
            const phone = document.getElementById('custPhone').value.trim();
            const email = document.getElementById('custEmail').value.trim();
            const details = document.getElementById('custDetails').value.trim();

            if (!name) { alert(currentLang === 'ar' ? 'من فضلك اكتب اسمك' : 'Please enter your name'); return; }
            if (!phone) { alert(currentLang === 'ar' ? 'من فضلك اكتب رقم الهاتف' : 'Please enter your phone number'); return; }

            sendOrderBtn.disabled = true;
            sendingOverlay.style.display = 'flex';

            try {
                const FB = await waitForFirebase();
                const offerName = currentOffer.name.en;
                const priceLabel = currentOffer.priceLabel.en;

                const orderRef = await FB.addDoc(FB.collection(FB.db, 'orders'), {
                    name,
                    phone,
                    email: email || null,
                    details: details || null,
                    packageName: offerName,
                    priceLabel: priceLabel,
                    status: 'new',
                    createdAt: FB.serverTimestamp()
                });

                await FB.addDoc(FB.collection(FB.db, 'orders', orderRef.id, 'messages'), {
                    sender: 'system',
                    text: `Order received: ${offerName} (${priceLabel})`,
                    createdAt: FB.serverTimestamp()
                });

                setTimeout(() => {
                    window.location.href = `chat-with-dev.html?order=${orderRef.id}`;
                }, 1400);
            } catch (err) {
                console.error('Order save failed:', err);
                sendingOverlay.style.display = 'none';
                sendOrderBtn.disabled = false;
                alert(currentLang === 'ar'
                    ? 'حصل خطأ أثناء إرسال الطلب، حاول تاني'
                    : 'Something went wrong while sending your order, please try again');
            }
        });

        const themeToggle = document.getElementById('themeToggle');

        function applyTheme(theme) {
            if (theme === 'light') {
                document.body.classList.add('light-mode');
            } else {
                document.body.classList.remove('light-mode');
            }
            try { localStorage.setItem('site-theme', theme); } catch (e) {}
        }

        function initTheme() {
            let saved = null;
            try { saved = localStorage.getItem('site-theme'); } catch (e) {}
            if (!saved) {
                saved = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
                    ? 'light' : 'dark';
            }
            applyTheme(saved);
        }

        themeToggle.addEventListener('click', function() {
            const isLight = document.body.classList.contains('light-mode');
            applyTheme(isLight ? 'dark' : 'light');
            if (navigator.vibrate) navigator.vibrate(8);
        });

        initTheme();

        const langToggle = document.getElementById('langToggle');
        const langLabel = document.getElementById('langLabel');

        const i18n = {
            'nav-name': { ar: 'محمد أشرف', en: 'Mohamed Ashraf' },
            'nav-info': { ar: 'معلومات', en: 'Info' },
            'nav-orders': { ar: 'الطلبات', en: 'Orders' },
            'eyebrow': { ar: 'متاح حاليًا لاستقبال مشاريع جديدة', en: 'Currently available for new projects' },
            'name': { ar: 'Mohamed Ashraf', en: 'Mohamed Ashraf' },
            'tagline': {
                ar: '<strong>مطور ويب</strong> بخبرة عملية في بناء مواقع ويب احترافية، وحلول مدمجة بالذكاء الاصطناعي. متخصص في الـ Front-end ومعايا تيم Back-end، ومتمكّن من لغات البرمجة الأساسية ومستخدم بكفاءة عالية لأدوات الـ AI في تسريع التطوير وحل المشاكل التقنية المعقدة.',
                en: '<strong>Web Developer</strong> with hands-on experience building professional websites and AI-integrated solutions. Focused on front-end development, backed by a dedicated back-end team. Proficient in core programming languages and skilled at leveraging AI tools to accelerate development and solve complex technical challenges.'
            },
            'stat-years': { ar: 'سنة خبرة برمجية', en: 'Years of coding experience' },
            'stat-fields': { ar: 'مجالات العمل', en: 'Work domains' },
            'stat-brand': { ar: 'العلامة التقنية', en: 'Tech brand' },
            'expertise-title': { ar: 'مجالات الخبرة', en: 'Areas of Expertise' },
            'expertise-sub': {
                ar: 'من تصميم الواجهات إلى التعديل على مستوى الكود الخام، بخبرة تقنية متعددة الاتجاهات',
                en: 'From UI design to low-level code modification, with multi-directional technical expertise'
            },
            'exp-web-title': { ar: 'تطوير الويب', en: 'Web Development' },
            'exp-web-desc': {
                ar: 'مواقع تجارية وتعليمية وتفاعلية بتصميم متجاوب، حركات سلسة، وتجربة استخدام مدروسة من الصفر.',
                en: 'Commercial, educational & interactive websites with responsive design, smooth animations, and thoughtful UX from scratch.'
            },
            'exp-android-title': { ar: 'تطوير أندرويد', en: 'Android Development' },
            'exp-android-desc': {
                ar: 'بناء وتعديل تطبيقات أندرويد، بما في ذلك التعامل المباشر مع كود Smali وهندسة عكسية لملفات APK.',
                en: 'Building & modifying Android apps, including direct work with Smali code and APK reverse engineering.'
            },
            'exp-ai-title': { ar: 'الذكاء الاصطناعي', en: 'Artificial Intelligence' },
            'exp-ai-desc': {
                ar: 'دمج مساعدين ذكاء اصطناعي داخل المنصات والتطبيقات، واستخدام أدوات AI بكفاءة لتسريع التطوير وحل المشاكل.',
                en: 'Integrating AI assistants into platforms & apps, and efficiently using AI tools to accelerate development and solve problems.'
            },
            'offers-title': { ar: 'عروض تصميم المواقع', en: 'Website Design Offers' },
            'offers-sub': { ar: 'اختار الباقة المناسبة لمشروعك وابدأ التنفيذ فورًا', en: 'Choose the right package for your project and start immediately' },
            'offer-btn': { ar: 'اختر هذه الباقة', en: 'Choose This Package' },
            'modal-title': { ar: 'إكمال الطلب', en: 'Complete Order' },
            'modal-sub': { ar: 'ابعت بياناتك وهيتم التواصل معاك على واتساب', en: 'Send your details and we\'ll contact you on WhatsApp' },
            'label-name': { ar: 'الاسم الكامل', en: 'Full Name' },
            'ph-name': { ar: 'اكتب اسمك بالكامل', en: 'Enter your full name' },
            'label-phone': { ar: 'رقم الهاتف', en: 'Phone Number' },
            'label-email': { ar: 'البريد الإلكتروني (اختياري)', en: 'Email (optional)' },
            'label-details': { ar: 'تفاصيل إضافية', en: 'Additional Details' },
            'ph-details': { ar: 'اكتب أي تفاصيل عن الموقع اللي محتاجه...', en: 'Describe any details about the website you need...' },
            'send-btn': { ar: 'إرسال الطلب عبر واتساب', en: 'Send via WhatsApp' },
            'sending-title': { ar: 'جاري تحويلك لصفحة الشات مع المطور...', en: 'Transferring you to the chat with the developer...' },
            'sending-sub': { ar: 'لإتمام عملية الشراء', en: 'To complete your purchase' },
            'footer-copy': { ar: '© 2026 جميع حقوق النشر محفوظة', en: '© 2026 All Rights Reserved' }
        };

        function applyLanguage(lang) {
            currentLang = lang;
            const body = document.body;
            if (lang === 'en') {
                body.dir = 'ltr';
                body.classList.remove('ar-mode');
                body.classList.add('en-mode');
                langLabel.textContent = 'ع';
            } else {
                body.dir = 'rtl';
                body.classList.remove('en-mode');
                body.classList.add('ar-mode');
                langLabel.textContent = 'En';
            }

            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.dataset.i18n;
                if (i18n[key] && i18n[key][lang] !== undefined) {
                    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                        el.placeholder = i18n[key][lang];
                    } else {
                        el.innerHTML = i18n[key][lang];
                    }
                }
            });

            renderOffers(lang);
            if (typeof initRevealObserver === 'function') {
                requestAnimationFrame(() => {
                    document.querySelectorAll('.offer-card[data-reveal]').forEach(el => el.classList.add('revealed'));
                });
            }

            if (currentOffer && modal.style.display === 'flex') {
                const isAr = lang === 'ar';
                const name = isAr ? currentOffer.name.ar : currentOffer.name.en;
                const priceLabel = isAr ? currentOffer.priceLabel.ar : currentOffer.priceLabel.en;
                selectedBanner.innerHTML =
                    `${isAr ? 'الباقة المختارة' : 'Selected Package'}:<b>${name} — ${priceLabel}</b>`;
            }
        }

        langToggle.addEventListener('click', function() {
            const nextLang = currentLang === 'ar' ? 'en' : 'ar';
            applyLanguage(nextLang);
        });

        const profileWrap = document.getElementById('profileWrap');
        const lightboxOverlay = document.getElementById('lightboxOverlay');
        const lightboxClose = document.getElementById('lightboxClose');
        const lightboxImg = document.getElementById('lightboxImg');
        let pressTimer = null;

        function openLightbox() {
            lightboxOverlay.style.display = 'flex';
            requestAnimationFrame(() => lightboxOverlay.classList.add('show'));
            if (navigator.vibrate) navigator.vibrate(10);
        }

        function closeLightbox() {
            lightboxOverlay.classList.remove('show');
            setTimeout(() => { lightboxOverlay.style.display = 'none'; }, 250);
        }

        function startPress(e) {
            pressTimer = setTimeout(openLightbox, 400);
        }

        function cancelPress() {
            clearTimeout(pressTimer);
        }
        profileWrap.addEventListener('mousedown', startPress);
        profileWrap.addEventListener('mouseup', cancelPress);
        profileWrap.addEventListener('mouseleave', cancelPress);
        profileWrap.addEventListener('touchstart', startPress, { passive: true });
        profileWrap.addEventListener('touchend', cancelPress);
        profileWrap.addEventListener('touchmove', cancelPress);
        profileWrap.addEventListener('contextmenu', e => e.preventDefault());

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxOverlay.addEventListener('click', e => { if (e.target === lightboxOverlay) closeLightbox(); });

        let revealObserver = null;

        function initRevealObserver() {
            if (revealObserver) revealObserver.disconnect();
            revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

            document.querySelectorAll('[data-reveal]:not(.revealed)').forEach(el => {
                revealObserver.observe(el);
            });
        }

        renderOffers('en');
        applyLanguage('en');
        initRevealObserver();

        console.log('✅ WhatsApp icon restored to original, all optimizations kept.');
