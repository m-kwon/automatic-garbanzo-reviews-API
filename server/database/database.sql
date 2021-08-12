DROP DATABASE IF EXISTS sdc_reviews;
CREATE DATABASE sdc_reviews;
\connect sdc_reviews;

CREATE TABLE reviews(
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  reviewer_name VARCHAR(100),
  reviewer_email VARCHAR(100),
  rating SMALLINT NOT NULL,
  recommend BOOLEAN NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  post_date BIGINT NOT NULL,
  response TEXT,
  helpfulness INTEGER NOT NULL,
  reported BOOLEAN NOT NULL
);

CREATE TABLE reviews_photos(
  id SERIAL PRIMARY KEY,
  img_url VARCHAR(1000) NOT NULL,
  review_id INTEGER NOT NULL
);

CREATE TABLE characteristics(
  id SERIAL PRIMARY KEY,
  char_name VARCHAR(10) NOT NULL
);

CREATE TABLE reviews_characteristics(
  id SERIAL PRIMARY KEY,
  char_value SMALLINT NOT NULL,
  review_id INTEGER NOT NULL,
  char_id SMALLINT NOT NULL
);

  -- CONSTRAINT fk_review
  --   FOREIGN KEY(review_id)
  --     REFERENCES reviews(id)
  -- CONSTRAINT fk_review
  --   FOREIGN KEY(review_id)
  --     REFERENCES reviews(id),
  -- CONSTRAINT fk_char
  --   FOREIGN KEY(char_id)
  --     REFERENCES characteristics(id)