import { portfolioData } from './data.js?v=2';

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

// Simple markdown renderer for bold (**) and paragraphs (\n\n)
function formatMarkdown(text) {
  if (!text) return '';
  const paragraphs = text.split(/\n\s*\n/);
  return paragraphs.map(p => {
    let safeText = p
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    
    safeText = safeText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return `<p>${safeText}</p>`;
  }).join('');
}

// Get official brand SVG logos for video/creative software tools
function getSoftwareLogoSvg(name) {
  const normalized = name.toLowerCase();
  if (normalized.includes('premiere')) {
    return `<svg class="software-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#14002a" stroke="#ea00ff" stroke-width="1.5"/>
      <text x="12" y="16.5" font-family="'Outfit', sans-serif" font-size="12" font-weight="900" fill="#ea00ff" text-anchor="middle">Pr</text>
    </svg>`;
  }
  if (normalized.includes('after effects')) {
    return `<svg class="software-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#1a0029" stroke="#9999FF" stroke-width="1.5"/>
      <text x="12" y="16.5" font-family="'Outfit', sans-serif" font-size="12" font-weight="900" fill="#9999FF" text-anchor="middle">Ae</text>
    </svg>`;
  }
  if (normalized.includes('photoshop')) {
    return `<svg class="software-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#001d26" stroke="#00C8FF" stroke-width="1.5"/>
      <text x="12" y="16.5" font-family="'Outfit', sans-serif" font-size="12" font-weight="900" fill="#00C8FF" text-anchor="middle">Ps</text>
    </svg>`;
  }
  if (normalized.includes('illustrator')) {
    return `<svg class="software-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#261800" stroke="#FF9A00" stroke-width="1.5"/>
      <text x="12" y="16.5" font-family="'Outfit', sans-serif" font-size="12" font-weight="900" fill="#FF9A00" text-anchor="middle">Ai</text>
    </svg>`;
  }
  if (normalized.includes('resolve')) {
    return `<svg class="software-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="7.5" r="5" fill="#FF3B30" opacity="0.85" />
      <circle cx="8" cy="14.5" r="5" fill="#34C759" opacity="0.85" />
      <circle cx="16" cy="14.5" r="5" fill="#007AFF" opacity="0.85" />
    </svg>`;
  }
  if (normalized.includes('canva')) {
    return `<svg class="software-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="canvaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00C4CC"/>
          <stop offset="100%" stop-color="#7D2AE8"/>
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#canvaGrad)"/>
      <text x="12" y="17.5" font-family="'Outfit', sans-serif" font-size="15" font-weight="800" fill="#ffffff" text-anchor="middle">C</text>
    </svg>`;
  }
  if (normalized.includes('capcut')) {
    return `<svg class="software-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#000000"/>
      <path d="M9 7 L12 12 L9 17" stroke="#00f2fe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M15 7 L12 12 L15 17" stroke="#ff007f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>`;
  }
  return `<i class="fa-solid fa-clapperboard"></i>`;
}

// Extract Google Drive or YouTube ID to create an embeddable URL
function getVideoEmbedUrl(url) {
  if (!url) return '';
  
  // Google Drive
  const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }
  
  // YouTube (watch, shorts, embed, youtu.be)
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([^#\&\?]+)/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
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
  renderFooter();
  
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
      
      const targetUrl = btn.target ? (btn.target.startsWith('#') ? btn.target : `#${btn.target}`) : btn.url;
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

  if (aboutBio) {
    aboutBio.innerHTML = formatMarkdown(portfolioData.about.description);
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
    
    // Mark as detailed if it contains responsibilities or details
    const isDetailed = exp.responsibilities || exp.details;
    if (isDetailed) {
      item.classList.add('detailed-card');
    }

    const dot = document.createElement('div');
    dot.className = 'timeline-dot';

    const content = document.createElement('div');
    content.className = 'timeline-content';

    // 1. Header Section
    const header = document.createElement('div');
    header.className = 'experience-header';

    // Icon (show briefcase by default, or specific icon if provided)
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'experience-icon-wrapper';
    const icon = document.createElement('i');
    icon.className = exp.icon || 'fa-solid fa-briefcase';
    iconWrapper.appendChild(icon);
    header.appendChild(iconWrapper);

    // Title and Metadata
    const titleMeta = document.createElement('div');
    titleMeta.className = 'experience-title-meta';

    const h3 = document.createElement('h3');
    h3.textContent = exp.role;
    titleMeta.appendChild(h3);

    const orgRow = document.createElement('div');
    orgRow.className = 'experience-org-row';

    const org = document.createElement('span');
    org.className = 'timeline-org';
    org.textContent = exp.organization;
    orgRow.appendChild(org);

    const deptText = exp.department || (exp.details && exp.details.Team);
    if (deptText) {
      const dept = document.createElement('span');
      dept.className = 'timeline-dept';
      dept.textContent = deptText;
      orgRow.appendChild(dept);
    }
    titleMeta.appendChild(orgRow);

    // Badges/Meta Row
    const metaRow = document.createElement('div');
    metaRow.className = 'experience-meta-row';

    if (exp.duration) {
      const durationItem = document.createElement('span');
      durationItem.className = 'meta-item';
      const icon = document.createElement('i');
      icon.className = 'fa-regular fa-calendar';
      durationItem.appendChild(icon);
      durationItem.appendChild(document.createTextNode(' ' + exp.duration));
      metaRow.appendChild(durationItem);
    }

    const locationVal = exp.details && (exp.details.Location || exp.details['Work Mode']);
    if (locationVal) {
      const locItem = document.createElement('span');
      locItem.className = 'meta-item';
      const isRemote = locationVal.toLowerCase().includes('remote');
      const iconClass = isRemote ? 'fa-solid fa-laptop' : 'fa-solid fa-location-dot';
      const icon = document.createElement('i');
      icon.className = iconClass;
      locItem.appendChild(icon);
      locItem.appendChild(document.createTextNode(' ' + locationVal));
      metaRow.appendChild(locItem);
    }

    const empType = exp.details && (exp.details['Employment Type'] || exp.details.Position);
    if (empType && empType !== exp.role) {
      const empItem = document.createElement('span');
      empItem.className = 'meta-item';
      const icon = document.createElement('i');
      icon.className = 'fa-solid fa-briefcase';
      empItem.appendChild(icon);
      empItem.appendChild(document.createTextNode(' ' + empType));
      metaRow.appendChild(empItem);
    }

    titleMeta.appendChild(metaRow);

    header.appendChild(titleMeta);
    content.appendChild(header);

    // 2. Short Description
    const desc = document.createElement('p');
    desc.className = 'timeline-desc';
    desc.textContent = exp.description;
    content.appendChild(desc);

    // 3. Key Responsibilities Subsection
    if (exp.responsibilities && exp.responsibilities.length > 0) {
      const responsibilitiesSection = document.createElement('div');
      responsibilitiesSection.className = 'experience-subsection';

      const responsibilitiesTitle = document.createElement('h4');
      const listIcon = document.createElement('i');
      listIcon.className = 'fa-solid fa-list-check';
      responsibilitiesTitle.appendChild(listIcon);
      responsibilitiesTitle.appendChild(document.createTextNode(' Key Responsibilities'));
      responsibilitiesSection.appendChild(responsibilitiesTitle);

      const list = document.createElement('ul');
      list.className = 'responsibilities-list';
      exp.responsibilities.forEach(respText => {
        const li = document.createElement('li');
        const bulletIcon = document.createElement('i');
        bulletIcon.className = 'fa-solid fa-chevron-right';
        li.appendChild(bulletIcon);
        li.appendChild(document.createTextNode(' ' + respText));
        list.appendChild(li);
      });
      responsibilitiesSection.appendChild(list);
      content.appendChild(responsibilitiesSection);
    }

    // 5. Optional View Experience Action Button
    if (exp.viewUrl) {
      const actionDiv = document.createElement('div');
      actionDiv.className = 'experience-actions';

      const actionBtn = document.createElement('a');
      actionBtn.className = 'btn btn-experience-view';
      actionBtn.setAttribute('href', validateUrl(exp.viewUrl));
      actionBtn.setAttribute('target', '_blank');
      actionBtn.setAttribute('rel', 'noopener noreferrer');

      const viewIcon = document.createElement('i');
      viewIcon.className = 'fa-solid fa-arrow-up-right-from-square';
      actionBtn.appendChild(viewIcon);
      actionBtn.appendChild(document.createTextNode(' ' + (exp.viewText || 'View Experience')));
      
      actionDiv.appendChild(actionBtn);
      content.appendChild(actionDiv);
    }

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

    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'software-icon-container';
    iconWrapper.innerHTML = getSoftwareLogoSvg(soft.name);

    const name = document.createElement('span');
    name.textContent = soft.name;

    badge.appendChild(iconWrapper);
    badge.appendChild(name);
    container.appendChild(badge);
  });
}

/* ==================== PROJECTS ==================== */
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.replaceChildren();

  // Render the categories filter bar above the grid
  renderProjectsFilter();

  portfolioData.largeProjects.forEach(proj => {
    const card = document.createElement('div');
    card.className = 'project-card';
    if (proj.category === 'reels') {
      card.classList.add('vertical-card');
    }
    card.setAttribute('data-category', proj.category || 'long-form');

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'project-image';

    const img = document.createElement('img');
    img.src = validateUrl(proj.cover);
    img.alt = proj.title;
    img.loading = 'lazy';
    imageWrapper.appendChild(img);

    // Support silent loop hover video previews
    if (proj.previewVideo) {
      const video = document.createElement('video');
      video.className = 'project-preview-video';
      video.src = validateUrl(proj.previewVideo);
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('preload', 'metadata');
      
      imageWrapper.appendChild(video);
      
      card.addEventListener('mouseenter', () => {
        video.play().catch(err => console.log('Video play interrupted:', err));
        video.classList.add('playing');
      });
      
      card.addEventListener('mouseleave', () => {
        video.pause();
        video.classList.remove('playing');
        video.currentTime = 0;
      });
    }

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
      if (proj.watchUrl.includes('drive.google.com')) {
        openVideoModal(proj.title, proj.watchUrl);
      } else {
        window.open(validateUrl(proj.watchUrl), '_blank');
      }
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

function renderProjectsFilter() {
  const filterContainer = document.getElementById('projects-filter');
  if (!filterContainer) return;

  filterContainer.replaceChildren();

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'reels', label: 'Reels / Short-Form' },
    { id: 'long-form', label: 'Long-Form & Films' }
  ];

  categories.forEach((cat, index) => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    if (index === 0) btn.classList.add('active');
    btn.textContent = cat.label;
    btn.setAttribute('data-filter', cat.id);

    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProjects(cat.id);
    });

    filterContainer.appendChild(btn);
  });
}

function filterProjects(categoryId) {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    const cardCategory = card.getAttribute('data-category');
    if (categoryId === 'all' || cardCategory === categoryId) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}



/* ==================== CONTACT ==================== */
function renderContact() {
  const infoContainer = document.getElementById('contact-links-container');

  if (infoContainer) {
    infoContainer.replaceChildren();

    const methods = [
      { key: 'whatsapp', icon: 'fa-brands fa-whatsapp', label: 'WhatsApp', url: portfolioData.contact.whatsapp },
      { key: 'telegram', icon: 'fa-brands fa-telegram', label: 'Telegram', url: portfolioData.contact.telegram },
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

  // Populate dynamic email address and clipboard copy actions
  const emailAddressEl = document.getElementById('email-address');
  if (emailAddressEl) {
    emailAddressEl.textContent = portfolioData.contact.email || 'yadamakantikirankumarreddy@gmail.com';
  }

  const copyBtn = document.getElementById('btn-copy-email');
  const toast = document.getElementById('copy-toast');
  if (copyBtn && emailAddressEl && toast) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(emailAddressEl.textContent);
        toast.classList.add('show');
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => {
          toast.classList.remove('show');
          copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
        }, 2500);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  }

  // Hook up Contact Form with EmailJS and Validation States
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (form && status) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;

      // Remove any existing state classes
      form.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error-state', 'success-state');
      });

      // Simple email validation check
      const emailField = form.email;
      const emailValue = emailField.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!emailRegex.test(emailValue)) {
        emailField.parentElement.classList.add('error-state');
        status.textContent = '❌ Please enter a valid email address.';
        status.className = 'show error';
        return;
      }

      submitButton.disabled = true;
      submitButton.classList.add('btn-sending');
      submitButton.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
      
      // Hide status container during transport
      status.className = '';
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
          status.className = 'show success';
          form.querySelectorAll('.form-group').forEach(group => {
            group.classList.add('success-state');
          });
          form.reset();

          // Reset success states after 4 seconds
          setTimeout(() => {
            form.querySelectorAll('.form-group').forEach(group => {
              group.classList.remove('success-state');
            });
            status.className = '';
          }, 4000);
        }
      } catch (error) {
        console.error('EmailJS Error:', error);
        status.textContent = '❌ Failed to send message. Please contact me directly or try again.';
        status.className = 'show error';
        form.querySelectorAll('.form-group').forEach(group => {
          group.classList.add('error-state');
        });
      } finally {
        submitButton.disabled = false;
        submitButton.classList.remove('btn-sending');
        submitButton.textContent = originalButtonText;
      }
    });
  }
}

/* ==================== FOOTER ==================== */
function renderFooter() {
  const container = document.getElementById('footer-socials');
  if (!container) return;

  container.replaceChildren();

  const socials = [
    { key: 'whatsapp', icon: 'fa-brands fa-whatsapp', url: portfolioData.contact.whatsapp },
    { key: 'telegram', icon: 'fa-brands fa-telegram', url: portfolioData.contact.telegram },
    { key: 'instagram_work', icon: 'fa-brands fa-instagram', url: portfolioData.contact.instagram_work },
    { key: 'linkedin', icon: 'fa-brands fa-linkedin', url: portfolioData.contact.linkedin },
    { key: 'youtube', icon: 'fa-brands fa-youtube', url: portfolioData.contact.youtube }
  ];

  socials.forEach(item => {
    if (item.url) {
      const a = document.createElement('a');
      a.setAttribute('href', validateUrl(item.url));
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      a.className = `footer-social-link ${item.key}`;

      const icon = document.createElement('i');
      icon.className = item.icon;

      a.appendChild(icon);
      container.appendChild(a);
    }
  });
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

  const embedUrl = getVideoEmbedUrl(url);
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
    const scrollPosition = window.scrollY;
    
    // Check if scrolled near the bottom of the page
    const isBottom = (window.innerHeight + scrollPosition) >= document.documentElement.scrollHeight - 50;

    if (isBottom) {
      current = 'contact';
    } else {
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollPosition >= sectionTop - 150) {
          current = section.getAttribute('id');
        }
      });
    }

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
    const titles = ['Video Editor & Motion Designer', 'Creative Content Creator'];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const currentTitle = titles[titleIndex];

      if (isDeleting) {
        charIndex--;
      } else {
        charIndex++;
      }

      subtitleEl.textContent = currentTitle.substring(0, charIndex);

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
