document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    initHeaderScroll();
    initMobileMenu();
    initPreloader();
    initBackToTop();
    initModals();
    initThemeToggle();
    initGlobalPhoneMasks(); 
    
    if (document.querySelector('.doctors-list')) {
        initDoctorSearch();
    }
    
    if (document.querySelector('.appointment-form')) {
        initAppointmentForm();
        initFormAutoSave();
        initDateConstraints();
        initInputValidation();
    }

    if (document.querySelector('.accordion-container')) {
        initAccordions();
    }

    if (document.querySelector('.counter-box')) {
        initCounters();
    }
});

function initNavigation() {
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentLocation.includes(linkPath) && linkPath !== '#') {
            link.classList.add('active');
        } else if ((currentLocation.endsWith('/') || currentLocation.endsWith('index.html')) && linkPath === 'index.html') {
            link.classList.add('active');
        }
    });
}

function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { root: null, threshold: 0.15 });
    reveals.forEach(reveal => revealObserver.observe(reveal));
}

function initHeaderScroll() {
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        window.scrollY > 50 ? header.classList.add('scrolled') : header.classList.remove('scrolled');
    });
}

function initMobileMenu() {
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('nav ul');
    const body = document.body;
    
    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
            body.classList.toggle('no-scroll');
        });

        nav.querySelectorAll('li').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                body.classList.remove('no-scroll');
            });
        });
    }
}

function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('hide-preloader');
        });
    }
}

function initBackToTop() {
    const btn = document.createElement('button');
    btn.id = 'backToTop';
    btn.innerHTML = '↑';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        window.scrollY > 300 ? btn.classList.add('show') : btn.classList.remove('show');
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initThemeToggle() {
    const btn = document.createElement('button');
    btn.className = 'theme-toggle-btn';
    btn.innerHTML = '🌙'; 
    document.body.appendChild(btn);

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        btn.innerHTML = '☀️';
    }

    btn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        let theme = 'light';
        if (document.body.classList.contains('dark-theme')) {
            theme = 'dark';
            btn.innerHTML = '☀️';
        } else {
            btn.innerHTML = '🌙';
        }
        localStorage.setItem('theme', theme);
    });
}

function applyPhoneMask(input) {
    input.addEventListener('input', function (e) {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
        if (!x[2] && x[1] !== '') {
            e.target.value = x[1] === '7' ? '+7 ' : '+7 ' + x[1];
        } else {
            e.target.value = !x[2] ? x[1] : '+7 (' + x[2] + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
        }
    });
}

function initGlobalPhoneMasks() {
    const inputs = document.querySelectorAll('input[type="tel"]');
    inputs.forEach(input => applyPhoneMask(input));
}

function initDoctorSearch() {
    const searchInput = document.getElementById('doctorSearchInput');
    if (!searchInput) return;

    const cards = document.querySelectorAll('.doctor-card');
    searchInput.addEventListener('input', (e) => {
        const searchText = e.target.value.toLowerCase();
        cards.forEach(card => {
            const name = card.querySelector('h3').innerText.toLowerCase();
            const spec = card.querySelector('p').innerText.toLowerCase();
            if (name.includes(searchText) || spec.includes(searchText)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s'; 
            } else {
                card.style.display = 'none';
            }
        });
    });
}

function initFormAutoSave() {
    const inputs = document.querySelectorAll('.appointment-form input, .appointment-form textarea, .appointment-form select');
    inputs.forEach(input => {
        const savedValue = localStorage.getItem('form_' + input.name);
        if (savedValue) input.value = savedValue;
        input.addEventListener('input', (e) => {
            localStorage.setItem('form_' + e.target.name, e.target.value);
        });
    });
    
    const form = document.querySelector('.appointment-form');
    form.addEventListener('submit', () => {
        inputs.forEach(input => localStorage.removeItem('form_' + input.name));
    });
}

function initDateConstraints() {
    const dateInput = document.getElementById('appointment-date');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
    }
}

function initInputValidation() {
    const inputs = document.querySelectorAll('.appointment-form input[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim() !== '') {
                input.classList.add('valid');
                input.classList.remove('invalid');
            } else {
                input.classList.add('invalid');
                input.classList.remove('valid');
            }
        });
    });
}

function initAppointmentForm() {
    const form = document.querySelector('.appointment-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            showNotification('Успешно!', 'Ваша заявка принята. Мы перезвоним.');
            form.reset();
            document.querySelectorAll('.valid').forEach(el => el.classList.remove('valid'));
        }, 1500);
    });
}

function initModals() {
    const urgentBtns = document.querySelectorAll('.btn.urgent');
    const modalHTML = `
        <div id="urgentModal" class="modal-overlay">
            <div class="modal-window">
                <span class="modal-close">&times;</span>
                <h3>Срочный вызов</h3>
                <p>Вы нажали кнопку экстренной помощи. Пожалуйста, позвоните нам напрямую:</p>
                <a href="tel:+79187654321" class="btn btn-large" style="background: var(--primary-red); display:block; text-align:center; margin: 15px 0;">+7 (918) 765-43-21</a>
                <p><small>Или оставьте телефон, мы перезвоним за 30 секунд:</small></p>
                <form id="urgentForm">
                    <input type="tel" id="urgentPhone" placeholder="+7 (___) ___-__-__" style="width:100%; padding: 10px; margin-bottom: 10px;" required>
                    <button type="submit" class="btn" style="width:100%">Жду звонка</button>
                </form>
            </div>
        </div>
    `;
    
    if (!document.getElementById('urgentModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const urgentInput = document.getElementById('urgentPhone');
        applyPhoneMask(urgentInput);
        
        const urgentForm = document.getElementById('urgentForm');
        urgentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = urgentForm.querySelector('button');
            btn.textContent = 'Ждите звонка...';
            btn.disabled = true;
            setTimeout(() => {
                showNotification('Вызов принят', 'Бригада уведомлена, ожидайте звонка.');
                document.getElementById('urgentModal').classList.remove('open');
                btn.textContent = 'Жду звонка';
                btn.disabled = false;
                urgentForm.reset();
            }, 1500);
        });
    }

    const modal = document.getElementById('urgentModal');
    const closeBtn = modal.querySelector('.modal-close');

    urgentBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('open');
        });
    });

    closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
    });
}

function initAccordions() {
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            header.classList.toggle('active');
            if (header.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = null;
            }
        });
    });
}

function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const options = { threshold: 0.5 };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const duration = 2000;
                const increment = target / (duration / 16);
                
                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, options);

    counters.forEach(counter => observer.observe(counter));
}

function showNotification(title, message) {
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.innerHTML = `
        <div class="toast-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <button class="toast-close">&times;</button>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    
    const removeToast = () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    };

    notification.querySelector('.toast-close').addEventListener('click', removeToast);
    setTimeout(removeToast, 5000);
}