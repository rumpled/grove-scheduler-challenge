# Running the app

## With Docker and make

*Requirements:*

- `make`
- Docker (https://www.docker.com/products/docker-desktop)
- Docker Compose (Included in Docker Desktop)

```bash
/ $ make
```

## With just Docker

*Requirements:*

- Docker (https://www.docker.com/products/docker-desktop)
- Docker Compose (Included in Docker Desktop)

```bash
/ $ docker-compose -f docker-compose.builder.yml run --rm install
/ $ docker-compose up
```

## Without Docker

*Requirements:*

- A working install of Node>=10

```bash
/ $ cd app
app/ $ npm install
app/ $ npm run serve
```

