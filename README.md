# Веб-версия Campfire

## Что тут есть

* `campweb` — frontend на React
* `proxy` — прокси на Rust для подключения к серверу

## Структура

```tree
campweb
├─ api
│  ├─ ApiContext.js (подключение и отправка запросов)
│  └─ requests (классы с запросами чтобы было легче)
├─ components (разные компоненты в приложении)
│  └─ pages (страницы которые отображаются в постах)
└─ pages (страницы приложения: /login, /feed, ...)

tools
└─ to_python.py (конвертировать API.java в JSON-файл)
```

## Как работает прокси

При каждом запросе на вебсокет на `:$PORT` (`:8080`
по умолчанию), открывается подключение к серверу на
`HTTPS_ADDR` (см. `main.rs`), отправляется 32-битная
длина запроса и сам запрос. Потом ожидается ответ, и
он перенаправляется обратно на вебсокет.

Когда запрос начинается на `__proxy__(media):`, то
запрос идет на `MEDIA_ADDR`.

## Где это хостится

* Прокси работает на [Heroku](https://heroku.com).
  Последние деплойменты можно посмотреть
  [тут](https://github.com/timas130/campweb/deployments/activity_log?environment=campweb-proxy).
* Фронтенд хостится на [Netlify](https://netlify.com),
  там же он и собирается. Версию можно посмотреть
  в [фиде](https://sit-campweb.netlify.app/feed).
  Все pull request'ы собираются для превью.
