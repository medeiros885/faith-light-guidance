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

export { SYSTEM_PROMPT } from "./personality";
export { WARMTH_PHRASES };

type Intent =
  | "factual"
  | "theological"
  | "emotional"
  | "prayer"
  | "verse"
  | "general";

type TopicKey =
  | "salvation_security"
  | "salvation"
  | "grace"
  | "sin"
  | "trinity"
  | "holy_spirit"
  | "predestination"
  | "baptism"
  | "justification"
  | "sanctification"
  | "regeneration"
  | "tithe"
  | "hell"
  | "heaven"
  | "eschatology"
  | "repentance"
  | "church"
  | "paul"
  | "forgiveness"
  | "faith"
  | "anxiety"
  | "fear"
  | "sadness"
  | "guilt"
  | "fatigue"
  | "factual"
  | "verse"
  | "prayer"
  | "general";

type MemoryState = {
  lastTopic: TopicKey | null;
  lastIntent: Intent | null;
  lastEmotion: UserEmotion | null;
};

let memoryState: MemoryState = {
  lastTopic: null,
  lastIntent: null,
  lastEmotion: null,
};

function remember(topic: TopicKey, intent: Intent, emotion?: UserEmotion | null) {
  memoryState = {
    lastTopic: topic,
    lastIntent: intent,
    lastEmotion: emotion ?? null,
  };
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function maybePrefixWithMemory(topic: TopicKey): string {
  if (memoryState.lastTopic && memoryState.lastTopic === topic) {
    return pick([
      "Voltando ao que você perguntou agora há pouco… ",
      "Continuando nessa mesma linha… ",
      "Pegando o fio da meada dessa conversa… ",
    ]);
  }

  if (memoryState.lastIntent === "emotional" && topic === "salvation_security") {
    return pick([
      "Como isso costuma mexer com o coração de muita gente… ",
      "Como essa dúvida normalmente vem acompanhada de inquietação… ",
    ]);
  }

  return "";
}

function detectIntent(q: string): Intent {
  const lower = q.toLowerCase();

  if (/orar|ora[cç][aã]o|reza|reze|intercede|ore\s+por/.test(lower)) return "prayer";
  if (/vers[íi]culo|me\s+mostra\s+um\s+vers|me\s+d[aá]\s+um\s+vers/i.test(lower))
    return "verse";

  if (
    /salva[cç][aã]o|gra[cç]a|pecado|trindade|esp[ií]rito\s+santo|batismo|inferno|c[eé]u|vida\s+eterna|predestina|livre\s*arb|apocalipse|arrebatamento|doutrina|teolog|justifica[cç][aã]o|santifica[cç][aã]o|regenera[cç][aã]o|apostasia|jejum|d[ií]zimo|ceia|comunh[aã]o|guerra\s+espiritual|dem[oô]nio|igreja|arrependimento/.test(
      lower
    )
  )
    return "theological";

  if (
    /trist|ansio|medo|sozinho|vazio|dor|sofr|culpa|cansa|confus|ang[uú]st|desespero|preocup|aflito|afli[cç]|exaust|esgota/.test(
      lower
    )
  )
    return "emotional";

  if (/^(quem|qual|quantos?|quantas?|onde|quando|como|o que|por que)\b/.test(lower))
    return "factual";

  return "general";
}

const emotionOpenings: Record<string, string[]> = {
  triste: [
    "Eu sinto que isso está pesado pra você…",
    "Imagino que isso não esteja sendo nada fácil…",
    "Seu coração merece cuidado agora.",
    "Deus vê cada lágrima sua, e nenhuma passa despercebida.",
  ],
  ansioso: [
    "Respira fundo… vamos com calma.",
    "Parece que seu coração está acelerado agora.",
    "A ansiedade aperta, mas você não está sozinho.",
    "Vamos sem pressa — uma coisa de cada vez.",
  ],
  cansado: [
    "Eu entendo esse cansaço…",
    "Você parece sobrecarregado, de verdade.",
    "Vamos devagar. Nem tudo precisa ser resolvido agora.",
  ],
  confuso: [
    "Eu sei como é não ter clareza.",
    "Você não precisa resolver tudo de uma vez.",
    "Vamos por partes, sem pressão.",
  ],
  em_paz: [
    "Que bom perceber paz. Isso é precioso. 😊",
    "A paz do Senhor sustenta de um jeito muito bonito.",
    "Aproveita esse momento com gratidão.",
  ],
  medo: [
    "Eu entendo esse medo…",
    "Tá tudo bem admitir que isso te assusta.",
    "Mesmo tremendo, você não está sozinho.",
  ],
};

const defaultOpenings = [
  "Entendo você.",
  "Obrigado por confiar isso aqui.",
  "Faz sentido trazer essa pergunta.",
  "Vamos olhar isso com calma.",
  "Eu te ouço. E Deus também.",
  "Essa é uma pergunta importante.",
];

function getEmotionAcolhimento(emotion?: UserEmotion | null): string {
  if (emotion && emotionOpenings[String(emotion)]) {
    return pick(emotionOpenings[String(emotion)]);
  }
  return pick(defaultOpenings);
}

function inferEmotionFromQuestion(q: string): UserEmotion | null {
  const lower = q.toLowerCase();

  if (/ansio|preocup|nervos|afli[cç][aã]o|desespero|p[aâ]nico/.test(lower)) return "ansioso";
  if (/trist|chor|vazio|sozinho|saudade|abatid|quebrado/.test(lower)) return "triste";
  if (/medo|assust|pavor|receio|terror/.test(lower)) return "medo";
  if (/cansa|exaust|esgota|sobrecarreg/.test(lower)) return "cansado";
  if (/confus|perdid|sem\s+dire[cç][aã]o/.test(lower)) return "confuso";
  return null;
}

function buildDirectTheologyResponse(opts: {
  topic: TopicKey;
  direct: string | string[];
  context: string | string[];
  explanation: string | string[];
  application: string | string[];
  verses: string[];
  prayer: string | string[];
  followUp?: string | string[];
  emotion?: UserEmotion | null;
}): BibleResponse {
  const inferredEmotion = opts.emotion ?? null;
  const emotionalPrefix =
    inferredEmotion && ["ansioso", "triste", "medo", "cansado", "confuso"].includes(String(inferredEmotion))
      ? `${getEmotionAcolhimento(inferredEmotion)} `
      : "";

  const direct = Array.isArray(opts.direct) ? pick(opts.direct) : opts.direct;
  const context = Array.isArray(opts.context) ? pick(opts.context) : opts.context;
  const explanation = Array.isArray(opts.explanation)
    ? pick(opts.explanation)
    : opts.explanation;
  const application = Array.isArray(opts.application)
    ? pick(opts.application)
    : opts.application;
  const prayer = Array.isArray(opts.prayer) ? pick(opts.prayer) : opts.prayer;
  const followUp = Array.isArray(opts.followUp)
    ? pick(opts.followUp)
    : opts.followUp ??
      pick([
        "Quer que eu aprofunde isso de forma mais simples?",
        "Quer que eu te mostre mais textos sobre esse tema?",
        "Quer que eu conecte isso com a vida prática?",
      ]);

  return {
    acolhimento: `${maybePrefixWithMemory(opts.topic)}${emotionalPrefix}${direct}`.trim(),
    contexto: context,
    explicacao: explanation,
    aplicacao: application,
    versiculos: opts.verses,
    oracao: prayer,
    followUp,
  };
}

function buildDebatedTheologyResponse(opts: {
  topic: TopicKey;
  direct: string | string[];
  context: string | string[];
  explanation: string | string[];
  application: string | string[];
  verses: string[];
  prayer: string | string[];
  followUp?: string | string[];
  emotion?: UserEmotion | null;
}): BibleResponse {
  const inferredEmotion = opts.emotion ?? null;
  const emotionalPrefix =
    inferredEmotion && ["ansioso", "triste", "medo", "cansado", "confuso"].includes(String(inferredEmotion))
      ? `${getEmotionAcolhimento(inferredEmotion)} `
      : "";

  const direct = Array.isArray(opts.direct) ? pick(opts.direct) : opts.direct;
  const context = Array.isArray(opts.context) ? pick(opts.context) : opts.context;
  const explanation = Array.isArray(opts.explanation)
    ? pick(opts.explanation)
    : opts.explanation;
  const application = Array.isArray(opts.application)
    ? pick(opts.application)
    : opts.application;
  const prayer = Array.isArray(opts.prayer) ? pick(opts.prayer) : opts.prayer;
  const followUp = Array.isArray(opts.followUp)
    ? pick(opts.followUp)
    : opts.followUp ??
      pick([
        "Quer que eu te mostre os textos usados em cada visão?",
        "Quer que eu resuma os dois lados de forma mais simples?",
        "Quer que eu aprofunde um desses pontos de vista?",
      ]);

  return {
    acolhimento: `${maybePrefixWithMemory(opts.topic)}${emotionalPrefix}${direct}`.trim(),
    contexto: context,
    explicacao: explanation,
    aplicacao: application,
    versiculos: opts.verses,
    oracao: prayer,
    followUp,
  };
}

function salvationSecurityMatcher(lower: string) {
  return /(pode\s+perder\s+a\s+salva[cç][aã]o|perder\s+a\s+salva[cç][aã]o|salva[cç][aã]o\s+se\s+perde|uma\s+vez\s+salvo\s+sempre\s+salvo|salvo\s+para\s+sempre|afastar\s+da\s+f[eé]\s+e\s+perder\s+a\s+salva[cç][aã]o)/.test(
    lower
  );
}

function salvationDefinitionMatcher(lower: string) {
  return /(o\s+que\s+[ée]\s+a\s+salva[cç][aã]o|como\s+(ser|sou)\s+salvo|o\s+que\s+significa\s+salva[cç][aã]o|como\s+receber\s+a\s+salva[cç][aã]o)/.test(
    lower
  );
}

function faithMatcher(lower: string) {
  return /(\bf[eé]\b|o\s+que\s+[ée]\s+a\s+f[eé]|significado\s+da\s+f[eé]|qual\s+o\s+significado\s+da\s+f[eé]|tenho\s+pouca\s+f[eé]|como\s+ter\s+f[eé]|aumentar\s+minha\s+f[eé])/.test(
    lower
  );
}

function heavenMatcher(lower: string) {
  return /(o\s+que\s+[ée]\s+o\s+c[eé]u|como\s+ser[aá]\s+o\s+c[eé]u|c[eé]u\s+na\s+b[ií]blia|vida\s+eterna\s+no\s+c[eé]u|\bc[eé]u\b|vida\s+eterna)/.test(
    lower
  );
}

function buildEmotionalBridge(
  q: string,
  emotion?: UserEmotion | null
): string | null {
  const detected = emotion ?? inferEmotionFromQuestion(q);
  if (!detected) return null;

  if (detected === "ansioso") {
    return pick([
      "Antes de entrar no tema em si, eu quero reconhecer uma coisa: isso pode mexer muito com a mente de alguém.",
      "Antes da parte teológica, vale dizer que dúvidas assim podem apertar o coração — e isso não faz de você alguém com pouca fé.",
    ]);
  }

  if (detected === "medo") {
    return pick([
      "Antes da explicação, deixa eu te dizer: perguntas assim costumam vir acompanhadas de medo, e Deus não se afasta de você por causa disso.",
      "Antes de qualquer resposta técnica, eu quero te lembrar que esse tipo de dúvida muitas vezes nasce de um coração assustado — e Deus sabe disso.",
    ]);
  }

  if (detected === "triste") {
    return pick([
      "Antes de explicar, eu quero reconhecer que talvez isso esteja vindo de um lugar de dor no seu coração.",
      "Antes da resposta, deixa eu só dizer: Deus também acolhe perguntas feitas no meio do cansaço da alma.",
    ]);
  }

  if (detected === "cansado" || detected === "confuso") {
    return pick([
      "Antes de aprofundar, vamos sem pressa. Você não precisa resolver tudo de uma vez.",
      "Antes de responder melhor, vale lembrar: Deus não exige de você clareza perfeita para começar a te conduzir.",
    ]);
  }

  return null;
}

function matchTheological(q: string, emotion?: UserEmotion | null): BibleResponse | null {
  const lower = q.toLowerCase();
  const bridge = buildEmotionalBridge(q, emotion);

  if (salvationSecurityMatcher(lower)) {
    return buildDebatedTheologyResponse({
      topic: "salvation_security",
      emotion,
      direct: [
        "Existem interpretações cristãs diferentes sobre isso. Alguns entendem que a salvação é definitiva em Cristo; outros entendem que a Bíblia também alerta sobre a possibilidade de afastamento.",
        "Essa é uma daquelas perguntas em que cristãos sinceros acabam chegando a conclusões diferentes, usando textos bíblicos reais dos dois lados.",
      ],
      context: [
        "A Bíblia apresenta tanto textos de segurança em Cristo quanto alertas sérios sobre perseverança. Por isso esse tema sempre foi debatido na teologia cristã.",
        "Quando esse assunto aparece, geralmente entram em cena dois grupos de textos: os que enfatizam a segurança da salvação e os que enfatizam a necessidade de permanecer firme até o fim.",
      ],
      explanation: [
        `${bridge ? `${bridge} ` : ""}Textos como João 10:28 e Romanos 8:38-39 são usados por quem defende segurança eterna. Já Hebreus 6:4-6 e Hebreus 10:26-29 são usados por quem entende que existe o risco de afastamento real. O ponto comum entre todos é: a salvação começa pela graça e conduz a uma vida de perseverança.`,
        `${bridge ? `${bridge} ` : ""}Alguns cristãos dizem: “quem nasceu de novo de verdade persevera até o fim”. Outros dizem: “a Bíblia leva a sério a responsabilidade humana de permanecer”. As duas leituras tentam honrar o texto bíblico.`,
      ],
      application: [
        "Mais importante do que transformar isso só em debate é viver diariamente em comunhão com Cristo, com fé sincera, arrependimento e constância.",
        "Na prática, essa pergunta não deve te empurrar pro pânico, e sim pra mais proximidade de Jesus, mais sinceridade e mais dependência da graça.",
      ],
      verses: [
        'João 10:28 — "Eu lhes dou a vida eterna, e jamais perecerão."',
        'Hebreus 6:4-6 — alerta sobre aqueles que caíram.',
        'Hebreus 3:14 — "Somos participantes de Cristo, se de fato guardarmos firme até o fim."',
      ],
      prayer: [
        "Senhor, fortalece minha fé e me ajuda a permanecer firme em Ti todos os dias. Amém.",
        "Pai, guarda meu coração em Ti, livra-me do desespero e firma meus passos na Tua graça. Amém.",
      ],
      followUp: [
        "Quer que eu te mostre, de forma simples, os textos usados por cada visão?",
        "Quer que eu resuma os dois lados dessa questão sem linguagem complicada?",
      ],
    });
  }

  if (salvationDefinitionMatcher(lower)) {
    return buildDirectTheologyResponse({
      topic: "salvation",
      emotion,
      direct: [
        "Salvação é o resgate que Deus faz da humanidade através de Jesus Cristo.",
        "Salvação é a obra de Deus para reconciliar o ser humano consigo por meio de Jesus.",
      ],
      context: [
        "A Bíblia mostra que todos pecaram e estão separados de Deus. A salvação é a iniciativa de Deus para restaurar esse relacionamento, não algo que o homem conquista sozinho.",
        "Desde o começo da Bíblia, Deus revela que o problema do homem não é só moral, mas espiritual. A salvação é a resposta de Deus para isso.",
      ],
      explanation: [
        "Não é por mérito ou esforço humano. É pela graça de Deus, recebida pela fé em Jesus. Ele viveu, morreu e ressuscitou para nos dar vida eterna.",
        "Ser salvo não é se tornar merecedor de Deus, e sim confiar na obra perfeita de Cristo, que fez por nós o que não conseguiríamos fazer sozinhos.",
      ],
      application: [
        "A salvação começa com um 'sim' sincero a Jesus. Não precisa ser perfeito — precisa ser verdadeiro.",
        "Na prática, isso significa parar de confiar no próprio esforço como base da aceitação e descansar na graça de Cristo.",
      ],
      verses: [
        'Efésios 2:8-9 — "Pois vocês são salvos pela graça, por meio da fé..."',
        'Romanos 10:9 — "Se você confessar com a sua boca que Jesus é Senhor... será salvo."',
      ],
      prayer: [
        "Senhor Jesus, eu reconheço que preciso de Ti. Entrego minha vida nas Tuas mãos. Amém.",
        "Pai, obrigado porque a salvação começa na Tua graça e não no meu mérito. Amém.",
      ],
      followUp: [
        "Quer entender o que muda na vida de alguém que é salvo?",
        "Quer que eu te explique a diferença entre salvação, justificação e santificação?",
      ],
    });
  }

  if (faithMatcher(lower)) {
    return buildDirectTheologyResponse({
      topic: "faith",
      emotion,
      direct: [
        "Fé é confiar em Deus mesmo quando você não tem todas as respostas.",
        "Fé é se apoiar no caráter de Deus, mesmo quando o caminho ainda não está totalmente claro.",
      ],
      context: [
        'Hebreus 11:1 define fé como "a certeza daquilo que esperamos e a prova das coisas que não vemos."',
        "Na Bíblia, fé nunca aparece como sentimento vazio. Ela sempre está ligada a confiar em Deus, obedecer a Ele e andar mesmo sem enxergar tudo.",
      ],
      explanation: [
        "Fé não é ausência de dúvida. É escolher confiar em Deus apesar da dúvida. Muitos personagens bíblicos tremeram por dentro, mas continuaram indo.",
        "Ter fé não significa nunca se questionar. Significa não transformar a falta de controle em desculpa para desistir de Deus.",
      ],
      application: [
        "Fé se fortalece com prática: oração, leitura da Palavra e lembrando do que Deus já fez na sua vida.",
        "Você não precisa esperar uma fé gigante pra começar. Deus honra até passos pequenos dados com sinceridade.",
      ],
      verses: [
        'Hebreus 11:1 — "A fé é a certeza daquilo que esperamos."',
        'Marcos 9:24 — "Eu creio; ajuda-me na minha falta de fé."',
      ],
      prayer: [
        "Senhor, aumenta minha fé e me ajuda a confiar em Ti mesmo quando não entendo tudo. Amém.",
        "Pai, firma meu coração em Ti e me ajuda a não viver guiado só pelo que eu vejo. Amém.",
      ],
      followUp: [
        "Quer que eu te mostre exemplos reais de fé na Bíblia?",
        "Quer que eu te explique como fortalecer a fé no dia a dia?",
      ],
    });
  }

  if (heavenMatcher(lower) && !/inferno/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "heaven",
      emotion,
      direct: [
        "O céu é a eternidade na presença de Deus, onde não há dor, morte ou sofrimento.",
        "O céu, biblicamente, é comunhão plena com Deus — a realidade final dos que estão em Cristo.",
      ],
      context: [
        "A Bíblia descreve o céu como o destino final daqueles que pertencem a Cristo.",
        "Quando a Bíblia fala do céu, ela não fala só de um lugar bonito, mas da plenitude da presença de Deus.",
      ],
      explanation: [
        "Mais do que um lugar físico, o céu é o cumprimento daquilo para o qual fomos criados: estar plenamente reconciliados com Deus.",
        "O ponto central do céu não é rua de ouro ou imagem bonita, mas o fato de Deus enxugar toda lágrima e estabelecer comunhão perfeita com seu povo.",
      ],
      application: [
        "Pensar no céu não é fugir da realidade, mas viver hoje com propósito eterno.",
        "A esperança do céu não nos aliena; ela nos fortalece para viver com mais fidelidade aqui.",
      ],
      verses: [
        'João 14:2 — "Na casa de meu Pai há muitas moradas."',
        'Apocalipse 21:4 — "Não haverá mais morte, nem dor."',
      ],
      prayer: [
        "Senhor, firma meu coração na eternidade e me ajuda a viver com propósito aqui. Amém.",
        "Pai, me lembra que minha esperança final está em Ti, e não só nas coisas desta vida. Amém.",
      ],
      followUp: [
        "Quer entender melhor como a Bíblia descreve a vida eterna?",
        "Quer que eu te mostre a diferença entre céu, nova criação e vida eterna?",
      ],
    });
  }

  if (/gra[cç]a/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "grace",
      emotion,
      direct: [
        "Graça é o favor imerecido de Deus — aquilo que recebemos sem ter como pagar.",
        "Graça é Deus nos dando o que não conseguimos conquistar sozinhos.",
      ],
      context: [
        "No Antigo Testamento, a graça já aparece na paciência e nas promessas de Deus. No Novo Testamento, ela se torna ainda mais clara em Jesus.",
        "Quando a Bíblia fala de graça, ela está falando da iniciativa amorosa de Deus em favor de quem não merece.",
      ],
      explanation: [
        "Graça não é Deus ignorando o pecado. É Deus pagando o preço que a gente não conseguiria pagar. É amor em ação.",
        "A graça não apenas perdoa; ela também sustenta, ensina e transforma.",
      ],
      application: [
        "Viver pela graça é parar de tentar 'merecer' Deus e começar a descansar no que Ele já fez.",
        "Na prática, isso significa trocar desespero e orgulho por gratidão, humildade e confiança.",
      ],
      verses: [
        'Romanos 3:24 — "Sendo justificados gratuitamente por sua graça..."',
        '2 Coríntios 12:9 — "A minha graça te basta..."',
      ],
      prayer: [
        "Pai, obrigado pela Tua graça. Me ajuda a viver nela sem culpa e sem medo. Amém.",
        "Senhor, me ensina a descansar na Tua graça mais do que no meu desempenho. Amém.",
      ],
      followUp: [
        "Quer entender a diferença entre graça e misericórdia?",
        "Quer que eu te mostre como a graça muda a vida prática?",
      ],
    });
  }

  if (/pecado/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "sin",
      emotion,
      direct: [
        "Pecado é tudo aquilo que nos separa de Deus — em ação, pensamento ou omissão.",
        "Pecado, biblicamente, não é só fazer coisa errada; é viver desalinhado do coração e da vontade de Deus.",
      ],
      context: [
        "Desde Gênesis 3, a humanidade vive as consequências do pecado. Mas a história bíblica também mostra que Deus providenciou redenção.",
        "A Bíblia trata o pecado com seriedade porque ele fere nossa relação com Deus, conosco e com os outros.",
      ],
      explanation: [
        "Pecado não é só 'fazer coisas ruins'. É uma ruptura profunda com o propósito de Deus. Por isso Jesus veio tratar a raiz do problema.",
        "Reconhecer o pecado não é para gerar desespero sem saída, mas para abrir o caminho do arrependimento e do perdão.",
      ],
      application: [
        "Reconhecer o pecado não é motivo de vergonha eterna. É o primeiro passo pra liberdade.",
        "Se Deus está mostrando algo, não fuja. Leve isso a Cristo, porque nele há perdão e recomeço.",
      ],
      verses: [
        'Romanos 3:23 — "Todos pecaram..."',
        '1 João 1:9 — "Se confessarmos... ele é fiel e justo para nos perdoar."',
      ],
      prayer: [
        "Senhor, eu reconheço que errei. Mas sei que Teu perdão é maior que qualquer falha minha. Amém.",
        "Pai, me dá um coração humilde para confessar, receber perdão e caminhar em novidade de vida. Amém.",
      ],
      followUp: [
        "Quer entender como lidar com a culpa de forma saudável?",
        "Quer que eu te explique a diferença entre pecado, culpa e condenação?",
      ],
    });
  }

  if (/trindade/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "trinity",
      emotion,
      direct: [
        "A Trindade é a doutrina de um só Deus em três pessoas: Pai, Filho e Espírito Santo.",
        "A fé cristã ensina que Deus é um só em essência, revelado eternamente como Pai, Filho e Espírito Santo.",
      ],
      context: [
        "A fé cristã histórica afirma um único Deus em essência, revelado eternamente como três pessoas distintas.",
        "A Bíblia não usa a palavra 'Trindade' explicitamente, mas apresenta com clareza o Pai, o Filho e o Espírito Santo como divinos e distintos.",
      ],
      explanation: [
        "Não são três deuses, nem um Deus mudando de forma. É um único Deus, eternamente Pai, Filho e Espírito Santo.",
        "A Trindade é um mistério profundo, mas não uma contradição: um só Deus, três pessoas distintas, mesma natureza divina.",
      ],
      application: [
        "A Trindade nos ajuda a enxergar a profundidade de quem Deus é e a beleza do relacionamento dentro do próprio ser divino.",
        "Na prática, isso alimenta reverência: o Deus que te salva não é impessoal, mas plenamente vivo e relacional.",
      ],
      verses: [
        'Mateus 28:19 — "Em nome do Pai, do Filho e do Espírito Santo."',
        '2 Coríntios 13:13 — bênção trinitária.',
      ],
      prayer: [
        "Senhor, aumenta minha reverência e meu entendimento diante da Tua grandeza. Amém.",
        "Pai, me ajuda a Te conhecer com mais profundidade, reverência e amor. Amém.",
      ],
      followUp: [
        "Quer que eu te explique a Trindade de forma ainda mais simples?",
        "Quer que eu te mostre onde isso aparece na Bíblia?",
      ],
    });
  }

  if (/esp[ií]rito\s+santo/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "holy_spirit",
      emotion,
      direct: [
        "O Espírito Santo é Deus presente e atuante na vida do cristão.",
        "O Espírito Santo não é uma energia impessoal — Ele é Deus, agindo e habitando no seu povo.",
      ],
      context: [
        "Jesus prometeu o Consolador, e o Espírito Santo foi derramado para habitar, ensinar, convencer e fortalecer o povo de Deus.",
        "Na Bíblia, o Espírito Santo aparece desde o começo, mas no Novo Testamento seu papel fica ainda mais claro na vida da igreja e do cristão.",
      ],
      explanation: [
        "Ele não é uma força impessoal. É pessoa divina: consola, guia, ensina, convence do pecado e produz fruto em quem caminha com Deus.",
        "Ser guiado pelo Espírito não é viver em misticismo vazio, mas em sensibilidade real à presença e à direção de Deus.",
      ],
      application: [
        "A vida cristã não foi feita para ser vivida só na força humana. Busque sensibilidade à direção do Espírito Santo no dia a dia.",
        "Na prática, isso significa orar, ouvir a Palavra, obedecer com prontidão e cultivar um coração disponível.",
      ],
      verses: [
        'João 14:26 — "O Consolador, o Espírito Santo..."',
        'Gálatas 5:22 — "O fruto do Espírito é..."',
      ],
      prayer: [
        "Espírito Santo, guia meus pensamentos, minhas escolhas e meu coração hoje. Amém.",
        "Senhor, torna meu coração sensível à Tua voz e firme na Tua direção. Amém.",
      ],
      followUp: [
        "Quer que eu te explique o que significa ser guiado pelo Espírito?",
        "Quer que eu te mostre a diferença entre dons e fruto do Espírito?",
      ],
    });
  }

  if (/predestina|livre\s*arb/.test(lower)) {
    return buildDebatedTheologyResponse({
      topic: "predestination",
      emotion,
      direct: [
        "Esse é um dos temas mais debatidos da teologia cristã — e ambos os lados tentam ser fiéis à Bíblia.",
        "Predestinação e livre-arbítrio formam uma das discussões mais profundas da fé cristã.",
      ],
      context: [
        "Alguns enfatizam a soberania de Deus na salvação; outros enfatizam mais a responsabilidade humana em responder ao chamado divino.",
        "Ao longo da história da igreja, esse tema foi tratado de formas diferentes por cristãos sérios e comprometidos com as Escrituras.",
      ],
      explanation: [
        "Textos como Efésios 1 e Romanos 8 são usados por quem destaca predestinação. Já textos de convite, escolha e responsabilidade são usados por quem enfatiza livre-arbítrio.",
        "As duas posições tentam honrar o texto bíblico: uma sublinha a soberania divina, a outra sublinha a responsabilidade humana. O mistério existe porque a Bíblia fala dos dois aspectos.",
      ],
      application: [
        "Mais importante que vencer debate é responder a Deus com fé, reverência e humildade. Confie no caráter de Deus.",
        "Na prática, esse tema deve gerar menos arrogância e mais adoração, menos discussão vazia e mais rendição a Deus.",
      ],
      verses: [
        'Efésios 1:5 — "Nos predestinou para ele..."',
        'Josué 24:15 — "Escolhei hoje a quem sirvais."',
      ],
      prayer: [
        "Senhor, me dá humildade diante do que é profundo e fidelidade diante do que já está claro. Amém.",
        "Pai, guarda meu coração da soberba e me ensina a descansar na Tua sabedoria. Amém.",
      ],
    });
  }

  if (/batismo/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "baptism",
      emotion,
      direct: [
        "Batismo é um sinal público de fé e identificação com Cristo.",
        "Batismo é um ato visível de obediência que aponta para a nova vida em Jesus.",
      ],
      context: [
        "No Novo Testamento, ele aparece ligado à conversão e arrependimento. É um ato de obediência e testemunho.",
        "A igreja primitiva tratava o batismo com seriedade porque ele comunicava publicamente a união com Cristo.",
      ],
      explanation: [
        "Simboliza morte para a velha vida e nova vida em Cristo. Não é o que salva, mas é parte importante da caminhada cristã.",
        "O batismo não substitui a fé, mas a expressa de forma visível, comunitária e obediente.",
      ],
      application: [
        "Se você crê em Cristo e ainda não foi batizado, vale tratar isso com seriedade e conversar com sua igreja.",
        "Na prática, o batismo lembra que seguir Jesus não é só uma convicção privada — também é testemunho público.",
      ],
      verses: [
        'Romanos 6:4 — "Fomos sepultados com ele na morte pelo batismo..."',
        'Atos 2:38 — "Arrependam-se e cada um de vocês seja batizado..."',
      ],
      prayer: [
        "Senhor, me ajuda a viver de forma pública aquilo que creio no meu coração. Amém.",
        "Pai, que minha fé não seja só interna, mas também visível em obediência. Amém.",
      ],
      followUp: [
        "Quer entender as diferentes formas de batismo nas tradições cristãs?",
        "Quer que eu te explique a relação entre fé, batismo e nova vida?",
      ],
    });
  }

  if (/justifica[cç][aã]o/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "justification",
      emotion,
      direct: [
        "Justificação é o ato de Deus declarar justo quem crê em Cristo.",
        "Justificação é quando Deus aceita o pecador por causa de Cristo, e não por causa do próprio mérito.",
      ],
      context: [
        "Paulo desenvolve isso especialmente em Romanos: somos declarados justos não por obras, mas pela fé no sacrifício de Jesus.",
        "No coração do evangelho está essa verdade: o homem não se salva por desempenho, mas pela obra de Cristo recebida pela fé.",
      ],
      explanation: [
        "Não é que Deus finge que somos perfeitos. Ele nos vê através de Cristo. É como se a justiça de Jesus fosse creditada na nossa conta.",
        "Justificação não é transformação moral progressiva — isso tem mais a ver com santificação. Aqui, o foco é aceitação diante de Deus por meio de Cristo.",
      ],
      application: [
        "Isso muda tudo: você não precisa viver tentando provar valor pra Deus. Já foi aceito em Cristo.",
        "Na prática, isso combate tanto o orgulho religioso quanto o desespero espiritual.",
      ],
      verses: [
        'Romanos 5:1 — "Tendo sido justificados pela fé, temos paz com Deus."',
        'Romanos 3:28 — "O homem é justificado pela fé..."',
      ],
      prayer: [
        "Pai, obrigado por me aceitar não pelo que eu faço, mas pelo que Jesus fez por mim. Amém.",
        "Senhor, me livra da escravidão do desempenho e firma meu coração na obra de Cristo. Amém.",
      ],
      followUp: [
        "Quer que eu compare justificação com santificação de forma simples?",
        "Quer que eu te mostre por que isso traz descanso ao coração?",
      ],
    });
  }

  if (/santifica[cç][aã]o/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "sanctification",
      emotion,
      direct: [
        "Santificação é o processo de ser transformado à imagem de Cristo ao longo da vida.",
        "Santificação é a obra contínua de Deus em nós, moldando nosso caráter para parecer mais com Jesus.",
      ],
      context: [
        "Diferente da justificação, a santificação é progressiva. É o Espírito Santo trabalhando em nós dia após dia.",
        "A Bíblia mostra que quem está em Cristo não apenas é perdoado, mas também começa a ser transformado.",
      ],
      explanation: [
        "Não é perfeição instantânea. É crescimento. É querer ser mais parecido com Jesus em cada decisão, cada pensamento, cada atitude.",
        "Santificação não significa ausência total de luta, mas presença real de transformação, arrependimento e maturidade crescente.",
      ],
      application: [
        "Santificação não é esforço solitário — é cooperação com o Espírito Santo. Leia a Palavra, ore, esteja em comunidade.",
        "Na prática, isso significa perseverar mesmo quando o processo parece lento.",
      ],
      verses: [
        '1 Tessalonicenses 4:3 — "A vontade de Deus é a santificação de vocês."',
        'Filipenses 1:6 — "Aquele que começou boa obra em vocês vai completá-la."',
      ],
      prayer: [
        "Senhor, continua me transformando. Eu quero parecer mais com Jesus a cada dia. Amém.",
        "Pai, não me deixa desistir do processo que o Senhor mesmo começou em mim. Amém.",
      ],
      followUp: [
        "Quer que eu te explique práticas que ajudam na santificação?",
        "Quer que eu compare santificação com justificação de forma bem simples?",
      ],
    });
  }

  if (/regenera[cç][aã]o|novo\s+nascimento|nascer\s+de\s+novo/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "regeneration",
      emotion,
      direct: [
        "Regeneração é o novo nascimento operado por Deus no coração humano.",
        "Nascer de novo é receber vida espiritual nova pela ação de Deus.",
      ],
      context: [
        "Jesus falou sobre isso com Nicodemos em João 3, mostrando que ninguém entra no Reino apenas por tradição, religião ou esforço.",
        "O novo nascimento é central porque o cristianismo não trata só de mudança externa, mas de nova vida interior.",
      ],
      explanation: [
        "Ser regenerado é receber nova vida espiritual. Não é só melhorar hábitos, mas ser transformado de dentro pra fora pela ação de Deus.",
        "A regeneração aponta para algo que Deus faz em nós, produzindo vida, sensibilidade espiritual e novo desejo por Ele.",
      ],
      application: [
        "Isso mostra que o cristianismo não é maquiagem moral. É vida nova em Cristo.",
        "Na prática, essa verdade nos chama a depender menos de aparência religiosa e mais da ação real de Deus no coração.",
      ],
      verses: [
        'João 3:3 — "Se alguém não nascer de novo..."',
        'Tito 3:5 — "mediante o lavar regenerador..."',
      ],
      prayer: [
        "Senhor, continua renovando meu coração e produzindo em mim vida nova. Amém.",
        "Pai, faz em mim aquilo que só o Senhor pode fazer: vida nova de dentro pra fora. Amém.",
      ],
      followUp: [
        "Quer que eu te explique a diferença entre regeneração, conversão e santificação?",
        "Quer que eu te mostre por que Jesus falou isso para Nicodemos?",
      ],
    });
  }

  if (/d[ií]zimo|oferta/.test(lower)) {
    return buildDebatedTheologyResponse({
      topic: "tithe",
      emotion,
      direct: [
        "O dízimo é um tema com diferentes interpretações entre os cristãos.",
        "Quando o assunto é dízimo, cristãos bíblicos concordam na generosidade, mas divergem em alguns detalhes de aplicação.",
      ],
      context: [
        "No Antigo Testamento, o dízimo era parte da Lei mosaica. No Novo Testamento, Paulo enfatiza generosidade voluntária.",
        "Ao longo da história cristã, alguns mantiveram o dízimo como princípio contínuo; outros destacaram mais a contribuição voluntária e alegre.",
      ],
      explanation: [
        "Alguns entendem que o dízimo continua como princípio; outros enfatizam a oferta generosa e voluntária como modelo neotestamentário. Ambos concordam que Deus valoriza um coração generoso.",
        "A divergência normalmente não está em dar ou não dar, mas em como entender a continuidade da prática do dízimo na nova aliança.",
      ],
      application: [
        "Mais do que percentual, Deus olha pro coração. Dê com alegria, com propósito, e confie na provisão dEle.",
        "Na prática, generosidade bíblica nunca deve nascer de manipulação, medo ou barganha com Deus.",
      ],
      verses: [
        'Malaquias 3:10 — "Trazei todos os dízimos..."',
        '2 Coríntios 9:7 — "Cada um dê conforme determinou em seu coração..."',
      ],
      prayer: [
        "Senhor, me ensina a ser generoso como Tu és comigo. Amém.",
        "Pai, livra meu coração da avareza e me ensina a contribuir com alegria. Amém.",
      ],
    });
  }

  if (/inferno/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "hell",
      emotion,
      direct: [
        "O inferno é descrito na Bíblia como o lugar de separação eterna de Deus.",
        "Biblicamente, o inferno aparece como juízo final e separação definitiva da presença favorável de Deus.",
      ],
      context: [
        "Jesus falou mais sobre o inferno do que qualquer outro personagem bíblico. Ele usou termos como 'Geena' e 'trevas exteriores'.",
        "A Bíblia trata esse tema com sobriedade porque ele revela a seriedade do pecado, da justiça divina e da necessidade da salvação.",
      ],
      explanation: [
        "A essência do inferno não é apenas uma imagem de sofrimento, mas a consequência final da rejeição de Deus.",
        "Jesus usa linguagem forte para mostrar que não se trata de curiosidade escatológica, mas de uma realidade espiritual séria.",
      ],
      application: [
        "A existência do inferno mostra a seriedade das nossas escolhas — mas também a grandeza da salvação que Deus oferece em Cristo.",
        "Esse tema deve nos conduzir menos a sensacionalismo e mais a reverência, urgência espiritual e gratidão pelo evangelho.",
      ],
      verses: [
        'Mateus 25:46 — "Irão estes para o castigo eterno..."',
        'João 3:16 — "Para que todo o que nele crê não pereça..."',
      ],
      prayer: [
        "Senhor, obrigado pela salvação em Cristo. Me ajuda a viver com essa urgência no coração. Amém.",
        "Pai, firma meu coração no evangelho e me livra de tratar coisas eternas com superficialidade. Amém.",
      ],
      followUp: [
        "Quer entender melhor o que Jesus ensinou sobre a eternidade?",
        "Quer que eu te mostre a diferença entre vida eterna, juízo e esperança cristã?",
      ],
    });
  }

  if (/apocalipse|arrebatamento|fim\s+dos\s+tempos/.test(lower)) {
    return buildDebatedTheologyResponse({
      topic: "eschatology",
      emotion,
      direct: [
        "Escatologia é um tema com múltiplas interpretações entre cristãos sinceros.",
        "Quando o assunto é fim dos tempos, existe acordo sobre a volta de Cristo, mas não sobre todos os detalhes.",
      ],
      context: [
        "O livro de Apocalipse usa linguagem simbólica e profética. Sobre o arrebatamento, cristãos divergem quanto ao momento e ao modo.",
        "Ao longo da história, surgiram diferentes linhas escatológicas tentando organizar os textos bíblicos sobre a consumação final.",
      ],
      explanation: [
        "Existem visões pré-tribulacionistas, pós-tribulacionistas, amilenistas e outras. Todas tentam ler a Bíblia com seriedade, mas destacam pontos diferentes.",
        "O ponto central não é decorar cronologia, e sim entender que Cristo voltará, Deus julgará com justiça e seu povo viverá em esperança.",
      ],
      application: [
        "O mais importante não é acertar a cronologia, mas viver preparado — com fé, amor e esperança em Cristo.",
        "Na prática, escatologia saudável produz vigilância, consolo e santidade, não paranoia.",
      ],
      verses: [
        '1 Tessalonicenses 4:17 — "Seremos arrebatados..."',
        'Apocalipse 21:4 — "Ele enxugará dos seus olhos toda lágrima."',
      ],
      prayer: [
        "Senhor, me ajuda a viver cada dia com esperança, vigilância e fidelidade. Amém.",
        "Pai, livra meu coração de medo vazio e firma minha esperança na volta de Cristo. Amém.",
      ],
    });
  }

  if (/arrependimento/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "repentance",
      emotion,
      direct: [
        "Arrependimento é mudar de direção — é reconhecer o erro e voltar pra Deus.",
        "Arrependimento não é só remorso; é mudança de mente, coração e caminho diante de Deus.",
      ],
      context: [
        "A palavra grega 'metanoia' significa literalmente 'mudança de mente'. É mais do que remorso — é transformação.",
        "Na Bíblia, arrependimento aparece como resposta genuína à verdade de Deus e à ação do Espírito no coração.",
      ],
      explanation: [
        "Arrependimento bíblico não é apenas sentir culpa. É abandonar o caminho errado e caminhar na direção de Deus.",
        "Existe diferença entre sentir peso e de fato se voltar pra Deus. Arrependimento envolve sinceridade, humildade e novo rumo.",
      ],
      application: [
        "Se algo no seu coração te incomoda, isso pode ser o Espírito te chamando. Não ignore — responda.",
        "Na prática, arrependimento começa com honestidade diante de Deus e segue com passos reais de mudança.",
      ],
      verses: [
        'Atos 3:19 — "Arrependam-se e voltem-se para Deus..."',
        '2 Crônicas 7:14 — "Se o meu povo... se humilhar..."',
      ],
      prayer: [
        "Pai, me dá coragem pra mudar de direção onde eu preciso. Eu quero andar contigo. Amém.",
        "Senhor, produz em mim arrependimento verdadeiro, e não só remorso passageiro. Amém.",
      ],
      followUp: [
        "Quer conversar sobre algo específico que está no seu coração?",
        "Quer que eu te explique a diferença entre culpa, arrependimento e condenação?",
      ],
    });
  }

  if (/igreja/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "church",
      emotion,
      direct: [
        "Igreja não é um prédio — é o corpo de Cristo, formado por todos os que creem nEle.",
        "Biblicamente, igreja é a comunidade dos que foram chamados por Deus para viver em Cristo e com Cristo.",
      ],
      context: [
        "No Novo Testamento, 'ekklesia' significa 'os chamados para fora'. A igreja é a comunidade dos que seguem Jesus.",
        "A igreja local aparece nas Escrituras como espaço de ensino, comunhão, adoração, serviço e crescimento mútuo.",
      ],
      explanation: [
        "A igreja local é onde cristãos se reúnem pra adorar, aprender, servir e crescer juntos. Não é perfeita — mas é o plano de Deus pra comunidade.",
        "Seguir Jesus sem igreja costuma parecer mais confortável, mas a Bíblia aponta para uma fé vivida em comunhão e mutualidade.",
      ],
      application: [
        "Se você está longe da igreja, considere voltar. Se está na igreja mas desanimado, lembre que o centro não é a instituição — é Jesus.",
        "Na prática, vale buscar uma comunidade saudável, bíblica e madura, onde haja graça, verdade e discipulado real.",
      ],
      verses: [
        'Mateus 16:18 — "Edificarei a minha igreja."',
        'Hebreus 10:25 — "Não deixemos de congregar-nos."',
      ],
      prayer: [
        "Senhor, me ajuda a encontrar meu lugar no Teu corpo. Amém.",
        "Pai, cura meu olhar sobre a igreja e me ensina a viver em comunhão com o Teu povo. Amém.",
      ],
      followUp: [
        "Quer conversar sobre como encontrar uma boa igreja?",
        "Quer que eu te diga sinais de uma comunidade saudável biblicamente?",
      ],
    });
  }

  return null;
}

function matchFactual(q: string): BibleResponse | null {
  const lower = q.toLowerCase();

  if (/rei\s+(antes|anterior)\s+(d[eo]\s+)?davi|antes\s+d[eo]\s+davi/.test(lower)) {
    return {
      acolhimento: maybePrefixWithMemory("factual") + "Foi Saul. 😊",
      contexto:
        "O primeiro rei de Israel foi Saul, da tribo de Benjamim. Ele foi ungido pelo profeta Samuel a pedido do povo.",
      explicacao:
        "Saul reinou por cerca de 40 anos, mas desobedeceu a Deus repetidamente. Quando Deus o rejeitou como rei, enviou Samuel para ungir Davi.",
      aplicacao:
        "A história de Saul nos ensina que posição sem obediência não se sustenta.",
      versiculos: [
        '1 Samuel 15:22 — "Obedecer é melhor do que sacrificar."',
        '1 Samuel 16:7 — "O Senhor não vê como o homem vê..."',
      ],
      oracao: "Senhor, me dá um coração obediente como o de Davi. Amém.",
      followUp: "Quer saber mais sobre a diferença entre Saul e Davi?",
    };
  }

  if (/quantos\s+livros/.test(lower)) {
    return {
      acolhimento: maybePrefixWithMemory("factual") + "A Bíblia tem 66 livros. 😊",
      contexto:
        "São 39 no Antigo Testamento e 27 no Novo Testamento. Escrita por cerca de 40 autores ao longo de aproximadamente 1.500 anos.",
      explicacao:
        "O Antigo Testamento reúne Lei, Históricos, Poéticos e Proféticos. O Novo Testamento traz Evangelhos, Atos, Cartas e Apocalipse.",
      aplicacao:
        "Começar por João, Salmos e Provérbios costuma ajudar muito quem está iniciando.",
      versiculos: [
        '2 Timóteo 3:16 — "Toda a Escritura é inspirada por Deus..."',
      ],
      oracao: "Deus, me ajuda a amar a Tua Palavra cada dia mais. Amém.",
      followUp: "Quer que eu te sugira um plano de leitura simples?",
    };
  }

  if (/quantos\s+(disc[ií]pulos|ap[oó]stolos)|12\s+disc[ií]pulos|doze\s+disc/.test(lower)) {
    return {
      acolhimento: maybePrefixWithMemory("factual") + "Jesus escolheu 12 discípulos. 😊",
      contexto:
        "Os doze foram chamados para andar com Jesus, aprender com Ele e depois anunciar o evangelho.",
      explicacao:
        "Depois da traição de Judas, Matias foi escolhido. Mais tarde, Paulo também foi chamado como apóstolo em sentido missionário.",
      aplicacao:
        "Eram pessoas comuns. Deus não escolhe os capacitados apenas — Ele também capacita os escolhidos.",
      versiculos: [
        'Marcos 3:14 — "Designou doze, para que estivessem com ele..."',
      ],
      oracao: "Senhor, usa a minha vida para espalhar o Teu amor. Amém.",
      followUp: "Quer conhecer a história de algum discípulo em particular?",
    };
  }

  if (/onde\s+jesus\s+nasceu|nascimento\s+de\s+jesus/.test(lower)) {
    return {
      acolhimento: maybePrefixWithMemory("factual") + "Jesus nasceu em Belém de Judá. 😊",
      contexto:
        "Maria e José estavam lá por causa de um censo ordenado por César Augusto.",
      explicacao:
        "O nascimento em Belém já havia sido profetizado em Miquéias 5:2. Jesus veio ao mundo da forma mais humilde possível.",
      aplicacao:
        "Deus não se orienta por status. A forma como Jesus veio ao mundo já revela isso.",
      versiculos: [
        'Miquéias 5:2 — "De ti me sairá o que governará em Israel."',
        'Lucas 2:7 — "E o deitou em uma manjedoura."',
      ],
      oracao: "Senhor Jesus, obrigado por ter vindo ao mundo por mim. Amém.",
      followUp: "Quer saber mais sobre a infância de Jesus?",
    };
  }

  return null;
}

function matchEmotional(q: string, emotion?: UserEmotion | null): BibleResponse | null {
  const lower = q.toLowerCase();

  if (/ansio|preocup|nervos|afli[cç][aã]o|desespero|p[aâ]nico/.test(lower) || emotion === "ansioso") {
    return {
      acolhimento: pick([
        "Eu sinto que isso está pesado pra você… mas você não está sozinho. 💙",
        "Parece que sua mente está cansada de carregar tanta coisa. Vamos com calma. 💙",
      ]),
      contexto:
        "Deus não ignora sua ansiedade. Ele te convida a lançar sobre Ele tudo que te pesa.",
      explicacao:
        "Ansiedade é real, e Deus entende. Ele não pede que você seja forte o tempo todo — pede que você confie nEle e caminhe um passo de cada vez.",
      aplicacao: pick([
        "Respira fundo agora. Inspira contando até 4, segura 4, solta 4. Faz isso 3 vezes.",
        "Tenta diminuir o ritmo por um instante. Olha ao redor e me diz mentalmente 3 coisas que você consegue ver agora.",
      ]),
      versiculos: [
        'Filipenses 4:6-7 — "Não andem ansiosos por coisa alguma…" ',
        '1 Pedro 5:7 — "Lancem sobre ele toda a sua ansiedade."',
      ],
      oracao: pick([
        "Senhor, acalma meu coração. Eu entrego o que não consigo controlar. Amém.",
        "Pai, segura minha mente, organiza meu interior e me cobre com Tua paz. Amém.",
      ]),
      followUp: pick([
        "Quer que eu te guie em um exercício de respiração agora?",
        "Quer que eu te mostre um versículo específico para ansiedade?",
      ]),
    };
  }

  if (/medo|assust|pavor|receio|terror/.test(lower) || emotion === "medo") {
    return {
      acolhimento: pick([
        "Eu entendo esse medo… e tá tudo bem admitir isso. 💙",
        "Perguntas e situações assim realmente podem assustar. Você não precisa atravessar isso sozinho. 💙",
      ]),
      contexto:
        "Deus está com você — mesmo quando tudo parece incerto.",
      explicacao:
        "O medo não te define. Até os heróis da Bíblia sentiram medo. O que importa não é nunca tremer, e sim pra quem você corre quando treme.",
      aplicacao: pick([
        "Dá um nome pro que te assusta. Fala com Deus sobre isso agora — Ele já sabe, mas quer ouvir de você.",
        "Tenta ser específico diante de Deus: 'Senhor, eu estou com medo de ___. Me ajuda a confiar em Ti nisso.'",
      ]),
      versiculos: [
        'Isaías 41:10 — "Não temas, porque eu sou contigo."',
        '2 Timóteo 1:7 — "Deus não nos deu espírito de covardia..."',
      ],
      oracao: pick([
        "Senhor, tira meu medo e enche meu coração de coragem. Amém.",
        "Pai, entra exatamente onde meu medo está mais forte e sustenta meu coração. Amém.",
      ]),
      followUp: pick([
        "Quer orar mais específico sobre o que está te assustando?",
        "Quer que eu te mostre promessas bíblicas para momentos de medo?",
      ]),
    };
  }

  if (/trist|chorar|sozinho|saudade|vazio/.test(lower) || emotion === "triste") {
    return {
      acolhimento: pick([
        "Eu sinto muito por isso… mas você não precisa enfrentar sozinho. 💙",
        "Seu coração parece cansado de doer. Eu sinto muito por isso. 💙",
      ]),
      contexto:
        "Deus guarda cada lágrima sua. Ele está perto dos que sofrem.",
      explicacao:
        "Sentir tristeza não é fraqueza. É humano. Até Jesus chorou. O que importa é não ficar sozinho nela.",
      aplicacao: pick([
        "Se permita sentir. Mas não se isole. Fala com Deus e, se puder, com alguém de confiança.",
        "Hoje talvez o mais espiritual que você possa fazer seja não fingir que está bem. Seja honesto com Deus.",
      ]),
      versiculos: [
        'Salmos 34:18 — "Perto está o Senhor dos que têm o coração quebrantado."',
        'Salmos 30:5 — "O choro pode durar uma noite..."',
      ],
      oracao: pick([
        "Pai, abraça meu coração agora. Restaura minha esperança. Amém.",
        "Senhor, me sustenta no meio dessa tristeza e não me deixa afundar sozinho. Amém.",
      ]),
      followUp: pick([
        "Quer me contar mais sobre o que está pesando no seu coração?",
        "Quer que eu te mostre uma palavra bíblica de consolo para isso?",
      ]),
    };
  }

  if (/culpa|envergonh|acusad/.test(lower)) {
    return {
      acolhimento: pick([
        "Imagino como isso pode estar te consumindo… mas existe graça pra isso. 💙",
        "Quando a culpa pesa, parece que tudo por dentro encolhe. Mas Deus ainda é refúgio. 💙",
      ]),
      contexto:
        "A culpa pode ser pesada, mas Deus não quer que você viva preso nela.",
      explicacao:
        "Existe diferença entre convicção e condenação. Deus convence para curar; a condenação paralisa e esmaga.",
      aplicacao: pick([
        "Se tem algo que precisa acertar, dê o primeiro passo. Mas saiba que o perdão de Deus já está disponível.",
        "Não alimente a culpa como se ela fosse espiritualidade. Leve tudo à luz diante de Deus.",
      ]),
      versiculos: [
        'Romanos 8:1 — "Não há condenação para os que estão em Cristo Jesus."',
        '1 João 1:9 — "Se confessarmos os nossos pecados..."',
      ],
      oracao: pick([
        "Senhor, me liberta da culpa. Eu aceito Teu perdão e escolho não me condenar mais. Amém.",
        "Pai, me ajuda a trocar acusação por arrependimento verdadeiro e descanso no Teu perdão. Amém.",
      ]),
      followUp: pick([
        "Quer conversar sobre como lidar com a culpa de forma saudável?",
        "Quer que eu te explique a diferença entre culpa, arrependimento e condenação?",
      ]),
    };
  }

  if (/cansa|exaust|esgota|sobrecarreg/.test(lower) || emotion === "cansado") {
    return {
      acolhimento: pick([
        "Eu entendo esse cansaço… você tem dado tudo de si. 💙",
        "Você parece sobrecarregado demais pra continuar fingindo que está tudo bem. 💙",
      ]),
      contexto:
        "Deus não ignora o seu limite. Ele chama os cansados para perto, não para longe.",
      explicacao:
        "Cansaço não é falta de fé. Muitas vezes é só sinal de que você é humano e precisa de descanso, cuidado e presença de Deus.",
      aplicacao: pick([
        "Pare um pouco. Respire. Nem tudo precisa ser resolvido hoje.",
        "Hoje talvez o próximo passo não seja produzir mais, e sim descansar melhor diante de Deus.",
      ]),
      versiculos: [
        'Mateus 11:28 — "Venham a mim, todos os que estão cansados..."',
      ],
      oracao: pick([
        "Senhor, renova minhas forças. Eu descanso em Ti. Amém.",
        "Pai, dá descanso ao meu corpo, à minha mente e ao meu coração. Amém.",
      ]),
      followUp: pick([
        "Quer que eu te ajude com um momento de pausa guiada?",
        "Quer que eu te mostre uma palavra bíblica para cansaço e descanso?",
      ]),
    };
  }

  return null;
}

function matchNamedTopic(q: string, emotion?: UserEmotion | null): BibleResponse | null {
  const lower = q.toLowerCase();

  if (/paulo|ap[oó]stolo\s+paulo|saulo/.test(lower)) {
    return {
      acolhimento: pick([
        "Que pergunta boa! A história de Paulo é realmente incrível. 😊",
        "Paulo é um dos personagens mais fortes e transformadores de toda a Bíblia. 😊",
      ]),
      contexto:
        "Paulo — antes chamado Saulo — perseguia cristãos até ter um encontro com Jesus na estrada de Damasco.",
      explicacao:
        "Depois desse encontro, ele se tornou um dos maiores missionários da história cristã e escreveu boa parte do Novo Testamento.",
      aplicacao:
        "A história de Paulo lembra que ninguém está longe demais para ser alcançado por Deus.",
      versiculos: [
        'Atos 9:15 — "Este é para mim um instrumento escolhido."',
        'Gálatas 2:20 — "Já não sou eu quem vive, mas Cristo vive em mim."',
      ],
      oracao: "Senhor, transforma a minha vida como transformaste a de Paulo. Amém.",
      followUp: "Quer saber mais sobre alguma fase específica da vida de Paulo?",
    };
  }

  if (/perd[aã]o|perdoar/.test(lower)) {
    return {
      acolhimento: `${getEmotionAcolhimento(emotion)} Falar sobre perdão nem sempre é fácil, né? 💙`,
      contexto:
        "O perdão é central na Bíblia. Quando Pedro perguntou quantas vezes deveria perdoar, Jesus respondeu de forma radical.",
      explicacao:
        "Perdoar não significa fingir que não doeu. É soltar o peso da mágoa e parar de permitir que ela governe o coração.",
      aplicacao:
        "Se tem alguém que você precisa perdoar, comece falando com Deus sobre isso com sinceridade. O processo pode ser gradual.",
      versiculos: [
        'Efésios 4:32 — "Perdoando-se mutuamente..."',
        'Mateus 6:14 — "Se perdoardes aos homens..."',
      ],
      oracao: "Pai, tira de mim a amargura e enche meu coração de graça. Amém.",
      followUp: "Quer que eu te ajude a pensar no próximo passo prático para esse perdão?",
    };
  }

  if (faithMatcher(lower)) {
    return {
      acolhimento: `${getEmotionAcolhimento(emotion)} Falar sobre fé é falar sobre o que sustenta tudo. 😊`,
      contexto:
        'Hebreus 11:1 define fé como "a certeza daquilo que esperamos e a prova das coisas que não vemos."',
      explicacao:
        "Fé não é ausência de dúvida. É escolher confiar em Deus mesmo quando nem todas as peças estão no lugar.",
      aplicacao:
        "Você pode fortalecer a fé lembrando do que Deus já fez, orando com sinceridade e se expondo à Palavra de forma constante.",
      versiculos: [
        'Hebreus 11:1 — "A fé é a certeza..."',
        'Marcos 9:24 — "Eu creio, Senhor! Ajuda-me..."',
      ],
      oracao: "Senhor, aumenta minha fé e me ajuda a confiar em Ti. Amém.",
      followUp: "Quer que eu te mostre exemplos bíblicos de fé em momentos difíceis?",
    };
  }

  return null;
}

function buildPrayerResponse(emotion?: UserEmotion | null): BibleResponse {
  return {
    acolhimento: `${getEmotionAcolhimento(emotion)} Vamos orar juntos. 💙`,
    contexto:
      "A oração é a conversa mais íntima que você pode ter com Deus. Ele ouve — sempre.",
    explicacao:
      "Não precisa ser bonito ou formal. Deus quer ouvir o que está no seu coração, do jeito que vier.",
    aplicacao:
      "Fecha os olhos, respira fundo, e fala com Deus como se Ele estivesse sentado do seu lado. Porque Ele está.",
    versiculos: [
      'Filipenses 4:6 — "Em tudo, pela oração..."',
      'Salmos 145:18 — "Perto está o Senhor de todos os que o invocam."',
    ],
    oracao: pick([
      "Pai, eu venho a Ti agora com tudo que sou. Ouve meu coração. Me encontra aqui. Amém.",
      "Senhor, eu me coloco diante de Ti agora. Vê meu interior, sustenta meu coração e fala comigo. Amém.",
    ]),
    followUp: pick([
      "Quer que eu faça uma oração mais específica sobre algo que está no seu coração?",
      "Quer que eu ore por uma área específica da sua vida agora?",
    ]),
  };
}

function buildVerseResponse(emotion?: UserEmotion | null): BibleResponse {
  const verses = [
    { ref: "Salmos 23:1", text: "O Senhor é o meu pastor, nada me faltará." },
    {
      ref: "Jeremias 29:11",
      text: "Eu sei os planos que tenho pra vocês — planos de paz e não de mal.",
    },
    {
      ref: "Romanos 8:28",
      text: "Todas as coisas cooperam para o bem daqueles que amam a Deus.",
    },
    {
      ref: "Isaías 40:31",
      text: "Os que esperam no Senhor renovam suas forças.",
    },
    {
      ref: "Josué 1:9",
      text: "Seja forte e corajoso! Não se apavore, porque o Senhor está com você.",
    },
  ];

  const v = pick(verses);

  return {
    acolhimento: `${getEmotionAcolhimento(emotion)} Aqui vai um versículo pra te acompanhar hoje. 😊`,
    contexto: `${v.ref}`,
    explicacao: `"${v.text}"`,
    aplicacao: pick([
      "Guarda esse versículo no coração. Lê de novo antes de dormir.",
      "Lê isso devagar mais uma vez e pergunta a Deus o que Ele quer acender no seu coração através dessa palavra.",
    ]),
    versiculos: [`${v.ref} — "${v.text}"`],
    oracao: pick([
      "Senhor, que essa palavra se torne real na minha vida. Amém.",
      "Pai, faz essa palavra descer do meu entendimento para o meu coração. Amém.",
    ]),
    followUp: pick([
      "Quer outro versículo ou quer refletir mais sobre esse?",
      "Quer que eu explique melhor esse versículo pra você?",
    ]),
  };
}

function buildGeneralResponse(emotion?: UserEmotion | null): BibleResponse {
  return {
    acolhimento: pick([
      `${getEmotionAcolhimento(emotion)} Vamos olhar isso juntos. 💙`,
      "Boa pergunta. Deixa eu te ajudar com isso.",
      "Que bom que você trouxe isso. Vamos conversar.",
      `Eu tô com você nessa reflexão. ${pick(WARMTH_PHRASES.closing)}`,
    ]),
    contexto: pick([
      "A Bíblia tem direção pra isso.",
      "A Palavra de Deus não é distante desse tipo de pergunta.",
      "Deus se importa mais com isso do que às vezes a gente imagina.",
    ]),
    explicacao: pick([
      "Deus fala de forma clara quando buscamos com sinceridade.",
      "Nem toda resposta vem de forma instantânea, mas Deus sabe conduzir quem O busca com verdade.",
      "Quando a gente se aproxima com o coração aberto, Deus tem um jeito de trazer luz até em temas difíceis.",
    ]),
    aplicacao: pick([
      "Separe um tempo com Deus hoje. Pode ser 5 minutos — Ele não precisa de muito tempo pra falar ao seu coração.",
      "Talvez o melhor próximo passo seja diminuir o ritmo por um instante, orar com honestidade e voltar à Palavra com calma.",
    ]),
    versiculos: [
      'Tiago 1:5 — "Se algum de vocês tem falta de sabedoria, peça-a a Deus..."',
    ],
    oracao: pick([
      "Senhor, me guia nessa questão. Eu confio em Ti. Amém.",
      "Pai, dá clareza ao meu coração e firmeza ao meu caminho. Amém.",
    ]),
    followUp: pick([
      "Quer que eu aprofunde isso com você?",
      "Quer que eu responda isso de um jeito mais simples ou mais profundo?",
    ]),
  };
}

export const helpTopics = [
  {
    id: "ansiedade",
    emoji: "😰",
    label: "Ansiedade",
    response: {
      acolhimento:
        "Eu sei que quando a ansiedade aperta parece que o coração não descansa. Mas você não está sozinho nisso. 💙",
      contexto:
        "A Bíblia fala com muita ternura sobre ansiedade, porque Deus conhece nossa fragilidade e sabe como a mente humana pode ficar sobrecarregada.",
      explicacao:
        "Ansiedade muitas vezes é o coração tentando controlar tudo ao mesmo tempo. Deus não te humilha por isso — Ele te chama pra perto e te convida a entregar o peso.",
      aplicacao:
        "Faz algo simples agora: respira fundo 3 vezes, mais devagar do que sua mente quer. Depois, fala com Deus com sinceridade: 'Senhor, eu não consigo carregar isso sozinho.'",
      versiculos: [
        'Filipenses 4:6-7 — "Não andem ansiosos por coisa alguma..."',
        '1 Pedro 5:7 — "Lancem sobre ele toda a sua ansiedade..."',
      ],
      oracao:
        "Senhor, Tu vês o que está acelerando minha mente. Acalma meu interior e sustenta meu coração com Tua paz. Amém.",
      followUp:
        "Quer que eu te guie agora em uma pequena pausa de respiração e oração?",
    },
  },
  {
    id: "tristeza",
    emoji: "😢",
    label: "Tristeza",
    response: {
      acolhimento:
        "Sei que essa tristeza pode deixar tudo mais pesado. Mas você não precisa atravessar isso sozinho. 💙",
      contexto:
        "A Bíblia não esconde a dor humana. Davi chorou, Jeremias lamentou, Jesus também chorou. Deus nunca tratou a tristeza sincera como fraqueza sem valor.",
      explicacao:
        "Tristeza não significa ausência de fé. Às vezes significa que o coração foi profundamente tocado e precisa de consolo real, não de pressa.",
      aplicacao:
        "Hoje, não se cobre tanto. Se puder, seja honesto com Deus e com alguém de confiança. O primeiro passo nem sempre é melhorar rápido — às vezes é só parar de se isolar.",
      versiculos: [
        'Salmos 34:18 — "Perto está o Senhor dos que têm o coração quebrantado."',
        'Salmos 30:5 — "O choro pode durar uma noite..."',
      ],
      oracao:
        "Pai, acolhe minha dor com Teu amor. Segura meu coração e não me deixa afundar sozinho. Amém.",
      followUp:
        "Quer me contar o que está pesando mais no seu coração hoje?",
    },
  },
  {
    id: "medo",
    emoji: "😨",
    label: "Medo",
    response: {
      acolhimento:
        "Ter medo não te faz fraco. Te faz humano. E Deus sabe exatamente como te encontrar aí. 💙",
      contexto:
        "A Bíblia está cheia de pessoas que sentiram medo e mesmo assim caminharam com Deus. O chamado de Deus nunca foi 'nunca sinta medo', mas 'não caminhe sozinho no medo'.",
      explicacao:
        "O medo tenta ampliar o problema e encolher a presença de Deus na nossa visão. A fé faz o contrário: não nega a luta, mas lembra que Deus continua maior.",
      aplicacao:
        "Dá nome ao que te assusta. Depois fala isso claramente diante de Deus. Quando o medo sai da confusão e entra na oração, ele começa a perder força.",
      versiculos: [
        'Isaías 41:10 — "Não temas, porque eu sou contigo."',
        '2 Timóteo 1:7 — "Deus não nos deu espírito de covardia..."',
      ],
      oracao:
        "Senhor, entra exatamente no lugar onde o medo está me apertando e enche meu coração de coragem em Ti. Amém.",
      followUp:
        "Quer que eu te mostre promessas bíblicas para enfrentar esse medo?",
    },
  },
  {
    id: "tentacao",
    emoji: "🔥",
    label: "Tentação",
    response: {
      acolhimento:
        "Obrigado por trazer isso com sinceridade. Falar da tentação já é, por si só, um passo de luz. 💙",
      contexto:
        "Jesus também foi tentado e respondeu com firmeza, verdade e dependência do Pai. A tentação, por si só, não é o pecado — ela é o campo de batalha.",
      explicacao:
        "O perigo da tentação está no isolamento, na repetição escondida e na mentira de que você precisa lutar sozinho. Deus sempre oferece um caminho de escape.",
      aplicacao:
        "Quando a tentação vier, faz 3 movimentos: se afasta do gatilho, ora na hora e chama alguém maduro pra andar com você nisso. Luta escondida cresce; luta exposta enfraquece.",
      versiculos: [
        '1 Coríntios 10:13 — "Fiel é Deus, que não permitirá..."',
        'Tiago 4:7 — "Resisti ao diabo, e ele fugirá..."',
      ],
      oracao:
        "Senhor, fortalece meu interior, guarda meus olhos, minha mente e minhas escolhas. Mostra a porta de saída e me dá coragem pra usá-la. Amém.",
      followUp:
        "Quer que eu te ajude a montar um plano prático pra quando isso voltar?",
    },
  },
];

export function generateMockResponse(
  question: string,
  emotion?: UserEmotion | null
): BibleResponse {
  const q = question.toLowerCase().trim();
  const intent = detectIntent(q);
  const effectiveEmotion = emotion ?? inferEmotionFromQuestion(q);

  const theological = matchTheological(q, effectiveEmotion);
  if (theological) {
    remember(
      theological.followUp.includes("visão")
        ? "salvation_security"
        : memoryState.lastTopic ?? "general",
      "theological",
      effectiveEmotion
    );
    return theological;
  }

  const factual = matchFactual(q);
  if (factual) {
    remember("factual", "factual", effectiveEmotion);
    return factual;
  }

  const emotional = matchEmotional(q, effectiveEmotion);
  if (emotional) {
    let topic: TopicKey = "general";
    if (/ansio|preocup|nervos|afli[cç][aã]o|desespero|p[aâ]nico/.test(q)) topic = "anxiety";
    else if (/medo|assust|pavor|receio|terror/.test(q)) topic = "fear";
    else if (/trist|chorar|sozinho|saudade|vazio/.test(q)) topic = "sadness";
    else if (/culpa|envergonh|acusad/.test(q)) topic = "guilt";
    else if (/cansa|exaust|esgota|sobrecarreg/.test(q)) topic = "fatigue";

    remember(topic, "emotional", effectiveEmotion);
    return emotional;
  }

  const named = matchNamedTopic(q, effectiveEmotion);
  if (named) {
    let topic: TopicKey = "general";
    if (/paulo|ap[oó]stolo\s+paulo|saulo/.test(q)) topic = "paul";
    else if (/perd[aã]o|perdoar/.test(q)) topic = "forgiveness";
    else if (faithMatcher(q)) topic = "faith";

    remember(topic, "general", effectiveEmotion);
    return named;
  }

  if (intent === "prayer") {
    const response = buildPrayerResponse(effectiveEmotion);
    remember("prayer", "prayer", effectiveEmotion);
    return response;
  }

  if (intent === "verse") {
    const response = buildVerseResponse(effectiveEmotion);
    remember("verse", "verse", effectiveEmotion);
    return response;
  }

  const response = buildGeneralResponse(effectiveEmotion);
  remember("general", intent, effectiveEmotion);
  return response;
}