# Etapa 1: Construcción
FROM node:18 AS build

WORKDIR /app

# Copia los archivos de configuración y dependencias
COPY package*.json ./
RUN npm install

# Copia el resto del código fuente
COPY . .

# Construye la aplicación
RUN npm run build

# Etapa 2: Servir la aplicación
FROM nginx:stable-alpine

# Copia los archivos construidos
COPY --from=build /app/build /usr/share/nginx/html

# Copia el archivo de configuración
COPY ./public/config.js /usr/share/nginx/html/config.js

# Expone el puerto 80
EXPOSE 80

# Comando por defecto para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]