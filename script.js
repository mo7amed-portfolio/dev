// =================================================================
        //  OFFERS DATA (updated prices with discounts)
        // =================================================================
        const offersData = [{
            id: 1,
            name: { ar: 'موقع صغير', en: 'Small Site' },
            price: 1200,
            discountPrice: 1000,
            badge: null,
            feats: {
                ar: ['صفحة واحدة بتصميم احترافي', 'تصميم متجاوب بالكامل', 'تسليم خلال 3 أيام', 'دعم فني أسبوع كامل'],
                en: ['Single page professional design', 'Fully responsive design', 'Delivery within 3 days', '1 week technical support']
            }
        }, {
            id: 2,
            name: { ar: 'موقع متوسط', en: 'Medium Site' },
            price: 1700,
            discountPrice: 1500,
            badge: { ar: 'الأكثر طلبًا', en: 'Most Popular' },
            feats: {
                ar: ['حتى 5 صفحات متكاملة', 'نماذج تواصل وربط سوشيال ميديا', 'تسليم خلال أسبوع', 'دعم فني لمدة شهر'],
                en: ['Up to 5 full pages', 'Contact forms & social media integration', 'Delivery within 1 week', '1 month technical support']
            }
        }, {
            id: 3,
            name: { ar: 'موقع كبير', en: 'Large Site' },
            price: 2500,
            discountPrice: 2000,
            badge: null,
            feats: {
                ar: ['صفحات غير محدودة + لوحة تحكم', 'نظام مستخدمين وتسجيل دخول', 'تسليم خلال أسبوعين', 'دعم فني 3 أشهر'],
                en: ['Unlimited pages + dashboard', 'User system & login', 'Delivery within 2 weeks', '3 months technical support']
            }
        }];

        const checkSvg =
            `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12l5 5L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

        // =================================================================
        //  RENDER OFFERS
        // =================================================================
        let currentLang = 'ar';

        function renderOffers(lang) {
            const wrap = document.getElementById('offersWrap');
            wrap.innerHTML = '';
            offersData.forEach(o => {
                const isAr = lang === 'ar';
                const name = isAr ? o.name.ar : o.name.en;
                const badge = o.badge ? (isAr ? o.badge.ar : o.badge.en) : null;
                const feats = isAr ? o.feats.ar : o.feats.en;
                const priceDisplay = o.discountPrice || o.price;
                const oldPrice = o.price;

                const el = document.createElement('div');
                el.className = 'glass-card offer-card' + (badge ? ' featured' : '');
                el.innerHTML = `
              ${badge ? `<span class="offer-badge">${badge}</span>` : ''}
              <div class="offer-name">${name}</div>
              <div class="offer-price-row">
                <span class="offer-price">${priceDisplay} <span class="currency">${isAr ? 'ج.م' : 'EGP'}</span></span>
                ${oldPrice > priceDisplay ? `<span class="offer-old-price">${oldPrice} ${isAr ? 'ج.م' : 'EGP'}</span>` : ''}
                ${oldPrice > priceDisplay ? `<span class="offer-discount">${Math.round((1 - priceDisplay/oldPrice)*100)}% OFF</span>` : ''}
              </div>
              <ul class="offer-feats">
                ${feats.map(f => `<li>${checkSvg}<span>${f}</span></li>`).join('')}
              </ul>
              <button class="offer-btn" data-id="${o.id}" data-i18n="offer-btn">${isAr ? 'اختر هذه الباقة' : 'Choose This Package'}</button>
            `;
                wrap.appendChild(el);
            });
            // re-bind events
            document.querySelectorAll('.offer-btn[data-id]').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    const id = parseInt(this.dataset.id);
                    const offer = offersData.find(o => o.id === id);
                    if (offer) openModal(offer);
                });
            });
        }

        // =================================================================
        //  MODAL
        // =================================================================
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
            const price = offer.discountPrice || offer.price;
            const currency = isAr ? 'ج.م' : 'EGP';
            selectedBanner.innerHTML =
                `${isAr ? 'الباقة المختارة' : 'Selected Package'}:<b>${name} — ${price} ${currency}</b>`;
            modal.style.display = 'flex';
            // Reset fields
            document.getElementById('custName').value = '';
            document.getElementById('custPhone').value = '';
            document.getElementById('custEmail').value = '';
            document.getElementById('custDetails').value = '';
        }

        modalClose.addEventListener('click', () => { modal.style.display = 'none'; });
        modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

        sendOrderBtn.addEventListener('click', function() {
            const name = document.getElementById('custName').value.trim();
            const phone = document.getElementById('custPhone').value.trim();
            const email = document.getElementById('custEmail').value.trim();
            const details = document.getElementById('custDetails').value.trim();

            if (!name) { alert(currentLang === 'ar' ? 'من فضلك اكتب اسمك' : 'Please enter your name'); return; }
            if (!phone) { alert(currentLang === 'ar' ? 'من فضلك اكتب رقم الهاتف' : 'Please enter your phone number'); return; }

            sendingOverlay.style.display = 'flex';

            const isAr = currentLang === 'ar';
            const offerName = isAr ? currentOffer.name.ar : currentOffer.name.en;
            const price = currentOffer.discountPrice || currentOffer.price;
            const currency = isAr ? 'ج.م' : 'EGP';

            const msg = `${isAr ? 'طلب موقع جديد 🌐' : 'New Website Request 🌐'}

        ${isAr ? 'الاسم' : 'Name'}: ${name}
        ${isAr ? 'الهاتف' : 'Phone'}: ${phone}
        ${isAr ? 'البريد' : 'Email'}: ${email || (isAr ? 'لم يحدد' : 'Not specified')}
        ${isAr ? 'الباقة' : 'Package'}: ${offerName}
        ${isAr ? 'السعر' : 'Price'}: ${price} ${currency}

        ${isAr ? 'تفاصيل إضافية' : 'Additional Details'}:
        ${details || (isAr ? 'لا توجد' : 'None')}

        ${isAr ? 'تم الإرسال عبر موقع Mohamed Ashraf' : 'Sent via Mohamed Ashraf website'}`;

            const url = `https://wa.me/201550425843?text=${encodeURIComponent(msg)}`;

            setTimeout(() => {
                sendingOverlay.style.display = 'none';
                window.open(url, '_blank');
                modal.style.display = 'none';
                currentOffer = null;
            }, 1600);
        });

        // =================================================================
        //  THEME TOGGLE (Dark / Light)
        // =================================================================
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

        // =================================================================
        //  LANGUAGE TOGGLE
        // =================================================================
        const langToggle = document.getElementById('langToggle');
        const langLabel = document.getElementById('langLabel');

        // Translations
        const i18n = {
            'nav-name': { ar: 'محمد أشرف', en: 'Mohamed Ashraf' },
            'eyebrow': { ar: 'متاح حاليًا لاستقبال مشاريع جديدة', en: 'Currently available for new projects' },
            'name': { ar: 'Mohamed Ashraf', en: 'Mohamed Ashraf' },
            'tagline': {
                ar: '<strong>مطور تطبيقات وويب</strong> بخبرة عملية في بناء مواقع ويب احترافية، تطبيقات أندرويد، وحلول مدمجة بالذكاء الاصطناعي. متمكّن من لغات البرمجة الأساسية ومستخدم بكفاءة عالية لأدوات الـ AI في تسريع التطوير وحل المشاكل التقنية المعقدة.',
                en: '<strong>Web & App Developer</strong> with hands-on experience building professional websites, Android apps, and AI-integrated solutions. Proficient in core programming languages and skilled at leveraging AI tools to accelerate development and solve complex technical challenges.'
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
            'label-phone': { ar: 'رقم الهاتف', en: 'Phone Number' },
            'label-email': { ar: 'البريد الإلكتروني (اختياري)', en: 'Email (optional)' },
            'label-details': { ar: 'تفاصيل إضافية', en: 'Additional Details' },
            'send-btn': { ar: 'إرسال الطلب عبر واتساب', en: 'Send via WhatsApp' },
            'sending-title': { ar: 'جاري تحويل طلبك...', en: 'Redirecting your request...' },
            'sending-sub': { ar: 'هيتم فتح واتساب خلال لحظات', en: 'WhatsApp will open in a moment' },
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

            if (currentOffer && modal.style.display === 'flex') {
                const isAr = lang === 'ar';
                const name = isAr ? currentOffer.name.ar : currentOffer.name.en;
                const price = currentOffer.discountPrice || currentOffer.price;
                const currency = isAr ? 'ج.م' : 'EGP';
                selectedBanner.innerHTML =
                    `${isAr ? 'الباقة المختارة' : 'Selected Package'}:<b>${name} — ${price} ${currency}</b>`;
            }
        }

        langToggle.addEventListener('click', function() {
            const nextLang = currentLang === 'ar' ? 'en' : 'ar';
            applyLanguage(nextLang);
        });

        // =================================================================
        //  LIGHTBOX (long press)
        // =================================================================
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

        // =================================================================
        //  INIT
        // =================================================================
        renderOffers('ar');
        applyLanguage('ar');

        console.log('✅ WhatsApp icon restored to original, all optimizations kept.');
