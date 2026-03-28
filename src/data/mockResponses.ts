import { WARMTH_PHRASES } from "./personality";

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

/** Pick a random phrase from a category for variety */
function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Re-export personality for future AI integration */
export { SYSTEM_PROMPT } from "./personality";
export { WARMTH_PHRASES };

export function generateMockResponse(question: string): BibleResponse {
  const q = question.toLowerCase();

  if (q.includes("paulo") || q.includes("apóstolo")) {
    return {
      acolhimento: "Que pergunta boa! A história de Paulo é uma das mais incríveis da Bíblia. Deixa eu te contar um pouco sobre ele. 😊",
      contexto: "Paulo — antes chamado Saulo — era um cara que perseguia cristãos com toda a sua energia. Ele realmente acreditava que estava fazendo a coisa certa. Até que um dia, na estrada de Damasco, ele teve um encontro com Jesus que mudou tudo.",
      explicacao: "Depois daquele encontro, Paulo se tornou o maior missionário da história do cristianismo. Ele viajou o mundo antigo fundando igrejas, enfrentou naufrágios, prisões e perseguições — e ainda assim escreveu boa parte do Novo Testamento. Tudo porque uma experiência real com Jesus transformou completamente sua identidade.",
      aplicacao: "A história de Paulo me faz pensar: se Deus transformou o maior perseguidor da igreja no maior missionário, imagina o que Ele pode fazer com a sua história? Não importa o que você já fez ou de onde você veio — Deus pode reescrever qualquer capítulo.",
      versiculos: [
        "Atos 9:15 — \"Este é para mim um instrumento escolhido para levar o meu nome perante os gentios.\"",
        "Gálatas 2:20 — \"Já estou crucificado com Cristo; e vivo, não mais eu, mas Cristo vive em mim.\""
      ],
      oracao: "Senhor, assim como Tu transformaste Paulo, transforma a minha vida também. Usa a minha história — com tudo que ela tem — pra Tua glória. Amém.",
      followUp: "Quer que eu te conte mais sobre alguma passagem específica da vida de Paulo? Ou quer saber sobre outro personagem bíblico?"
    };
  }

  if (q.includes("perdão") || q.includes("perdoar")) {
    return {
      acolhimento: "Falar sobre perdão nem sempre é fácil, né? Às vezes a ferida ainda dói. Eu entendo. Vamos conversar sobre isso com calma. 💙",
      contexto: "O perdão é um dos temas mais centrais de toda a Bíblia. Jesus falou sobre isso muitas vezes. Quando Pedro perguntou 'Quantas vezes devo perdoar?', Jesus respondeu: 'Não sete, mas setenta vezes sete.' Ou seja: sempre.",
      explicacao: "Mas perdoar não significa fingir que não doeu. Não significa dizer 'tudo bem' quando não está tudo bem. Perdoar é escolher soltar o peso da mágoa — não pelo outro, mas por você. É dizer: 'Eu não vou mais carregar isso. Eu entrego a justiça nas mãos de Deus.' E isso é libertador.",
      aplicacao: "Se tem alguém que você precisa perdoar, talvez o primeiro passo seja só falar com Deus sobre isso. Tipo: 'Deus, eu não consigo perdoar sozinho(a). Me ajuda.' Perdão é um processo, não um momento. E tá tudo bem ir devagar.",
      versiculos: [
        "Efésios 4:32 — \"Sejam bondosos e compassivos uns para com os outros, perdoando-se mutuamente, assim como Deus os perdoou em Cristo.\"",
        "Mateus 6:14 — \"Porque, se perdoardes aos homens as suas ofensas, também vosso Pai celestial vos perdoará.\""
      ],
      oracao: "Pai, Tu sabes o quanto isso me machucou. Eu não consigo perdoar na minha força, mas escolho começar esse processo com a Tua ajuda. Tira de mim a amargura e enche meu coração de graça. Amém.",
      followUp: "Quer que eu aprofunde isso com você? Posso te ajudar a entender como perdoar quando parece impossível."
    };
  }

  if (q.includes("fé")) {
    return {
      acolhimento: "Essa é uma das perguntas mais bonitas que alguém pode fazer. Falar sobre fé é falar sobre o que sustenta tudo. 😊",
      contexto: "A Bíblia define fé de um jeito muito especial em Hebreus 11:1 — 'A certeza daquilo que esperamos e a prova das coisas que não vemos.' É um dos versículos mais profundos das Escrituras.",
      explicacao: "Fé não é a ausência de dúvida. Lê de novo: fé não é nunca ter dúvida. É escolher confiar em Deus mesmo quando você não entende tudo. É dar um passo no escuro sabendo que Deus segura sua mão. Todo mundo que a Bíblia chama de 'herói da fé' teve momentos de questionamento. E tudo bem.",
      aplicacao: "Quer exercitar sua fé hoje? Tenta isso: pense em algo que parece impossível na sua vida agora. Fala com Deus sobre isso — com honestidade. Depois, tenta lembrar de um momento em que Ele já foi fiel. Conectar o passado com o presente fortalece a fé pro futuro.",
      versiculos: [
        "Hebreus 11:1 — \"Ora, a fé é a certeza daquilo que esperamos e a prova das coisas que não vemos.\"",
        "Romanos 10:17 — \"A fé vem pelo ouvir, e o ouvir pela palavra de Deus.\""
      ],
      oracao: "Senhor, aumenta minha fé. Nos dias em que eu duvidar, me lembra de quem Tu és. Me ajuda a confiar mesmo quando eu não vejo o caminho. Amém.",
      followUp: "Quer que eu te conte sobre alguém na Bíblia que teve uma fé incrível mesmo em momentos difíceis?"
    };
  }

  // Default conversational response
  return {
    acolhimento: "Que bom que você perguntou isso! Fico feliz que você veio aqui conversar. Vamos buscar juntos o que a Palavra diz sobre isso. 😊",
    contexto: "A Bíblia é incrivelmente rica sobre todos os aspectos da vida. Deus se importa com cada detalhe — das grandes questões existenciais até as coisas do dia a dia.",
    explicacao: "Quando a gente busca respostas na Palavra com o coração aberto, Deus tem um jeito de falar exatamente o que a gente precisa ouvir. Às vezes é uma confirmação, às vezes é uma direção nova, às vezes é simplesmente paz.",
    aplicacao: "Minha sugestão? Separa um momento de quietude hoje — pode ser 10 minutos. Abre a Bíblia (ou um app), lê um Salmo com calma, e depois fica em silêncio. Pergunta a Deus: 'O que Tu queres me dizer hoje?' E espera. Ele fala.",
    versiculos: [
      "Tiago 1:5 — \"Se algum de vocês tem falta de sabedoria, peça a Deus, que a todos dá livremente, sem criticar.\"",
      "Salmos 119:105 — \"Lâmpada para os meus pés é a tua palavra e luz para o meu caminho.\""
    ],
    oracao: "Deus, ilumina o meu entendimento. Fala comigo através da Tua Palavra. Guia os meus passos e dá clareza ao meu coração. Amém.",
    followUp: "Quer que eu busque algo mais específico? Pode me perguntar qualquer coisa — estou aqui pra isso. 💙"
  };
}
