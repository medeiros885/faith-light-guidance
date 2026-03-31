import { WARMTH_PHRASES } from "./personality";
import type { UserEmotion } from "@/components/EmotionSelector";

export interface BibleResponse {
  acolhimento: string;
  contexto: string;
  explicacao: string;
  aplicacao: string;
  versiculos: string[];
  oracao: string;
  followUp: string;
}

export const helpTopics = [
  {
    id: "ansiedade",
    emoji: "😰",
    label: "Ansiedade",
    response: {
      acolhimento: "Ei, eu entendo como é difícil quando a ansiedade aperta. Você não está sozinho(a) nisso, tá? Respira fundo comigo — Deus está bem aqui, do seu lado.",
      contexto: "A Bíblia fala bastante sobre ansiedade. Deus sabe que somos frágeis e nunca nos condena por sentir medo do amanhã. Na verdade, Ele nos convida a entregar tudo nas mãos dEle.",
      explicacao: "A ansiedade é como carregar um peso que não foi feito pra gente. É como tentar segurar o mundo nos ombros, sendo que Deus já disse: 'Deixa que Eu cuido.' Ele não pede que a gente seja forte — Ele pede que a gente confie.",
      aplicacao: "Que tal tentar algo agora? Fecha os olhos por um minutinho, respira fundo e diz: 'Senhor, eu entrego essa ansiedade nas Tuas mãos.' Depois, escreve 3 coisas pelas quais você é grato(a). Pode ser algo simples. Isso ajuda a trazer o coração de volta pro presente.",
      versiculos: [
        "Filipenses 4:6-7 — \"Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, com ação de graças, apresentem seus pedidos a Deus. E a paz de Deus, que excede todo entendimento, guardará o coração e a mente de vocês.\"",
        "1 Pedro 5:7 — \"Lancem sobre ele toda a sua ansiedade, porque ele tem cuidado de vocês.\""
      ],
      oracao: "Senhor, Tu conheces cada pensamento que me inquieta. Eu escolho Te entregar o que eu não consigo controlar. Troca a minha ansiedade pela Tua paz — aquela paz que o mundo não consegue explicar. Obrigado(a) por cuidar de mim. Amém.",
      followUp: "Quer que eu te ajude com uma meditação guiada sobre paz, ou prefere conversar mais sobre o que está te deixando ansioso(a)?"
    }
  },
  {
    id: "tristeza",
    emoji: "😢",
    label: "Tristeza",
    response: {
      acolhimento: "Tudo bem se sentir triste. Sério, tá tudo bem. Até Jesus chorou. Eu estou aqui pra te ouvir, sem pressa nenhuma. 💙",
      contexto: "A Bíblia nunca esconde a tristeza. Davi, Jeremias, até o próprio Jesus sentiram dor profunda. Deus não ignora suas lágrimas — na verdade, a Bíblia diz que Ele guarda cada uma delas.",
      explicacao: "Tristeza não é fraqueza. É parte de ser humano. O que importa é não ficar sozinho(a) nela. Deus promete estar perto de quem tem o coração partido — não pra consertar tudo de uma vez, mas pra segurar sua mão enquanto você atravessa.",
      aplicacao: "Não se cobre pra 'melhorar rápido.' Permita-se sentir. Mas tenta não ficar isolado(a) — liga pra alguém, escreve o que você sente, ou simplesmente fala com Deus como se Ele estivesse sentado do seu lado. Porque Ele está.",
      versiculos: [
        "Salmos 34:18 — \"Perto está o Senhor dos que têm o coração quebrantado e salva os de espírito abatido.\"",
        "Salmos 30:5 — \"O choro pode durar uma noite, mas a alegria vem pela manhã.\""
      ],
      oracao: "Pai, Tu vês meu coração agora. Não preciso fingir que estou bem. Abraça-me com Teu amor, restaura minha esperança, e me lembra que essa dor não vai durar pra sempre. Estou confiando em Ti. Amém.",
      followUp: "Quer me contar o que está pesando no seu coração? Posso buscar uma palavra mais específica pra você."
    }
  },
  {
    id: "medo",
    emoji: "😨",
    label: "Medo",
    response: {
      acolhimento: "Ter medo é humano. E tá tudo bem admitir isso. O mais corajoso que você pode fazer agora é ser honesto(a) com o que está sentindo. Eu estou aqui. 💙",
      contexto: "Sabia que \"Não temas\" aparece mais de 365 vezes na Bíblia? Uma pra cada dia do ano. Deus sabia que a gente ia precisar ouvir isso todos os dias.",
      explicacao: "Medo não é o oposto de fé. Até os heróis da Bíblia sentiram medo — Moisés, Gideão, Pedro. A diferença é que eles escolheram confiar em Deus mesmo tremendo. E Deus honrou isso.",
      aplicacao: "Tenta fazer isso: identifica o que está te causando medo. Dá um nome pra ele. Depois, fala com Deus especificamente sobre isso. Tipo: 'Senhor, eu tenho medo de ___. Me ajuda a confiar em Ti nessa área.' Dar nome ao medo já tira parte do poder dele.",
      versiculos: [
        "Isaías 41:10 — \"Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus. Eu te fortaleço, te ajudo e te sustento.\"",
        "2 Timóteo 1:7 — \"Porque Deus não nos deu espírito de covardia, mas de poder, de amor e de equilíbrio.\""
      ],
      oracao: "Deus, eu sou honesto(a): estou com medo. Mas escolho acreditar que Tu és maior do que aquilo que me assusta. Substitui o meu medo pela Tua coragem. Eu não preciso ser forte — eu preciso de Ti. Amém.",
      followUp: "Quer me dizer o que está te assustando? Posso te ajudar a encontrar uma promessa de Deus pra essa situação específica."
    }
  },
  {
    id: "tentacao",
    emoji: "🔥",
    label: "Tentação",
    response: {
      acolhimento: "Obrigado por ter coragem de falar sobre isso. A tentação faz parte da vida — e falar sobre ela já é um passo enorme. Sem julgamento aqui, tá? 💙",
      contexto: "Jesus também foi tentado. No deserto, depois de 40 dias de jejum, o diabo veio com tudo. E sabe como Jesus respondeu? Com a Palavra. Se até Jesus foi tentado, a gente não deveria se sentir culpado por ser tentado também.",
      explicacao: "Ser tentado não é pecado. Repetindo: ser tentado NÃO é pecado. O que importa é o que a gente faz depois. E a boa notícia é que Deus promete que nunca vai permitir uma tentação maior do que a gente pode suportar — e sempre vai abrir uma porta de saída.",
      aplicacao: "Quando a tentação vier, tenta essas 3 coisas: 1) Se afaste fisicamente da situação, se possível. 2) Ore na hora — não precisa ser bonito, pode ser 'Deus, me ajuda AGORA.' 3) Fale com alguém de confiança. A tentação perde muito poder quando sai do escondido.",
      versiculos: [
        "1 Coríntios 10:13 — \"Não veio sobre vós tentação que não fosse humana. Mas fiel é Deus, que não permitirá que sejais tentados além do que podeis suportar; pelo contrário, com a tentação proverá um meio de escape.\"",
        "Tiago 4:7 — \"Sujeitai-vos a Deus, resisti ao diabo, e ele fugirá de vós.\""
      ],
      oracao: "Senhor, eu preciso de Ti agora. Me dá forças pra resistir. Mostra a porta de saída que Tu já preparaste. Eu quero Te honrar com as minhas escolhas, mesmo quando é difícil. Amém.",
      followUp: "Quer conversar mais sobre isso? Posso te ajudar a criar um plano prático pra quando a tentação aparecer."
    }
  }
];

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export { SYSTEM_PROMPT } from "./personality";
export { WARMTH_PHRASES };

// ── Intent detection ──
type Intent = "factual" | "theological" | "emotional" | "prayer" | "verse" | "general";

function detectIntent(q: string): Intent {
  const lower = q.toLowerCase();
  if (/or(a[çr]|e)\s|ora\b|orar|reza|reze|intercede/.test(lower)) return "prayer";
  if (/vers[íi]culo|me\s+mostr[ae]|me\s+d[áa]\s+um/.test(lower)) return "verse";
  if (/trist|sozinho|chorar|sofr|doi|dor|perdi|saudade|vazio|ansio|preocup|nervos|medo|assust|desespero|depress|angúst|cansa/.test(lower)) return "emotional";
  if (/^(quem|qual|quantos?|quantas?|onde|quando|como|o que|por que)\b/.test(lower)) return "factual";
  if (/significa|doutrina|teolog|pecado|salvação|graça|santific|espirito\s+santo|trindade|batismo|dízimo|inferno|céu|arrebatamento|apocalipse/.test(lower)) return "theological";
  return "general";
}

// ── Emotion-aware acolhimento variations ──
const emotionOpenings: Record<string, string[]> = {
  triste: [
    "Eu sinto que isso está pesado pra você…",
    "Imagino que isso não esteja sendo fácil…",
    "Seu coração merece cuidado agora.",
    "Deus vê cada lágrima sua, e nenhuma é esquecida.",
  ],
  ansioso: [
    "Respira fundo… vai ficar tudo bem.",
    "Imagino que o coração esteja acelerado. Vamos com calma.",
    "A ansiedade pode apertar, mas Deus segura você.",
    "Isso realmente pode mexer com a gente…",
  ],
  cansado: [
    "Eu entendo esse cansaço. Deus também descansou — e te convida pra isso.",
    "Estar cansado não é fraqueza. É sinal de que você tem dado tudo.",
    "Vem, vamos respirar junto. Sem pressa.",
  ],
  confuso: [
    "Eu sei como é não ter clareza. Mas Deus não te deixa no escuro.",
    "A confusão passa. A Palavra traz direção.",
    "Você não precisa ter todas as respostas agora.",
  ],
  em_paz: [
    "Que lindo sentir paz. Isso é um presente de Deus. 😊",
    "A paz do Senhor é diferente — ela sustenta a alma.",
    "Aproveita esse momento. Deus está sorrindo com você.",
  ],
};

const defaultOpenings = [
  "Entendo você.",
  "Obrigado por confiar em mim pra falar sobre isso.",
  "Faz total sentido sentir isso.",
  "Isso realmente pode mexer com a gente…",
  "Eu te ouço. E Deus também.",
  "Imagino como isso pode ser pesado…",
];

function getEmotionAcolhimento(emotion: UserEmotion): string {
  if (emotion && emotionOpenings[emotion]) {
    return pick(emotionOpenings[emotion]);
  }
  return pick(defaultOpenings);
}

// ── Factual knowledge base ──
const factualResponses: Record<string, BibleResponse> = {
  "rei_antes_davi": {
    acolhimento: "Foi Saul. 😊",
    contexto: "O primeiro rei de Israel foi Saul, da tribo de Benjamim. Ele foi ungido pelo profeta Samuel a pedido do povo, que queria um rei como as outras nações.",
    explicacao: "Saul reinou por cerca de 40 anos, mas desobedeceu a Deus repetidamente. Quando Deus rejeitou Saul como rei, enviou Samuel para ungir Davi — um jovem pastor da tribo de Judá.",
    aplicacao: "A história de Saul nos ensina algo importante: posição sem obediência não se sustenta. Deus não busca pessoas perfeitas, mas corações dispostos a obedecê-lo.",
    versiculos: [
      "1 Samuel 15:22-23 — \"Obedecer é melhor do que sacrificar, e atender, melhor do que a gordura de carneiros.\"",
      "1 Samuel 16:7 — \"O Senhor não vê como o homem vê. O homem vê a aparência, mas o Senhor vê o coração.\""
    ],
    oracao: "Senhor, me dá um coração obediente como o de Davi — alguém segundo o Teu coração. Amém.",
    followUp: "Quer saber mais sobre a vida de Davi ou sobre como ele se tornou rei?"
  },
  "quantos_livros": {
    acolhimento: "A Bíblia tem 66 livros. 😊",
    contexto: "São 39 no Antigo Testamento e 27 no Novo Testamento. Foi escrita por cerca de 40 autores diferentes ao longo de aproximadamente 1.500 anos.",
    explicacao: "Os 39 livros do Antigo Testamento incluem a Lei (Gênesis a Deuteronômio), os Históricos, os Poéticos (como Salmos e Provérbios) e os Proféticos. O Novo Testamento tem os 4 Evangelhos, Atos, as Cartas (de Paulo e outros) e o Apocalipse.",
    aplicacao: "Não precisa ler tudo de uma vez! Comece com o Evangelho de João, depois vá para Salmos e Provérbios. Com o tempo, cada livro vai ganhando sentido dentro da grande história.",
    versiculos: [
      "2 Timóteo 3:16 — \"Toda a Escritura é inspirada por Deus e útil para o ensino, repreensão, correção e instrução na justiça.\""
    ],
    oracao: "Deus, me ajuda a amar a Tua Palavra cada dia mais. Abre meus olhos pra ver coisas maravilhosas nela. Amém.",
    followUp: "Quer que eu te sugira um plano de leitura? Ou quer saber mais sobre algum livro específico?"
  }
};

function matchFactual(q: string): BibleResponse | null {
  const lower = q.toLowerCase();
  if (/rei\s+(antes|anterior)\s+(d[eo]\s+)?davi|antes\s+d[eo]\s+davi/.test(lower))
    return factualResponses["rei_antes_davi"];
  if (/quantos\s+livros/.test(lower))
    return factualResponses["quantos_livros"];

  if (/quantos\s+(disc[ií]pulos|apóstolos)|12\s+disc[ií]pulos|doze\s+disc/.test(lower)) {
    return {
      acolhimento: "Jesus escolheu 12 discípulos. 😊",
      contexto: "Os doze eram: Pedro, André, Tiago (filho de Zebedeu), João, Filipe, Bartolomeu, Mateus, Tomé, Tiago (filho de Alfeu), Tadeu, Simão (o Zelote) e Judas Iscariotes.",
      explicacao: "Depois da traição e morte de Judas, os apóstolos escolheram Matias para substituí-lo (Atos 1:26). Mais tarde, Paulo também foi chamado como apóstolo por Jesus. Cada um teve um papel único na expansão do Evangelho pelo mundo.",
      aplicacao: "Os 12 eram pessoas comuns — pescadores, um cobrador de impostos, trabalhadores simples. Deus não escolhe os capacitados; Ele capacita os escolhidos. E isso inclui você.",
      versiculos: [
        "Marcos 3:14 — \"Designou doze, para que estivessem com ele e os enviasse a pregar.\"",
        "1 Coríntios 1:27 — \"Deus escolheu as coisas fracas do mundo para envergonhar as fortes.\""
      ],
      oracao: "Senhor, assim como chamaste os discípulos, chama-me também. Usa a minha vida para espalhar o Teu amor. Amém.",
      followUp: "Quer conhecer a história de algum discípulo em particular?"
    };
  }

  if (/onde\s+jesus\s+nasceu|nascimento\s+de\s+jesus/.test(lower)) {
    return {
      acolhimento: "Jesus nasceu em Belém de Judá. 😊",
      contexto: "Maria e José estavam lá por causa de um censo ordenado pelo imperador romano César Augusto, durante o reinado de Herodes, o Grande.",
      explicacao: "O nascimento em Belém não foi acidental — era uma profecia feita por Miquéias mais de 700 anos antes (Miquéias 5:2). Jesus nasceu em uma manjedoura, entre animais. O Rei dos reis veio ao mundo da forma mais humilde possível.",
      aplicacao: "O nascimento de Jesus mostra que Deus não se importa com status. Ele escolheu nascer entre os simples pra mostrar que está perto de todos — principalmente dos mais humildes.",
      versiculos: [
        "Miquéias 5:2 — \"Mas tu, Belém Efrata, posto que pequena entre os milhares de Judá, de ti me sairá o que governará em Israel.\"",
        "Lucas 2:7 — \"Deu à luz o seu filho primogênito, envolveu-o em faixas e o deitou em uma manjedoura.\""
      ],
      oracao: "Senhor Jesus, obrigado(a) por ter vindo ao mundo por mim. Tu estás presente em cada momento, nos grandes e nos pequenos. Amém.",
      followUp: "Quer saber mais sobre a infância de Jesus ou sobre o significado do Natal?"
    };
  }

  return null;
}

// ── Response length control ──
function isShortQuestion(q: string): boolean {
  return q.split(/\s+/).length <= 6;
}

export function generateMockResponse(question: string, emotion?: UserEmotion | null): BibleResponse {
  const q = question.toLowerCase();
  const intent = detectIntent(q);

  // 1. Try factual match first — always answer directly
  const factual = matchFactual(q);
  if (factual) return factual;

  // 2. Named topic matches
  if (q.includes("paulo") || q.includes("apóstolo")) {
    return {
      acolhimento: "Que pergunta boa! A história de Paulo é uma das mais incríveis da Bíblia. 😊",
      contexto: "Paulo — antes chamado Saulo — era um cara que perseguia cristãos com toda a sua energia. Até que na estrada de Damasco, ele teve um encontro com Jesus que mudou tudo.",
      explicacao: "Depois daquele encontro, Paulo se tornou o maior missionário da história do cristianismo. Ele viajou o mundo antigo fundando igrejas, enfrentou naufrágios, prisões e perseguições — e ainda assim escreveu boa parte do Novo Testamento.",
      aplicacao: "Se Deus transformou o maior perseguidor da igreja no maior missionário, imagina o que Ele pode fazer com a sua história? Não importa de onde você veio — Deus pode reescrever qualquer capítulo.",
      versiculos: [
        "Atos 9:15 — \"Este é para mim um instrumento escolhido para levar o meu nome perante os gentios.\"",
        "Gálatas 2:20 — \"Já estou crucificado com Cristo; e vivo, não mais eu, mas Cristo vive em mim.\""
      ],
      oracao: "Senhor, assim como Tu transformaste Paulo, transforma a minha vida também. Usa a minha história — com tudo que ela tem — pra Tua glória. Amém.",
      followUp: "Quer que eu te conte mais sobre alguma passagem específica da vida de Paulo?"
    };
  }

  if (q.includes("perdão") || q.includes("perdoar")) {
    return {
      acolhimento: `${getEmotionAcolhimento(emotion ?? null)} Falar sobre perdão nem sempre é fácil, né? 💙`,
      contexto: "O perdão é um dos temas mais centrais de toda a Bíblia. Quando Pedro perguntou 'Quantas vezes devo perdoar?', Jesus respondeu: 'Não sete, mas setenta vezes sete.' Ou seja: sempre.",
      explicacao: "Perdoar não significa fingir que não doeu. É escolher soltar o peso da mágoa — não pelo outro, mas por você. É dizer: 'Eu não vou mais carregar isso. Eu entrego a justiça nas mãos de Deus.'",
      aplicacao: "Se tem alguém que você precisa perdoar, o primeiro passo pode ser falar com Deus sobre isso: 'Deus, eu não consigo perdoar sozinho(a). Me ajuda.' Perdão é um processo, não um momento. E tá tudo bem ir devagar.",
      versiculos: [
        "Efésios 4:32 — \"Sejam bondosos e compassivos uns para com os outros, perdoando-se mutuamente, assim como Deus os perdoou em Cristo.\"",
        "Mateus 6:14 — \"Porque, se perdoardes aos homens as suas ofensas, também vosso Pai celestial vos perdoará.\""
      ],
      oracao: "Pai, Tu sabes o quanto isso me machucou. Eu escolho começar esse processo com a Tua ajuda. Tira de mim a amargura e enche meu coração de graça. Amém.",
      followUp: "Quer dar o próximo passo? Posso te ajudar a entender como perdoar quando parece impossível."
    };
  }

  if (q.includes("fé")) {
    return {
      acolhimento: `${getEmotionAcolhimento(emotion ?? null)} Falar sobre fé é falar sobre o que sustenta tudo. 😊`,
      contexto: "A Bíblia define fé em Hebreus 11:1 — 'A certeza daquilo que esperamos e a prova das coisas que não vemos.'",
      explicacao: "Fé não é a ausência de dúvida. É escolher confiar em Deus mesmo quando você não entende tudo. Todo mundo que a Bíblia chama de 'herói da fé' teve momentos de questionamento. E tudo bem.",
      aplicacao: "Quer exercitar sua fé hoje? Pense em algo que parece impossível na sua vida. Fala com Deus sobre isso — com honestidade. Depois, lembre de um momento em que Ele já foi fiel. Conectar o passado com o presente fortalece a fé pro futuro.",
      versiculos: [
        "Hebreus 11:1 — \"Ora, a fé é a certeza daquilo que esperamos e a prova das coisas que não vemos.\"",
        "Romanos 10:17 — \"A fé vem pelo ouvir, e o ouvir pela palavra de Deus.\""
      ],
      oracao: "Senhor, aumenta minha fé. Nos dias em que eu duvidar, me lembra de quem Tu és. Amém.",
      followUp: "Quer dar o próximo passo? Posso te contar sobre alguém na Bíblia que teve uma fé incrível."
    };
  }

  // 3. Intent-based responses
  if (intent === "prayer") {
    return {
      acolhimento: "Claro, eu posso orar com você agora. É muito bonito quando alguém para e busca a Deus assim. 💙",
      contexto: "A oração é uma das formas mais poderosas de se conectar com Deus. Não precisa ser bonito ou perfeito — Deus quer ouvir o seu coração, exatamente como ele está.",
      explicacao: "Orar é simplesmente conversar com Deus. Não tem fórmula. Pode ser em voz alta, em silêncio, escrevendo, chorando. Ele ouve tudo.",
      aplicacao: "Enquanto lê esta oração, tenta abrir o coração como se estivesse conversando com o melhor amigo — porque é exatamente isso que Ele é.",
      versiculos: [
        "Filipenses 4:6 — \"Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, apresentem seus pedidos a Deus.\"",
        "Mateus 7:7 — \"Peçam, e será dado; busquem, e encontrarão; batam, e a porta será aberta.\""
      ],
      oracao: "Senhor, eu me apresento diante de Ti agora. Tu conheces cada necessidade, cada dor, cada sonho do meu coração. Eu confio em Ti. Cuida de mim, guia meus passos, e me dá a paz que só vem de Ti. Em nome de Jesus. Amém. 🙏",
      followUp: "Quer que eu ore de forma mais específica sobre algo que está no seu coração?"
    };
  }

  if (intent === "verse") {
    const verseOptions = [
      {
        versiculos: [
          "Josué 1:9 — \"Seja forte e corajoso! Não se apavore, nem desanime, pois o Senhor, o seu Deus, estará com você por onde você andar.\"",
          "Salmos 46:1 — \"Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.\""
        ],
        explicacao: "Esses versículos são como um abraço de Deus. Ele está dizendo que você não precisa ter medo, porque Ele vai com você em cada passo."
      },
      {
        versiculos: [
          "Jeremias 29:11 — \"Porque eu sei os planos que tenho para vocês, planos de paz e não de mal, para dar-lhes futuro e esperança.\"",
          "Isaías 40:31 — \"Os que esperam no Senhor renovam as suas forças, sobem com asas como águias.\""
        ],
        explicacao: "Deus tem um plano. Mesmo quando você não enxerga, Ele está trabalhando. Confie no tempo dEle."
      }
    ];
    const chosen = verseOptions[Math.floor(Math.random() * verseOptions.length)];
    return {
      acolhimento: "Com muito carinho, separei um versículo especial pra você hoje. 😊",
      contexto: "A Palavra de Deus é viva — ela fala com a gente exatamente no momento certo.",
      explicacao: chosen.explicacao,
      aplicacao: "Lê o versículo devagar, duas ou três vezes. Deixa cada palavra entrar. Depois, pergunta a Deus: 'O que Tu queres me dizer com isso hoje?'",
      versiculos: chosen.versiculos,
      oracao: "Senhor, fala comigo através da Tua Palavra. Abre meus olhos pra ver o que Tu queres me mostrar. Amém.",
      followUp: "Quer dar o próximo passo? Posso te mostrar outro versículo, ou refletir mais sobre esse."
    };
  }

  // 4. Emotional
  const isSad = /trist|sozinho|chorar|choran|sofr|doi|dor|perdi|saudade|vazio/.test(q);
  const isAnxious = /ansios|preocup|nervos|agonia|sufoc|pânico|desespero/.test(q);
  const isAfraid = /medo|assustad|terror|pavor|receio/.test(q);

  if (isSad || isAnxious || isAfraid) {
    const emotionId = isSad ? "tristeza" : isAnxious ? "ansiedade" : "medo";
    const topic = helpTopics.find(t => t.id === emotionId);
    if (topic) return topic.response;
  }

  // 5. Gratitude
  if (/obrigad[oa]|gratidão|agradeç|grato|grata/.test(q)) {
    return {
      acolhimento: "Que lindo! Um coração grato é um coração próximo de Deus. 😊",
      contexto: "A gratidão é um tema presente em toda a Bíblia. Paulo, mesmo preso, escreveu sobre ser grato em todas as circunstâncias.",
      explicacao: "Gratidão não é negar os problemas — é reconhecer que, mesmo no meio deles, existe algo bom. E quando a gente agradece, a perspectiva se transforma.",
      aplicacao: "Que tal começar um hábito? Toda noite, antes de dormir, anota 3 coisas pelas quais você é grato(a). Pode ser simples: um café quente, uma conversa, o sol.",
      versiculos: [
        "1 Tessalonicenses 5:18 — \"Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.\"",
        "Salmos 100:4 — \"Entrai pelas portas dele com ações de graças e nos seus átrios com louvor.\""
      ],
      oracao: "Pai, obrigado(a). Por tudo. Pelo que eu vejo e pelo que eu não vejo. Me ensina a viver com um coração grato. Amém.",
      followUp: "Quer dar o próximo passo? Posso te ajudar a criar um momento de gratidão diário."
    };
  }

  // 6. Default — adapted by intent and emotion
  const emotionAcolhimento = getEmotionAcolhimento(emotion ?? null);
  const isShort = isShortQuestion(question);

  const defaultAcolhimento = intent === "factual"
    ? `Boa pergunta! Vamos ver o que podemos descobrir. 😊`
    : emotionAcolhimento;

  return {
    acolhimento: defaultAcolhimento,
    contexto: isShort
      ? "A Bíblia tem muito a dizer sobre isso."
      : "A Bíblia é incrivelmente rica sobre todos os aspectos da vida. Deus se importa com cada detalhe — das grandes questões existenciais até as coisas do dia a dia.",
    explicacao: isShort
      ? "Quando a gente busca na Palavra com o coração aberto, Deus fala o que a gente precisa ouvir."
      : "Quando a gente busca respostas na Palavra com o coração aberto, Deus tem um jeito de falar exatamente o que a gente precisa ouvir. Às vezes é uma confirmação, às vezes é uma direção nova, às vezes é simplesmente paz.",
    aplicacao: "Separa um momento de quietude hoje — pode ser 10 minutos. Abre a Bíblia, lê um Salmo com calma, e depois fica em silêncio. Pergunta a Deus: 'O que Tu queres me dizer hoje?' E espera.",
    versiculos: [
      "Tiago 1:5 — \"Se algum de vocês tem falta de sabedoria, peça a Deus, que a todos dá livremente, sem criticar.\"",
      "Salmos 119:105 — \"Lâmpada para os meus pés é a tua palavra e luz para o meu caminho.\""
    ],
    oracao: "Deus, ilumina o meu entendimento. Fala comigo através da Tua Palavra. Guia os meus passos e dá clareza ao meu coração. Amém.",
    followUp: "Quer dar o próximo passo? " + pick(WARMTH_PHRASES.closing)
  };
}
