// Crie uma chave gratuita em https://web3forms.com e substitua o valor abaixo
// para ativar o envio real. Enquanto não configurar, o formulário usa o
// cliente de e-mail (mailto) como fallback.
const ACCESS_KEY = 'CONFIGURE_SEU_ACCESS_KEY_WEB3FORMS';

export function initContact() {
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (!form || !status) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome     = form.nome.value.trim();
    const email    = form.email.value.trim();
    const mensagem = form.mensagem.value.trim();

    // Validação: campos obrigatórios
    if (!nome || !email || !mensagem) {
      showStatus('Preencha todos os campos.', 'error');
      return;
    }

    // Validação: regex simples de e-mail
    if (!/.+@.+\..+/.test(email)) {
      showStatus('Informe um e-mail válido.', 'error');
      return;
    }

    // Fallback mailto enquanto a chave não estiver configurada
    if (ACCESS_KEY === 'CONFIGURE_SEU_ACCESS_KEY_WEB3FORMS') {
      const subject = encodeURIComponent(`Contato do portfólio — ${nome}`);
      const body    = encodeURIComponent(`Nome: ${nome}\nE-mail: ${email}\n\n${mensagem}`);

      window.location.href = `mailto:pablohlaraujo@gmail.com?subject=${subject}&body=${body}`;
      showStatus('Abrindo seu cliente de e-mail…', 'success');
      form.reset();
      return;
    }

    // Envio real via Web3Forms
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText   = submitBtn ? submitBtn.textContent : '';

    if (submitBtn) submitBtn.disabled = true;
    showStatus('Enviando…', '');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name: nome,
          email,
          message: mensagem,
          subject: 'Contato do portfólio — ' + nome,
          from_name: 'Portfólio Pablo Henrique',
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showStatus('Mensagem enviada com sucesso! Retornarei em breve.', 'success');
        form.reset();
      } else {
        showStatus('Não foi possível enviar agora. Tente novamente ou use o e-mail direto.', 'error');
      }
    } catch {
      showStatus('Não foi possível enviar agora. Tente novamente ou use o e-mail direto.', 'error');
    } finally {
      // Reabilita o botão e restaura o texto original
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = btnText || 'Enviar mensagem';
      }
    }
  });

  function showStatus(msg, type) {
    status.textContent = msg;
    status.className   = `form__status ${type}`;
    // Limpa a mensagem após alguns segundos (erros ficam ~6s)
    setTimeout(() => {
      status.textContent = '';
      status.className   = 'form__status';
    }, 6000);
  }
}
