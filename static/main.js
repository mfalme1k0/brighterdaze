const navbar = document.querySelector('.navbar');
const revealElements = document.querySelectorAll('.reveal');
const navLinks = document.querySelectorAll('.nav-link, .navbar .btn');
const navbarCollapse = document.querySelector('.navbar-collapse');
const bookingForm = document.querySelector('#booking form');
const yearElement = document.querySelector('#year');

function updateNavbar() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.16,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach((element) => revealObserver.observe(element));

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      const collapseInstance = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
      collapseInstance.hide();
    }
  });
});

if (bookingForm) {
  const statusMessage = document.createElement('div');
  statusMessage.className = 'mt-3 mb-0';
  statusMessage.setAttribute('aria-live', 'polite');
  bookingForm.appendChild(statusMessage);

  bookingForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nameField = bookingForm.querySelector('#name');
    const emailField = bookingForm.querySelector('#email');
    const serviceField = bookingForm.querySelector('#service');
    const dateField = bookingForm.querySelector('#date');
    const messageField = bookingForm.querySelector('#message');
    const button = bookingForm.querySelector('button[type="submit"]');
    const originalText = button.textContent;

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const service = serviceField.value.trim();
    const date = dateField.value.trim();
    const message = messageField.value.trim();

    if (!name || !email || !service || !date) {
      statusMessage.className = 'alert alert-danger mt-3 mb-0 py-2';
      statusMessage.textContent = 'Please complete all required fields before sending your request.';
      if (!name) nameField.focus();
      else if (!email) emailField.focus();
      else if (!service) serviceField.focus();
      else dateField.focus();
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      statusMessage.className = 'alert alert-danger mt-3 mb-0 py-2';
      statusMessage.textContent = 'Please enter a valid email address.';
      emailField.focus();
      return;
    }

    const formData = new FormData(bookingForm);
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]')?.value;

    button.textContent = 'Sending...';
    button.disabled = true;
    statusMessage.className = 'alert alert-info mt-3 mb-0 py-2';
    statusMessage.textContent = 'Sending your request...';

    try {
      const response = await fetch(bookingForm.action, {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrfToken || ''
        },
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Unable to submit your request.');
      }

      statusMessage.className = 'alert alert-success mt-3 mb-0 py-2';
      statusMessage.textContent = `Thanks, ${name}! Your booking request for ${service} has been received.`;
      bookingForm.reset();
    } catch (error) {
      statusMessage.className = 'alert alert-danger mt-3 mb-0 py-2';
      statusMessage.textContent = error.message;
    } finally {
      button.textContent = originalText;
      button.disabled = false;
    }
  });
}

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

window.addEventListener('scroll', updateNavbar, { passive: true });
window.addEventListener('load', updateNavbar);
