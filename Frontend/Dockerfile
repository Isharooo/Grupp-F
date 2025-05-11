#FROM node:20-alpine

#WORKDIR /app

#COPY package*.json ./

#RUN npm install

#COPY . .

#EXPOSE 3000

#CMD ["node", "--max-old-space-size=1024", "node_modules/.bin/react-scripts", "start", "--host", "0.0.0.0"]

# Steg 1: Bygg frontend
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Steg 2: Servera statiska filer
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
