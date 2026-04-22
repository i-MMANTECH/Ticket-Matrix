# Emmanuel Aro's project submission for evaluation.
# Frontend image: Next.js 15 (App Router) on Node 20-alpine.

FROM node:20-alpine

WORKDIR /app

# Install dependencies separately so they cache when only source changes
COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
