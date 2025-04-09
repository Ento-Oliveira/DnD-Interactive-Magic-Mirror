const areaClicavel = document.getElementById('area-clicavel');
const balaoDeFala = document.getElementById('balao-de-fala');
const bonusInput = document.getElementById('bonusInput');
const decreaseButton = document.getElementById('decreaseBonus');
const increaseButton = document.getElementById('increaseBonus');
const espelho = document.getElementById('espelho');
const listaRegistro = document.getElementById('lista-registro');
const toggleHistorico = document.getElementById('toggle-historico');
const registro = document.getElementById('registro');

const opcoes = [
  { nome: 'Rosto Radiante', tipo: 'excelente', mensagem: 'Olha para mim e vê quem tu és verdadeiramente. Agora, carrega essa verdade contigo.', efeito: 'Concede ao jogador +1 ponto permanente em um atributo à escolha.' },
  { nome: 'Olhar Estrelado', tipo: 'bom', mensagem: 'Tu és parte do grande tecido do cosmos. Sente sua força correr em tuas veias.', efeito: 'Concede ao jogador uma bênção (ex.: vantagem em testes, resistência a um tipo de dano, um ataque adicional por rodada) até o próximo descanso longo.' },
  { nome: 'Sorriso Enigmático', tipo: 'bom', mensagem: 'Um lampejo do futuro... ou talvez do passado. Decifra seu significado.', efeito: 'Concede ao jogador uma informação importante sobre o vilão, um segredo oculto ou o próximo passo da aventura.' },
  { nome: 'Olhar Confuso', tipo: 'neutro', mensagem: 'Não compreendo... mas talvez tu consigas. Escuta estas palavras.', efeito: 'Concede um enigma ou mensagem críptica que pode desencadear uma side quest ou avançar a trama principal.' },
  { nome: 'Sorriso Tímido', tipo: 'neutro', mensagem: 'O que está escondido espera por ti... mas o preço pode ser mais alto do que imaginas.', efeito: 'Ele abre uma passagem para o mundo do espelho, onde os jogadores podem buscar um tesouro ou segredo valioso. No entanto, cada vez que o poder é usado, a prisão do ser aprisionado é enfraquecida, aproximando-o de sua liberdade.' },
  { nome: 'Olhar Distante', tipo: 'neutro', mensagem: 'O que vês pode ser verdade... ou apenas sombras do que poderia ser.', efeito: 'Prende o jogador em uma ilusão dentro do espelho por 1d4 rodadas, mostrando eventos distorcidos do passado ou futuro. Ao sair, o jogador pode ganhar uma pista importante ou sofrer efeitos psicológicos temporários.' },
  { nome: 'Olho Flamejante', tipo: 'ruim', mensagem: 'Teu destino arde em chamas... e eu sou a centelha.', efeito: 'O jogador deve fazer um teste de resistência (Sabedoria, CD 15) ou será hipnotizado/controlado por 1d4 rodadas, agindo de forma prejudicial ao grupo ou seguindo ordens do ser aprisionado.' },
  { nome: 'Coração Pulsante', tipo: 'ruim', mensagem: 'Tua energia alimenta minha prisão... mas também me fortalece.', efeito: 'O jogador deve fazer um teste de resistência (Constituição, CD 15). Se passar, sofre 1d6 de dano necrótico. Se falhar, sofre 1d6 de dano necrótico e tem 1 ponto de um atributo reduzido até o próximo descanso longo.' },
  { nome: 'Olhar Vazio', tipo: 'ruim', mensagem: 'Os olhos do reflexo ficam negros.', efeito: 'Todos os jogadores ficam cegos por alguns turnos.' },
  { nome: 'Espelho Quebrado', tipo: 'pessimo', mensagem: 'O espelho se parte violentamente.', efeito: 'Libera o ser maligno aprisionado.' }
];

const imagensPorEfeito = {
  'Rosto Radiante': './img/espelhoradiante.jpg',
  'Olhar Estrelado': './img/espelhowink.jpg',
  'Sorriso Enigmático': './img/espelhoenigma.jpg',
  'Olhar Confuso': './img/espelhoconfuso.jpg',
  'Sorriso Tímido': './img/espelhotimido.jpg',
  'Olhar Distante': './img/espelhodistante.jpg',
  'Olho Flamejante': './img/espelhohipnose.jpg',
  'Coração Pulsante': './img/espelhovitae.jpg',
  'Olhar Vazio': './img/espelhovazio.jpg',
  'Espelho Quebrado': './img/espelhoquebrado.jpg'
};


function calcularProbabilidades(bonus) {
  let excelente = 1;
  let bons = 20;
  let neutros = 30;
  let ruins = 45;
  let pessimo = 4;

  if (bonus > 0) {
    excelente += bonus * 1;
    bons += bonus * 2;
    ruins -= bonus * 3;
    pessimo -= bonus * 1;
  } else if (bonus < 0) {
    excelente += bonus * 1;
    bons += bonus * 2;
    ruins -= bonus * 3;
    pessimo -= bonus * 1;
  }

  excelente = Math.max(0, excelente);
  bons = Math.max(0, bons);
  ruins = Math.max(0, ruins);
  pessimo = Math.max(0, pessimo);

  neutros = 100 - (excelente + bons + ruins + pessimo);

  return [excelente, bons, neutros, ruins, pessimo];
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
}

function exibirResultado(resultado) {
  if (!resultado) {
    console.error("Resultado inválido!");
    return;
  }

  balaoDeFala.textContent = resultado.mensagem;
  balaoDeFala.classList.add('visible');

  const novaImagem = imagensPorEfeito[resultado.nome];
  if (novaImagem) {
    espelho.src = novaImagem;

    setTimeout(() => {
      espelho.src = './img/espelhomagico.png';
    }, 5000);
  }

  const novoItem = document.createElement('li');
  novoItem.textContent = resultado.efeito;
  listaRegistro.prepend(novoItem);
}

function limparBalao() {
  setTimeout(() => {
    balaoDeFala.classList.remove('visible');
  }, 5000);
}

areaClicavel.addEventListener('click', () => {
  const bonus = parseInt(bonusInput.value);
  const resultado = gerarResultado(bonus);

  exibirResultado(resultado);

  limparBalao();
});

decreaseButton.addEventListener('click', () => {
  let bonus = parseInt(bonusInput.value);
  if (bonus > -5) {
    bonus -= 1;
    bonusInput.value = bonus;
  }
});

increaseButton.addEventListener('click', () => {
  let bonus = parseInt(bonusInput.value);
  if (bonus < 5) {
    bonus += 1;
    bonusInput.value = bonus;
  }
});

toggleHistorico.addEventListener('click', () => {
  if (registro.style.display === 'none' || registro.style.display === '') {
    registro.style.display = 'block';
    toggleHistorico.textContent = 'Ocultar Histórico';
  } else {
    registro.style.display = 'none';
    toggleHistorico.textContent = 'Mostrar Histórico';
  }
});