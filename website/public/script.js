async function loadProjects() {
  const container = document.getElementById('projects-list');
  try {
    const res = await fetch('/api/projects');
    if (!res.ok) throw new Error('Errore nel caricamento dei progetti');
    const projects = await res.json();

    if (projects.length === 0) {
      container.innerHTML = '<p class="loading">Nessun progetto ancora.</p>';
      return;
    }

    container.innerHTML = projects
      .map(
        (p) => `
        <article class="project-card">
          <h3>${escapeHtml(p.title)}</h3>
          <p>${escapeHtml(p.description)}</p>
          ${p.link ? `<a href="${escapeAttribute(p.link)}" target="_blank" rel="noopener">Vedi progetto &rarr;</a>` : ''}
        </article>
      `
      )
      .join('');
  } catch (err) {
    container.innerHTML = '<p class="error">Impossibile caricare i progetti al momento.</p>';
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttribute(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';
    status.className = 'form-status';
    submitBtn.disabled = true;

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Errore durante l\'invio.');
      }

      status.textContent = 'Messaggio inviato, grazie!';
      status.classList.add('success');
      form.reset();
    } catch (err) {
      status.textContent = err.message;
      status.classList.add('error');
    } finally {
      submitBtn.disabled = false;
    }
  });
}

loadProjects();
initContactForm();
