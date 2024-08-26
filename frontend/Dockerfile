FROM nginx:latest
 
RUN mkdir /app
WORKDIR /app
RUN mkdir ./dist
 
ADD ./dist ./dist
COPY ./nginx/nginx.conf /etc/nginx/conf.d
 
EXPOSE 80
 
CMD ["nginx", "-g", "daemon off;"]