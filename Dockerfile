FROM node:18-alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . ./
ENV PORT 5174
#ENV VITE_APISERVER=https://sscresult.chanakyasoft.com:3001
#ENV VITE_APISERVER=https://hsc_verificationstate.mahahsscboard.in
ENV VITE_APISERVER=https://hsc_verificationstaffserver.mahahsscboard.in
ENV VITE_LOGOUT_URL=https://hsc_verificationstate.mahahsscboard.in
EXPOSE $PORT
RUN npm run build
CMD ["node","build/index.js"]
