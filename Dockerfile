# ============================
# STAGE 1: Build con Node/Vite
# ============================
FROM node:22-alpine AS builder

# Directorio de trabajo
WORKDIR /app

# Copia dependencias
COPY package*.json ./
RUN npm install

# Copia el resto del código fuente
COPY . .

# Compila la app (genera /dist)
RUN npm run build

# ============================
# STAGE 2: Servir con Nginx
# ============================
FROM nginx:alpine

# Copia archivos estáticos desde el builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto estándar
EXPOSE 80

# Inicia Nginx
CMD ["nginx", "-g", "daemon off;"]
