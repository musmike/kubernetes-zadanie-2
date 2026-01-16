# ETAP 1: Budowanie aplikacji (Builder)
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# To stworzy folder dist/frontend z gotowymi plikami
RUN npm run build

# ETAP 2: Serwer produkcyjny (Nginx)
FROM nginx:alpine

# Kopiujemy naszą konfigurację Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiujemy zbudowane pliki Angulara z Etapu 1 do Nginxa
# Ścieżka /app/dist/frontend/browser wynika z nowej struktury Angulara
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Nginx domyślnie działa na porcie 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]