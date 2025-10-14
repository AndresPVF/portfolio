const typingElement = document.getElementById('typingText');
const phrases = [
  'Print("Roblox Scripter & Animator")',
  'Print("UI Animations")',
  'if client:IsA("LegendaryScripter") then return end',
  'Print("Cutscenes Maker")',
  'Print("Optimized Systems")',
  'local success = pcall(function() return GreatDeveloper("AndresPVF") end)',
  'workspace:SetAttribute("Talent", "100%")',
  'if bug then print("It works anyway") end',
  'while task.wait() do brain:Execute("NewIdeas") end',
  'if deadline == today then panic() end',
  'if UI:IsClean() then print("Satisfying.") end',
  'if coffee == nil then TakeBreak() end',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];

  if (!isDeleting && charIndex <= currentPhrase.length) {
    typingElement.textContent = currentPhrase.slice(0, charIndex);
    charIndex++;
    typingSpeed = 50 + Math.random() * 50;
  } else if (isDeleting && charIndex >= 0) {
    typingElement.textContent = currentPhrase.slice(0, charIndex);
    charIndex--;
    typingSpeed = 30;
  }

  if (charIndex === currentPhrase.length + 1) {
    isDeleting = true;
    typingSpeed = 1500;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typingSpeed = 500;
  }

  setTimeout(typeEffect, typingSpeed);
}

typeEffect();

const navbar = document.getElementById('navbar');
const navBurger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

navBurger.addEventListener('click', () => {
  navBurger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      navBurger.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });
});

const portfolioTabs = document.querySelectorAll('.portfolio-tab');
const categorySections = document.querySelectorAll('.category-section');

portfolioTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const category = tab.dataset.category;
    
    portfolioTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    categorySections.forEach(section => {
      if (section.dataset.category === category) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });
  });
});

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal-element').forEach(el => {
  observer.observe(el);
});

const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      animateStats();
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
  statsObserver.observe(statsSection);
}

function animateStats() {
  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateNumber = () => {
      current += step;
      if (current < target) {
        stat.textContent = Math.floor(current) + '+';
        requestAnimationFrame(updateNumber);
      } else {
        stat.textContent = target + '+';
      }
    };

    updateNumber();
  });
}

const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    scrollToTopBtn.classList.add('visible');
  } else {
    scrollToTopBtn.classList.remove('visible');
  }
});

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mouseenter', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  });
});

const projectItems = document.querySelectorAll('.project-item');

projectItems.forEach(item => {
  // Lazy load videos
  const video = item.querySelector('.project-video');
  if (video) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          video.classList.remove('loading');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(video);
  }

  // Hover effects
  item.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-10px) scale(1.02)';
  });
  
  item.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

const skillCards = document.querySelectorAll('.skill-card');
skillCards.forEach(card => {
  card.addEventListener('mouseenter', function() {
    const listItems = this.querySelectorAll('.skill-list li');
    listItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.transform = 'translateX(10px)';
        item.style.color = 'var(--primary-light)';
      }, index * 50);
    });
  });
  
  card.addEventListener('mouseleave', function() {
    const listItems = this.querySelectorAll('.skill-list li');
    listItems.forEach(item => {
      item.style.transform = 'translateX(0)';
      item.style.color = 'var(--text-gray)';
    });
  });
});

function createParticles() {
  const particlesContainer = document.getElementById('particles');
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    const size = Math.random() * 4 + 1;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    const duration = Math.random() * 10 + 10;
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = Math.random() * 5 + 's';
    
    const colors = ['#a855f7', '#ec4899', '#f59e0b', '#c084fc'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    particlesContainer.appendChild(particle);
  }
}

createParticles();

document.addEventListener('mousemove', (e) => {
  const cards = document.querySelectorAll('.floating-card');
  const mouseX = e.clientX / window.innerWidth;
  const mouseY = e.clientY / window.innerHeight;
  
  cards.forEach((card, index) => {
    const speed = (index + 1) * 20;
    const x = (mouseX - 0.5) * speed;
    const y = (mouseY - 0.5) * speed;
    
    card.style.transform = `translate(${x}px, ${y}px)`;
  });
});

const aboutCards = document.querySelectorAll('.about-card');
aboutCards.forEach((card, index) => {
  card.style.animationDelay = `${index * 0.1}s`;
});

window.addEventListener('load', () => {
  document.body.style.opacity = '1';
  document.body.style.transform = 'translateY(0)';
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
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

let lastScrollTop = 0;
window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > lastScrollTop && scrollTop > 100) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  
  lastScrollTop = scrollTop;
});

const contactCards = document.querySelectorAll('.contact-card');
contactCards.forEach(card => {
  card.addEventListener('click', function() {
    const value = this.querySelector('.contact-value').textContent;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(value).then(() => {
        const originalText = this.querySelector('.contact-description').textContent;
        this.querySelector('.contact-description').textContent = 'Copied to clipboard!';
        this.querySelector('.contact-description').style.color = 'var(--primary-light)';
        
        setTimeout(() => {
          this.querySelector('.contact-description').textContent = originalText;
          this.querySelector('.contact-description').style.color = 'var(--text-gray)';
        }, 2000);
      });
    }
  });
});

document.querySelectorAll('.project-item').forEach(item => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, { threshold: 0.2 });
  
  observer.observe(item);
});

const statCards = document.querySelectorAll('.stat-card');
statCards.forEach((card, index) => {
  card.style.animationDelay = `${index * 0.1}s`;
});

document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80;
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
});

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.hero::before, .about, .stats');
      
      parallaxElements.forEach((element, index) => {
        const speed = (index + 1) * 0.5;
        element.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
      });
      
      ticking = false;
    });
    
    ticking = true;
  }
});

const heroButtons = document.querySelectorAll('.hero-buttons .btn');
heroButtons.forEach((btn, index) => {
  btn.style.animationDelay = `${0.5 + index * 0.2}s`;
  btn.classList.add('fade-in-up');
});

document.querySelectorAll('.portfolio-tab').forEach(tab => {
  tab.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-3px) scale(1.05)';
  });
  
  tab.addEventListener('mouseleave', function() {
    if (!this.classList.contains('active')) {
      this.style.transform = 'translateY(0) scale(1)';
    }
  });
});

const ctaSection = document.querySelector('.cta-section');
if (ctaSection) {
  const ctaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        ctaSection.style.animation = 'fadeIn 1s ease forwards';
      }
    });
  }, { threshold: 0.3 });
  
  ctaObserver.observe(ctaSection);
}

document.querySelectorAll('.about-card-icon').forEach(icon => {
  icon.addEventListener('mouseenter', function() {
    this.style.animation = 'iconSpin 0.6s ease';
  });
  
  icon.addEventListener('animationend', function() {
    this.style.animation = 'iconBounce 2s ease-in-out infinite';
  });
});

const projectVideos = document.querySelectorAll('.project-video iframe');
projectVideos.forEach(video => {
  video.addEventListener('load', function() {
    this.style.opacity = '1';
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    navLinks.classList.remove('active');
    navBurger.classList.remove('active');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    navLinks.classList.remove('active');
    navBurger.classList.remove('active');
  }
});

const navLinksArray = document.querySelectorAll('.nav-links a');
navLinksArray.forEach(link => {
  link.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-2px)';
  });
  
  link.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
  });
});

let isScrolling;
window.addEventListener('scroll', () => {
  window.clearTimeout(isScrolling);
  
  document.body.style.pointerEvents = 'none';
  
  isScrolling = setTimeout(() => {
    document.body.style.pointerEvents = 'auto';
  }, 100);
});

const heroContent = document.querySelector('.hero-content');
if (heroContent) {
  setTimeout(() => {
    heroContent.style.opacity = '1';
    heroContent.style.transform = 'translateY(0)';
  }, 100);
}

document.querySelectorAll('.skill-list li').forEach((item, index) => {
  item.style.animationDelay = `${index * 0.05}s`;
});

const observer2 = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.project-item, .stat-card, .contact-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'all 0.6s ease-out';
  observer2.observe(el);
});

const navBrand = document.querySelector('.nav-brand');
navBrand.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.5)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s ease-out';
    ripple.style.pointerEvents = 'none';
    
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  });
});

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    if (!name || !email || !message) {
      formStatus.textContent = 'Please fill out all fields.';
      formStatus.style.color = 'var(--secondary)';
      return;
    }
    formStatus.textContent = 'Sending...';
    formStatus.style.color = 'var(--primary)';
    contactForm.querySelector('button[type="submit"]').disabled = true;
    setTimeout(() => {
      formStatus.textContent = 'Message sent! (Demo only)';
      formStatus.style.color = 'var(--accent)';
      contactForm.querySelector('button[type="submit"]').disabled = false;
      contactForm.reset();
    }, 1500);
    formStatus.animate([
      { opacity: 0, transform: 'scale(0.9)' },
      { opacity: 1, transform: 'scale(1.05)' },
      { opacity: 1, transform: 'scale(1)' }
    ], {
      duration: 600,
      easing: 'ease-out'
    });
  });
}
