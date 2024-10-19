FROM node:14-alpine3.11
WORKDIR /app
RUN curl -L https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf -o qwen2.5-0.5b-instruct-q4_k_m.gguf
COPY package*.json ./
RUN npm ci
COPY src .
ENTRYPOINT ["node", "/app/app.js"]
