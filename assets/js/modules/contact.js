export function initContact() {
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome     = form.nome.value.trim();
    const email    = form.email.value.trim();
    const mensagem = form.mensagem.value.trim();

    if (!nome || !email || !mensagem) {
      showStatus('Preencha todos os campos.', 'error');
      return;
    }

    if (!/.+@.+\..+/.test(email)) {
      showStatus('Informe um e-mail válido.', 'error');
      return;
    }

    const subject = encodeURIComponent(`Contato do portfólio — ${nome}`);
    const body    = encodeURIComponent(`Nome: ${nome}\nE-mail: ${email}\n\n${mensagem}`);

    window.location.href = `mailto:pablohlaraujo@gmail.com?subject=${subject}&body=${body}`;
    showStatus('Redirecionando para o cliente de e-mail...', 'success');
    form.reset();
  });

  function showStatus(msg, type) {
    status.textContent = msg;
    status.className   = `form__status ${type}`;
    setTimeout(() => {
      status.textContent = '';
      status.className   = 'form__status';
    }, 5000);
  }
}
