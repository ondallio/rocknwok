// ===== DOM Elements =====
const header = document.getElementById('header');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const reservationForm = document.getElementById('reservation-form');
const toast = document.getElementById('toast');
const dateInput = document.getElementById('date');

// ===== Header Scroll Effect =====
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.pageYOffset > 50);
});

// ===== Mobile Navigation =====
navToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// ===== Set Minimum Date for Reservation =====
if (dateInput) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${year}-${month}-${day}`;

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tYear = tomorrow.getFullYear();
    const tMonth = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const tDay = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.value = `${tYear}-${tMonth}-${tDay}`;
}

// ===== Form Submission =====
reservationForm?.addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    const phoneRegex = /^[0-9]{2,3}-?[0-9]{3,4}-?[0-9]{4}$/;
    if (!phoneRegex.test(data.phone.replace(/-/g, ''))) {
        showToast('올바른 연락처를 입력해주세요', 'error');
        return;
    }

    showToast('예약이 접수되었습니다. 확인 문자가 발송됩니다.');
    this.reset();

    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tYear = tomorrow.getFullYear();
        const tMonth = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const tDay = String(tomorrow.getDate()).padStart(2, '0');
        dateInput.value = `${tYear}-${tMonth}-${tDay}`;
    }
});

// ===== Toast Notification =====
function showToast(message, type = 'success') {
    const toastMessage = toast.querySelector('.toast__message');
    toastMessage.textContent = message;
    toast.classList.add('show');
    toast.style.background = type === 'error' ? '#C62828' : '#2E7D32';

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== Intersection Observer for Animations =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.menu-card, .info__block, .concept__image').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== Video Fallback for Mobile =====
const heroVideo = document.querySelector('.hero__video');
if (heroVideo) {
    heroVideo.play().catch(() => {
        heroVideo.style.display = 'none';
        const container = heroVideo.parentElement;
        container.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)';
    });
}
