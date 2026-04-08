# 🎓 EduTwin.kz — AI-powered Student Digital Twin

> Персональный ИИ-репетитор для подготовки к ЕНТ на казахском и русском языках

![React](https://img.shields.io/badge/React-TypeScript-61DAFB?style=flat&logo=react)
![AI](https://img.shields.io/badge/AI-Qwen3%20%2B%20AlemLLM-blueviolet?style=flat)
![License](https://img.shields.io/badge/license-MIT-green?style=flat)

---

## 🧠 О проекте

**EduTwin.kz** — это веб-приложение, которое создаёт **цифрового двойника ученика** на основе многоагентного искусственного интеллекта. Платформа адаптирует обучение под уровень каждого школьника и помогает эффективно готовиться к **ЕНТ** (Единое национальное тестирование).

### Проблема
Качественные репетиторы в Казахстане стоят дорого и недоступны для большинства учеников. Стандартные учебники не адаптируются под уровень конкретного человека.

### Решение
ИИ-репетитор, который знает твои слабые места, объясняет на понятном языке (включая казахский) и подстраивает темп обучения под тебя — 24/7 и бесплатно.

---

## ✨ Возможности

- 🤖 **Многоагентный ИИ** — разные агенты для диагностики, объяснения и проверки знаний
- 🇰🇿 **Поддержка казахского языка** — через модель AlemLLM 247B
- 📊 **Аналитика прогресса** — отслеживание результатов через NocoDB
- 💬 **ИИ-репетитор в реальном времени** — отвечает на вопросы и объясняет темы
- 📁 **Хранение материалов** — загрузка и хранение учебных файлов через MinIO
- 📝 **Обратная связь** — сбор отзывов пользователей через Formbricks

---

## 🛠️ Технологии

| Слой | Технология |
|------|-----------|
| Frontend | React + TypeScript (Vite) |
| Основная LLM | Qwen3 via Alem.ai API |
| Казахский язык | AlemLLM 247B |
| Кэширование | Redis |
| Хранилище файлов | MinIO |
| Аналитика | NocoDB |
| Обратная связь | Formbricks |
| Backend API | Node.js (Express) |

---

## 🚀 Быстрый старт

### 1. Клонируй репозиторий

```bash
git clone https://github.com/твой_username/edutwin.git
cd edutwin
```

### 2. Установи зависимости

```bash
npm install
```

### 3. Настрой переменные среды

```bash
cp .env.example .env
```

Открой `.env` и заполни своими API ключами:

```env
VITE_QWEN_API_BASE="https://llm.alem.ai/v1"
VITE_QWEN_API_KEY="твой_ключ"
VITE_QWEN_MODEL=qwen3

VITE_ALEMLLM_API_KEY="твой_ключ"
VITE_ALEMLLM_MODEL="alem-llm-247b"

VITE_BACKEND_URL="http://localhost:4000"
```

### 4. Запусти backend (Redis API)

```bash
cd redis-api
node server.js
```

> Backend запустится на порту **:4000**

### 5. Запусти frontend

```bash
npm run dev
```

> Открой [http://localhost:3000](http://localhost:3000) в браузере

---

## 📁 Структура проекта

```
edutwin/
├── src/
│   ├── components/      # UI компоненты
│   ├── agents/          # Многоагентная ИИ логика
│   ├── api/             # Интеграции с LLM и сервисами
│   └── main.tsx         # Точка входа
├── redis-api/
│   └── server.js        # Backend для Redis + MinIO
├── .env.example         # Шаблон переменных среды
├── index.html
└── README.md
```

---

## 🔑 Получение API ключей

| Сервис | Где получить |
|--------|-------------|
| Qwen3 + AlemLLM | [llm.alem.ai](https://llm.alem.ai) |
| NocoDB | [nocodb.com](https://nocodb.com) |
| Formbricks | [formbricks.com](https://formbricks.com) |

---

## 🤝 Автор

**Bagzhan Taubay**
- 🎓 Студент Computer Science, Satbayev University
- 📍 Алматы, Казахстан
- 💼 [LinkedIn](https://linkedin.com/in/твой_профиль)
- 🐙 [GitHub](https://github.com/твой_username)

---

## 📄 Лицензия

MIT License — используй свободно, ссылка на автора приветствуется.

---

> *Сделано с ❤️ для казахстанских школьников*
