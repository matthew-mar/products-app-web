# products-app-web

## Requirements

- docker
- node 22

## Настройка проекта

```bash
npm install
```

## Запуск

### Локально

```bash
npx http-server -c-1
```

### Docker

```bash
docker build -t web_app .
docker run -p 8080:8080 web_app
```
