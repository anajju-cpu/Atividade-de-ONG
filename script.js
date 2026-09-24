// =========================================================
// Amor Animal ONG — script.js
// JavaScript puro, sem dependências externas
// =========================================================

document.addEventListener('DOMContentLoaded', function () {
  inicializarMenuResponsivo();
  inicializarRolagemSuave();
  inicializarBotaoVoltarTopo();
  inicializarFormularioCadastro();
});

/* ---------------------------------------------------------
   Menu responsivo
--------------------------------------------------------- */
function inicializarMenuResponsivo() {
  const botaoMenu = document.querySelector('.botao-menu');
  const menu = document.querySelector('.menu-principal');

  if (!botaoMenu || !menu) return;

  botaoMenu.addEventListener('click', function () {
    const aberto = menu.classList.toggle('aberto');
    botaoMenu.classList.toggle('aberto', aberto);
    botaoMenu.setAttribute('aria-expanded', aberto ? 'true' : 'false');
  });

  // Fecha o menu ao clicar em um link (útil em telas pequenas)
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('aberto');
      botaoMenu.classList.remove('aberto');
      botaoMenu.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------------------------------------------------
   Rolagem suave entre seções (fallback para navegadores
   sem suporte a scroll-behavior via CSS)
--------------------------------------------------------- */
function inicializarRolagemSuave() {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (evento) {
      const destinoId = link.getAttribute('href');
      if (destinoId.length <= 1) return;
      const destino = document.querySelector(destinoId);
      if (!destino) return;
      evento.preventDefault();
      destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ---------------------------------------------------------
   Botão "Voltar ao topo"
--------------------------------------------------------- */
function inicializarBotaoVoltarTopo() {
  const botao = document.querySelector('.voltar-topo');
  if (!botao) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 420) {
      botao.classList.add('visivel');
    } else {
      botao.classList.remove('visivel');
    }
  });

  botao.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------------------------------------------------------
   Validação do formulário de cadastro
--------------------------------------------------------- */
function inicializarFormularioCadastro() {
  const formulario = document.getElementById('formulario-cadastro');
  if (!formulario) return;

  const botaoLimpar = formulario.querySelector('.botao-limpar');
  const caixaSucesso = document.getElementById('mensagem-sucesso');

  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const valido = validarFormulario(formulario);

    if (valido) {
      if (caixaSucesso) {
        caixaSucesso.textContent = 'Cadastro enviado com sucesso! Em breve nossa equipe entrará em contato com você. Obrigado por fazer parte dessa causa. 🐾';
        caixaSucesso.classList.add('visivel');
        caixaSucesso.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      formulario.reset();
      formulario.querySelectorAll('.campo-invalido').forEach(function (campo) {
        campo.classList.remove('campo-invalido');
      });
    } else if (caixaSucesso) {
      caixaSucesso.classList.remove('visivel');
    }
  });

  if (botaoLimpar) {
    botaoLimpar.addEventListener('click', function () {
      formulario.reset();
      formulario.querySelectorAll('.campo-invalido').forEach(function (campo) {
        campo.classList.remove('campo-invalido');
      });
      formulario.querySelectorAll('.mensagem-erro').forEach(function (erro) {
        erro.classList.remove('visivel');
        erro.textContent = '';
      });
      if (caixaSucesso) caixaSucesso.classList.remove('visivel');
    });
  }

  // Validação ao sair do campo (melhora a experiência do usuário)
  formulario.querySelectorAll('input, select, textarea').forEach(function (campo) {
    campo.addEventListener('blur', function () {
      validarCampo(campo);
    });
  });

  // Máscaras simples para facilitar o preenchimento
  aplicarMascara(formulario.querySelector('#cpf'), mascararCPF);
  aplicarMascara(formulario.querySelector('#telefone'), mascararTelefone);
  aplicarMascara(formulario.querySelector('#cep'), mascararCEP);
}

function aplicarMascara(campo, funcaoMascara) {
  if (!campo) return;
  campo.addEventListener('input', function () {
    campo.value = funcaoMascara(campo.value);
  });
}

function mascararCPF(valor) {
  return valor
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function mascararTelefone(valor) {
  const numeros = valor.replace(/\D/g, '').slice(0, 11);
  if (numeros.length <= 10) {
    return numeros
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return numeros
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

function mascararCEP(valor) {
  return valor
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, '$1-$2');
}

/* ---------------------------------------------------------
   Validação: percorre todos os campos obrigatórios
--------------------------------------------------------- */
function validarFormulario(formulario) {
  let formularioValido = true;

  const campos = formulario.querySelectorAll('[required]');
  campos.forEach(function (campo) {
    const campoValido = validarCampo(campo);
    if (!campoValido) formularioValido = false;
  });

  // Validação dos grupos de radio (tipo de interesse, tipo de animal)
  const gruposRadio = formulario.querySelectorAll('.grupo-obrigatorio');
  gruposRadio.forEach(function (grupo) {
    const marcado = grupo.querySelector('input[type="radio"]:checked');
    const erro = grupo.parentElement.querySelector('.mensagem-erro');
    if (!marcado) {
      formularioValido = false;
      if (erro) {
        erro.textContent = 'Selecione uma opção.';
        erro.classList.add('visivel');
      }
    } else if (erro) {
      erro.classList.remove('visivel');
    }
  });

  // Aceite dos termos
  const aceite = formulario.querySelector('#aceite-termos');
  if (aceite && !aceite.checked) {
    formularioValido = false;
    const erro = document.getElementById('erro-aceite');
    if (erro) {
      erro.textContent = 'É necessário aceitar os termos para continuar.';
      erro.classList.add('visivel');
    }
  } else {
    const erro = document.getElementById('erro-aceite');
    if (erro) erro.classList.remove('visivel');
  }

  return formularioValido;
}

/* ---------------------------------------------------------
   Validação individual de um campo
--------------------------------------------------------- */
function validarCampo(campo) {
  const valor = campo.value.trim();
  const erroElemento = document.getElementById('erro-' + campo.id);
  let mensagem = '';

  if (campo.hasAttribute('required') && valor === '') {
    mensagem = 'Este campo é obrigatório.';
  } else if (valor !== '') {
    if (campo.type === 'email' && !validarEmail(valor)) {
      mensagem = 'Digite um e-mail válido, exemplo: nome@email.com.';
    } else if (campo.id === 'cpf' && !validarCPF(valor)) {
      mensagem = 'Digite um CPF válido, no formato 000.000.000-00.';
    } else if (campo.id === 'telefone' && !validarTelefone(valor)) {
      mensagem = 'Digite um telefone válido, com DDD, exemplo: (11) 91234-5678.';
    } else if (campo.id === 'cep' && !validarCEP(valor)) {
      mensagem = 'Digite um CEP válido, no formato 00000-000.';
    } else if (campo.type === 'date' && campo.id === 'data-nascimento') {
      const idadeValida = validarDataNascimento(valor);
      if (!idadeValida) mensagem = 'Verifique a data de nascimento informada.';
    }
  }

  if (mensagem) {
    campo.classList.add('campo-invalido');
    if (erroElemento) {
      erroElemento.textContent = mensagem;
      erroElemento.classList.add('visivel');
    }
    return false;
  }

  campo.classList.remove('campo-invalido');
  if (erroElemento) {
    erroElemento.textContent = '';
    erroElemento.classList.remove('visivel');
  }
  return true;
}

/* ---------------------------------------------------------
   Regras de validação específicas
--------------------------------------------------------- */
function validarEmail(email) {
  const padrao = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return padrao.test(email);
}

function validarTelefone(telefone) {
  const numeros = telefone.replace(/\D/g, '');
  return numeros.length === 10 || numeros.length === 11;
}

function validarCEP(cep) {
  const numeros = cep.replace(/\D/g, '');
  return numeros.length === 8;
}

function validarDataNascimento(data) {
  const dataNascimento = new Date(data);
  const hoje = new Date();
  if (isNaN(dataNascimento.getTime())) return false;
  return dataNascimento < hoje;
}

function validarCPF(cpf) {
  const numeros = cpf.replace(/\D/g, '');
  if (numeros.length !== 11) return false;

  // Rejeita sequências repetidas (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(numeros)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(numeros.charAt(i), 10) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(numeros.charAt(9), 10)) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(numeros.charAt(i), 10) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(numeros.charAt(10), 10);
}
