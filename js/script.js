// Constantes
const TEMPO_EXIBICAO = 8000;
const CAMINHO_BASE = './'; // Ajuste se necessário (ex.: '/recursos/')
const LIMITE_REGISTROS = 50;

// Estado do jogo
let espelhoQuebrado = false;
let travaHistorico = true;

// Elementos DOM (com validação)
const elementos = {
  areaClicavel: 'area-clicavel',
  balaoDeFala: 'balao-de-fala',
  bonusInput: 'bonusInput',
  decreaseButton: 'decreaseBonus',
  increaseButton: 'increaseBonus',
  espelho: 'espelho',
  listaRegistro: 'lista-registro',
  toggleHistorico: 'toggle-historico',
  registro: 'registro',
  iconeTrava: 'icone-trava'
};

const dom = {};
function inicializarElementos() {
  for (const [nome, id] of Object.entries(elementos)) {
    dom[nome] = document.getElementById(id);
    if (!dom[nome]) {
      console.error(`Elemento '${id}' não encontrado!`);
      return false;
    }
  }
  // Configurações iniciais
  dom.registro.style.display = 'none';
  dom.toggleHistorico.textContent = 'Mostrar Histórico';
  dom.balaoDeFala.setAttribute('role', 'alert');
  dom.areaClicavel.setAttribute('tabindex', '0');
  return true;
}

if (!inicializarElementos()) {
  console.error("Falha ao inicializar. Script interrompido.");
  throw new Error("Inicialização falhou");
}

// Lista de opções do espelho
const opcoes = [
  { nome: 'Rosto Radiante', tipo: 'excelente', mensagem: 'Olha para mim e vê quem tu és verdadeiramente. Agora, carrega essa verdade contigo.', efeito: 'Concede ao jogador +1 ponto permanente em um atributo à escolha.' },
  { nome: 'Olhar Estrelado', tipo: 'bom', mensagem: 'Tu és parte do grande tecido do cosmos. Sente sua força correr em tuas veias.', efeito: 'Concede ao jogador uma bênção (ex.: vantagem em testes, resistência a um tipo de dano, um ataque adicional por rodada) até o próximo descanso longo.' },
  { nome: 'Sorriso Enigmático', tipo: 'bom', mensagem: 'Um lampejo do futuro... ou talvez do passadocrate. Decifra seu significado.', efeito: 'Concede uma informação importante sobre o vilão, um segredo oculto ou aventura.' },
  { nome: 'Olhar Confuso', tipo: 'neutro', mensagem: 'Não compreendo... mas talvez tu consigas. Escuta estas palavras.', efeito: 'Concede um enigma ou mensagem críptica que pode desencadear uma side quest ou avançar trama.' },
  { nome: 'Sorriso Tímido', tipo: 'neutro', mensagem: 'O que está escondido espera por ti... mas o preço pode ser alto do que imaginas.', efeito: 'Abre uma passagem para o mundo do espelho, onde os jogadores podem buscar um tesouro ou segredo valioso. No entanto, cada vez que o poder é usado, a prisão do ser aprisionado é enfraquecida, aproximando-o de sua liberdade (-1 de Penalidade).' },
  { nome: 'Olhar Distante', tipo: 'neutro', mensagem: 'O que vês pode ser verdade... ou apenas sombras do que poderia ser.', efeito: 'Prende o jogador em uma ilusão por 1d4 rodadas com pistas ou efeitos.' },
  { nome: 'Olho Flamejante', tipo: 'ruim', mensagem: 'Teu destino arde em chamas... e eu sou a centelha.', efeito: 'O jogador deve fazer um salvaguarda de Sabedoria (CD 15) ou será hipnose por 1d4 rodadas.' },
  { nome: 'Coração Pulsante', tipo: 'ruim', mensagem: 'Tua energia alimenta minha prisão... mas também me fortalece.', efeito: 'O jogador deve fazer um salvaguarda de Constituição (CD 15). Se passar, sofre 1d6 de dano necrótico. Se falhar, sofre 1d6 de dano necrótico e tem 1 ponto de um atributo reduzido até o próximo descanso longo.' },
  { nome: 'Olhar Vazio', tipo: 'ruim', mensagem: 'No vazio, tu és nada... e eu sou tudo.', efeito: 'Todos os jogadores devem fazer um salvaguarda de Sabedoria (CD 15). Se falharem, sofrem uma maldição que impõe desvantagem em todos os ataques e testes de habilidade até o próximo descanso longo.' },
  { nome: 'Espelho Quebrado', tipo: 'pessimo', mensagem: 'Olhem para mim agora... e vejam o que libertaram.', efeito: 'Libera o ser maligno aprisionado. Ele se liga à sombra de um jogador (geralmente, quem o libertou) e começa a perturbar todos os jogadores com eventos assustadores, até see descoberto como uma entidade ligada à sombra do jogador. Após ser descoberto, ele começa a sussurrar diretamente no ouvido do portador, manipulando sua mente e causando caos. Até ser removido ou se fortalecer para assumir uma forma física e confrontar os jogadores.' }
];

// Mapeamento de mídia
const imagensPorEfeito = {
  'Rosto Radiante': `${CAMINHO_BASE}img/espelhoradiante.jpg`,
  'Olhar Estrelado': `${CAMINHO_BASE}img/espelhowink.jpg`,
  'Sorriso Enigmático': `${CAMINHO_BASE}img/espelhoenigma.jpg`,
  'Olhar Confuso': `${CAMINHO_BASE}img/espelhoconfuso.jpg`,
  'Sorriso Tímido': `${CAMINHO_BASE}img/espelhotimido.jpg`,
  'Olhar Distante': `${CAMINHO_BASE}img/espelhodistante.jpg`,
  'Olho Flamejante': `${CAMINHO_BASE}img/espelhohipnose.jpg`,
  'Coração Pulsante': `${CAMINHO_BASE}img/espelhovitae.jpg`,
  'Olhar Vazio': `${CAMINHO_BASE}img/espelhovazio.jpg`,
  'Espelho Quebrado': `${CAMINHO_BASE}img/espelhoquebrado.jpg`,
  'AvisoDM': `${CAMINHO_BASE}img/espelhoaviso.jpg`
};

const listaDeSons = {
  'Rosto Radiante': `${CAMINHO_BASE}sons/radiant.mp3`,
  'Espelho Quebrado': `${CAMINHO_BASE}sons/broken.mp3`
};

// Pré-carrega sons
const sons = {};
for (const nomeDoEfeito in listaDeSons) {
  sons[nomeDoEfeito] = new Audio(listaDeSons[nomeDoEfeito]);
  sons[nomeDoEfeito].preload = 'auto';
}

// Funções utilitárias
function mostrarBalao(mensagem, duracao = TEMPO_EXIBICAO) {
  dom.balaoDeFala.textContent = mensagem;
  dom.balaoDeFala.classList.add('visible');
  setTimeout(() => dom.balaoDeFala.classList.remove('visible'), duracao);
}

function tocarSom(nomeDoEfeito) {
  if (sons[nomeDoEfeito]) {
    sons[nomeDoEfeito].play().catch(() => {
      mostrarBalao("Efeito sonoro não disponível!", 3000);
    });
  }
}

function obterBonus() {
  const valor = dom.bonusInput.value;
  if (!valor || isNaN(valor)) {
    return 0;
  }
  return Math.max(-5, Math.min(5, parseInt(valor))); // Limita entre -5 e +5
}

// Lógica do jogo
function calcularProbabilidades(bonus) {
  let excelente = 1;
  let bons = 20;
  let ruins = 45;
  let pessimo = 4;
  const neutros = 30; // Fixo em 30%

  if (bonus !== 0) {
    excelente += bonus * 1;
    bons += bonus * 2;
    ruins -= bonus * 3;
    pessimo -= bonus * 1;
  }

  // Garante valores não negativos
  excelente = Math.max(0, excelente);
  bons = Math.max(0, bons);
  ruins = Math.max(0, ruins);
  pessimo = Math.max(0, pessimo);

  // Normaliza excelente, bons, ruins e pessimo para 70%
  const totalVariavel = excelente + bons + ruins + pessimo;
  const fatorNormalizacao = totalVariavel > 0 ? 70 / totalVariavel : 1;

  return [
    (excelente * fatorNormalizacao) / 100 * 100, // % dentro dos 70%
    (bons * fatorNormalizacao) / 100 * 100,
    neutros, // Sempre 30%
    (ruins * fatorNormalizacao) / 100 * 100,
    (pessimo * fatorNormalizacao) / 100 * 100
  ];
}

function gerarResultado(bonus) {
  const probabilidades = calcularProbabilidades(bonus);
  const sorteio = Math.random() * 100;
  let acumulado = 0;

  for (let i = 0; i < probabilidades.length; i++) {
    acumulado += probabilidades[i];
    if (sorteio < acumulado) {
      const categoria = ['excelente', 'bom', 'neutro', 'ruim', 'pessimo'][i];
      const opcoesFiltradas = opcoes.filter(opcao => opcao.tipo === categoria);
      return opcoesFiltradas[Math.floor(Math.random() * opcoesFiltradas.length)];
    }
  }
  return opcoes[0]; // Fallback (nunca deve ocorrer)
}

function exibirResultado(resultado) {
  mostrarBalao(resultado.mensagem);

  const novaImagem = imagensPorEfeito[resultado.nome];
  if (novaImagem) {
    dom.espelho.src = novaImagem;
    if (resultado.nome === 'Espelho Quebrado') {
      espelhoQuebrado = true;
      tocarSom(resultado.nome);
      salvarEstado();
    } else if (!espelhoQuebrado) {
      setTimeout(() => {
        if (!espelhoQuebrado) {
          dom.espelho.src = `${CAMINHO_BASE}img/espelhomagico.png`;
        }
      }, TEMPO_EXIBICAO);
    }
  } else {
    console.warn(`Imagem para '${resultado.nome}' não encontrada!`);
  }

  const novoItem = document.createElement('li');
  novoItem.textContent = resultado.efeito;
  dom.listaRegistro.prepend(novoItem);

  // Limita registros
  if (dom.listaRegistro.children.length > LIMITE_REGISTROS) {
    dom.listaRegistro.removeChild(dom.listaRegistro.lastChild);
  }
}

function alternarTrava() {
  travaHistorico = !travaHistorico;
  dom.iconeTrava.title = travaHistorico
    ? "Clique para desbloquear o histórico (DM Only)"
    : "Clique para bloquear o histórico";
  dom.iconeTrava.classList.toggle('travado', travaHistorico);
  if (!travaHistorico && !espelhoQuebrado) {
    dom.espelho.src = `${CAMINHO_BASE}img/espelhomagico.png`;
  }
  salvarEstado();
}

function ajustarBonus(direcao) {
  let bonus = obterBonus();
  if (direcao === 'aumentar' && bonus < 5) {
    bonus += 1;
  } else if (direcao === 'diminuir' && bonus > -5) {
    bonus -= 1;
  }
  dom.bonusInput.value = bonus;
}

// Eventos
dom.areaClicavel.addEventListener('click', () => {
  if (espelhoQuebrado) return;
  const bonus = obterBonus();
  const resultado = gerarResultado(bonus);
  exibirResultado(resultado);
});

dom.areaClicavel.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') dom.areaClicavel.click();
});

dom.decreaseButton.addEventListener('click', () => ajustarBonus('diminuir'));
dom.increaseButton.addEventListener('click', () => ajustarBonus('aumentar'));

dom.iconeTrava.addEventListener('click', alternarTrava);

dom.toggleHistorico.addEventListener('click', () => {
  if (travaHistorico) {
    mostrarBalao("Hey, você é o DM? Então é melhor não mexer aí!");
    if (!espelhoQuebrado) {
      const novaImagem = imagensPorEfeito['AvisoDM'];
      if (novaImagem) {
        dom.espelho.src = novaImagem;
        setTimeout(() => {
          if (!espelhoQuebrado) {
            dom.espelho.src = `${CAMINHO_BASE}img/espelhomagico.png`;
          }
        }, TEMPO_EXIBICAO);
      } else {
        console.warn('Imagem AvisoDM não encontrada!');
      }
    }
    return;
  }
  const visivel = dom.registro.style.display !== 'block';
  dom.registro.style.display = visivel ? 'block' : 'none';
  dom.toggleHistorico.textContent = visivel ? 'Ocultar Histórico' : 'Mostrar Histórico';
  if (!espelhoQuebrado && dom.espelho.src !== `${CAMINHO_BASE}img/espelhomagico.png`) {
    dom.espelho.src = `${CAMINHO_BASE}img/espelhomagico.png`;
  }
});

window.addEventListener('load', () => {
  console.log('Carregando página...');
  espelhoQuebrado = false; // Força espelho não quebrado
  travaHistorico = true; // Força histórico travado
  localStorage.setItem('espelhoQuebrado', espelhoQuebrado);
  localStorage.setItem('travaHistorico', travaHistorico);
  dom.espelho.src = `${CAMINHO_BASE}img/espelhomagico.png`;
  dom.iconeTrava.title = "Clique para desbloquear o histórico (DM Only)";
  dom.iconeTrava.classList.add('travado');
  console.log('Estado inicial:', { espelhoQuebrado, travaHistorico });
});

function salvarEstado() {
  localStorage.setItem('espelhoQuebrado', espelhoQuebrado);
  localStorage.setItem('travaHistorico', travaHistorico);
}