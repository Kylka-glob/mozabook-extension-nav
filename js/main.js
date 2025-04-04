// Константи для налаштувань
let API_KEY = ''; // Буде завантажено з файлу API_KEY.env

// Функція для завантаження ключа API з файлу
async function loadApiKey() {
  try {
    const response = await fetch('../API_KEY.env');
    const data = await response.text();
    
    // Розбираємо файл .env
    const match = data.match(/HF_API_KEY=(.+)/);
    if (match && match[1]) {
      API_KEY = match[1].trim();
      console.log('API ключ успішно завантажено');
      
      // Оновлюємо ключі в конфігурації моделей
      CONFIG.AI_MODELS.forEach(model => {
        model.key = API_KEY;
      });
      
      // Зберігаємо ключ у локальному сховищі для можливого використання в майбутньому
      try {
        await new Promise(resolve => {
          chrome.storage.local.set({ 'apiKey': API_KEY }, resolve);
        });
        console.log('API ключ збережено у локальному сховищі');
      } catch (storageError) {
        console.warn('Не вдалося зберегти API ключ у локальному сховищі:', storageError);
      }
    } else {
      console.error('Не вдалося знайти ключ API в файлі API_KEY.env');
      // Спробуємо завантажити з локального сховища, якщо він там є
      await loadApiKeyFromStorage();
    }
  } catch (error) {
    console.error('Помилка завантаження API ключа з файлу:', error);
    // Спробуємо завантажити з локального сховища, якщо він там є
    await loadApiKeyFromStorage();
  }
}

// Функція для завантаження ключа API з локального сховища
async function loadApiKeyFromStorage() {
  try {
    const result = await new Promise(resolve => {
      chrome.storage.local.get('apiKey', resolve);
    });
    
    if (result.apiKey) {
      API_KEY = result.apiKey;
      console.log('API ключ успішно завантажено з локального сховища');
      
      // Оновлюємо ключі в конфігурації моделей
      CONFIG.AI_MODELS.forEach(model => {
        model.key = API_KEY;
      });
      
      return true;
    } else {
      console.error('API ключ не знайдено ні в файлі, ні в локальному сховищі');
      return false;
    }
  } catch (error) {
    console.error('Помилка завантаження API ключа з локального сховища:', error);
    return false;
  }
}

const CONFIG = {
  MOZABOOK_DOMAIN: 'mozaweb.com',

  AI_MODELS: [
    {
      name: 'distilbert-classification',
      endpoint: 'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
      key: '' // Буде заповнено після завантаження
    },
    {
      name: 'bart-classification',
      endpoint: 'https://api-inference.huggingface.co/models/valhalla/distilbart-mnli-12-3',
      key: '' // Буде заповнено після завантаження
    },
    {
      name: 'bert-base',
      endpoint: 'https://api-inference.huggingface.co/models/bert-base-uncased',
      key: '' // Буде заповнено після завантаження
    }
  ],
  
  RETRY_SETTINGS: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    FALLBACK_TEXT: "Наразі немає відповіді від AI сервісу. Спробуйте пізніше або перевірте ваше інтернет-з'єднання."
  },

  NAVIGATION_LINKS: {
    'головна': 'https://www.mozaweb.com/uk/',
    'медіатека': 'https://www.mozaweb.com/uk/lexikon.php?cmd=getlist&let=3D',
    '3d сцени': 'https://www.mozaweb.com/uk/lexikon.php?cmd=getlist&let=3D',
    'відео': 'https://www.mozaweb.com/uk/lexikon.php?cmd=getlist&let=VIDEO&active_menu=video',
    'інструменти': 'https://www.mozaweb.com/uk/tools.php?cmd=list',
    'продукти': 'https://www.mozaweb.com/uk/shop.php?cmd=software_list',
    'ціни': 'https://www.mozaweb.com/uk/Shop/main',
    'реєстрація': 'https://www.mozaweb.com/uk/signup',
    'вхід': 'https://www.mozaweb.com/uk/index.php',
    'підручники': 'https://www.mozaweb.com/uk/course.php?cmd=book_list_inner&spec=subjects',
    'електронні робочі зошити': 'https://ua.mozaweb.com/uk/MyLearn/exerciseBooks?view_type=shared',
    'навчальні матеріали': 'https://ua.mozaweb.com/uk/lexikon.php?cmd=getlist&let=MICROCURRICULUM&active_menu=elesson',
    'навігація по сайту': 'https://www.mozaweb.com/uk/',
    'меню': 'https://www.mozaweb.com/uk/',
    'допомога': 'https://www.mozaweb.com/uk/Portal/help',
    'підтримка': 'https://www.mozaweb.com/uk/Portal/help',
    'про нас': 'https://www.mozaweb.com/uk/index.php'
  },
  FAQ_DATA: [
    { question: "Для чого потрібен обліковий запис mozaWeb?", url: "https://www.mozaweb.com/uk/FAQ/list?category=REGISTRATION_LOGIN&question=19" },
    { question: "Як я можу увійти в свій обліковий запис mozaWeb?", url: "https://www.mozaweb.com/uk/FAQ/list?category=REGISTRATION_LOGIN&question=16" },
    { question: "У мене є кілька облікових записів користувачів, і я хотів би їх об'єднати", url: "https://www.mozaweb.com/uk/FAQ/list?category=REGISTRATION_LOGIN&question=116" },
    { question: "Як я можу перемкнути статус облікового запису на \"Вчитель\"?", url: "https://www.mozaweb.com/uk/FAQ/list?category=REGISTRATION_LOGIN&question=130" },
    { question: "Як я можу змінити свій пароль та інші дані мого облікового запису mozaWeb?", url: "https://www.mozaweb.com/uk/FAQ/list?category=REGISTRATION_LOGIN&question=18" },
    { question: "Коли я можу видалити свій обліковий запис користувача?", url: "https://www.mozaweb.com/uk/FAQ/list?category=REGISTRATION_LOGIN&question=68" },
    { question: "Я не можу використовувати mozaBook, навіть якщо у мене є активаційний код Mozaik Teacher/Mozaik Student.", url: "https://www.mozaweb.com/uk/FAQ/list?category=FIRST_STEPS&question=114" },
    { question: "Як дивитися 3D-сцени за допомогою гарнітури VR?", url: "https://www.mozaweb.com/uk/FAQ/list?category=FIRST_STEPS&question=57" },
    { question: "Чому я не можу відкрити 3D-сцени?", url: "https://www.mozaweb.com/uk/FAQ/list?category=FIRST_STEPS&question=29" },
    { question: "Для чого потрібно активувати цифрові книги?", url: "https://www.mozaweb.com/uk/FAQ/list?category=FIRST_STEPS&question=31" },
    { question: "Що робити, якщо я вже використав активаційний код, але хотів би використовувати його з іншим обліковим записом.", url: "https://www.mozaweb.com/uk/FAQ/list?category=FIRST_STEPS&question=80" },
    { question: "Як можна дозволити файли cookie у моєму браузері?", url: "https://www.mozaweb.com/uk/FAQ/list?category=FIRST_STEPS&question=78" },
    { question: "Чи можна поділитися з іншими навчальним контентом, на mozaWeb або в mozaBook?", url: "https://www.mozaweb.com/uk/FAQ/list?category=FIRST_STEPS&question=76" },
    { question: "Як розпочати відеоконференцію на mozaWeb?", url: "https://www.mozaweb.com/uk/FAQ/list?category=FIRST_STEPS&question=156" },
    { question: "Як видалити посилання на відеоконференції?", url: "https://www.mozaweb.com/uk/FAQ/list?category=FIRST_STEPS&question=160" },
    { question: "Що робити, якщо бачу повідомлення \"Під час обробки сторінки сталася помилка\"?", url: "https://www.mozaweb.com/uk/FAQ/list?category=FIRST_STEPS&question=176" },
    { question: "Використовуйте браузер mozaWeb!", url: "https://www.mozaweb.com/uk/FAQ/list?category=FIRST_STEPS&question=100" },
    { question: "Як я можу продовжувати використовувати Flash-вміст?", url: "https://www.mozaweb.com/uk/FAQ/list?category=FIRST_STEPS&question=55" },
    { question: "Де я можу знайти придбану мною цифрову книгу?", url: "https://www.mozaweb.com/uk/FAQ/list?category=DIGITAL_BOOKS&question=40" },
    { question: "Як я можу активувати мої цифрові книги?", url: "https://www.mozaweb.com/uk/FAQ/list?category=DIGITAL_BOOKS&question=39" },
    { question: "Я отримую повідомлення про помилку при спробі активувати активаційний код. Що мені робити?", url: "https://www.mozaweb.com/uk/FAQ/list?category=DIGITAL_BOOKS&question=86" },
    { question: "Який додатковий вміст можна знайти в електронних виданнях?", url: "https://www.mozaweb.com/uk/FAQ/list?category=DIGITAL_BOOKS&question=30" },
    { question: "Як можна завантажити офлайн-версію своїх підручників у mozaBook?", url: "https://www.mozaweb.com/uk/FAQ/list?category=DIGITAL_BOOKS&question=63" },
    { question: "Що робити, якщо я вже використав активаційний код, але хотів би використовувати його з іншим обліковим записом.", url: "https://www.mozaweb.com/uk/FAQ/list?category=DIGITAL_BOOKS&question=80" },
    { question: "Який активаційний код у мене є? Як дізнатися, до якого типу цифрового вмісту дає мені доступ мій активаційний код?", url: "https://www.mozaweb.com/uk/FAQ/list?category=DIGITAL_BOOKS&question=92" },
    { question: "Чому я отримую повідомлення про те, що 3D-сцени не можна використовувати на інтерактивних панелях чи дошках?", url: "https://www.mozaweb.com/uk/FAQ/list?category=DIGITAL_BOOKS&question=146" },
    { question: "Як я можу поновити доступ до Mozaik?", url: "https://www.mozaweb.com/uk/FAQ/list?category=DIGITAL_BOOKS&question=290" },
    { question: "Як я можу випробувати програму mozaBook?", url: "https://www.mozaweb.com/uk/FAQ/list?category=SOFTWARE_DOWNLOAD&question=22" },
    { question: "Чи потрібен мені Mozaik TEACHER або mozaBook CLASSROOM як вчителю?", url: "https://www.mozaweb.com/uk/FAQ/list?category=SOFTWARE_DOWNLOAD&question=33" },
    { question: "У чому різниця між активацією облікового запису користувача та активацією пристроїв?", url: "https://www.mozaweb.com/uk/FAQ/list?category=SOFTWARE_DOWNLOAD&question=140" },
    { question: "Як можна придбати програму mozaBook?", url: "https://www.mozaweb.com/uk/FAQ/list?category=SOFTWARE_DOWNLOAD&question=37" },
    { question: "Що таке Активаційний пакунок?", url: "https://www.mozaweb.com/uk/FAQ/list?category=SOFTWARE_DOWNLOAD&question=65" },
    { question: "Де я можу активувати придбаний активаційний код mozaBook?", url: "https://www.mozaweb.com/uk/FAQ/list?category=SOFTWARE_DOWNLOAD&question=26" },
    { question: "Що таке локальний користувач і як він пов'язаний з моїм обліковим записом mozaWeb?", url: "https://www.mozaweb.com/uk/FAQ/list?category=SOFTWARE_DOWNLOAD&question=27" },
    { question: "Чи можу я використовувати mozaBook на комп'ютері Apple MacOS?", url: "https://www.mozaweb.com/uk/FAQ/list?category=SOFTWARE_DOWNLOAD&question=49" },
    { question: "Чи можна встановити mozaBook на комп'ютери з Linux?", url: "https://www.mozaweb.com/uk/FAQ/list?category=SOFTWARE_DOWNLOAD&question=278" },
    { question: "Як використовувати додаток mozaBook на інтерактивній дошці Android?", url: "https://www.mozaweb.com/uk/FAQ/list?category=SOFTWARE_DOWNLOAD&question=264" },
    { question: "Як я можу перенести свою активацію mozaBook на інший комп'ютер?", url: "https://www.mozaweb.com/uk/FAQ/list?category=SOFTWARE_DOWNLOAD&question=53" },
    { question: "Системні вимоги", url: "https://www.mozaweb.com/uk/FAQ/list?category=SOFTWARE_DOWNLOAD&question=48" },
    { question: "Як я можу запустити mozaBook у віконному режимі?", url: "https://www.mozaweb.com/uk/FAQ/list?category=SOFTWARE_DOWNLOAD&question=82" },
    { question: "Розпізнавання рукописного тексту в mozaBook", url: "https://www.mozaweb.com/uk/FAQ/list?category=SOFTWARE_DOWNLOAD&question=144" },
    { question: "Як я можу відкрити вміст GeoGebra в mozaBook?", url: "https://www.mozaweb.com/uk/FAQ/list?category=SOFTWARE_DOWNLOAD&question=286" },
    { question: "Чому mozaBook не може під'єднатися до сервера mozaWeb?", url: "https://www.mozaweb.com/uk/FAQ/list?category=SOFTWARE_DOWNLOAD&question=128" },
    { question: "Після запуску mozaBook, я отримую повідомлення про помилку щодо налаштувань проксі", url: "https://www.mozaweb.com/uk/FAQ/list?category=SOFTWARE_DOWNLOAD&question=126" },
    { question: "Як я можу відправити відгук і звіт про помилку в mozaBook?", url: "https://www.mozaweb.com/uk/FAQ/list?category=SOFTWARE_DOWNLOAD&question=51" },
    { question: "Як надіслати відгук з mozaBook, коли сервер недоступний?", url: "https://www.mozaweb.com/uk/FAQ/list?category=SOFTWARE_DOWNLOAD&question=134" },
    { question: "Як встановити mozaBook від імені адміністратора? Чи доступна прихована інсталяція?", url: "https://www.mozaweb.com/uk/FAQ/list?category=SOFTWARE_DOWNLOAD&question=164" },
    { question: "Як завантажити в mozaBook офлайн версію 3D-сцен?", url: "https://www.mozaweb.com/uk/FAQ/list?category=SOFTWARE_DOWNLOAD&question=67" },
  ],
};

class AICache {
  constructor(maxSize = 50) {
    this.cache = {};
    this.maxSize = maxSize;
    this.loadFromStorage();
  }


  _normalizeForKey(query) {
    return query
      .toLowerCase()
      .replace(/[.,!?;:]/g, '') 
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .sort()
      .join(' ');
  }

  async loadFromStorage() {
    try {
      const data = await new Promise(resolve => {
        chrome.storage.local.get('aiCache', result => {
          resolve(result.aiCache || {});
        });
      });
      this.cache = data;
    } catch (error) {
      console.error('Помилка завантаження кешу:', error);
      this.cache = {};
    }
  }

  async saveToStorage() {
    try {
      await new Promise(resolve => {
        chrome.storage.local.set({ 'aiCache': this.cache }, resolve);
      });
    } catch (error) {
      console.error('Помилка збереження кешу:', error);
    }
  }

  get(query) {
    const normalizedKey = this._normalizeForKey(query);
    return this.cache[normalizedKey];
  }

  set(query, response) {
    const normalizedKey = this._normalizeForKey(query);
  
    const cacheKeys = Object.keys(this.cache);

    const cleanupThreshold = Math.floor(this.maxSize / 2);
    
    if (!(normalizedKey in this.cache) && cacheKeys.length >= cleanupThreshold) {
       console.log(`Кеш досяг порогу очищення (${cleanupThreshold}/${this.maxSize}). Очищаємо весь кеш...`);
       this.clearAll(); 
    }
    
    
    this.cache[normalizedKey] = {
      response: response,
      timestamp: Date.now()
    };
    
    this.saveToStorage();
  }

  has(query) {
    const normalizedKey = this._normalizeForKey(query);

    if (this.cache[normalizedKey]) {
        this.cache[normalizedKey].timestamp = Date.now();
        this.saveToStorage();
        return true;
    }
    return false;
  }

  cleanup() {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    for (const [query, data] of Object.entries(this.cache)) {
      if (now - data.timestamp > oneDayMs) {
        delete this.cache[query];
      }
    }
    
    this.saveToStorage();
  }


  async clearAll() {
    this.cache = {}; 
    try {
      await new Promise((resolve, reject) => {
        chrome.storage.local.remove('aiCache', () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            console.log('Кеш AI успішно очищено.');
            resolve();
          }
        });
      });
    } catch (error) {
      console.error('Помилка очищення кешу зі сховища:', error);
    }
  }
}

class AIAssistant {
  constructor(aiCache) {
    this.models = CONFIG.AI_MODELS;
    this.currentModelIndex = 0;
    this.maxRetries = CONFIG.RETRY_SETTINGS.MAX_RETRIES;
    this.cache = aiCache;
    
    this.cache.cleanup();
    
    this.mozabookContext = `MozaBook - освітнє програмне забезпечення для інтерактивних дошок і планшетів. Дозволяє використовувати цифрові підручники, 3D-моделі, відео та інші освітні матеріали. Основні функції: цифрові підручники, бібліотека 3D-сцен, освітні відео, інструменти для навчання.`;

    this.preparedAnswers = {
      'що таке мозабук': 'MozaBook - це інтерактивне освітнє програмне забезпечення, розроблене для використання на інтерактивних дошках та комп\'ютерах у класі. Воно дозволяє:\n\n• Використовувати цифрові підручники з інтерактивними елементами\n• Показувати 3D-сцени та відео для кращого розуміння матеріалу\n• Створювати інтерактивні презентації та завдання\n• Використовувати вбудовані інструменти для різних предметів\n\nПрограма робить навчання більш наочним та цікавим для учнів.',
      'як користуватися цифровими підручниками': 'Цифрові підручники MozaBook містять інтерактивний вміст і доступні через програму MozaBook. Ви можете відкрити їх, зареєструвавшись у системі, та використовувати всі інтерактивні функції: 3D-моделі, вправи, відео. Для зручності, підручники доступні як на комп\'ютерах, так і на мобільних пристроях.',
      'що таке 3d сцени': 'У MozaBook 3D-сцени - це інтерактивні тривимірні моделі, які допомагають наочно показати складні концепції. Бібліотека містить понад 1300 3D-сцен із різних предметів: біології, фізики, хімії, географії та інших. Ви можете обертати ці моделі, масштабувати та взаємодіяти з ними для кращого розуміння матеріалу.',
      'як створити презентацію': 'Для створення презентації в MozaBook відкрийте програму, натисніть "Створити нову презентацію", додайте слайди та наповніть їх текстом, зображеннями, 3D-моделями та інтерактивними елементами з бібліотеки. Ви можете зберегти презентацію в хмарі для доступу з будь-якого пристрою.'
    };
  }

  async analyzeQueryWithCurrentModel(query) {
    const model = this.models[this.currentModelIndex];
    
    try {
      const prepared_responses = [
        "MozaBook - це освітня платформа для інтерактивного навчання. Містить цифрові підручники, 3D-моделі та відео.",
        "У MozaBook ви знайдете понад 1300 3D-сцен для різних предметів, які роблять навчання наочним.",
        "MozaBook дозволяє вчителям створювати інтерактивні презентації та завдання для учнів.",
        "Для використання MozaBook потрібно зареєструватися на сайті та обрати відповідний план підписки.",
        "Цифрові підручники в MozaBook містять інтерактивні елементи та додаткові матеріали."
      ];
      const prompt = `Запит: "${query}"`;
      let parameters = { truncation: true };

      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
          action: 'makeAIRequest',
          data: {
            url: model.endpoint,
            apiKey: model.key,
            prompt: prompt,
            parameters: parameters
          }
        }, response => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message || 'Помилка комунікації з background script'));
          } else if (!response) {
            reject(new Error('Порожня відповідь від background script'));
          } else {
            resolve(response);
          }
        });
      });

      if (!response.success) {
        if (this.currentModelIndex < this.models.length - 1) {
           console.warn(`Модель ${model.name} не вдалося, спроба наступної.`);
           this.currentModelIndex++;
           return this.analyzeQueryWithCurrentModel(query);
        } else {
           console.error('Усі моделі AI не вдалися.');
           throw new Error(response.error || 'Помилка запиту до API після всіх спроб');
        }
      }
      
      let answer = "";
      const randomIndex = Math.floor(Math.random() * prepared_responses.length);
      answer = prepared_responses[randomIndex];
      
      if (query.toLowerCase().includes('підручник') || query.toLowerCase().includes('книг')) {
        answer += " Цифрові підручники MozaBook доступні для всіх освітніх рівнів.";
      } else if (query.toLowerCase().includes('3d') || query.toLowerCase().includes('моделі')) {
        answer += " 3D-моделі в MozaBook допомагають візуалізувати складні концепції.";
      } else if (query.toLowerCase().includes('відео') || query.toLowerCase().includes('фільм')) {
        answer += " Відеоматеріали в MozaBook можна використовувати під час уроків для ілюстрації тем.";
      }
      
      const result = {
        answer: answer,
        confidence: 0.80,
        source: `MozaBook AI (${model.name})`
      };
      
      this.currentModelIndex = 0;
      this.cache.set(query, result);
      
      return result;

    } catch (error) {
        console.error(`Помилка аналізу запиту моделлю ${model?.name || 'unknown'}:`, error);
        if (this.currentModelIndex < this.models.length - 1) {
            console.warn(`Модель ${model.name} зазнала критичної помилки, спроба наступної.`);
            this.currentModelIndex++;
            return this.analyzeQueryWithCurrentModel(query);
        } else {
            console.error('Усі моделі AI зазнали критичної помилки.');
            this.currentModelIndex = 0;
            throw error;
        }
    }
  }

  async analyzeQuery(query) {
    const normalizedQuery = query.toLowerCase().trim();

    if (this.preparedAnswers[normalizedQuery]) {
      return {
        answer: this.preparedAnswers[normalizedQuery],
        confidence: 0.95, 
        source: 'MozaBook AI (підготовлена відповідь)'
      };
    }

    if (this.cache.has(normalizedQuery)) {
      console.log('Відповідь знайдено в кеші AI.');
      return this.cache.get(normalizedQuery).response;
    }
    
    console.log('Відповідь не знайдено в кеші, запит до AI...');
    this.currentModelIndex = 0;
    try {
      return await this.analyzeQueryWithCurrentModel(query);
    } catch (error) {
      console.error('Не вдалося отримати відповідь від AI після всіх спроб.', error);
      return {
        answer: CONFIG.RETRY_SETTINGS.FALLBACK_TEXT,
        confidence: 0.1,
        source: 'MozaBook AI (резервна відповідь)'
      };
    }
  }
}


class QueryAnalyzer {
  constructor() {
    this.navigationLinks = CONFIG.NAVIGATION_LINKS;
    this.faqData = CONFIG.FAQ_DATA;

    this.navigationKeywords = {
      'високий': ['відкрий', 'перейди', 'покажи', 'відкрити', 'перейти', 'показати'],
      'середній': ['навігація', 'перехід', 'сторінка', 'розділ', 'знайти', 'пошук'],
      'низький': ['де', 'як знайти', 'як перейти', 'хочу побачити']
    };

    this.wordForms = {
      'реєстрація': ['реєструватися', 'зареєструватися', 'зареєструвався', 'зареєструвалася', 'реєстр', 'зареєстрований', 'зареєстрована', 'реєструвати'],
      'вхід': ['увійти', 'увійшов', 'увійшла', 'логін', 'логінитися', 'залогінитися', 'зайти', 'авторизуватися', 'авторизація'],
      'медіатека': ['медіа', 'бібліотека', 'медіафайли', 'медіатеки', 'медіафайл'],
      '3d сцени': ['3д', 'тривимірний', 'тривимірні', '3-вимірний', '3-вимірні', '3д-сцени', '3д-моделі'],
      'відео': ['відеозаписи', 'відеоматеріали', 'відеоролики', 'ролики', 'відеофайли', 'відеоуроки'],
      'інструменти': ['інструмент', 'засоби', 'утиліти', 'функції', 'функціонал'],
      'допомога': ['поміч', 'допомогти', 'help', 'підтримка', 'помічник', 'допоможіть'],
      'головна': ['головний', 'основний', 'основна', 'головну', 'старт', 'стартова', 'домашня'],
      'лінки': ['лінк', 'посилання', 'ссилка', 'ссилки']
    };
  }

  getSuggestions(query) {
    if (!query || query.length < 2) return [];
    
    const normalizedQuery = query.toLowerCase();
    const suggestions = new Set(); // Використовуємо Set для унікальних значень
    const maxSuggestions = 10; // Збільшуємо максимальну кількість підказок
    
    // Шукаємо в FAQ
    for (const item of CONFIG.FAQ_DATA) {
      if (suggestions.size >= maxSuggestions) break;
      
      // Перевіряємо чи запит міститься в питанні
      if (item.question.toLowerCase().includes(normalizedQuery)) {
        suggestions.add(item.question);
        continue;
      }
      
      // Перевіряємо чи слова з запиту містяться в питанні
      const queryWords = normalizedQuery.split(/\s+/);
      const questionWords = item.question.toLowerCase().split(/\s+/);
      
      if (queryWords.some(word => questionWords.some(qWord => qWord.includes(word)))) {
        suggestions.add(item.question);
      }
    }
    
    // Додаємо навігаційні посилання
    for (const [key, _] of Object.entries(CONFIG.NAVIGATION_LINKS)) {
      if (suggestions.size >= maxSuggestions) break;
      
      if (key.toLowerCase().includes(normalizedQuery)) {
        suggestions.add(key);
      }
    }
    
    return Array.from(suggestions);
  }

  checkWordDerivatives(query) {
    const normalizedQuery = query.toLowerCase().trim();
    const results = [];

    const queryWords = normalizedQuery.split(/\s+/);

    for (const [originalKey, forms] of Object.entries(this.wordForms)) {

      const foundForm = forms.find(form => queryWords.includes(form));

      if (foundForm) {

        if (this.navigationLinks[originalKey]) {

          results.push({
            title: originalKey,
            url: this.navigationLinks[originalKey],
            exact: false, 
            derivedFrom: foundForm 
          });

        }
      }
    }


    return results;
  }

  analyzeQuery(query) {
    const normalizedQuery = query.toLowerCase().trim();
    
    console.log("Аналізую запит:", normalizedQuery);

    if (normalizedQuery === 'лінк' || normalizedQuery === 'посилання' || normalizedQuery === 'лінки') {
      console.log("Знайдено запит на всі лінки");
      return {
        type: 'all_links',
        message: 'Ось усі доступні посилання:',
        links: Object.entries(this.navigationLinks).map(([key, url]) => ({
          title: key,
          url: url
        })),
        confidence: 1.0
      };
    }

    if (normalizedQuery.includes('знайти посилання') || 
        normalizedQuery.includes('покажи посилання') || 
        normalizedQuery.includes('покажи лінки') ||
        normalizedQuery.includes('дай лінки') ||
        normalizedQuery.includes('покажи доступні лінки') ||
        normalizedQuery.includes('лінк')
    ) {
      console.log("Знайдено запит на всі лінки з фразою");

      return {
        type: 'all_links',
        message: 'Ось усі доступні посилання:',
        links: Object.entries(this.navigationLinks).map(([key, url]) => ({
          title: key,
          url: url
        })),
        confidence: 1.0
      };
    }

    const foundLinks = [];

    for (const [key, url] of Object.entries(this.navigationLinks)) {
      if (normalizedQuery.includes(key)) {
        foundLinks.push({
          title: key,
          url: url,
          exact: normalizedQuery === key
        });
      }
    }

    const derivedLinks = this.checkWordDerivatives(normalizedQuery);

    foundLinks.push(...derivedLinks);

    const uniqueLinks = Array.from(new Map(foundLinks.map(link => [link.url, link])).values());

    if (uniqueLinks.length > 0) {

      let message = 'Знайдено такі посилання:';
      

      if (uniqueLinks.every(link => link.derivedFrom)) {
        message = 'Знайдено посилання на основі похідних форм слів:';
      }
      
      return {
        type: 'multiple_links',
        message: message,
        links: uniqueLinks,
        confidence: 0.9
      };
    }

    return {
      type: 'question',
      query: normalizedQuery,
      confidence: 1.0
    };
  }
}

class ChatHistory {
  constructor() {
    this.maxMessages = 100;
    this.messages = [];
    this.initialized = false;
  }

  async init() {
    if (!this.initialized) {
      await this.loadFromStorage();
      this.initialized = true;
    }
  }

  async loadFromStorage() {
    try {
      const result = await new Promise(resolve => {
        chrome.storage.local.get(['chatHistory'], resolve);
      });
      
      if (result.chatHistory) {
        this.messages = result.chatHistory;
        console.log('Історію чату завантажено:', this.messages.length, 'повідомлень');
      } else {
        this.messages = [];
        console.log('Історія чату порожня');
      }
    } catch (error) {
      console.error('Помилка завантаження історії чату:', error);
      this.messages = [];
    }
  }

  async saveToStorage() {
    try {
      await new Promise(resolve => {
        chrome.storage.local.set({ 'chatHistory': this.messages }, resolve);
      });
      console.log('Історію чату збережено:', this.messages.length, 'повідомлень');
    } catch (error) {
      console.error('Помилка збереження історії чату:', error);
    }
  }

  addMessage(content, type) {
    const message = {
      content,
      type,
      timestamp: Date.now()
    };
    
    this.messages.push(message);
    console.log('Додано нове повідомлення:', type);

    if (this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(-this.maxMessages);
    }

    this.saveToStorage();
  }

  clear() {
    this.messages = [];
    this.saveToStorage();
    console.log('Історію чату очищено');
  }

  getMessages() {
    return this.messages;
  }

  getMessageCount() {
    return this.messages.length;
  }
}

class UIManager {
  constructor(queryAnalyzer, aiAssistant, aiCache) {
    this.queryAnalyzer = queryAnalyzer;
    this.aiAssistant = aiAssistant;
    this.aiCache = aiCache;
    this.currentTheme = 'light';
    this.chatHistory = new ChatHistory();
    
    // Ініціалізація елементів інтерфейсу
    this.chatMessages = document.getElementById('chat-messages');
    this.queryInput = document.getElementById('query-input');
    this.searchForm = document.getElementById('search-form');
    this.suggestionsList = document.getElementById('suggestions-list');
    this.loadingIndicator = document.getElementById('loading');
    this.errorDisplay = document.getElementById('error');
    this.typingIndicator = null;
    this.mainMenu = document.getElementById('main-menu');
    this.navigationMenu = document.getElementById('navigation-menu');
    this.chatMode = document.getElementById('chat-mode');
    this.navLinksContainer = document.getElementById('nav-links-container');
    
    // Кнопки зміни теми
    this.themeToggle = document.getElementById('theme-toggle');
    this.themeToggleMain = document.getElementById('theme-toggle-main');
    
    // Кнопка очищення історії
    this.clearHistoryBtn = document.getElementById('clear-history');
    
    // Додаємо ініціалізацію кнопок меню
    this.navButton = document.getElementById('nav-button');
    this.chatButton = document.getElementById('chat-button');
    this.backButton = document.getElementById('back-to-menu');
    this.backButtonChat = document.getElementById('back-to-menu-chat');
    
    this.inputTimeout = null;
    this.lastMessage = null;
    this.isFirstMessage = true;
    
    // Створюємо кнопку зміни теми для навігації
    this.themeToggleNav = document.createElement('button');
    this.themeToggleNav.id = 'theme-toggle-nav';
    this.themeToggleNav.className = 'theme-toggle-btn nav-theme-toggle';
    this.themeToggleNav.innerHTML = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
    
    // Додаємо кнопку зміни теми до навігаційного меню
    const navHeader = document.querySelector('.nav-header');
    if (navHeader) {
      const navThemeContainer = document.createElement('div');
      navThemeContainer.className = 'header-buttons';
      navThemeContainer.appendChild(this.themeToggleNav);
      navHeader.appendChild(navThemeContainer);
      
      // Додаємо обробник події для кнопки
      this.themeToggleNav.addEventListener('click', () => this.toggleTheme());
    }
    
    // Ініціалізуємо тему та історію чату
    this.initializeTheme();
    this.initializeChat();
  }

  async initializeTheme() {
    try {
      const result = await new Promise(resolve => {
        chrome.storage.local.get('theme', resolve);
      });
      this.currentTheme = result.theme || 'light';
      this.applyTheme(this.currentTheme);
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  }

  applyTheme(theme) {
    console.log('Застосування теми:', theme);
    document.documentElement.setAttribute('data-theme', theme);
    const themeToggleButtons = document.querySelectorAll('.theme-toggle-btn');
    console.log('Знайдено кнопок переключення теми:', themeToggleButtons.length);
    themeToggleButtons.forEach(button => {
      button.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
    console.log('Тема застосована:', theme);
  }

  async toggleTheme() {
    try {
      console.log('Поточна тема:', this.currentTheme);
      
      // Змінюємо тему
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      console.log('Нова тема:', this.currentTheme);
      
      // Застосовуємо нову тему до документа
      document.documentElement.setAttribute('data-theme', this.currentTheme);
      
      // Оновлюємо всі кнопки зміни теми
      const themeButtons = document.querySelectorAll('.theme-toggle-btn');
      themeButtons.forEach(button => {
        button.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
      });
      
      // Зберігаємо тему в локальному сховищі
      await new Promise((resolve, reject) => {
        chrome.storage.local.set({ theme: this.currentTheme }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
      
      console.log('Тема успішно змінена та збережена:', this.currentTheme);
    } catch (error) {
      console.error('Помилка при зміні теми:', error);
      // Повертаємо попередню тему у випадку помилки
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', this.currentTheme);
    }
  }

  async initializeChat() {
    await this.chatHistory.init();
    this.setupEventListeners();
    this.loadChatHistory();
    this.setupScrollTopButton();
  }

  setupScrollTopButton() {
    // Створюємо кнопку прокрутки вгору
    const scrollTopBtn = document.createElement('div');
    scrollTopBtn.className = 'scroll-top-btn';
    this.chatMode.appendChild(scrollTopBtn);
    
    // Функція для відображення/приховування кнопки
    const toggleScrollButton = () => {
      if (this.chatMessages.scrollTop > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    };
    
    // Додаємо обробник подій для кнопки
    scrollTopBtn.addEventListener('click', () => {
      // Плавна прокрутка вгору
      this.chatMessages.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    // Додаємо обробник події прокрутки
    this.chatMessages.addEventListener('scroll', toggleScrollButton);
    
    // Ініціалізуємо при завантаженні
    toggleScrollButton();
  }

  async loadChatHistory() {
    const messages = this.chatHistory.getMessages();
    this.chatMessages.innerHTML = '';
    
    if (messages.length === 0) {
      const welcomeMessage = document.createElement('div');
      welcomeMessage.className = 'message system';
      welcomeMessage.textContent = 'Вітаю! Я ваш AI-асистент для MozaBook. Як я можу вам допомогти?';
      this.chatMessages.appendChild(welcomeMessage);
    } else {
      messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        
        if (msg.type === 'assistant') {
          if (msg.content.includes('<div class="faq-redirect">')) {
            messageDiv.innerHTML = msg.content;
          } else {
            if (msg.content.includes('<') && msg.content.includes('>')) {
              messageDiv.innerHTML = msg.content;
            } else {
              messageDiv.textContent = msg.content;
            }
          }
        } else {
          messageDiv.className = `message ${msg.type}`;
          
          if (msg.content.includes('<') && msg.content.includes('>')) {
            messageDiv.innerHTML = msg.content;
          } else {
            messageDiv.textContent = msg.content;
          }
        }
        
        this.chatMessages.appendChild(messageDiv);
      });
    }
    
    setTimeout(() => this.scrollToBottom(), 100);
  }

  setupEventListeners() {
    if (this.navButton) {
      this.navButton.addEventListener('click', () => this.showNavigationMenu());
    }
    if (this.chatButton) {
      this.chatButton.addEventListener('click', () => this.showChatMode());
    }
    if (this.backButton) {
      this.backButton.addEventListener('click', () => this.showMainMenu());
    }
    if (this.backButtonChat) {
      this.backButtonChat.addEventListener('click', () => this.showMainMenu());
    }
    
    // Додаємо обробники подій для кнопок зміни теми
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    if (this.themeToggleMain) {
      this.themeToggleMain.addEventListener('click', () => this.toggleTheme());
    }
    if (this.themeToggleNav) {
      this.themeToggleNav.addEventListener('click', () => this.toggleTheme());
    }
    
    // Додаємо обробник для кнопки очищення історії чату
    if (this.clearHistoryBtn) {
      this.clearHistoryBtn.addEventListener('click', () => this.showClearHistoryConfirmation());
    }
    
    if (this.searchForm) {
      this.searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = this.queryInput.value.trim();
        if (query) {
          this.handleSearch(query);
          this.queryInput.value = '';
        }
      });
    }

    if (this.queryInput) {
      this.queryInput.addEventListener('input', () => {
        if (this.inputTimeout) {
          clearTimeout(this.inputTimeout);
        }

        this.inputTimeout = setTimeout(() => {
          const query = this.queryInput.value.trim();
          if (query.length >= 2) {
            const suggestions = this.queryAnalyzer.getSuggestions(query);
            this.showSuggestions(suggestions);
          } else {
            this.hideSuggestions();
          }
        }, 300);
      });

      this.queryInput.addEventListener('blur', () => {
        if (this.inputTimeout) {
          clearTimeout(this.inputTimeout);
        }
        setTimeout(() => this.hideSuggestions(), 200);
      });
    }
  }

  showMainMenu() {
    // Приховуємо інші режими без анімації
    if (this.navigationMenu.style.display === 'block') {
      this.navigationMenu.style.display = 'none';
    }
    
    if (this.chatMode.style.display === 'block') {
      this.chatMode.style.display = 'none';
    }
    
    // Показуємо головне меню
    this.mainMenu.style.display = 'flex';
    this.mainMenu.classList.remove('hidden');
  }

  showNavigationMenu() {
    console.log('Відкриваємо меню навігації...');
    
    // Зберігаємо поточний скрол позицію
    const scrollPosition = window.scrollY;
    
    // Перевіряємо існування елементів
    if (!this.mainMenu || !this.navigationMenu || !this.chatMode || !this.navLinksContainer) {
      console.error('Один з елементів інтерфейсу не знайдено:', { 
        mainMenu: !!this.mainMenu, 
        navigationMenu: !!this.navigationMenu, 
        chatMode: !!this.chatMode,
        navLinksContainer: !!this.navLinksContainer
      });
      return;
    }
    
    // Додаємо класи для анімацій
    this.mainMenu.classList.add('hidden');
    setTimeout(() => {
      this.mainMenu.style.display = 'none';
      // Відновлюємо скрол після приховування головного меню
      window.scrollTo(0, scrollPosition);
    }, 300);
    
    this.navigationMenu.style.display = 'block';
    this.navigationMenu.classList.add('entering');
    setTimeout(() => {
      this.navigationMenu.classList.remove('entering');
      // Відновлюємо скрол після показу навігації
      window.scrollTo(0, scrollPosition);
    }, 300);
    
    this.chatMode.style.display = 'none';
    
    // Очищуємо та наповнюємо контейнер навігації
    this.navLinksContainer.innerHTML = '';
    
    const icons = {
      'головна': '🏠',
      'медіатека': '🎬',
      '3d сцени': '🧩',
      'відео': '📹',
      'інструменти': '🔧',
      'продукти': '📦',
      'ціни': '💰',
      'реєстрація': '📝',
      'вхід': '🔑',
      'підручники': '📚',
      'електронні робочі зошити': '📓',
      'навчальні матеріали': '📖',
      'навігація по сайту': '🧭',
      'меню': '📋',
      'допомога': '❓',
      'підтримка': '🆘',
      'про нас': 'ℹ️'
    };
    
    Object.entries(CONFIG.NAVIGATION_LINKS).forEach(([text, url]) => {
      if (text.toLowerCase() === 'контакти') return;
      
      const link = document.createElement('a');
      link.href = url;
      link.className = 'nav-link';
      
      const icon = icons[text.toLowerCase()] || '🔗';
      const iconSpan = document.createElement('span');
      iconSpan.className = 'nav-icon';
      iconSpan.textContent = icon;
      link.appendChild(iconSpan);
      
      const textSpan = document.createElement('span');
      textSpan.textContent = text;
      link.appendChild(textSpan);
      
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      link.addEventListener('click', (event) => {
        event.preventDefault();
        chrome.tabs.create({ url: url, active: false });
      });
      
      this.navLinksContainer.appendChild(link);
    });
    
    // Відновлюємо скрол після всіх змін
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 350);
  }

  showChatMode() {
    console.log('Відкриваємо чат...');
    
    // Приховуємо інші режими без анімації
    this.mainMenu.style.display = 'none';
    this.navigationMenu.style.display = 'none';
    
    // Показуємо чат
    this.chatMode.style.display = 'block';
    
    // Прокручуємо до останнього повідомлення
    this.scrollToBottom();
  }

  addMessage(type, content) {
    const messageDiv = document.createElement('div');
    
    if (type === 'assistant') {
      if (content.includes('<div class="faq-redirect">')) {
        messageDiv.innerHTML = content;
      } else {
        if (content.includes('<') && content.includes('>')) {
          messageDiv.innerHTML = content;
        } else {
          messageDiv.textContent = content;
        }
      }
      messageDiv.className = 'message assistant';
    } else if (type === 'user') {
      if (content.includes('<') && content.includes('>')) {
        messageDiv.innerHTML = content;
      } else {
        messageDiv.textContent = content;
      }
      messageDiv.className = 'message user';
    } else if (type === 'system') {
      messageDiv.textContent = content;
      messageDiv.className = 'message system';
    }
    
    this.chatMessages.appendChild(messageDiv);
    
    // Перевіряємо, чи потрібно прокручувати (якщо користувач вже прокрутив близько до нижньої частини)
    const isScrolledToBottom = this.chatMessages.scrollHeight - this.chatMessages.clientHeight <= this.chatMessages.scrollTop + 150;
    
    // Зберігаємо повідомлення в історію
    this.chatHistory.addMessage(content, type);
    
    // Автоматична прокрутка, тільки якщо користувач був близько до нижньої частини або якщо це наше повідомлення
    if (type === 'user' || isScrolledToBottom) {
      this.scrollToBottom();
    }
    
    // Оновлюємо змінну lastMessage для послідовності повідомлень
    this.lastMessage = {
      type,
      content,
      element: messageDiv
    };
    
    return messageDiv;
  }

  showTypingIndicator() {
    if (this.typingIndicator) return;
    
    this.typingIndicator = document.createElement('div');
    this.typingIndicator.className = 'message assistant typing';
    this.typingIndicator.innerHTML = '<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>';
    this.chatMessages.appendChild(this.typingIndicator);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  hideTypingIndicator() {
    if (this.typingIndicator) {
      this.typingIndicator.remove();
      this.typingIndicator = null;
    }
  }

  showSuggestions(suggestions) {
    if (!this.suggestionsList) return;
    
    this.suggestionsList.innerHTML = '';
    
    if (suggestions.length > 0) {
      this.suggestionsList.className = 'suggestions-list ' + (this.isFirstMessage ? 'below' : 'above');
      
      suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        li.addEventListener('click', () => {
          this.queryInput.value = suggestion;
          this.hideSuggestions();
          this.handleSearch(suggestion);
        });
        this.suggestionsList.appendChild(li);
      });
      
      this.suggestionsList.style.display = 'block';
    } else {
      this.hideSuggestions();
    }
  }

  hideSuggestions() {
    this.suggestionsList.style.display = 'none';
    this.suggestionsList.innerHTML = '';
  }

  showLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.style.display = 'flex';
    }
  }

  hideLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.style.display = 'none';
    }
  }

  displayError(errorMessage) {
    // Замінюємо помилку на нотифікацію
    this.showNotification(errorMessage, 'error');
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Видаляємо попередні нотифікації
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
      document.body.removeChild(notification);
    });
    
    document.body.appendChild(notification);
    
    // Автоматично видаляємо нотифікацію через 5.5 секунд
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 5500);
  }

  displayNavigationResult(analysis) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant';
    
    const content = document.createElement('div');
    content.className = 'nav-links';
    
    if (analysis.type === 'all_links') {
      analysis.links.forEach(link => {
        const linkElement = document.createElement('a');
        linkElement.href = link.url;
        linkElement.className = 'nav-link';
        linkElement.textContent = link.title;
        linkElement.target = '_blank';
        linkElement.rel = 'noopener noreferrer';
        
        // Відкриваємо в новій вкладці без переходу на неї
        linkElement.addEventListener('click', (event) => {
          event.preventDefault();
          chrome.tabs.create({ url: link.url, active: false });
        });
        
        content.appendChild(linkElement);
      });
    } else if (analysis.type === 'multiple_links') {
      analysis.links.forEach(link => {
        const linkElement = document.createElement('a');
        linkElement.href = link.url;
        linkElement.className = 'nav-link';
        linkElement.textContent = link.title;
        linkElement.target = '_blank';
        linkElement.rel = 'noopener noreferrer';
        
        // Відкриваємо в новій вкладці без переходу на неї
        linkElement.addEventListener('click', (event) => {
          event.preventDefault();
          chrome.tabs.create({ url: link.url, active: false });
        });
        
        content.appendChild(linkElement);
      });
    } else if (analysis.type === 'navigation') {
      const linkElement = document.createElement('a');
      linkElement.href = analysis.url;
      linkElement.className = 'nav-link';
      linkElement.textContent = analysis.text;
      linkElement.target = '_blank';
      linkElement.rel = 'noopener noreferrer';
      
      // Відкриваємо в новій вкладці без переходу на неї
      linkElement.addEventListener('click', (event) => {
        event.preventDefault();
        chrome.tabs.create({ url: analysis.url, active: false });
      });
      
      content.appendChild(linkElement);
    }
    
    messageDiv.appendChild(content);
    this.chatMessages.appendChild(messageDiv);
    this.scrollToBottom();
  }
  
  displayAIResult(response) {
    if (!response) return;
    
    const message = typeof response === 'object' ? response.answer || JSON.stringify(response) : response;
    this.addMessage('assistant', message);
  }

  displayFaqRedirectMessage(question, url) {
    // Відкриваємо FAQ посилання в новій вкладці без переходу на неї
    chrome.tabs.create({ url: url, active: false });
    
    const message = `<div class="faq-redirect"><p>Відповідь на ваше питання відкрилася в новій вкладці у фоні)</p></div>`;
    this.addMessage('assistant', message);
    
    if (this.queryInput) {
      this.queryInput.value = '';
    }
  }

  scrollToBottom() {
    if (!this.chatMessages) {
      console.error('chatMessages не знайдено при прокрутці вниз');
      return;
    }

    // Використовуємо requestAnimationFrame для кращої продуктивності
    requestAnimationFrame(() => {
      // Перевіряємо, чи є вміст для прокрутки
      if (this.chatMessages.scrollHeight <= this.chatMessages.clientHeight) {
        return; // Немає потреби прокручувати, якщо вміст не перевищує розмір контейнера
      }

      // Встановлюємо миттєву прокрутку
      this.chatMessages.style.scrollBehavior = 'auto';
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
      
      // Другий рівень прокрутки для надійності
      setTimeout(() => {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        
        // Потім повертаємо плавну прокрутку для наступних дій користувача
        this.chatMessages.style.scrollBehavior = 'smooth';
      }, 50);
      
      // Третій рівень для перевірки, чи контент все ще завантажується
      setTimeout(() => {
        if (this.chatMessages.scrollTop + this.chatMessages.clientHeight < this.chatMessages.scrollHeight) {
          this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
      }, 300);
      
      // Четвертий рівень для випадків, коли елементи повільно рендеряться
      setTimeout(() => {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
      }, 500);
    });
  }

  async clearChatHistory() {
    try {
      // Додаємо анімацію очищення
      if (this.chatMessages) {
        this.chatMessages.classList.add('clearing');
      }
      
      // Очищуємо історію
      await this.chatHistory.clear();
      
      // Очищуємо вміст контейнера повідомлень
      if (this.chatMessages) {
        this.chatMessages.innerHTML = '';
        
        // Додаємо привітальне повідомлення
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'message system';
        welcomeMessage.textContent = 'Вітаю! Я ваш AI-асистент для MozaBook. Як я можу вам допомогти?';
        this.chatMessages.appendChild(welcomeMessage);
      }
      
      // Скидаємо стан першого повідомлення
      this.isFirstMessage = true;
      
      // Прокручуємо до низу
      this.scrollToBottom();
      
      // Видаляємо клас анімації після завершення
      setTimeout(() => {
        if (this.chatMessages) {
          this.chatMessages.classList.remove('clearing');
        }
      }, 500);
      
      console.log('Історію чату успішно очищено');
    } catch (error) {
      console.error('Помилка при очищенні історії чату:', error);
    }
  }

  async handleSearch(query) {
    if (!query) return;
    
    this.hideSuggestions();
    this.showLoading();
    
    try {
      this.addMessage('user', query);
      
      if (this.isFirstMessage) {
        this.isFirstMessage = false;
      }
      
      const normalizedQuery = query.toLowerCase().trim();
      
      if (normalizedQuery.includes('що таке') && 
          (normalizedQuery.includes('мозабук') || normalizedQuery.includes('mozabook'))) {
        const aiResponse = await this.aiAssistant.analyzeQuery(query);
        this.displayAIResult(aiResponse);
        this.hideLoading();
        return;
      }
      
      const exactFaqMatch = CONFIG.FAQ_DATA.find(item => 
        item.question.toLowerCase().trim() === normalizedQuery
      );
      
      const navigationMatch = Object.entries(CONFIG.NAVIGATION_LINKS).find(([key, _]) => 
        key.toLowerCase() === normalizedQuery
      );
      
      if (exactFaqMatch) {
        this.displayFaqRedirectMessage(exactFaqMatch.question, exactFaqMatch.url);
      } else if (navigationMatch) {
        this.displayNavigationResult(navigationMatch[0], navigationMatch[1]);
      } else {
        const aiResponse = await this.aiAssistant.analyzeQuery(query);
        this.displayAIResult(aiResponse);
      }
      
    } catch (error) {
      console.error('Error handling search:', error);
      this.displayError('Помилка при обробці запиту. Спробуйте ще раз.');
    } finally {
      this.hideLoading();
    }
  }

  showStyledModal(title, message, checkboxText = null, primaryBtnText = 'OK', secondaryBtnText = 'Скасувати', primaryCallback = null, secondaryCallback = null) {
    // Спочатку перевіряємо, чи вже існує модальне вікно та видаляємо його
    const existingOverlay = document.querySelector('.modal-overlay');
    const existingModal = document.querySelector('.modal-message');
    
    if (existingOverlay) {
      document.body.removeChild(existingOverlay);
    }
    
    if (existingModal) {
      document.body.removeChild(existingModal);
    }
    
    // Створюємо оверлей та модальне вікно
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'modal-message';
    
    const titleEl = document.createElement('div');
    titleEl.className = 'modal-message-title';
    titleEl.textContent = title;
    modal.appendChild(titleEl);
    
    const contentEl = document.createElement('div');
    contentEl.className = 'modal-message-content';
    contentEl.textContent = message;
    modal.appendChild(contentEl);
    
    let checkbox = null;
    if (checkboxText) {
      const checkboxContainer = document.createElement('div');
      checkboxContainer.className = 'modal-checkbox';
      
      checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = 'modal-checkbox';
      
      const label = document.createElement('label');
      label.htmlFor = 'modal-checkbox';
      label.textContent = checkboxText;
      
      checkboxContainer.appendChild(checkbox);
      checkboxContainer.appendChild(label);
      modal.appendChild(checkboxContainer);
    }
    
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'modal-buttons';
    
    const primaryBtn = document.createElement('button');
    primaryBtn.className = 'modal-button primary';
    primaryBtn.textContent = primaryBtnText;
    primaryBtn.addEventListener('click', () => {
      if (primaryCallback) {
        primaryCallback(checkbox ? checkbox.checked : false);
      }
      
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    });
    
    buttonsContainer.appendChild(primaryBtn);
    
    if (secondaryBtnText) {
      const secondaryBtn = document.createElement('button');
      secondaryBtn.className = 'modal-button secondary';
      secondaryBtn.textContent = secondaryBtnText;
      secondaryBtn.addEventListener('click', () => {
        if (secondaryCallback) {
          secondaryCallback(checkbox ? checkbox.checked : false);
        }
        
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
        }
      });
      
      buttonsContainer.appendChild(secondaryBtn);
    }
    
    modal.appendChild(buttonsContainer);
    
    // Додаємо модальне вікно всередину оверлея
    overlay.appendChild(modal);
    
    // Додаємо оверлей на сторінку
    document.body.appendChild(overlay);
    
    // Примусово викликаємо reflow для застосування анімацій
    void modal.offsetWidth;
    
    return { modal, overlay, checkbox };
  }
}

class App {
  constructor() {
    this.aiCache = new AICache(); 
    this.queryAnalyzer = new QueryAnalyzer();
    this.aiAssistant = new AIAssistant(this.aiCache); 
    this.uiManager = new UIManager(this.queryAnalyzer, this.aiAssistant, this.aiCache); 
  }

  async init() {
    console.log('Додаток ініціалізовано');
    
    // Завантажуємо API ключ
    await loadApiKey();
    
    // Ініціалізуємо елементи інтерфейсу
    this.initUIElements();
    
    // Додаємо прямі обробники подій для кнопок
    this.setupEventListeners();
    
    // Ініціалізуємо UI Manager (нова порядок, спершу завантажуємо тему)
    await this.loadTheme();
    
    // Потім ініціалізуємо чат
    await this.uiManager.initializeChat();
  }
  
  setupEventListeners() {
    // Кнопки зміни теми
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMain = document.getElementById('theme-toggle-main');
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        console.log('Клік по кнопці зміни теми в чаті');
        this.uiManager.toggleTheme();
      });
    }
    
    if (themeToggleMain) {
      themeToggleMain.addEventListener('click', () => {
        console.log('Клік по кнопці зміни теми в головному меню');
        this.uiManager.toggleTheme();
      });
    }
    
    // Кнопка очищення історії
    const clearHistoryBtn = document.getElementById('clear-history');
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', () => {
        console.log('Клік по кнопці очищення історії');
        this.uiManager.showStyledModal(
          'Повідомлення від розширення MozaBook AI Assistant v3:',
          'Ви впевнені, що хочете очистити історію чату?',
          'Заборонити цій сторінці створювати додаткові діалогові вікна',
          'ОК',
          'Скасувати',
          (doNotAskAgain) => {
            if (doNotAskAgain) {
              chrome.storage.local.set({ 'skipClearConfirmation': true });
            }
            this.uiManager.clearChatHistory();
          }
        );
      });
    }
  }
  
  async loadTheme() {
    try {
      console.log('Завантаження збереженої теми...');
      const result = await new Promise(resolve => {
        chrome.storage.local.get('theme', resolve);
      });
      const savedTheme = result.theme || 'light';
      console.log('Завантажена тема:', savedTheme);
      this.uiManager.currentTheme = savedTheme;
      this.uiManager.applyTheme(savedTheme);
    } catch (error) {
      console.error('Помилка завантаження теми:', error);
      // За замовчуванням використовуємо світлу тему
      this.uiManager.currentTheme = 'light';
      this.uiManager.applyTheme('light');
    }
  }
  
  initUIElements() {
    // Головна сторінка
    this.mainMenu = document.getElementById('main-menu');
    this.themeToggleMain = document.getElementById('theme-toggle-main');
    this.navButton = document.getElementById('nav-button');
    this.chatButton = document.getElementById('chat-button');
    
    // Навігація
    this.navigationMenu = document.getElementById('navigation-menu');
    this.backToMenu = document.getElementById('back-to-menu');
    this.navLinksContainer = document.getElementById('nav-links-container');
    
    // Чат
    this.chatMode = document.getElementById('chat-mode');
    this.chatMessages = document.getElementById('chat-messages');
    this.backToMenuChat = document.getElementById('back-to-menu-chat');
    this.themeToggle = document.getElementById('theme-toggle');
    this.clearHistoryBtn = document.getElementById('clear-history');
    this.searchForm = document.getElementById('search-form');
    this.queryInput = document.getElementById('query-input');
    this.suggestionsList = document.getElementById('suggestions-list');
    
    // Виправлення для правильної обробки кнопок "Назад"
    this.backButton = this.backToMenu;
    this.backButtonChat = this.backToMenuChat;
    
    // Інші елементи
    this.loading = document.getElementById('loading');
    this.error = document.getElementById('error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
}); 