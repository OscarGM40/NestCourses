<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" />
  </a>
</p>

# Pasos a ejecutar para servir en desarrollo

1. Clonar el repositorio
2. Ejecutar

```
yarn install
```

3. Se requiere tener Nest CLI instalado

```
npm i -g @nestjs/cli
```

4. Levantar la base de datos(la MONGOURI necesita ?authSource=admin)

```
docker-compose -f docker-compose.dev.yaml --env-file .env up -d  <- cambiar el -f y el --env-file segun entorno
```

5. Clonar el archivo **.env.template** y renombrar la copia a **.env**.Configurar esas variables en el **.env**

6. Ejecutar la aplicación y reconstruir(precargar) la base de datos con la semilla

```
GET a http://localhost:3000/api/v1/seed
```

# Pasos para servir en producción
1. Crear el archivo __.env.prod__ con la URI correcta,etc
2. Buildear el docker-compose
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```
3. Desde aqui podria crear una imagen remota y servirla en una VM o un POD,etc

## Stack usado

- MongoDB
- Nest
- ODM Mongoose
- Docker & Docker-compose
