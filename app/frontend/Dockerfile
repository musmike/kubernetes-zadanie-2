# ETAP 1: Budowanie aplikacji (Builder)
FROM node:20-alpine AS builder

# Ustawiam katalog roboczy
WORKDIR /app

# Kopiuję pliki package.json i package-lock.json
COPY package*.json ./

# Instaluję zależności
RUN npm install

# Kopiuję resztę plików aplikacji
COPY . .

# To stworzy folder dist/frontend z gotowymi plikami
RUN npm run build

# ETAP 2: Serwer produkcyjny (Nginx)
FROM nginx:alpine

# Kopiuję konfigurację Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiuję zbudowane pliki Angulara z Etapu 1 do Nginxa
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Nginx domyślnie działa na porcie 80
EXPOSE 80

# Uruchamiam Nginxa w trybie pierwszoplanowym
CMD ["nginx", "-g", "daemon off;"]