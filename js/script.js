// Variável para rastrear se o espelho está quebrado
let espelhoQuebrado = false;

// Variável para rastrear se o histórico está travado
let travaHistorico = true;

// Seleciona elementos
const areaClicavel = document.getElementById('area-clicavel');
const balaoDeFala = document.getElementById('balao-de-fala');
const bonusInput = document.getElementById('bonusInput');
const decreaseButton = document.getElementById('decreaseBonus');
const increaseButton = document.getElementById('increaseBonus');
const espelho = document.getElementById('espelho');
const listaRegistro = document.getElementById('lista-registro');
const toggleHistorico = document.getElementById('toggle-historico');
const registro = document.getElementById('registro');

// Ícone de trava
const iconeTrava = document.getElementById('icone-trava');

// Função para alternar o estado da trava
function alternarTrava() {
  travaHistorico = !travaHistorico; // Alterna entre true e false
  if (travaHistorico) {
    console.log("Histórico travado!");
    iconeTrava.title = "Clique aqui para desbloquear o histórico (DM Only)";
  } else {
    console.log("Histórico desbloqueado!");
    iconeTrava.title = "Clique aqui para bloquear o histórico novamente";
  }
}

// Evento de clique no ícone de trava
iconeTrava.addEventListener('click', () => {
  alternarTrava(); // Alterna o estado da trava
});

// Lista de opções do espelho
const opcoes = [
  { nome: 'Rosto Radiante', tipo: 'excelente', mensagem: 'Olha para mim e vê quem tu és verdadeiramente. Agora, carrega essa verdade contigo.', efeito: 'Concede ao jogador +1 ponto permanente em um atributo à escolha.' },
  { nome: 'Olhar Estrelado', tipo: 'bom', mensagem: 'Tu és parte do grande tecido do cosmos. Sente sua força correr em tuas veias.', efeito: 'Concede ao jogador uma bênção (ex.: vantagem em testes, resistência a um tipo de dano, um ataque adicional por rodada) até o próximo descanso longo.' },
  { nome: 'Sorriso Enigmático', tipo: 'bom', mensagem: 'Um lampejo do futuro... ou talvez do passado. Decifra seu significado.', efeito: 'Concede ao jogador uma informação importante sobre o vilão, um segredo oculto ou o próximo passo da aventura.' },
  { nome: 'Olhar Confuso', tipo: 'neutro', mensagem: 'Não compreendo... mas talvez tu consigas. Escuta estas palavras.', efeito: 'Concede um enigma ou mensagem críptica que pode desencadear uma side quest ou avançar a trama principal.' },
  { nome: 'Sorriso Tímido', tipo: 'neutro', mensagem: 'O que está escondido espera por ti... mas o preço pode ser mais alto do que imaginas.', efeito: 'Ele abre uma passagem para o mundo do espelho, onde os jogadores podem buscar um tesouro ou segredo valioso. No entanto, cada vez que o poder é usado, a prisão do ser aprisionado é enfraquecida, aproximando-o de sua liberdade.' },
  { nome: 'Olhar Distante', tipo: 'neutro', mensagem: 'O que vês pode ser verdade... ou apenas sombras do que poderia ser.', efeito: 'Prende o jogador em uma ilusão dentro do espelho por 1d4 rodadas, mostrando eventos distorcidos do passado ou futuro. Ao sair, o jogador pode ganhar uma pista importante ou sofrer efeitos psicológicos temporários.' },
  { nome: 'Olho Flamejante', tipo: 'ruim', mensagem: 'Teu destino arde em chamas... e eu sou a centelha.', efeito: 'O jogador deve fazer um teste de resistência (Sabedoria, CD 15) ou será hipnotizado/controlado por 1d4 rodadas, agindo de forma prejudicial ao grupo ou seguindo ordens do ser aprisionado.' },
  { nome: 'Coração Pulsante', tipo: 'ruim', mensagem: 'Tua energia alimenta minha prisão... mas também me fortalece.', efeito: 'O jogador deve fazer um teste de resistência (Constituição, CD 15). Se passar, sofre 1d6 de dano necrótico. Se falhar, sofre 1d6 de dano necrótico e tem 1 ponto de um atributo reduzido até o próximo descanso longo.' },
  { nome: 'Olhar Vazio', tipo: 'ruim', mensagem: 'No vazio, tu és nada... e eu sou tudo.', efeito: 'Todos os jogadores próximos devem fazer um teste de resistência (Sabedoria, CD 15). Se falharem, sofrem uma maldição que impõe desvantagem em todos os ataques e testes de habilidade até o próximo descanso longo.' },
  { nome: 'Espelho Quebrado', tipo: 'pessimo', mensagem: 'Olhem para mim agora... e vejam o que libertaram.', efeito: 'Libera o ser maligno aprisionado. Ele se liga à sombra de um jogador (geralmente, quem o libertou) e começa a perturbar todos os jogadores com eventos assustadores, até see descoberto como uma entidade ligada à sombra do jogador. Após ser descoberto, ele começa a sussurrar diretamente no ouvido do portador, manipulando sua mente e causando caos. Até ser removido ou se fortalecer para assumir uma forma física e confrontar os jogadores.' }
];

// Mapeamento de imagens para cada efeito
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

// Mapeamento de sons para cada efeito
const listaDeSons = {
  'Rosto Radiante': './sons/radiant.mp3',
  'Olhar Estrelado': './audio/olhar_estrelado.mp3',
  'Sorriso Enigmático': './audio/sorriso_enigmatico.mp3',
  'Olhar Confuso': './audio/olhar_confuso.mp3',
  'Sorriso Tímido': './audio/sorriso_timido.mp3',
  'Olhar Distante': './audio/olhar_distante.mp3',
  'Olho Flamejante': './audio/olho_flamejante.mp3',
  'Coração Pulsante': './audio/coracao_pulsante.mp3',
  'Olhar Vazio': './audio/olhar_vazio.mp3',
  'Espelho Quebrado': './sons/broken.mp3'
};

// Pré-carrega os sons
const sons = {};
for (const nomeDoEfeito in listaDeSons) {
  sons[nomeDoEfeito] = new Audio(listaDeSons[nomeDoEfeito]);
  sons[nomeDoEfeito].preload = 'auto';
}

// Função para reproduzir um som específico
function tocarSom(nomeDoEfeito) {
  if (sons[nomeDoEfeito]) {
    sons[nomeDoEfeito].play().catch((error) => {
      console.error("Erro ao reproduzir o som:", error);
    });
  } else {
    console.error("Som não encontrado para o efeito:", nomeDoEfeito);
  }
}

// Função para calcular probabilidades com base no bônus/penalidade
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

// Função para gerar um resultado aleatório com base no bônus/penalidade
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

// Função para exibir o resultado no balão de fala
function exibirResultado(resultado) {
  if (!resultado) {
    console.error("Resultado inválido!");
    return;
  }

  // Exibe o resultado no balão de fala
  balaoDeFala.textContent = resultado.mensagem;
  balaoDeFala.classList.add('visible');

  // Altera a imagem do espelho com base no nome do efeito
  const novaImagem = imagensPorEfeito[resultado.nome];
  if (novaImagem) {
    espelho.src = novaImagem;

    // Verifica se o efeito é "Espelho Quebrado"
    if (resultado.nome === 'Espelho Quebrado') {
      espelhoQuebrado = true; // Marca o espelho como quebrado
      tocarSom(resultado.nome); // Reproduz o som correspondente
    } else {
      // Para outros efeitos, restaura a imagem após 8 segundos, a menos que o espelho esteja quebrado
      setTimeout(() => {
        if (!espelhoQuebrado) {
          espelho.src = './img/espelhomagico.png';
        }
      }, 8000);
    }
  }

  // Adiciona o resultado ao registro
  const novoItem = document.createElement('li');
  novoItem.textContent = resultado.efeito;
  listaRegistro.prepend(novoItem);
}

// Função para limpar o balão de fala após alguns segundos
function limparBalao() {
  setTimeout(() => {
    balaoDeFala.classList.remove('visible');
  }, 8000);
}

// Evento de clique na área clicável
areaClicavel.addEventListener('click', () => {
  // Verifica se o espelho já está quebrado
  if (espelhoQuebrado) {
    return; // Impede novos cliques enquanto o espelho estiver quebrado
  }

  const bonus = parseInt(bonusInput.value); // Obtém o valor do bônus/penalidade
  const resultado = gerarResultado(bonus);

  // Exibe o resultado no balão de fala
  exibirResultado(resultado);

  // Limpa o balão de fala após 8 segundos
  limparBalao();
});

// Botões para aumentar/diminuir o bônus
decreaseButton.addEventListener('click', () => {
  let bonus = parseInt(bonusInput.value);
  if (bonus > -5) {
    bonus -= 1; // Diminui o valor do bônus
    bonusInput.value = bonus; // Atualiza o campo de entrada
  }
});

increaseButton.addEventListener('click', () => {
  let bonus = parseInt(bonusInput.value);
  if (bonus < 5) {
    bonus += 1; // Aumenta o valor do bônus
    bonusInput.value = bonus; // Atualiza o campo de entrada
  }
});

// Evento de clique no botão "Mostrar/Ocultar Histórico"
toggleHistorico.addEventListener('click', () => {
  if (travaHistorico) {
    // Exibe a mensagem no balão de fala
    balaoDeFala.textContent = "Hey, você não é o DM, melhor não mexer aí!";
    balaoDeFala.classList.add('visible');
    limparBalao(); // Remove a mensagem após alguns segundos
    return; // Impede que o histórico seja mostrado
  }

  // Alterna a visibilidade do histórico
  if (registro.style.display === 'none' || registro.style.display === '') {
    registro.style.display = 'block';
    toggleHistorico.textContent = 'Ocultar Histórico';
  } else {
    registro.style.display = 'none';
    toggleHistorico.textContent = 'Mostrar Histórico';
  }
});

