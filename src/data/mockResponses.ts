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

// Adicionado o 'string' no final para aceitar os milhares de temas novos sem erro de tipagem
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
  | "general"
  | string;

type NormalizedEmotion =
  | "triste"
  | "ansioso"
  | "medo"
  | "cansado"
  | "confuso"
  | "em_paz"
  | null;

type MemoryState = {
  lastTopic: TopicKey | null;
  lastIntent: Intent | null;
  lastEmotion: NormalizedEmotion;
  lastQuestion: string | null;
  conversationDepth: number;
};

let memoryState: MemoryState = {
  lastTopic: null,
  lastIntent: null,
  lastEmotion: null,
  lastQuestion: null,
  conversationDepth: 0,
};

function remember(
  topic: TopicKey,
  intent: Intent,
  emotion?: NormalizedEmotion,
  question?: string
) {
  memoryState = {
    lastTopic: topic,
    lastIntent: intent,
    lastEmotion: emotion ?? null,
    lastQuestion: question ?? null,
    conversationDepth: memoryState.conversationDepth + 1,
  };
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function normalizeEmotion(emotion?: UserEmotion | string | null): NormalizedEmotion {
  if (!emotion) return null;

  const value = String(emotion).toLowerCase().trim();

  if (value.includes("ansio")) return "ansioso";
  if (value.includes("trist")) return "triste";
  if (value.includes("med")) return "medo";
  if (value.includes("cansa")) return "cansado";
  if (value.includes("conf")) return "confuso";
  if (value.includes("paz")) return "em_paz";

  return null;
}

function maybePrefixWithMemory(topic: TopicKey): string {
  if (memoryState.conversationDepth > 2) {
    return pick([
      "Eu tô percebendo que essa questão está realmente importante pra você… ",
      "Isso está se tornando uma reflexão mais profunda na sua caminhada… ",
    ]);
  }

  if (memoryState.lastTopic && memoryState.lastTopic === topic) {
    return pick([
      "Voltando ao que você trouxe agora há pouco… ",
      "Continuando exatamente nesse ponto… ",
      "Pegando essa mesma linha que você abriu… ",
    ]);
  }

  if (memoryState.lastIntent === "emotional") {
    return pick([
      "Percebo que isso não é só uma dúvida, mas algo que toca seu coração… ",
      "Isso não parece só teórico — parece pessoal pra você… ",
    ]);
  }

  return "";
}

function detectIntent(q: string): Intent {
  const lower = q.toLowerCase();

  if (/orar|oração|reza|ore por/.test(lower)) return "prayer";
  if (/versículo|me mostra um vers/i.test(lower)) return "verse";

  if (
    /salvação|graça|pecado|trindade|espírito santo|batismo|inferno|céu|vida eterna|predestinação|teologia|doutrina|igreja|arrependimento|jejum|divórcio|namoro|prosperidade|dízimo|demônios|anjos/.test(
      lower
    )
  ) {
    return "theological";
  }

  if (
    /triste|ansioso|medo|sozinho|vazio|dor|culpa|cansa|confuso|angústia|depressão|suicídio/.test(
      lower
    )
  ) {
    return "emotional";
  }

  if (/^(quem|qual|quantos?|onde|quando|como|por que)/.test(lower)) {
    return "factual";
  }

  return "general";
}

const emotionOpenings: Record<Exclude<NormalizedEmotion, null>, string[]> = {
  triste: [
    "Eu sinto que isso está doendo em você…",
    "Imagino que isso esteja bem pesado no seu coração.",
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
    "Você parece sobrecarregado de verdade.",
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
  "Obrigado por confiar isso aqui.",
  "Isso que você trouxe é importante de verdade.",
  "Faz sentido você pensar nisso.",
  "Eu tô com você nessa reflexão.",
  "Essa pergunta não é simples — e tá tudo bem.",
  "Isso merece ser olhado com calma.",
];

function getEmotionAcolhimento(emotion?: NormalizedEmotion): string {
  if (emotion && emotionOpenings[emotion]) {
    return pick(emotionOpenings[emotion]);
  }
  return pick(defaultOpenings);
}

function inferEmotionFromQuestion(q: string): NormalizedEmotion {
  const lower = q.toLowerCase();

  if (/ansio|preocup|nervos|afli[cç][aã]o|desespero|p[aâ]nico/.test(lower)) return "ansioso";
  if (/trist|chor|vazio|sozinho|saudade|abatid|quebrado|depress[aã]o|suic[ií]dio/.test(lower)) return "triste";
  if (/medo|assust|pavor|receio|terror/.test(lower)) return "medo";
  if (/cansa|exaust|esgota|sobrecarreg/.test(lower)) return "cansado";
  if (/confus|perdid|sem\s+dire[cç][aã]o/.test(lower)) return "confuso";

  return null;
}

function prayerSuggestion(topic?: string): string {
  if (topic) {
    return `Se fizer sentido pra você, posso transformar isso em uma oração simples sobre ${topic}.`;
  }

  return pick([
    "Se fizer sentido pra você, posso transformar isso em uma oração simples.",
    "Se quiser, posso te ajudar com uma oração bem direta sobre isso.",
  ]);
}

function buildDirectTheologyResponse(opts: {
  topic: TopicKey;
  direct: string | string[];
  context: string | string[];
  explanation: string | string[];
  application: string | string[];
  verses: string[];
  followUp?: string | string[];
  emotion?: NormalizedEmotion;
  prayerTopic?: string;
}): BibleResponse {
  const inferredEmotion = opts.emotion ?? null;
  const emotionalPrefix =
    inferredEmotion &&
    ["ansioso", "triste", "medo", "cansado", "confuso"].includes(inferredEmotion)
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
  const followUp = Array.isArray(opts.followUp)
    ? pick(opts.followUp)
    : opts.followUp ??
      pick([
        "Quer aprofundar mais esse ponto específico?",
        "Quer que eu te mostre como isso aparece na prática?",
        "Quer explorar mais um texto bíblico sobre isso?",
        "Quer levar isso pra uma aplicação mais pessoal?",
        "Quer que eu simplifique ainda mais essa parte?",
      ]);

  return {
    acolhimento: `${maybePrefixWithMemory(opts.topic)}${emotionalPrefix}${direct}`.trim(),
    contexto: context,
    explicacao: explanation,
    aplicacao: application,
    versiculos: opts.verses,
    oracao: prayerSuggestion(opts.prayerTopic),
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
  followUp?: string | string[];
  emotion?: NormalizedEmotion;
  prayerTopic?: string;
}): BibleResponse {
  return buildDirectTheologyResponse({
    ...opts,
  });
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
  emotion?: NormalizedEmotion
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

function matchTheological(q: string, emotion?: NormalizedEmotion): BibleResponse | null {
  const lower = q.toLowerCase();
  const bridge = buildEmotionalBridge(q, emotion);

  // ==========================================
  // BLOCOS ORIGINAIS
  // ==========================================

  if (salvationSecurityMatcher(lower)) {
    return buildDebatedTheologyResponse({
      topic: "salvation_security",
      emotion,
      prayerTopic: "salvação e perseverança",
      direct: [
        "Existem interpretações cristãs diferentes sobre isso. Alguns entendem que a salvação é definitiva em Cristo; outros entendem que a Bíblia também alerta sobre a possibilidade de afastamento.",
      ],
      context: [
        "A Bíblia apresenta tanto textos de segurança em Cristo quanto alertas sérios sobre perseverança. Por isso esse tema sempre foi debatido na teologia cristã.",
      ],
      explanation: [
        `${bridge ? `${bridge} ` : ""}Textos como João 10:28 e Romanos 8:38-39 são usados por quem defende segurança eterna. Já Hebreus 6:4-6 e Hebreus 10:26-29 são usados por quem entende que existe o risco de afastamento real. O ponto comum entre todos é: a salvação começa pela graça e conduz a uma vida de perseverança.`,
      ],
      application: [
        "Mais importante do que transformar isso só em debate é viver diariamente em comunhão com Cristo, com fé sincera, arrependimento e constância.",
      ],
      verses: [
        'João 10:28 — "Eu lhes dou a vida eterna, e jamais perecerão."',
        'Hebreus 3:14 — "Somos participantes de Cristo, se de fato guardarmos firme até o fim."',
      ],
      followUp: "Quer que eu te mostre, de forma simples, os textos usados por cada visão?",
    });
  }

  if (salvationDefinitionMatcher(lower)) {
    return buildDirectTheologyResponse({
      topic: "salvation",
      emotion,
      prayerTopic: "salvação",
      direct: "Salvação é o resgate que Deus faz da humanidade através de Jesus Cristo.",
      context: "A Bíblia mostra que todos pecaram e estão separados de Deus. A salvação é a iniciativa de Deus para restaurar esse relacionamento.",
      explanation: "Não é por mérito ou esforço humano. É pela graça de Deus, recebida pela fé em Jesus. Ele viveu, morreu e ressuscitou para nos dar vida eterna.",
      application: "A salvação começa com um 'sim' sincero a Jesus. Não precisa ser perfeito — precisa ser verdadeiro.",
      verses: ['Efésios 2:8-9 — "Pois vocês são salvos pela graça..."', 'Romanos 10:9'],
    });
  }

  // ==========================================
  // NOVOS BLOCOS DE VIDA PRÁTICA E ÉTICA
  // ==========================================

  if (/(namoro|casar|jugo\s+desigual|relacionamento|noivado)/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "relationships",
      emotion,
      prayerTopic: "vida sentimental",
      direct: "A Bíblia vê o relacionamento como algo que deve apontar para Cristo e glorificar a Deus.",
      context: "Desde Gênesis, vemos que Deus criou a família como a base da sociedade e do cuidado mútuo.",
      explanation: "O conceito de 'jugo desigual' em 2 Coríntios 6:14 não é sobre superioridade, mas sobre direção: como dois podem caminhar juntos se seguem mestres e princípios diferentes? O propósito do namoro cristão é conhecer o caráter do outro para o casamento, mantendo a pureza e a honra.",
      application: "Busque alguém que ame a Deus mais do que ama você. Isso garante que a base do seu futuro lar seja construída sobre a Rocha.",
      verses: ["2 Coríntios 6:14", "Provérbios 31:30", "Gênesis 2:24"],
    });
  }

  if (/(div[oó]rcio|pode\s+separar|casamento\s+acabou|recasamento)/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "divorce",
      emotion,
      prayerTopic: "família e restauração",
      direct: "O plano original de Deus é a união permanente, mas a Bíblia reconhece a dureza e a quebra do coração humano.",
      context: "Jesus ensinou que o divórcio não era o plano de Deus (Mateus 19), mas abriu exceções específicas.",
      explanation: "A maioria dos teólogos identifica duas causas bíblicas que permitem o divórcio: imoralidade sexual (adultério) e o abandono definitivo por parte de um cônjuge não crente. Em todos os outros casos, a reconciliação é o caminho buscado.",
      application: "Se você está passando por isso, busque aconselhamento pastoral. Deus odeia o divórcio, mas Ele ama profundamente as pessoas divorciadas e pode restaurar corações feridos.",
      verses: ["Mateus 19:6", "1 Coríntios 7:15", "Malaquias 2:16"],
    });
  }

  if (/(depress[aã]o|querer\s+morrer|vontade\s+de\s+sumir|suic[ií]dio|desespero\s+profundo)/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "sadness",
      emotion: "triste",
      prayerTopic: "esperança e socorro imediato",
      direct: "Sinto muito que você esteja passando por esse vale tão escuro. Saiba que Deus não te condena por se sentir assim.",
      context: "Grandes homens de Deus como Elias (1 Reis 19) e o próprio Jó desejaram a morte em momentos de exaustão extrema.",
      explanation: "A fé não anula nossa biologia ou nossas emoções. Deus cuidou de Elias dando-lhe sono e comida antes de falar com ele. A depressão pode ser uma batalha espiritual, mas também química. Buscar ajuda médica e psicológica não é falta de fé, é usar os meios de Deus para cura.",
      application: "O seu valor não está na sua produtividade hoje. Peça ajuda a um líder e a um profissional. Não carregue esse fardo sozinho, por favor. (Se precisar conversar com alguém agora, ligue 188 - CVV).",
      verses: ["Salmos 42:11", "1 Reis 19:4-8", "Salmos 34:17"],
    });
  }

  if (/(pornografia|masturba|pureza|sexo\s+antes|fornica|adult[ée]rio)/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "general",
      emotion,
      prayerTopic: "liberdade e pureza",
      direct: "A Bíblia trata a sexualidade como um presente de Deus para ser vivenciado dentro da aliança do casamento.",
      context: "Em um mundo que banaliza o corpo, a visão bíblica é de que fomos comprados por preço e nosso corpo é templo do Espírito.",
      explanation: "O pecado sexual é descrito como algo que fere o próprio corpo (1 Coríntios 6:18). A luta pela pureza começa na mente e na dependência da graça de Deus, não apenas na força de vontade.",
      application: "Se você falhou, não se esconda de Deus. A vergonha te mantém no erro, a confissão te liberta. Corte os gatilhos e busque alguém maduro na fé para te ajudar a prestar contas.",
      verses: ["1 Coríntios 6:18-20", "Mateus 5:28", "1 João 1:9"],
    });
  }

  if (/(como\s+jejuar|jejum\s+b[ií]blico|tipos\s+de\s+jejum)/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "general",
      emotion,
      prayerTopic: "disciplina espiritual",
      direct: "O jejum é uma disciplina espiritual poderosa para humilhar a carne e sintonizar o espírito com Deus.",
      context: "Jesus disse 'quando jejuardes', indicando que era uma prática esperada para a igreja.",
      explanation: "Jejuar não é 'comprar' o favor de Deus ou fazer greve de fome. É esvaziar-se de si mesmo. Pode ser total (água e comida), parcial (como o de Daniel) ou até abstenção de redes sociais, desde que o tempo seja focado em Deus.",
      application: "Comece com um propósito claro e curto. Beba água e foque o tempo que você estaria comendo em oração e leitura da Bíblia.",
      verses: ["Mateus 6:17-18", "Isaías 58:6"],
    });
  }

  if (/(batalha\s+espiritual|dem[oô]nios|armadura\s+de\s+deus|liberta[cç][aã]o|forças\s+malignas)/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "general",
      emotion,
      prayerTopic: "proteção e autoridade",
      direct: "Nossa luta não é contra pessoas, mas contra forças espirituais que tentam nos afastar de Deus e da verdade.",
      context: "O apóstolo Paulo descreve essa realidade em Efésios 6, chamando a igreja a estar preparada.",
      explanation: "A vitória já foi conquistada por Cristo na cruz (Colossenses 2:15). Nossa função não é viver com medo do diabo, mas 'permanecer firmes' usando a armadura de Deus: verdade, justiça, evangelho, fé, salvação e a Palavra.",
      application: "Se você se sente atacado espiritualmente, não dialogue com o medo. Revista-se da verdade de quem você é em Cristo e resista usando a Palavra e a oração.",
      verses: ["Efésios 6:12", "Tiago 4:7", "Colossenses 2:15"],
    });
  }

  if (/(dinheiro|ficar\s+rico|prosperidade|falido|d[ií]vidas)/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "general",
      emotion,
      prayerTopic: "sabedoria financeira e provisão",
      direct: "A Bíblia fala muito sobre dinheiro porque ele é um dos maiores testes para onde está o nosso coração.",
      context: "O dinheiro em si é neutro; o problema apontado nas Escrituras é o amor ao dinheiro (avareza).",
      explanation: "A 'Teologia da Prosperidade' foca apenas no material, esquecendo que Jesus nos chamou para tomar a cruz. Já a miséria não glorifica a Deus. O princípio bíblico é o trabalho honesto, a generosidade, não ser escravo das dívidas e viver com contentamento.",
      application: "Evite dívidas que te escravizam. Seja generoso com o que tem hoje. Confie que Deus é seu provedor, seja na abundância ou na escassez.",
      verses: ["Mateus 6:33", "1 Timóteo 6:10", "Provérbios 22:7"],
    });
  }

  if (/(como\s+ler\s+a\s+biblia|entender\s+a\s+biblia|biblia\s+foi\s+alterada|confiar\s+na\s+biblia)/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "general",
      direct: "A Bíblia é a Palavra de Deus inspirada, nossa bússola de fé e prática.",
      context: "Escrita por cerca de 40 autores ao longo de 1.500 anos, ela conta uma única grande história: o plano de redenção de Deus.",
      explanation: "Apesar das traduções, os manuscritos originais são preservados com precisão impressionante. O Espírito Santo, que inspirou os autores, é o mesmo que ilumina nosso entendimento hoje ao lermos.",
      application: "Ore antes de ler. Peça a Deus para abrir seus olhos. Uma ótima dica é começar pelo Evangelho de João e ler um pouco todo dia, sem pressa.",
      verses: ["2 Timóteo 3:16", "Salmos 119:105", "Hebreus 4:12"],
    });
  }

  // ==========================================
  // BLOCOS DOUTRINÁRIOS EXTRAS (Padrão Antigo + Novos)
  // ==========================================

  if (faithMatcher(lower)) {
    return buildDirectTheologyResponse({
      topic: "faith",
      emotion,
      prayerTopic: "fé",
      direct: "Fé é confiar em Deus mesmo quando você não tem todas as respostas.",
      context: 'Hebreus 11:1 define fé como "a certeza daquilo que esperamos e a prova das coisas que não vemos."',
      explanation: "Fé não é ausência de dúvida, é escolher confiar em Deus apesar da dúvida. Ter fé significa não transformar a falta de controle em desculpa para desistir de Deus.",
      application: "Fé se fortalece com prática: oração, leitura da Palavra e lembrando do que Deus já fez.",
      verses: ['Hebreus 11:1', 'Marcos 9:24'],
    });
  }

  if (heavenMatcher(lower) && !/inferno/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "heaven",
      emotion,
      prayerTopic: "esperança eterna",
      direct: "O céu é a eternidade na presença de Deus, onde não há dor, morte ou sofrimento.",
      context: "A Bíblia descreve o céu como o destino final daqueles que pertencem a Cristo e foram resgatados por Ele.",
      explanation: "O ponto central do céu não é a rua de ouro, mas a presença de Deus: Ele enxugará toda lágrima e teremos comunhão perfeita com Ele.",
      application: "Pensar no céu não é fugir da realidade, mas viver hoje com o propósito de quem sabe para onde está indo.",
      verses: ['João 14:2', 'Apocalipse 21:4'],
    });
  }

  if (/gra[cç]a/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "grace",
      emotion,
      prayerTopic: "graça e descanso",
      direct: "Graça é o favor imerecido de Deus — receber de Deus aquilo que não tínhamos como pagar.",
      context: "No Novo Testamento, a graça se torna clara na pessoa e obra de Jesus Cristo a nosso favor.",
      explanation: "Graça não é Deus ignorando o pecado, é Deus pagando o preço que a gente não conseguiria pagar. A graça perdoa, sustenta e transforma nossa vida.",
      application: "Viver pela graça é parar de tentar 'merecer' o amor de Deus e começar a descansar no que Ele já fez na cruz.",
      verses: ['Romanos 3:24', '2 Coríntios 12:9'],
    });
  }

  if (/pecado/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "sin",
      emotion,
      prayerTopic: "arrependimento e perdão",
      direct: "Pecado é tudo aquilo que nos separa de Deus — seja em ação, pensamento ou omissão.",
      context: "Desde Gênesis 3, a humanidade vive as consequências da queda e da ruptura com Deus.",
      explanation: "Pecado não é só 'fazer coisas ruins', é uma rebelião do coração contra o Criador. Por isso Jesus veio tratar a raiz do nosso problema na cruz.",
      application: "Reconhecer o pecado é o primeiro passo para a liberdade. Leve tudo a Cristo, porque nEle há perdão absoluto.",
      verses: ['Romanos 3:23', '1 João 1:9'],
    });
  }

  if (/trindade/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "trinity",
      emotion,
      prayerTopic: "conhecer a Deus",
      direct: "A Trindade é a doutrina bíblica de um só Deus em três pessoas distintas: Pai, Filho e Espírito Santo.",
      context: "A palavra 'Trindade' não está na Bíblia, mas o conceito permeia toda a Escritura desde Gênesis até Apocalipse.",
      explanation: "Não são três deuses (politeísmo), nem um Deus que muda de máscara. É um único Deus, eternamente revelado em três pessoas coexistentes e coiguais.",
      application: "A Trindade mostra que Deus, em Si mesmo, é amor e relacionamento. Você foi criado para se relacionar com esse Deus profundo.",
      verses: ['Mateus 28:19', '2 Coríntios 13:13'],
    });
  }

  if (/esp[ií]rito\s+santo/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "holy_spirit",
      emotion,
      prayerTopic: "direção do Espírito",
      direct: "O Espírito Santo não é uma energia ou 'força'. Ele é Deus, a terceira pessoa da Trindade.",
      context: "Jesus prometeu que enviaria o Consolador para habitar em nós, guiar à verdade e nos capacitar.",
      explanation: "O Espírito Santo convence do pecado, consola, ensina, distribui dons e produz o 'Fruto do Espírito' (amor, alegria, paz...) naqueles que creem.",
      application: "Não apague o Espírito. Busque ser sensível à voz de Deus orando e lendo a Palavra todos os dias.",
      verses: ['João 14:26', 'Gálatas 5:22-23'],
    });
  }

  if (/predestina|livre\s*arb/.test(lower)) {
    return buildDebatedTheologyResponse({
      topic: "predestination",
      emotion,
      prayerTopic: "sabedoria e humildade",
      direct: "Esse é um dos mistérios mais debatidos da teologia cristã: a Soberania de Deus versus a Responsabilidade Humana.",
      context: "Ao longo dos séculos, correntes como o Calvinismo e o Arminianismo tentaram explicar essa tensão bíblica.",
      explanation: "Textos como Efésios 1 mostram que Deus escolhe e predestina. Textos como Josué 24 mostram que o homem tem o dever de escolher a Deus. As duas verdades estão na Bíblia e devemos abraçar ambas com humildade.",
      application: "Não deixe a teologia te tornar arrogante. Agradeça a Deus por Sua graça soberana e pregue o evangelho a todos, sabendo que quem crer será salvo.",
      verses: ['Efésios 1:4-5', 'João 3:16'],
    });
  }

  if (/batismo/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "baptism",
      emotion,
      prayerTopic: "obediência",
      direct: "Batismo é um mandamento de Jesus, um sinal público e visível de uma realidade interna e invisível.",
      context: "No Novo Testamento, ele sempre aparece ligado à conversão, arrependimento e nova vida.",
      explanation: "O batismo nas águas simboliza o sepultamento da velha natureza (ao descer à água) e a ressurreição para uma nova vida com Cristo (ao subir da água). Não é o que te salva, mas é a evidência de quem já foi salvo.",
      application: "Se você entregou sua vida a Jesus, procure uma igreja local e seja batizado em obediência ao Mestre.",
      verses: ['Mateus 28:19', 'Romanos 6:4'],
    });
  }

  if (/inferno/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "hell",
      emotion,
      prayerTopic: "urgência espiritual",
      direct: "A Bíblia trata o inferno de forma muito séria como o lugar de separação eterna de Deus.",
      context: "Curiosamente, Jesus foi quem mais falou sobre o inferno nas Escrituras, usando termos fortes para alertar a humanidade.",
      explanation: "O inferno não é o 'reino do diabo', mas o local do juízo final para todos que rejeitarem a graça de Deus. A essência de seu tormento é o total isolamento do amor, luz e bondade do Criador.",
      application: "Falar de inferno não é para gerar terror sem propósito, mas para nos mostrar a grandeza do sacrifício de Jesus que nos livrou dessa condenação.",
      verses: ['Mateus 25:46', 'Apocalipse 20:15'],
    });
  }

  if (/arrependimento/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "repentance",
      emotion,
      prayerTopic: "coração quebrantado",
      direct: "Arrependimento não é só chorar pelo que fez; é mudar a direção dos seus passos de volta para Deus.",
      context: "A primeira mensagem de Jesus no ministério foi: 'Arrependam-se, pois o Reino dos céus está próximo'.",
      explanation: "No grego (Metanoia), significa mudança de mente. Remorso é ficar triste pelas consequências do pecado (como Judas); arrependimento é odiar o pecado e buscar a santidade de Cristo (como Pedro).",
      application: "Confesse a Deus aquilo que você tem escondido. O sangue de Jesus perdoa todo e qualquer pecado quando há um coração quebrantado.",
      verses: ['Atos 3:19', '2 Crônicas 7:14'],
    });
  }

  if (/igreja/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "church",
      emotion,
      prayerTopic: "comunhão",
      direct: "Igreja não é um prédio ou um CNPJ; é o Corpo vivo de Cristo na terra, formado por todos os salvos.",
      context: "Jesus instituiu a igreja e disse que as portas do inferno não prevaleceriam contra ela.",
      explanation: "A igreja local é imperfeita porque é feita de pecadores perdoados. Mas ela é o meio que Deus escolheu para nos pastorear, ensinar, proteger e nos fazer crescer em amor uns pelos outros.",
      application: "Não seja um cristão isolado. O isolamento esfria a fé. Encontre uma igreja que pregue a Bíblia e sirva a seus irmãos.",
      verses: ['Mateus 16:18', 'Hebreus 10:25'],
    });
  }

  // ==========================================
  // BLOCO FACTUAL (LIVROS E PERSONAGENS)
  // ==========================================

  if (/(g[eê]nesis|no\s+princ[ií]pio|cria[cç][aã]o|ad[aã]o\s+e\s+eva)/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "factual",
      direct: "Gênesis é o livro das origens. O primeiro livro da Bíblia.",
      context: "Escrito por Moisés, ele estabelece as bases de toda a teologia cristã.",
      explanation: "Narra a criação do mundo, a queda do homem no pecado, o dilúvio e a história dos patriarcas (Abraão, Isaque, Jacó e José), mostrando o início do plano de redenção de Deus.",
      application: "Gênesis nos lembra que Deus é soberano sobre a criação e cumpre Suas promessas, mesmo quando os homens falham.",
      verses: ["Gênesis 1:1", "Gênesis 12:1-3"],
    });
  }

  if (/(apocalipse|fim\s+do\s+mundo|anticristo|besta)/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "factual",
      direct: "Apocalipse significa 'Revelação'. É o último livro da Bíblia, escrito pelo apóstolo João.",
      context: "Foi escrito enquanto João estava exilado na ilha de Patmos, revelando a glória final de Cristo.",
      explanation: "O livro usa uma linguagem altamente simbólica e profética para descrever os juízos de Deus, a queda do mal, a volta de Jesus em glória e o estabelecimento de Novos Céus e Nova Terra.",
      application: "O Apocalipse não foi escrito para assustar, mas para consolar a igreja sofredora: no final, Cristo vence e enxugará toda lágrima.",
      verses: ["Apocalipse 1:1", "Apocalipse 21:3-4"],
    });
  }

  if (/(moises|mois[ée]s|egito|mar\s+vermelho|dez\s+mandamentos)/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "factual",
      direct: "Moisés foi o líder escolhido por Deus para libertar os israelitas da escravidão no Egito.",
      context: "Sua história, registrada em Êxodo, mostra um homem que passou 40 anos no palácio, 40 anos no deserto aprendendo humildade, e 40 anos liderando o povo.",
      explanation: "Ele foi o mediador da Antiga Aliança, recebendo os Dez Mandamentos no Monte Sinai. Ele aponta para Jesus, que seria o Mediador de uma Nova e Superior Aliança.",
      application: "A vida de Moisés nos prova que Deus capacita aqueles que Ele chama, usando até mesmo nossas fraquezas e nosso passado para Sua glória.",
      verses: ["Êxodo 3:14", "Hebreus 11:24-26"],
    });
  }

  if (/(davi|golias|salmista|rei\s+davi)/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "factual",
      direct: "Davi foi o maior rei de Israel e um ancestral de Jesus Cristo, conhecido como o 'homem segundo o coração de Deus'.",
      context: "Ele derrotou o gigante Golias quando jovem e mais tarde se tornou o rei mais próspero da nação.",
      explanation: "Davi não era perfeito; ele cometeu pecados gravíssimos (como adultério com Bate-Seba). No entanto, o que o definia era o seu rápido e profundo arrependimento diante de Deus. Ele também escreveu grande parte dos Salmos.",
      application: "Podemos aprender com Davi a amar a presença de Deus apaixonadamente e a nunca esconder nossos pecados, mas confessá-los com dor genuína.",
      verses: ["1 Samuel 16:7", "Salmos 51:1-2", "Atos 13:22"],
    });
  }

  if (/(abra[aã]o|isaque|jac[oó]|patriarca)/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "factual",
      direct: "Abraão é considerado o 'Pai da Fé' e o ancestral do povo de Israel.",
      context: "Deus o chamou em Gênesis 12 para deixar sua terra e sua parentela em troca de uma promessa de abençoar todas as nações da terra através dele.",
      explanation: "Apesar de ter falhado algumas vezes, Abraão creu em Deus quando Ele prometeu um filho (Isaque) mesmo ele e Sara sendo idosos. Essa fé lhe foi imputada como justiça (Romanos 4).",
      application: "Andar com Deus requer deixar nossa zona de conforto e confiar que o que Deus prometeu, Ele é poderoso para cumprir.",
      verses: ["Gênesis 12:1-3", "Hebreus 11:8"],
    });
  }

  if (/(pedro|sim[aã]o\s+pedro|ap[oó]stolo\s+pedro)/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "factual",
      direct: "Pedro foi um dos 12 apóstolos de Jesus, sendo parte do círculo mais íntimo de Cristo.",
      context: "Pescador de profissão, era conhecido por ser impulsivo, falando e agindo antes de pensar.",
      explanation: "Pedro declarou Jesus como o Cristo, andou sobre as águas, mas também negou a Jesus três vezes na noite da crucificação. Jesus o restaurou e ele se tornou o grande pregador de Pentecostes em Atos 2.",
      application: "A história de Pedro é a prova de que o fracasso não é o fim para quem anda com Jesus. Há restauração e propósito após a queda.",
      verses: ["Mateus 16:16", "João 21:15-17"],
    });
  }

  if (/(jo[aã]o\s+batista)/.test(lower)) {
    return buildDirectTheologyResponse({
      topic: "factual",
      direct: "João Batista foi o profeta que preparou o caminho para o ministério de Jesus.",
      context: "Primo de Jesus, ele pregava no deserto do Jordão chamando o povo ao arrependimento.",
      explanation: "Seu ministério era um divisor de águas entre o Antigo e Novo Testamento. Quando viu Jesus, declarou: 'Eis o Cordeiro de Deus que tira o pecado do mundo!'. Foi ele quem batizou Jesus nas águas.",
      application: "A atitude de João deve ser a nossa: 'É necessário que Ele cresça e que eu diminua'.",
      verses: ["João 1:29", "João 3:30"],
    });
  }

  return null;
}

// ==========================================
// OUTROS MATCHERS E LÓGICA FINAL
// ==========================================

function matchFactual(q: string): BibleResponse | null {
  const lower = q.toLowerCase();

  if (/quantos\s+livros/.test(lower)) {
    return {
      acolhimento: maybePrefixWithMemory("factual") + "A Bíblia tem 66 livros. 😊",
      contexto: "São 39 no Antigo Testamento e 27 no Novo Testamento. Escrita por cerca de 40 autores ao longo de aproximadamente 1.500 anos.",
      explicacao: "O Antigo Testamento reúne Lei, Históricos, Poéticos e Proféticos. O Novo Testamento traz Evangelhos, Atos, Cartas e Apocalipse.",
      aplicacao: "Começar por João, Salmos e Provérbios costuma ajudar muito quem está iniciando.",
      versiculos: ['2 Timóteo 3:16'],
      oracao: prayerSuggestion("amor pela Palavra"),
      followUp: "Quer que eu te sugira um plano de leitura simples?",
    };
  }

  if (/quantos\s+(disc[ií]pulos|ap[oó]stolos)|12\s+disc[ií]pulos/.test(lower)) {
    return {
      acolhimento: maybePrefixWithMemory("factual") + "Jesus escolheu 12 discípulos. 😊",
      contexto: "Os doze foram chamados para andar com Jesus, aprender com Ele e depois anunciar o evangelho.",
      explicacao: "Depois da traição de Judas, Matias foi escolhido. Mais tarde, Paulo também foi chamado como apóstolo em sentido missionário.",
      aplicacao: "Eram pessoas comuns. Deus não escolhe apenas os capacitados — Ele também capacita os escolhidos.",
      versiculos: ['Marcos 3:14'],
      oracao: prayerSuggestion("disponibilidade para servir"),
      followUp: "Quer conhecer a história de algum discípulo em particular?",
    };
  }

  if (/onde\s+jesus\s+nasceu|nascimento\s+de\s+jesus/.test(lower)) {
    return {
      acolhimento: maybePrefixWithMemory("factual") + "Jesus nasceu em Belém de Judá. 😊",
      contexto: "Maria e José estavam lá por causa de um censo ordenado pelo império romano.",
      explicacao: "O nascimento em Belém já havia sido profetizado no Antigo Testamento. Jesus veio ao mundo da forma mais humilde possível, nascendo numa manjedoura.",
      aplicacao: "A forma como Jesus veio ao mundo revela que a verdadeira grandeza no Reino de Deus começa com a humildade.",
      versiculos: ['Miquéias 5:2', 'Lucas 2:7'],
      oracao: prayerSuggestion("gratidão por Jesus"),
      followUp: "Quer saber mais sobre a infância de Jesus?",
    };
  }

  return null;
}

function matchEmotional(q: string, emotion?: NormalizedEmotion): BibleResponse | null {
  const lower = q.toLowerCase();

  if (/ansio|preocup|nervos|afli[cç][aã]o|desespero|p[aâ]nico/.test(lower) || emotion === "ansioso") {
    return {
      acolhimento: pick([
        "Eu sinto que isso está pesado pra você… mas você não está sozinho. 💙",
        "Parece que sua mente está cansada de carregar tanta coisa. Vamos com calma. 💙",
      ]),
      contexto: "Deus não ignora sua ansiedade. Ele te convida a lançar sobre Ele tudo que te pesa.",
      explicacao: "Ansiedade é real, e Deus entende. Ele não pede que você seja forte o tempo todo — pede que você confie nEle e caminhe um passo de cada vez.",
      aplicacao: pick([
        "Respira fundo agora. Inspira contando até 4, segura 4, solta 4. Faz isso 3 vezes.",
        "Tenta diminuir o ritmo por um instante. Olha ao redor e nomeie mentalmente 3 coisas que você consegue ver agora.",
      ]),
      versiculos: ['Filipenses 4:6-7', '1 Pedro 5:7'],
      oracao: "Se você quiser, eu posso fazer uma oração curta com você agora para ansiedade.",
      followUp: "Quer que eu te mostre um versículo específico para ansiedade?",
    };
  }

  if (/medo|assust|pavor|receio|terror/.test(lower) || emotion === "medo") {
    return {
      acolhimento: pick([
        "Eu entendo esse medo… e tá tudo bem admitir isso. 💙",
        "Perguntas e situações assim realmente podem assustar. Você não precisa atravessar isso sozinho. 💙",
      ]),
      contexto: "Deus está com você — mesmo quando tudo parece incerto.",
      explicacao: "O medo não te define. Até os heróis da Bíblia sentiram medo. O que importa não é nunca tremer, e sim pra quem você corre quando treme.",
      aplicacao: "Dê nome ao que te assusta. Fale isso diante de Deus com honestidade.",
      versiculos: ['Isaías 41:10', '2 Timóteo 1:7'],
      oracao: "Se quiser, eu posso transformar isso em uma oração curta contra o medo.",
      followUp: "Quer que eu te mostre promessas bíblicas para momentos de medo?",
    };
  }

  if (/trist|chorar|sozinho|saudade|vazio/.test(lower) || emotion === "triste") {
    return {
      acolhimento: pick([
        "Eu sinto muito por isso… mas você não precisa enfrentar sozinho. 💙",
        "Seu coração parece cansado de doer. Eu sinto muito por isso. 💙",
      ]),
      contexto: "Deus guarda cada lágrima sua. Ele está perto dos que sofrem.",
      explicacao: "Sentir tristeza não é fraqueza. É humano. Até Jesus chorou. O que importa é não ficar sozinho nela.",
      aplicacao: "Se permita sentir. Mas não se isole. Fale com Deus e, se puder, com alguém de confiança.",
      versiculos: ['Salmos 34:18', 'Salmos 30:5'],
      oracao: "Se quiser, eu também posso montar uma oração curta de consolo para esse momento.",
      followUp: "Quer me contar mais sobre o que está pesando no seu coração hoje?",
    };
  }

  if (/culpa|envergonh|acusad/.test(lower)) {
    return {
      acolhimento: pick([
        "Imagino como isso pode estar te consumindo… mas existe graça pra isso. 💙",
      ]),
      contexto: "A culpa pode ser pesada, mas Deus não quer que você viva preso nela.",
      explicacao: "Existe diferença entre convicção e condenação. Deus convence para curar; a condenação paralisa e esmaga.",
      aplicacao: "Se tem algo que precisa acertar, dê o primeiro passo. Mas saiba que o perdão de Deus já está disponível.",
      versiculos: ['Romanos 8:1', '1 João 1:9'],
      oracao: "Se quiser, eu posso te entregar uma oração curta sobre culpa e perdão.",
      followUp: "Quer conversar sobre como lidar com a culpa de forma saudável?",
    };
  }

  if (/cansa|exaust|esgota|sobrecarreg/.test(lower) || emotion === "cansado") {
    return {
      acolhimento: pick([
        "Eu entendo esse cansaço… você tem dado tudo de si. 💙",
      ]),
      contexto: "Deus não ignora o seu limite. Ele chama os cansados para perto, não para longe.",
      explicacao: "Cansaço não é falta de fé. Muitas vezes é só sinal de que você é humano e precisa de descanso e presença de Deus.",
      aplicacao: "Pare um pouco. Respire. Nem tudo precisa ser resolvido hoje.",
      versiculos: ['Mateus 11:28'],
      oracao: "Se quiser, eu também posso te deixar uma oração curta de descanso e renovação.",
      followUp: "Quer que eu te mostre uma palavra bíblica para cansaço?",
    };
  }

  return null;
}

function matchNamedTopic(q: string, emotion?: NormalizedEmotion): BibleResponse | null {
  const lower = q.toLowerCase();

  if (/paulo|ap[oó]stolo\s+paulo|saulo/.test(lower)) {
    return {
      acolhimento: "Que pergunta boa! A história de Paulo é incrível. 😊",
      contexto: "Paulo — antes chamado Saulo — perseguia cristãos até ter um encontro com Jesus na estrada de Damasco.",
      explicacao: "Depois desse encontro, ele se tornou um dos maiores missionários da história cristã e escreveu boa parte do Novo Testamento.",
      aplicacao: "A história de Paulo lembra que ninguém está longe demais para ser alcançado por Deus.",
      versiculos: ['Atos 9:15', 'Gálatas 2:20'],
      oracao: prayerSuggestion("transformação"),
      followUp: "Quer saber mais sobre alguma fase específica da vida de Paulo?",
    };
  }

  if (/perd[aã]o|perdoar/.test(lower)) {
    return {
      acolhimento: `${getEmotionAcolhimento(emotion)} Falar sobre perdão nem sempre é fácil, né? 💙`,
      contexto: "O perdão é central na Bíblia. Quando Pedro perguntou quantas vezes deveria perdoar, Jesus respondeu de forma radical.",
      explicacao: "Perdoar não significa fingir que não doeu. É soltar o peso da mágoa e parar de permitir que ela governe o coração. É entregar a justiça para Deus.",
      aplicacao: "Se tem alguém que você precisa perdoar, comece falando com Deus sobre isso com sinceridade. O perdão é uma decisão que pode levar tempo para virar sentimento.",
      versiculos: ['Efésios 4:32', 'Mateus 6:14'],
      oracao: prayerSuggestion("perdão"),
      followUp: "Quer que eu te ajude a pensar no próximo passo prático para esse perdão?",
    };
  }

  return null;
}

function buildPrayerResponse(emotion?: NormalizedEmotion): BibleResponse {
  return {
    acolhimento: `${getEmotionAcolhimento(emotion)} Vamos orar juntos. 💙`,
    contexto: "A oração é a conversa mais íntima que você pode ter com Deus. Ele ouve — sempre.",
    explicacao: "Não precisa ser bonito ou formal. Deus quer ouvir o que está no seu coração, do jeito que vier.",
    aplicacao: "Fecha os olhos, respira fundo, e fala com Deus como se Ele estivesse sentado do seu lado.",
    versiculos: ['Filipenses 4:6', 'Salmos 145:18'],
    oracao: pick([
      "Pai, eu venho a Ti agora com tudo que sou. Ouve meu coração. Me encontra aqui. Amém.",
      "Senhor, eu me coloco diante de Ti agora. Vê meu interior, sustenta meu coração e fala comigo. Amém.",
    ]),
    followUp: "Quer que eu faça uma oração mais específica sobre algo que está no seu coração?",
  };
}

function buildVerseResponse(emotion?: NormalizedEmotion): BibleResponse {
  const verses = [
    { ref: "Salmos 23:1", text: "O Senhor é o meu pastor, nada me faltará." },
    { ref: "Jeremias 29:11", text: "Eu sei os planos que tenho pra vocês — planos de paz e não de mal." },
    { ref: "Romanos 8:28", text: "Todas as coisas cooperam para o bem daqueles que amam a Deus." },
    { ref: "Isaías 40:31", text: "Os que esperam no Senhor renovam suas forças." },
    { ref: "Josué 1:9", text: "Seja forte e corajoso! Não se apavore, porque o Senhor está com você." },
  ];

  const v = pick(verses);

  return {
    acolhimento: `${getEmotionAcolhimento(emotion)} Aqui vai um versículo pra te acompanhar hoje. 😊`,
    contexto: `${v.ref}`,
    explicacao: `"${v.text}"`,
    aplicacao: "Guarda esse versículo no coração. Lê de novo antes de dormir.",
    versiculos: [`${v.ref} — "${v.text}"`],
    oracao: "Se quiser, eu também posso transformar esse versículo em uma oração curta.",
    followUp: "Quer outro versículo ou quer refletir mais sobre esse?",
  };
}

function buildGeneralResponse(emotion?: NormalizedEmotion): BibleResponse {
  return {
    acolhimento: pick([
      `${getEmotionAcolhimento(emotion)} Vamos olhar isso juntos. 💙`,
      "Boa pergunta. Deixa eu te ajudar com isso.",
    ]),
    contexto: "A Bíblia tem direção e sabedoria para todas as áreas da nossa vida.",
    explicacao: "Nem toda resposta vem de forma instantânea, mas Deus sabe conduzir e clarear a mente de quem O busca com verdade e coração aberto.",
    aplicacao: "Separe um tempo com Deus hoje. Pode ser 5 minutos — Ele não precisa de muito tempo pra falar ao seu coração.",
    versiculos: ['Tiago 1:5 — "Se algum de vocês tem falta de sabedoria, peça-a a Deus..."'],
    oracao: "Se você quiser, eu posso orar para que Deus te dê clareza sobre isso.",
    followUp: "Quer que eu aprofunde isso com você ou traga outros textos bíblicos?",
  };
}

export const helpTopics = [
  {
    id: "ansiedade",
    emoji: "😰",
    label: "Ansiedade",
    response: {
      acolhimento: "Eu sei que quando a ansiedade aperta parece que o coração não descansa. Mas você não está sozinho nisso. 💙",
      contexto: "A Bíblia fala com muita ternura sobre ansiedade, porque Deus conhece nossa fragilidade.",
      explicacao: "Ansiedade muitas vezes é o coração tentando controlar tudo ao mesmo tempo. Deus não te humilha por isso — Ele te convida a entregar o peso.",
      aplicacao: "Faz algo simples agora: respira fundo 3 vezes. Depois, fala com Deus: 'Senhor, eu não consigo carregar isso sozinho.'",
      versiculos: ['Filipenses 4:6-7', '1 Pedro 5:7'],
      oracao: "Pai, traz paz pra mente e pro coração agora. Acalma a tempestade. Amém.",
      followUp: "Quer que eu te guie agora em uma pequena pausa de oração?",
    },
  },
  {
    id: "tristeza",
    emoji: "😢",
    label: "Tristeza",
    response: {
      acolhimento: "Sei que essa tristeza pode deixar tudo mais pesado. Você não precisa atravessar isso sozinho. 💙",
      contexto: "A Bíblia não esconde a dor humana. Jesus também chorou. Deus nunca tratou a tristeza sincera como fraqueza.",
      explicacao: "Tristeza não significa ausência de fé. Às vezes significa que o coração foi profundamente tocado e precisa de consolo real.",
      aplicacao: "Não se cobre tanto. O primeiro passo nem sempre é melhorar rápido — às vezes é só parar de se esconder de Deus.",
      versiculos: ['Salmos 34:18', 'Salmos 30:5'],
      oracao: "Senhor, consola esse coração machucado e traz o Seu abraço de Pai. Amém.",
      followUp: "Quer me contar o que está pesando mais no seu coração hoje?",
    },
  },
  {
    id: "medo",
    emoji: "😨",
    label: "Medo",
    response: {
      acolhimento: "Ter medo não te faz fraco. Te faz humano. E Deus sabe exatamente como te encontrar aí. 💙",
      contexto: "A Bíblia está cheia de pessoas que sentiram medo. O chamado de Deus não é 'nunca sinta medo', mas 'não caminhe sozinho'.",
      explicacao: "O medo tenta ampliar o problema e encolher a presença de Deus na nossa visão. A fé lembra que Deus continua maior.",
      aplicacao: "Dá nome ao que te assusta. Quando o medo sai da confusão e entra na oração, ele começa a perder força.",
      versiculos: ['Isaías 41:10', '2 Timóteo 1:7'],
      oracao: "Deus, tira o espírito de medo e traz paz e certeza do Seu cuidado. Amém.",
      followUp: "Quer que eu te mostre promessas bíblicas para enfrentar esse medo?",
    },
  },
];

export function generateMockResponse(
  question: string,
  emotion?: UserEmotion | null
): BibleResponse {
  const q = question.toLowerCase().trim();
  const intent = detectIntent(q);
  const effectiveEmotion = normalizeEmotion(emotion) ?? inferEmotionFromQuestion(q);

  const theological = matchTheological(q, effectiveEmotion);
  if (theological) {
    remember("theological", "theological", effectiveEmotion, question);
    return theological;
  }

  const factual = matchFactual(q);
  if (factual) {
    remember("factual", "factual", effectiveEmotion, question);
    return factual;
  }

  const emotional = matchEmotional(q, effectiveEmotion);
  if (emotional) {
    remember("emotional", "emotional", effectiveEmotion, question);
    return emotional;
  }

  const named = matchNamedTopic(q, effectiveEmotion);
  if (named) {
    remember("general", "general", effectiveEmotion, question);
    return named;
  }

  if (intent === "prayer") {
    const response = buildPrayerResponse(effectiveEmotion);
    remember("prayer", "prayer", effectiveEmotion, question);
    return response;
  }

  if (intent === "verse") {
    const response = buildVerseResponse(effectiveEmotion);
    remember("verse", "verse", effectiveEmotion, question);
    return response;
  }

  const response = buildGeneralResponse(effectiveEmotion);
  remember("general", intent, effectiveEmotion, question);
  return response;
}

// ==========================================
// FUNÇÕES DE INTEGRAÇÃO COM O CHAT (ADICIONADAS PARA CORRIGIR O BUG)
// ==========================================

// 1. Se o seu chat no 'index' precisar exibir a resposta como um texto simples (string), use esta função:
export function formatMockResponseToString(res: BibleResponse): string {
  const versos = res.versiculos.length > 0 ? `\n📖 Versículos: ${res.versiculos.join(" | ")}` : "";
  return `${res.acolhimento}\n\n${res.contexto}\n\n${res.explicacao}\n\n${res.aplicacao}${versos}\n\n🙏 ${res.oracao}\n\n${res.followUp}`;
}

// 2. Se o seu 'index' precisa chamar a função como se fosse uma API real (com delay de tempo), chame esta função ao invés da `generateMockResponse`:
export async function fetchMockChatAsync(question: string, emotion?: UserEmotion | null): Promise<BibleResponse> {
  return new Promise((resolve) => {
    // Simula 1.5 segundos de "carregamento" para o chat não bugar
    setTimeout(() => {
      resolve(generateMockResponse(question, emotion));
    }, 1500); 
  });
}
