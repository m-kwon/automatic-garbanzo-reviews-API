FROM postgres:latest

ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD POSTGRES_PASSWORD
ENV POSTGRES_DB 'sdc_reviews'

COPY *.sql /docker-entrypoint-initdb.d/

EXPOSE 5432