\connect sdc_reviews;
COPY reviews FROM '/Users/matthewkwon/HackReactor/HR-LAX45/SDC/automatic-garbanzo-reviews-API/data/reviews.csv' DELIMITER ',' CSV HEADER;
COPY reviews_photos FROM '/Users/matthewkwon/HackReactor/HR-LAX45/SDC/automatic-garbanzo-reviews-API/data/reviews_photos.csv' DELIMITER ',' CSV HEADER;
COPY characteristics FROM '/Users/matthewkwon/HackReactor/HR-LAX45/SDC/automatic-garbanzo-reviews-API/data/characteristics.csv' DELIMITER ',' CSV HEADER;
COPY characteristic_reviews FROM '/Users/matthewkwon/HackReactor/HR-LAX45/SDC/automatic-garbanzo-reviews-API/data/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;