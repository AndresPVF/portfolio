const cursorDot = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');
const navbar = document.getElementById('navbar');
const navBurger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  if (window.scrollY > lastScrollY && window.scrollY > 100) {
    navbar.classList.add('hide');
  } else {
    navbar.classList.remove('hide');
  }
  lastScrollY = window.scrollY;
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
      const offsetTop = targetSection.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      navBurger.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });
});

const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -100px 0px'
};

const workObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll('.work-item:not(.hidden)');
      items.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('visible');
        }, index * 150);
      });
      workObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

const workSection = document.querySelector('.work-grid');
if (workSection) {
  workObserver.observe(workSection);
}

const filterButtons = document.querySelectorAll('.filter-btn');
const workItems = document.querySelectorAll('.work-item');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    workItems.forEach((item) => {
      item.classList.remove('visible');
    });
    
    setTimeout(() => {
      let visibleIndex = 0;
      workItems.forEach((item) => {
        if (filter === 'all') {
          item.classList.remove('hidden');
          setTimeout(() => {
            item.classList.add('visible');
          }, visibleIndex * 120);
          visibleIndex++;
        } else {
          if (item.dataset.category === filter) {
            item.classList.remove('hidden');
            setTimeout(() => {
              item.classList.add('visible');
            }, visibleIndex * 120);
            visibleIndex++;
          } else {
            item.classList.add('hidden');
          }
        }
      });
    }, 300);
  });
});

const serviceObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px'
});

const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, index) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = `all 0.6s ease ${index * 0.1}s`;
  serviceObserver.observe(card);
});

const contactCards = document.querySelectorAll('.contact-card');
contactCards.forEach((card, index) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = `all 0.6s ease ${index * 0.15}s`;
  serviceObserver.observe(card);
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

const parallaxElements = document.querySelectorAll('.hero-bg');
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  parallaxElements.forEach(el => {
    el.style.transform = `translateY(${scrolled * 0.5}px)`;
  });
});

document.querySelectorAll('.contact-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    
    const textContent = link.childNodes[0].textContent.trim();
    
    navigator.clipboard.writeText(textContent).then(() => {
      const notification = document.createElement('div');
      notification.textContent = '✓ Copied to clipboard!';
      notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        color: #0a0a0a;
        padding: 1.5rem 3rem;
        border-radius: 8px;
        font-weight: 600;
        font-size: 1.1rem;
        z-index: 10000;
        animation: fadeInOut 2s ease;
        box-shadow: 0 10px 40px rgba(255,255,255,0.2);
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  });
});

const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    15% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
    20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
  }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
  const dynamicWord = document.getElementById('dynamicWord');
  const cyclingWord = document.getElementById('cyclingWord');
  
  if (dynamicWord && cyclingWord) {
    const flashWords = [
      'Epic',
      'Polished',
      'Advanced',
      'Cinematic',
      'Dynamic',
      'Optimized',
      'Professional',
      'Stunning',
      'Flawless',
      'Advanced'
    ];
    
    const cycleWords = ['Experiences', 'Scripts', 'Animations'];
    let cycleIndex = 0;
    
    setTimeout(() => {
      let currentIndex = 0;
      const flashDuration = 100;
      
      dynamicWord.style.transition = 'opacity 0.05s ease';
      
      const flashInterval = setInterval(() => {
        dynamicWord.style.opacity = '0.4';
        
        setTimeout(() => {
          currentIndex++;
          
          if (currentIndex >= flashWords.length) {
            clearInterval(flashInterval);
            dynamicWord.textContent = 'Advanced';
            dynamicWord.style.opacity = '1';
            dynamicWord.style.transition = 'opacity 0.3s ease';
            
          } else {
            dynamicWord.textContent = flashWords[currentIndex];
            dynamicWord.style.opacity = '1';
          }
        }, flashDuration / 2);
        
      }, flashDuration);
      
    }, 300);

                
cyclingWord.classList.remove('show', 'hide');

setTimeout(() => {
  cyclingWord.textContent = cycleWords[cycleIndex];
  cyclingWord.classList.add('show');

  setInterval(() => {
    cyclingWord.classList.remove('show');
    cyclingWord.classList.add('hide');

    setTimeout(() => {
      cycleIndex = (cycleIndex + 1) % cycleWords.length;
      cyclingWord.textContent = cycleWords[cycleIndex];

      cyclingWord.classList.remove('hide');
      cyclingWord.classList.add('show');
    }, 450);

  }, 3000);
}, 1200);

  }
  
  setTimeout(() => {
    workItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('visible');
      }, index * 150);
    });
  }, 500);
});
