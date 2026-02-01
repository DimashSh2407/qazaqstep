const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/qazaqstep';

const lessons = [
  {
    title: 'Greetings and Introductions',
    level: 'A1',
    duration: 15,
    grammarText: 'In Kazakh, greetings change based on the time of day and formality. "Сәлем" (Salem) is a general greeting, while "Қайырлы таң" (Qayırlı tañ) means "Good morning". When introducing yourself, use "Менің атым..." (Menіñ atym...) meaning "My name is...".',
    example: 'Сәлем! Менің атым Айгүл. (Salem! Menіñ atym Aygül.) - Hello! My name is Aygül.',
    audioUrl: '/audio/greetings.mp3',
    testQuestions: [
      {
        question: 'How do you say "Hello" in Kazakh?',
        options: ['Сәлем', 'Қош келдіңіз', 'Рақмет', 'Кешіріңіз'],
        correctAnswer: 0
      },
      {
        question: 'What does "Менің атым" mean?',
        options: ['How are you?', 'My name is', 'Thank you', 'Goodbye'],
        correctAnswer: 1
      },
      {
        question: 'Which greeting is used in the morning?',
        options: ['Қайырлы кеш', 'Қайырлы таң', 'Сәлем', 'Сау болыңыз'],
        correctAnswer: 1
      },
      {
        question: 'How do you respond to "Қалайсыз?" (How are you?)?',
        options: ['Жақсы', 'Рақмет', 'Кешіріңіз', 'Жоқ'],
        correctAnswer: 0
      },
      {
        question: 'What is the polite form of "you" in Kazakh?',
        options: ['Сен', 'Сіз', 'Ол', 'Біз'],
        correctAnswer: 1
      }
    ],
    vocabularyCards: [
      'Сәлем - Hello',
      'Қайырлы таң - Good morning',
      'Менің атым - My name is',
      'Қалайсыз? - How are you?',
      'Жақсы - Good/Well',
      'Рақмет - Thank you'
    ],
    skills: ['grammar', 'speaking', 'listening']
  },
  {
    title: 'Numbers and Counting',
    level: 'A1',
    duration: 20,
    grammarText: 'Kazakh uses a decimal number system. Numbers 1-10 are: бір (1), екі (2), үш (3), төрт (4), бес (5), алты (6), жеті (7), сегіз (8), тоғыз (9), он (10). When counting objects, the noun form may change slightly. Numbers are placed before the noun.',
    example: 'Бір кітап (Bir kitap) - One book. Екі оқушы (Eki oqushy) - Two students.',
    audioUrl: '/audio/numbers.mp3',
    testQuestions: [
      {
        question: 'What is the Kazakh word for "five"?',
        options: ['Төрт', 'Бес', 'Алты', 'Жеті'],
        correctAnswer: 1
      },
      {
        question: 'How do you say "ten" in Kazakh?',
        options: ['Тоғыз', 'Он', 'Бір', 'Екі'],
        correctAnswer: 1
      },
      {
        question: 'What does "үш" mean?',
        options: ['Two', 'Three', 'Four', 'Five'],
        correctAnswer: 1
      },
      {
        question: 'How do you say "seven books" in Kazakh?',
        options: ['Жеті кітап', 'Алты кітап', 'Сегіз кітап', 'Тоғыз кітап'],
        correctAnswer: 0
      },
      {
        question: 'What is "төрт" in English?',
        options: ['Three', 'Four', 'Five', 'Six'],
        correctAnswer: 1
      },
      {
        question: 'How do you say "eight" in Kazakh?',
        options: ['Жеті', 'Сегіз', 'Тоғыз', 'Он'],
        correctAnswer: 1
      }
    ],
    vocabularyCards: [
      'Бір - One',
      'Екі - Two',
      'Үш - Three',
      'Төрт - Four',
      'Бес - Five',
      'Алты - Six',
      'Жеті - Seven',
      'Сегіз - Eight',
      'Тоғыз - Nine',
      'Он - Ten'
    ],
    skills: ['grammar', 'speaking', 'listening']
  },
  {
    title: 'Present Tense Verbs',
    level: 'A2',
    duration: 25,
    grammarText: 'Kazakh verbs in the present tense are formed by adding suffixes to the verb stem. The basic structure is: verb root + tense marker + personal ending. For example, "жазу" (to write) becomes "жазамын" (I write), "жазасың" (you write), "жазады" (he/she writes). The personal endings change based on the subject.',
    example: 'Мен кітап жазамын. (Men kitap jazamyn.) - I write a book. Сіз оқып жатырсыз. (Sіz oqyp jatırsyz.) - You are reading.',
    audioUrl: '/audio/verbs.mp3',
    testQuestions: [
      {
        question: 'What does "жазамын" mean?',
        options: ['I write', 'You write', 'He writes', 'We write'],
        correctAnswer: 0
      },
      {
        question: 'How do you say "I read" in Kazakh?',
        options: ['Оқимын', 'Оқисың', 'Оқиды', 'Оқимыз'],
        correctAnswer: 0
      },
      {
        question: 'What is the correct form for "you (formal) speak"?',
        options: ['Сөйлейсің', 'Сөйлейді', 'Сөйлейсіз', 'Сөйлейміз'],
        correctAnswer: 2
      },
      {
        question: 'How do you say "they go" in Kazakh?',
        options: ['Барамын', 'Барасың', 'Барады', 'Барады'],
        correctAnswer: 3
      },
      {
        question: 'What does "жасаймыз" mean?',
        options: ['I do', 'You do', 'We do', 'They do'],
        correctAnswer: 2
      },
      {
        question: 'Which verb form is used for "he/she eats"?',
        options: ['Жеймін', 'Жейсің', 'Жейді', 'Жейміз'],
        correctAnswer: 2
      },
      {
        question: 'How do you say "I understand" in Kazakh?',
        options: ['Түсінемін', 'Түсінесің', 'Түсінеді', 'Түсінеміз'],
        correctAnswer: 0
      },
      {
        question: 'What is the present tense ending for "I" (first person singular)?',
        options: ['-мын/-мін', '-сың/-сің', '-ды/-ді', '-мыз/-міз'],
        correctAnswer: 0
      }
    ],
    vocabularyCards: [
      'Жазу - To write',
      'Оқу - To read',
      'Сөйлеу - To speak',
      'Бару - To go',
      'Жасау - To do/make',
      'Жеу - To eat',
      'Түсіну - To understand',
      'Келу - To come'
    ],
    skills: ['grammar', 'speaking', 'listening']
  },
  {
    title: 'Family and Relationships',
    level: 'A1',
    duration: 18,
    grammarText: 'Family members in Kazakh use specific terms. "Әке" (äke) means father, "Ана" (ana) means mother. "Аға" (ağa) is older brother, "Апа" (apa) is older sister. "Бала" (bala) means child. When talking about family, use possessive suffixes like "менің әкем" (my father).',
    example: 'Менің әкем дәрігер. (Menіñ äkem därіger.) - My father is a doctor. Менің анам мұғалім. (Menіñ anam muğalіm.) - My mother is a teacher.',
    audioUrl: '/audio/family.mp3',
    testQuestions: [
      {
        question: 'What does "әке" mean?',
        options: ['Mother', 'Father', 'Brother', 'Sister'],
        correctAnswer: 1
      },
      {
        question: 'How do you say "mother" in Kazakh?',
        options: ['Әке', 'Ана', 'Аға', 'Апа'],
        correctAnswer: 1
      },
      {
        question: 'What is "аға" in English?',
        options: ['Father', 'Mother', 'Older brother', 'Older sister'],
        correctAnswer: 2
      },
      {
        question: 'How do you say "my father" in Kazakh?',
        options: ['Менің әкем', 'Менің анам', 'Менің ағам', 'Менің апам'],
        correctAnswer: 0
      },
      {
        question: 'What does "бала" mean?',
        options: ['Parent', 'Child', 'Grandparent', 'Uncle'],
        correctAnswer: 1
      },
      {
        question: 'How do you say "older sister" in Kazakh?',
        options: ['Аға', 'Апа', 'Ана', 'Әке'],
        correctAnswer: 1
      }
    ],
    vocabularyCards: [
      'Әке - Father',
      'Ана - Mother',
      'Аға - Older brother',
      'Апа - Older sister',
      'Бала - Child',
      'Қарындас - Younger sister',
      'Іні - Younger brother',
      'Ата - Grandfather',
      'Әже - Grandmother'
    ],
    skills: ['grammar', 'speaking', 'vocabulary']
  },
  {
    title: 'Food and Dining',
    level: 'A1',
    duration: 20,
    grammarText: 'Food vocabulary is essential for daily conversations. "Ет" (et) means meat, "нан" (nan) is bread, "сүт" (süt) is milk. When ordering or talking about food, use "Мен... алдым" (I want...) or "Менге... беріңіз" (Give me...).',
    example: 'Менге нан беріңіз. (Menge nan berіñіz.) - Give me bread. Мен ет алдым. (Men et aldym.) - I want meat.',
    audioUrl: '/audio/food.mp3',
    testQuestions: [
      {
        question: 'What does "ет" mean?',
        options: ['Bread', 'Meat', 'Milk', 'Water'],
        correctAnswer: 1
      },
      {
        question: 'How do you say "bread" in Kazakh?',
        options: ['Ет', 'Нан', 'Сүт', 'Су'],
        correctAnswer: 1
      },
      {
        question: 'What is "сүт" in English?',
        options: ['Meat', 'Bread', 'Milk', 'Water'],
        correctAnswer: 2
      },
      {
        question: 'How do you say "Give me bread" in Kazakh?',
        options: ['Менге нан беріңіз', 'Мен нан алдым', 'Менге ет беріңіз', 'Мен сүт алдым'],
        correctAnswer: 0
      },
      {
        question: 'What does "су" mean?',
        options: ['Milk', 'Water', 'Bread', 'Meat'],
        correctAnswer: 1
      },
      {
        question: 'How do you say "I want meat" in Kazakh?',
        options: ['Мен ет алдым', 'Менге ет беріңіз', 'Мен нан алдым', 'Мен сүт алдым'],
        correctAnswer: 0
      }
    ],
    vocabularyCards: [
      'Ет - Meat',
      'Нан - Bread',
      'Сүт - Milk',
      'Су - Water',
      'Шай - Tea',
      'Кофе - Coffee',
      'Кәмпит - Candy',
      'Жеміс - Fruit',
      'Көкөніс - Vegetable'
    ],
    skills: ['vocabulary', 'speaking', 'listening']
  },
  {
    title: 'Colors and Descriptions',
    level: 'A1',
    duration: 15,
    grammarText: 'Colors in Kazakh are adjectives that agree with nouns. "Қызыл" (qyzyl) is red, "көк" (kök) is blue, "сары" (sary) is yellow. Colors come before the noun: "қызыл кітап" (red book).',
    example: 'Бұл қызыл кітап. (Bul qyzyl kitap.) - This is a red book. Менің көйлегім көк. (Menіñ köylegіm kök.) - My shirt is blue.',
    audioUrl: '/audio/colors.mp3',
    testQuestions: [
      {
        question: 'What does "қызыл" mean?',
        options: ['Blue', 'Red', 'Yellow', 'Green'],
        correctAnswer: 1
      },
      {
        question: 'How do you say "blue" in Kazakh?',
        options: ['Қызыл', 'Көк', 'Сары', 'Жасыл'],
        correctAnswer: 1
      },
      {
        question: 'What is "сары" in English?',
        options: ['Red', 'Blue', 'Yellow', 'Green'],
        correctAnswer: 2
      },
      {
        question: 'How do you say "red book" in Kazakh?',
        options: ['Қызыл кітап', 'Көк кітап', 'Сары кітап', 'Жасыл кітап'],
        correctAnswer: 0
      },
      {
        question: 'What does "жасыл" mean?',
        options: ['Red', 'Blue', 'Yellow', 'Green'],
        correctAnswer: 3
      }
    ],
    vocabularyCards: [
      'Қызыл - Red',
      'Көк - Blue',
      'Сары - Yellow',
      'Жасыл - Green',
      'Қара - Black',
      'Ақ - White',
      'Сұр - Gray',
      'Қоңыр - Brown'
    ],
    skills: ['vocabulary', 'grammar']
  },
  {
    title: 'Past Tense Verbs',
    level: 'A2',
    duration: 25,
    grammarText: 'Past tense in Kazakh is formed by adding "-ды/-ді/-ты/-ті" to the verb stem, depending on vowel harmony. The structure is: verb root + past tense marker + personal ending. "Мен оқыдым" (I read), "сіз оқыдыңыз" (you read), "ол оқыды" (he/she read).',
    example: 'Мен кітап оқыдым. (Men kitap oqydym.) - I read a book. Ол мектепке барды. (Ol mektepke bardy.) - He went to school.',
    audioUrl: '/audio/past-tense.mp3',
    testQuestions: [
      {
        question: 'What does "оқыдым" mean?',
        options: ['I read (past)', 'You read (past)', 'He read (past)', 'We read (past)'],
        correctAnswer: 0
      },
      {
        question: 'How do you say "I went" in Kazakh?',
        options: ['Бардым', 'Бардың', 'Барды', 'Бардық'],
        correctAnswer: 0
      },
      {
        question: 'What is the past tense form of "to write" for "he/she"?',
        options: ['Жаздым', 'Жаздың', 'Жазды', 'Жаздық'],
        correctAnswer: 2
      },
      {
        question: 'How do you say "we ate" in Kazakh?',
        options: ['Жедік', 'Жедіңдер', 'Жеді', 'Жедім'],
        correctAnswer: 0
      },
      {
        question: 'What does "келді" mean?',
        options: ['I came', 'You came', 'He/she came', 'We came'],
        correctAnswer: 2
      },
      {
        question: 'How do you say "you (formal) spoke" in Kazakh?',
        options: ['Сөйледің', 'Сөйледіңіз', 'Сөйледі', 'Сөйледік'],
        correctAnswer: 1
      },
      {
        question: 'What is the past tense ending for first person singular?',
        options: ['-дым/-дім', '-дың/-дің', '-ды/-ді', '-дық/-дік'],
        correctAnswer: 0
      }
    ],
    vocabularyCards: [
      'Оқу (past) - To read (read)',
      'Жазу (past) - To write (wrote)',
      'Бару (past) - To go (went)',
      'Келу (past) - To come (came)',
      'Жеу (past) - To eat (ate)',
      'Ішу (past) - To drink (drank)',
      'Көру (past) - To see (saw)',
      'Есту (past) - To hear (heard)'
    ],
    skills: ['grammar', 'speaking', 'listening']
  },
  {
    title: 'Future Tense and Plans',
    level: 'A2',
    duration: 22,
    grammarText: 'Future tense in Kazakh uses "-амын/-емін" for first person, "-асың/-есің" for second person, and "-ады/-еді" for third person. The structure is: verb root + future marker + personal ending. "Мен барамын" (I will go), "сіз барасыз" (you will go).',
    example: 'Мен ертең мектепке барамын. (Men erteñ mektepke baramyn.) - I will go to school tomorrow. Ол кітап оқиды. (Ol kitap oqydy.) - He will read a book.',
    audioUrl: '/audio/future-tense.mp3',
    testQuestions: [
      {
        question: 'What does "барамын" mean?',
        options: ['I will go', 'You will go', 'He will go', 'We will go'],
        correctAnswer: 0
      },
      {
        question: 'How do you say "I will read" in Kazakh?',
        options: ['Оқимын', 'Оқисың', 'Оқиды', 'Оқимыз'],
        correctAnswer: 0
      },
      {
        question: 'What is the future tense form for "you (formal) will speak"?',
        options: ['Сөйлейсің', 'Сөйлейсіз', 'Сөйлейді', 'Сөйлейміз'],
        correctAnswer: 1
      },
      {
        question: 'How do you say "they will come" in Kazakh?',
        options: ['Келемін', 'Келесің', 'Келеді', 'Келеміз'],
        correctAnswer: 2
      },
      {
        question: 'What does "жасаймыз" mean?',
        options: ['I will do', 'You will do', 'We will do', 'They will do'],
        correctAnswer: 2
      },
      {
        question: 'What is the future tense ending for first person singular?',
        options: ['-амын/-емін', '-асың/-есің', '-ады/-еді', '-амыз/-еміз'],
        correctAnswer: 0
      }
    ],
    vocabularyCards: [
      'Ертең - Tomorrow',
      'Бүрін - The day after tomorrow',
      'Жоспар - Plan',
      'Жоспарлау - To plan',
      'Келешек - Future',
      'Күту - To wait/expect',
      'Дайындалу - To prepare',
      'Ойлау - To think'
    ],
    skills: ['grammar', 'speaking', 'vocabulary']
  },
  {
    title: 'Daily Activities',
    level: 'A1',
    duration: 20,
    grammarText: 'Daily activities use common verbs. "Тұру" (to wake up), "жуыну" (to wash), "тамақтану" (to eat breakfast), "жұмыс істеу" (to work), "үйге қайту" (to return home). Use time expressions: "ертең" (morning), "түсте" (afternoon), "кеште" (evening).',
    example: 'Мен ертең тұрамын. (Men erteñ turamyn.) - I wake up in the morning. Ол жұмыс істейді. (Ol jumys іsteidі.) - He works.',
    audioUrl: '/audio/daily-activities.mp3',
    testQuestions: [
      {
        question: 'What does "тұру" mean?',
        options: ['To sleep', 'To wake up', 'To eat', 'To work'],
        correctAnswer: 1
      },
      {
        question: 'How do you say "to wash" in Kazakh?',
        options: ['Тұру', 'Жуыну', 'Тамақтану', 'Жұмыс істеу'],
        correctAnswer: 1
      },
      {
        question: 'What is "ертең" in English?',
        options: ['Evening', 'Afternoon', 'Morning', 'Night'],
        correctAnswer: 2
      },
      {
        question: 'How do you say "I work" in Kazakh?',
        options: ['Мен жұмыс істеймін', 'Мен тұрамын', 'Мен жуынамын', 'Мен тамақтанамын'],
        correctAnswer: 0
      },
      {
        question: 'What does "үйге қайту" mean?',
        options: ['To go home', 'To leave home', 'To stay home', 'To return home'],
        correctAnswer: 3
      },
      {
        question: 'How do you say "evening" in Kazakh?',
        options: ['Ертең', 'Түсте', 'Кеште', 'Түнде'],
        correctAnswer: 2
      }
    ],
    vocabularyCards: [
      'Тұру - To wake up',
      'Жуыну - To wash',
      'Тамақтану - To eat breakfast',
      'Жұмыс істеу - To work',
      'Оқу - To study/read',
      'Үйге қайту - To return home',
      'Ұйықтау - To sleep',
      'Ертең - Morning',
      'Кеште - Evening'
    ],
    skills: ['vocabulary', 'speaking', 'listening']
  },
  {
    title: 'Plural Forms',
    level: 'A2',
    duration: 20,
    grammarText: 'Plural in Kazakh is formed by adding "-лар/-лер" to nouns, depending on vowel harmony. "Кітап" (book) becomes "кітаптар" (books), "оқушы" (student) becomes "оқушылар" (students). The plural marker comes after the noun root.',
    example: 'Бір кітап (One book) → Көп кітаптар (Many books). Бір оқушы (One student) → Көп оқушылар (Many students).',
    audioUrl: '/audio/plural.mp3',
    testQuestions: [
      {
        question: 'What is the plural of "кітап" (book)?',
        options: ['Кітаптар', 'Кітап', 'Кітапта', 'Кітапты'],
        correctAnswer: 0
      },
      {
        question: 'How do you say "students" (plural) in Kazakh?',
        options: ['Оқушы', 'Оқушылар', 'Оқушыда', 'Оқушыны'],
        correctAnswer: 1
      },
      {
        question: 'What is the plural marker in Kazakh?',
        options: ['-тар/-тер', '-лар/-лер', '-дар/-дер', '-нар/-нер'],
        correctAnswer: 1
      },
      {
        question: 'How do you say "many books" in Kazakh?',
        options: ['Көп кітап', 'Көп кітаптар', 'Бір кітап', 'Бір кітаптар'],
        correctAnswer: 1
      },
      {
        question: 'What is the plural of "бала" (child)?',
        options: ['Бала', 'Балалар', 'Балата', 'Баланы'],
        correctAnswer: 1
      }
    ],
    vocabularyCards: [
      'Кітап - Book',
      'Кітаптар - Books',
      'Оқушы - Student',
      'Оқушылар - Students',
      'Бала - Child',
      'Балалар - Children',
      'Үй - House',
      'Үйлер - Houses'
    ],
    skills: ['grammar', 'vocabulary']
  },
  {
    title: 'Questions and Interrogatives',
    level: 'A2',
    duration: 18,
    grammarText: 'Questions in Kazakh use question words: "қайда" (where), "қашан" (when), "кім" (who), "не" (what), "неге" (why), "қалай" (how). Yes/no questions can be formed by intonation or adding "-ма/-ме" to verbs. "Сіз оқып жатырсыз ма?" (Are you reading?)',
    example: 'Сіз қайда бардыңыз? (Sіz qayda bardyñyz?) - Where did you go? Ол не істейді? (Ol ne іsteidі?) - What does he do?',
    audioUrl: '/audio/questions.mp3',
    testQuestions: [
      {
        question: 'What does "қайда" mean?',
        options: ['When', 'Where', 'Who', 'What'],
        correctAnswer: 1
      },
      {
        question: 'How do you say "when" in Kazakh?',
        options: ['Қайда', 'Қашан', 'Кім', 'Не'],
        correctAnswer: 1
      },
      {
        question: 'What is "кім" in English?',
        options: ['Where', 'When', 'Who', 'What'],
        correctAnswer: 2
      },
      {
        question: 'How do you say "What are you doing?" in Kazakh?',
        options: ['Сіз не істейсіз?', 'Сіз қайда бардыңыз?', 'Сіз қашан келдіңіз?', 'Сіз кімсіз?'],
        correctAnswer: 0
      },
      {
        question: 'What does "неге" mean?',
        options: ['Where', 'When', 'Why', 'How'],
        correctAnswer: 2
      },
      {
        question: 'How do you form a yes/no question?',
        options: ['Add -ма/-ме', 'Use question word', 'Change intonation', 'All of the above'],
        correctAnswer: 3
      }
    ],
    vocabularyCards: [
      'Қайда - Where',
      'Қашан - When',
      'Кім - Who',
      'Не - What',
      'Неге - Why',
      'Қалай - How',
      'Қанша - How much/many',
      'Қайсы - Which'
    ],
    skills: ['grammar', 'speaking', 'listening']
  },
  {
    title: 'Possessive Forms',
    level: 'A2',
    duration: 22,
    grammarText: 'Possessive forms in Kazakh use suffixes: "-ым/-ім" (my), "-ың/-ің" (your), "-ы/-і" (his/her), "-ымыз/-іміз" (our), "-ыңдар/-іңдер" (your plural), "-ы/-і" (their). These attach to the noun: "кітабым" (my book), "кітабың" (your book).',
    example: 'Менің кітабым (My book). Сіздің кітабыңыз (Your book). Оның кітабы (His/her book).',
    audioUrl: '/audio/possessive.mp3',
    testQuestions: [
      {
        question: 'What is "my book" in Kazakh?',
        options: ['Кітабым', 'Кітабың', 'Кітабы', 'Кітабымыз'],
        correctAnswer: 0
      },
      {
        question: 'How do you say "your book" (formal) in Kazakh?',
        options: ['Кітабың', 'Кітабыңыз', 'Кітабы', 'Кітабымыз'],
        correctAnswer: 1
      },
      {
        question: 'What is the possessive suffix for "my"?',
        options: ['-ым/-ім', '-ың/-ің', '-ы/-і', '-ымыз/-іміз'],
        correctAnswer: 0
      },
      {
        question: 'How do you say "our house" in Kazakh?',
        options: ['Үйім', 'Үйің', 'Үйі', 'Үйіміз'],
        correctAnswer: 3
      },
      {
        question: 'What does "кітабы" mean?',
        options: ['My book', 'Your book', 'His/her book', 'Our book'],
        correctAnswer: 2
      },
      {
        question: 'What is the possessive suffix for "their"?',
        options: ['-ым/-ім', '-ың/-ің', '-ы/-і', '-ымыз/-іміз'],
        correctAnswer: 2
      }
    ],
    vocabularyCards: [
      'Менің - My',
      'Сіздің - Your (formal)',
      'Оның - His/Her',
      'Біздің - Our',
      'Сіздердің - Your (plural)',
      'Олардың - Their',
      'Кітабым - My book',
      'Үйіңіз - Your house'
    ],
    skills: ['grammar', 'vocabulary']
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Clear existing lessons
    await Lesson.deleteMany({});
    console.log('🗑️  Cleared existing lessons');
    
    // Insert seed data
    await Lesson.insertMany(lessons);
    console.log(`✅ Seeded ${lessons.length} lessons`);
    
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

