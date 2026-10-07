This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

npx create-next-app

# Development
Pasos para levantar la app en desarrollo

1. levantar base de datos
```
docker compose up -d
```
2. Renombrar el .env.template a .env
3. Reemplazar las variables de entorno

# Prisma commands
npx prisma init
npx prisma migrate dev_migrate # actualiza los modelos en la DB
npx prisma generate # genera el cliente de prisma con el que se manipula la DB
