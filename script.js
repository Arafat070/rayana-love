// ============================================
// НАСТРОЙКИ — ЗАПОЛНИ ПЕРЕД ПУБЛИКАЦИЕЙ!
// ============================================
const TELEGRAM_BOT_TOKEN = "8545442435:AAFzl5h1-u8gdf1BuhttY_hWscsoRloT1F8";
const TELEGRAM_CHAT_ID = "992638774";

// ============================================
// ТЕКСТ ПРИЗНАНИЯ
// ============================================
const loveText = `Раяна, милая...

Я очень долго думал, как сказать тебе это. Слова путались, сердце билось быстрее при одной только мысли о тебе, и я понял — лучше всего скажет сам этот сайт.

С того момента, как ты появилась в моей жизни, всё вокруг стало ярче. Твой смех — моя любимая мелодия. Твоя улыбка — моё солнце даже в самый пасмурный день. Твои глаза — то, в чём я готов утонуть навсегда.

Ты — первая мысль, когда я просыпаюсь, и последняя, когда закрываю глаза. Ты стала моим вдохновением, моим спокойствием и моим счастьем.

Я люблю тебя, Раяна. По-настоящему. Всем сердцем. 💖

И сейчас мне очень важно узнать — что чувствуешь ты?`;

// ============================================
// ЭЛЕМЕНТЫ
// ============================================
const envelopeScreen = document.getElementById("envelopeScreen");
const envelopeWrapper = document.getElementById("envelopeWrapper");
const siteContent = document.getElementById("siteContent");
const heartsBg = document.getElementById("heartsBg");
const typedTextEl = document.getElementById("typedText");
const cursorEl = document.getElementById("cursor");
const answerBlock = document.getElementById("answerBlock");
const galleryBlock = document.getElementById("galleryBlock");
const answerInput = document.getElementById("answerInput");
const sendBtn = document.getElementById("sendBtn");
const statusEl = document.getElementById("status");
const themeBtn = document.getElementById("themeBtn");
const musicBtn = document.getElementById("musicBtn");
const bgMusic = document.getElementById("bgMusic");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

// ============================================
// МОБИЛЬНЫЕ ФЛАГИ
// ============================================
const isMobile = window.matchMedia("(max-width: 768px)").matches;
const heartEmojis = ["💖", "💕", "💗", "❤️", "💓", "💝", "🌸", "✨"];

// ============================================
// ЛЕТАЮЩИЕ СЕРДЕЧКИ (с лимитом)
// ============================================
let activeHearts = 0;
const maxHearts = isMobile ? 12 : 30;
const heartInterval = isMobile ? 900 : 500;

function createHeart() {
  if (activeHearts >= maxHearts) return;
  activeHearts++;

  const heart = document.createElement("div");
  heart.className = "floating-heart";
  heart.textContent =
    heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  heart.style.left = Math.random() * 100 + "%";
  heart.style.fontSize = (isMobile ? 14 : 18) + Math.random() * 20 + "px";

  const duration = 8 + Math.random() * 10;
  heart.style.animationDuration = duration + "s";
  heart.style.animationDelay = Math.random() * 3 + "s";

  heartsBg.appendChild(heart);

  setTimeout(
    () => {
      heart.remove();
      activeHearts--;
    },
    (duration + 4) * 1000,
  );
}

setInterval(createHeart, heartInterval);
for (let i = 0; i < (isMobile ? 8 : 15); i++) {
  setTimeout(createHeart, i * 200);
}

// ============================================
// АНИМАЦИЯ ПЕЧАТАЮЩЕГОСЯ ТЕКСТА
// ============================================
let charIndex = 0;
let typingStarted = false;

function typeChar() {
  if (charIndex < loveText.length) {
    typedTextEl.textContent += loveText.charAt(charIndex);
    charIndex++;

    let delay = 45;
    const ch = loveText.charAt(charIndex - 1);
    if (ch === "," || ch === ".") delay = 300;
    if (ch === "!" || ch === "?") delay = 400;
    if (ch === "\n") delay = 500;

    setTimeout(typeChar, delay);
  } else {
    cursorEl.style.display = "none";
    setTimeout(() => galleryBlock.classList.add("show"), 400);
    setTimeout(() => answerBlock.classList.add("show"), 1200);
  }
}

// ============================================
// ОТПРАВКА ОТВЕТА В TELEGRAM
// ============================================
sendBtn.addEventListener("click", async () => {
  const answer = answerInput.value.trim();

  if (!answer) {
    statusEl.textContent = "Пожалуйста, напиши свой ответ 💌";
    statusEl.style.color = "#ff6b9d";
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = "Отправляю...";
  statusEl.textContent = "";

  const message = `💖 Раяна ответила на признание!\n\n📝 Её ответ:\n"${answer}"\n\n🕐 ${new Date().toLocaleString("ru-RU")}`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        }),
      },
    );

    const data = await response.json();

    if (data.ok) {
      statusEl.textContent = "Спасибо, Раяна 💖 Твой ответ долетел до меня!";
      statusEl.style.color = "#ffb6c1";
      answerInput.value = "";
      sendBtn.textContent = "Отправлено ✓";

      // Салют из сердечек
      for (let i = 0; i < 40; i++) setTimeout(createHeart, i * 50);
    } else {
      throw new Error(data.description || "Ошибка отправки");
    }
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Ой, что-то пошло не так. Попробуй ещё раз 💔";
    statusEl.style.color = "#ff6b9d";
    sendBtn.disabled = false;
    sendBtn.textContent = "Отправить 💕";
  }
});

// ============================================
// МОБИЛЬНАЯ ПРИЯТНОСТЬ — скролл к кнопке
// ============================================
answerInput.addEventListener("focus", () => {
  setTimeout(() => {
    sendBtn.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 300);
});

// ============================================
// ФОНОВАЯ МУЗЫКА
// ============================================
// ============================================
// СМЕНА ТЕМЫ
// ============================================
const themes = ["pink", "red", "purple"];
let currentThemeIndex = 0;

// Запомнить выбранную тему
const savedTheme = localStorage.getItem("loveTheme");
if (savedTheme && themes.includes(savedTheme)) {
  document.body.dataset.theme = savedTheme;
  currentThemeIndex = themes.indexOf(savedTheme);
}

themeBtn.addEventListener("click", () => {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  const newTheme = themes[currentThemeIndex];
  document.body.dataset.theme = newTheme;
  localStorage.setItem("loveTheme", newTheme);

  // Небольшая анимация кнопки
  themeBtn.style.transform = "scale(1.3) rotate(180deg)";
  setTimeout(() => {
    themeBtn.style.transform = "";
  }, 300);
});

// ============================================
// ЛАЙТБОКС — просмотр фото
// ============================================
document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    const img = item.querySelector("img");
    if (img && img.src) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add("show");
      document.body.style.overflow = "hidden";
    }
  });
});

function closeLightbox() {
  lightbox.classList.remove("show");
  document.body.style.overflow = "";
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});
// ============================================
// ФОНОВАЯ МУЗЫКА
// ============================================
let musicPlaying = false;

function startMusic() {
  if (musicPlaying) return;
  bgMusic.volume = 0.4;
  bgMusic
    .play()
    .then(() => {
      musicBtn.classList.add("playing");
      musicBtn.querySelector(".music-icon").textContent = "🔊";
      musicPlaying = true;
    })
    .catch((err) => {
      console.warn("Не удалось воспроизвести музыку:", err);
    });
}

musicBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (musicPlaying) {
    bgMusic.pause();
    musicBtn.classList.remove("playing");
    musicBtn.querySelector(".music-icon").textContent = "🔇";
    musicPlaying = false;
  } else {
    startMusic();
  }
});

// ============================================
// ОТКРЫТИЕ ОТКРЫТКИ
// ============================================
let envelopeOpened = false;

function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;

  // 1. Запускаем музыку (пользователь кликнул — автоплей разрешён!)
  startMusic();

  // 2. Анимация раскрытия конверта
  envelopeWrapper.classList.add("opening");

  // 3. Создаём салют из сердечек
  for (let i = 0; i < 30; i++) {
    setTimeout(createHeart, i * 40);
  }

  // 4. Через время прячем открытку и показываем сайт
  setTimeout(() => {
    envelopeScreen.classList.add("hidden");
    siteContent.classList.add("visible");

    // Прокручиваем в начало
    window.scrollTo({ top: 0, behavior: "instant" });

    // 5. Запускаем печать текста
    if (!typingStarted) {
      typingStarted = true;
      setTimeout(() => typeChar(), 800);
    }
  }, 1400);

  // 6. Полностью удаляем открытку из DOM через 2.5 сек
  setTimeout(() => {
    envelopeScreen.remove();
  }, 2600);
}

envelopeScreen.addEventListener("click", openEnvelope);
envelopeScreen.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    openEnvelope();
  },
  { passive: false },
);

// Поддержка клавиатуры (Enter/Space)
document.addEventListener("keydown", (e) => {
  if (!envelopeOpened && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    openEnvelope();
  }
});
