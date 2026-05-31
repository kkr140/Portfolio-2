import { portfolioData } from './data.js';

// URL validation to prevent XSS (javascript: links)
function validateUrl(url) {
  if (!url) return '#';
  const trimmed = url.trim();
  if (trimmed.startsWith('#') || trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('assets/')) {
    return trimmed;
  }
  if (trimmed.startsWith('https://wa.me/') || trimmed.startsWith('mailto:') || trimmed.startsWith('https://t.me/')) {
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch (e) {}
  return '#';
}

// Extract Google Drive ID to create an embeddable preview URL
function getGoogleDriveEmbedUrl(url) {
  if (!url) return '';
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
}

document.addEventListener('DOMContentLoaded', () => {
  // Page Title & Meta tags
  document.title = portfolioData.website.title;

  // Initialize EmailJS
  if (window.emailjs) {
    window.emailjs.init('Y73xQeP5-PQUu9-AZ'); // Public Key from original script.js
  }

  // Initialize Navbar Interactions
  initNavbar();

  // Render Page Content
  renderHero();
  renderAbout();
  renderExperience();
  renderEducation();
  renderSkills();
  renderSoftwareProficiency();
  renderProjects();
  renderContact();
  
  // Set up Video Modal
  initVideoModal();

  // Load effects & transitions
  initEffects();
});

/* ==================== NAVBAR ==================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const brandEl = document.querySelector('.nav-brand');

  if (brandEl) {
    brandEl.textContent = portfolioData.website.brand || portfolioData.website.displayName;
  }

  // Shrink/Transition navbar background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
    });

    // Close menu when clicking link
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
      }
    });
  }

  // Populate navigation links dynamically
  if (navLinks) {
    navLinks.replaceChildren(); // Safe clear
    portfolioData.navigation.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = item;
      a.setAttribute('href', `#${item.toLowerCase()}`);
      li.appendChild(a);
      navLinks.appendChild(li);
    });
  }
}

/* ==================== HERO ==================== */
function renderHero() {
  const nameHighlight = document.querySelector('.name-highlight');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroButtonsContainer = document.querySelector('.hero-buttons');

  if (nameHighlight) {
    nameHighlight.textContent = portfolioData.hero.name;
  }

  if (heroSubtitle) {
    heroSubtitle.textContent = ''; // Will be populated by typing effect
  }

  if (heroButtonsContainer) {
    heroButtonsContainer.replaceChildren();
    portfolioData.hero.buttons.forEach((btn, index) => {
      const a = document.createElement('a');
      a.textContent = btn.label;
      
      const targetUrl = btn.target ? `#${btn.target}` : btn.url;
      a.setAttribute('href', validateUrl(targetUrl));
      
      // Highlight the first button as primary
      if (index === 0) {
        a.className = 'btn btn-primary';
      } else {
        a.className = 'btn btn-secondary';
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
      heroButtonsContainer.appendChild(a);
    });
  }
}

/* ==================== ABOUT ==================== */
function renderAbout() {
  const aboutBio = document.getElementById('about-bio');
  const companyHighlight = document.getElementById('about-company-highlight');

  if (aboutBio) {
    aboutBio.textContent = portfolioData.about.description;
  }

  if (companyHighlight && portfolioData.about.company) {
    companyHighlight.replaceChildren();

    const card = document.createElement('div');
    card.className = 'company-card';

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-graduation-cap highlight-icon';

    const info = document.createElement('div');
    info.className = 'highlight-info';

    const h4 = document.createElement('h4');
    h4.textContent = `Affiliation: ${portfolioData.about.company.name}`;

    const p = document.createElement('p');
    p.textContent = 'Collaborating on creative digital content, high-quality event editing, and visual storytelling.';

    const a = document.createElement('a');
    a.setAttribute('href', validateUrl(portfolioData.about.company.instagram));
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.className = 'company-link';
    a.textContent = 'Follow Work Team ';
    
    const igIcon = document.createElement('i');
    igIcon.className = 'fa-brands fa-instagram';
    a.appendChild(igIcon);

    info.appendChild(h4);
    info.appendChild(p);
    info.appendChild(a);

    card.appendChild(icon);
    card.appendChild(info);
    companyHighlight.appendChild(card);
  }
}

/* ==================== EXPERIENCE ==================== */
function renderExperience() {
  const timeline = document.getElementById('experience-timeline');
  if (!timeline) return;

  timeline.replaceChildren();

  portfolioData.experience.forEach(exp => {
    const item = document.createElement('div');
    item.className = 'timeline-item';

    const dot = document.createElement('div');
    dot.className = 'timeline-dot';

    const content = document.createElement('div');
    content.className = 'timeline-content';

    const h3 = document.createElement('h3');
    h3.textContent = exp.role;

    const org = document.createElement('div');
    org.className = 'timeline-org';
    org.textContent = exp.organization;

    const desc = document.createElement('p');
    desc.className = 'timeline-desc';
    desc.textContent = exp.description;

    content.appendChild(h3);
    content.appendChild(org);
    content.appendChild(desc);

    item.appendChild(dot);
    item.appendChild(content);
    timeline.appendChild(item);
  });
}

/* ==================== EDUCATION ==================== */
function renderEducation() {
  const timeline = document.getElementById('education-timeline');
  if (!timeline) return;

  timeline.replaceChildren();

  portfolioData.education.forEach(edu => {
    const item = document.createElement('div');
    item.className = 'timeline-item';

    const dot = document.createElement('div');
    dot.className = 'timeline-dot';

    const content = document.createElement('div');
    content.className = 'timeline-content';

    const h3 = document.createElement('h3');
    h3.textContent = edu.degree;

    const institution = document.createElement('div');
    institution.className = 'timeline-institution';
    institution.textContent = edu.institution;

    const duration = document.createElement('div');
    duration.className = 'timeline-duration';
    duration.textContent = edu.duration;

    const desc = document.createElement('p');
    desc.className = 'timeline-desc';
    desc.textContent = edu.description;

    content.appendChild(h3);
    content.appendChild(institution);
    content.appendChild(duration);
    content.appendChild(desc);

    item.appendChild(dot);
    item.appendChild(content);
    timeline.appendChild(item);
  });
}

/* ==================== SKILLS ==================== */
function renderSkills() {
  const badgesContainer = document.getElementById('skills-badges');
  if (!badgesContainer) return;

  badgesContainer.replaceChildren();

  portfolioData.skills.forEach(skill => {
    const badge = document.createElement('div');
    badge.className = 'skill-badge';

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-circle-check';

    const label = document.createElement('span');
    label.textContent = skill;

    badge.appendChild(icon);
    badge.appendChild(label);
    badgesContainer.appendChild(badge);
  });
}

/* ==================== SOFTWARE ==================== */
function renderSoftwareProficiency() {
  const container = document.getElementById('software-proficiency-grid');
  if (!container) return;

  container.replaceChildren();

  portfolioData.softwareProficiency.forEach(soft => {
    const badge = document.createElement('div');
    badge.className = 'skill-badge';

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-clapperboard';

    const name = document.createElement('span');
    name.textContent = soft.name;

    badge.appendChild(icon);
    badge.appendChild(name);
    container.appendChild(badge);
  });
}

/* ==================== PROJECTS ==================== */
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.replaceChildren();

  portfolioData.largeProjects.forEach(proj => {
    const card = document.createElement('div');
    card.className = 'project-card';

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'project-image';

    const img = document.createElement('img');
    img.src = validateUrl(proj.cover);
    img.alt = proj.title;
    img.loading = 'lazy';

    imageWrapper.appendChild(img);

    const info = document.createElement('div');
    info.className = 'project-info';

    const title = document.createElement('h3');
    title.textContent = proj.title;

    const type = document.createElement('span');
    type.className = 'project-type';
    type.textContent = proj.projectType;

    const role = document.createElement('p');
    role.className = 'project-role';
    role.textContent = `Role: ${proj.role}`;

    const watchBtn = document.createElement('button');
    watchBtn.className = 'btn btn-watch';
    
    const playIcon = document.createElement('i');
    playIcon.className = 'fa-solid fa-circle-play';
    
    const btnText = document.createTextNode(' Watch Video');
    watchBtn.appendChild(playIcon);
    watchBtn.appendChild(btnText);

    // Watch video click trigger
    watchBtn.addEventListener('click', () => {
      openVideoModal(proj.title, proj.watchUrl);
    });

    info.appendChild(title);
    info.appendChild(type);
    info.appendChild(role);
    info.appendChild(watchBtn);

    card.appendChild(imageWrapper);
    card.appendChild(info);
    grid.appendChild(card);
  });
}



/* ==================== CONTACT ==================== */
function renderContact() {
  const infoContainer = document.getElementById('contact-links-container');
  const footerCopyright = document.getElementById('footer-copyright');

  if (infoContainer) {
    infoContainer.replaceChildren();

    const methods = [
      { key: 'whatsapp', icon: 'fa-brands fa-whatsapp', label: 'WhatsApp', url: portfolioData.contact.whatsapp },
      { key: 'telegram', icon: 'fa-brands fa-telegram', label: 'Telegram', url: portfolioData.contact.telegram },
      { key: 'instagram', icon: 'fa-brands fa-instagram', label: 'Instagram (Personal)', url: portfolioData.contact.instagram },
      { key: 'instagram_work', icon: 'fa-solid fa-clapperboard', label: 'Instagram (Work)', url: portfolioData.contact.instagram_work },
      { key: 'linkedin', icon: 'fa-brands fa-linkedin', label: 'LinkedIn', url: portfolioData.contact.linkedin },
      { key: 'youtube', icon: 'fa-brands fa-youtube', label: 'YouTube', url: portfolioData.contact.youtube }
    ];

    methods.forEach(method => {
      if (method.url) {
        const a = document.createElement('a');
        a.className = `contact-link-item ${method.key}`;
        a.setAttribute('href', validateUrl(method.url));
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');

        const icon = document.createElement('i');
        icon.className = method.icon;

        const text = document.createElement('span');
        text.textContent = method.label;

        a.appendChild(icon);
        a.appendChild(text);
        infoContainer.appendChild(a);
      }
    });
  }

  if (footerCopyright) {
    footerCopyright.textContent = portfolioData.website.copyright;
  }

  // Hook up Contact Form with EmailJS
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (form && status) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;

      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      submitButton.style.opacity = '0.6';
      status.textContent = '';

      const templateParams = {
        from_name: form.name.value,
        from_email: form.email.value,
        message: form.message.value,
        to_email: 'kirankumarreddy74161@gmail.com' // Receiver
      };

      try {
        if (!window.emailjs) {
          throw new Error('EmailJS SDK not loaded.');
        }

        const response = await window.emailjs.send(
          'service_q7hpwte',      // Service ID
          'template_lhnzkpe',     // Template ID
          templateParams
        );

        if (response.status === 200) {
          status.textContent = "✅ Message sent successfully! I'll get back to you soon.";
          status.style.color = '#4ade80';
          status.style.fontWeight = '500';
          form.reset();
        }
      } catch (error) {
        console.error('EmailJS Error:', error);
        status.textContent = '❌ Failed to send message. Please contact me directly or try again.';
        status.style.color = '#ef4444';
        status.style.fontWeight = '500';
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        submitButton.style.opacity = '1';
      }
    });
  }
}

/* ==================== VIDEO MODAL ==================== */
let videoModal, videoFrame, modalClose;

function initVideoModal() {
  videoModal = document.getElementById('videoModal');
  videoFrame = document.getElementById('videoFrame');
  modalClose = document.getElementById('modal-close');

  if (modalClose && videoModal) {
    modalClose.addEventListener('click', closeVideoModal);
    
    // Close on overlay click
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoModal();
    });

    // Close on escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeVideoModal();
    });
  }
}

function openVideoModal(title, url) {
  if (!videoModal || !videoFrame) return;

  const embedUrl = getGoogleDriveEmbedUrl(url);
  videoFrame.setAttribute('src', embedUrl);
  videoModal.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  if (!videoModal || !videoFrame) return;

  videoFrame.setAttribute('src', '');
  videoModal.classList.remove('visible');
  document.body.style.overflow = '';
}

/* ==================== EFFECT CONTROLLERS ==================== */
function initEffects() {
  // Smooth scrolling for navigation anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Dynamic active navigation highlighting on scroll
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Typing effect
  const subtitleEl = document.querySelector('.hero-subtitle');
  if (subtitleEl) {
    const titles = ['Video Editor', 'Motion Graphic Designer', 'Cinematographer'];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const currentTitle = titles[titleIndex];

      if (isDeleting) {
        subtitleEl.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
      } else {
        subtitleEl.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentTitle.length) {
        typeSpeed = 2000; // Pause at full string
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typeSpeed = 500;
      }

      setTimeout(typeEffect, typeSpeed);
    }
    
    setTimeout(typeEffect, 1000);
  }

  // Reveal Animations on Scroll (Intersection Observer)
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.timeline-item, .project-card, .software-card, .reel-card, .creative-card').forEach(el => {
    el.classList.add('fade-reveal');
    observer.observe(el);
  });
}
