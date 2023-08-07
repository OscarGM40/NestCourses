<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Installation

1. Clonar el proyecto
2. Copiar el **_.env.template y configurarlo como un .env_**
3. Reconstruir los modulos de node

```bash
$ yarn install
```

## Running the app

1. Levantar el docker compose

```bash
$ docker-compose up -d
```

2. Levantar la app

```bash
# watch mode
$ yarn run start:dev
# production mode
$ yarn run start:prod
```

3. Recuerda que puedo limpiar el volumen con docker-compose down -v

## Test

```bash
# unit tests
$ yarn run test
# e2e tests
$ yarn run test:e2e
# test coverage
$ yarn run test:cov
```

## El endpoint de GraphQL estará en localhost:3000/graphql por defecto

4. Puedo ejecutar la mutation 'executeSeed' para reiniciar la DB con datos mockeados,siempre que no esté en producción
