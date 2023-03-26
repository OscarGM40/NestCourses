<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Levantar el entorno en desarrollo

1. Clonar proyecto y ejecutar yarn install,etc
```
yarn install
```
2. Rellenar el .env mediante el __.env.template__

3. Levantar el compose segun entorno
```
docker-compose (-f <file> --env-file <env>) up -d | --build
```

4. Levantar proyecto
```
yarn run start:dev
```

5. Ejecutar seed (carga inicial de data)
```
http://localhost:3000/api/v1/seed por GET
```
