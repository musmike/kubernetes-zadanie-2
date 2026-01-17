# Używam lekkiego obrazu Node.js w wersji 20 opartego na Alpine Linux
FROM node:20-alpine

# Ustawiam katalog roboczy w kontenerze
WORKDIR /app

# Kopiuję pliki package.json i package-lock.json do katalogu roboczego
COPY package*.json ./

# Instaluję zależności Node.js
RUN npm install

# Kopiuję resztę plików projektu do katalogu roboczego
COPY . .

# Otwieram port 5000 dla aplikacji
EXPOSE 5000

# Uruchamiam aplikację Node.js
CMD ["node", "index.js"]
