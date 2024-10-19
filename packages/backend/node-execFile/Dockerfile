FROM node:14-alpine3.11
WORKDIR /app
RUN curl -L https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf -o qwen2.5-0.5b-instruct-q4_k_m.gguf
RUN curl -L -o llamafile https://github.com/Mozilla-Ocho/llamafile/releases/download/0.8.11/llamafile-0.8.11
COPY package*.json ./
RUN npm ci
COPY src .
ENTRYPOINT ["node", "/app/app.js"]
