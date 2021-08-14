const pool = require('./');
const loadFrom = require('./helper');
const path = require('path');

/*SET UP TABLES==============================================================================*/
let tables = [];

tables.push(pool.query('DROP TABLE IF EXISTS public.reviews CASCADE'));
tables.push(pool.query('DROP TABLE IF EXISTS public.characteristics CASCADE'));
tables.push(pool.query('DROP TABLE IF EXISTS public.photos CASCADE'));
tables.push(pool.query('DROP TABLE IF EXISTS public.characteristics_reviews CASCADE'));

tables.push(pool.query(`
  CREATE TABLE public.reviews(
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    rating SMALLINT NOT NULL,
    date BIGINT NOT NULL,
    summary TEXT NOT NULL,
    body TEXT NOT NULL,
    recommend BOOLEAN NOT NULL,
    reported BOOLEAN NOT NULL,
    reviewer_name VARCHAR(100) NOT NULL,
    reviewer_email VARCHAR(100) NOT NULL,
    response TEXT,
    helpfulness INTEGER NOT NULL
  )
`));
tables.push(pool.query(`
  CREATE TABLE public.characteristics(
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    name VARCHAR(20) NOT NULL
  );
`));
tables.push(pool.query(`
  CREATE TABLE public.photos(
    id SERIAL PRIMARY KEY,
    review_id INTEGER NOT NULL,
    url VARCHAR(1000)
  );
`));
tables.push(pool.query(`
  CREATE TABLE public.characteristics_reviews(
    id SERIAL PRIMARY KEY,
    characteristic_id INTEGER NOT NULL,
    review_id INTEGER NOT NULL,
    value SMALLINT NOT NULL
  );
`));

Promise.all(tables)
  .then(() => {
/*SET UP LOAD DATA===========================================================================*/
    let loadData = [];

    let dataPath = path.join(__dirname, '../data')

    loadData.push(loadFrom('public.reviews', `${dataPath}/reviews.csv`));
    loadData.push(loadFrom('public.characteristics', `${dataPath}/characteristics.csv`));
    loadData.push(loadFrom('public.photos', `${dataPath}/photos.csv`));
    loadData.push(loadFrom('public.characteristics_reviews', `${dataPath}/characteristics_reviews.csv`));

    Promise.all(loadData)
      .then(() => {
/*RESET PRIMARY KEY SEQUENCE=================================================================*/
        let sequences = [];

        sequences.push(pool.query(`SELECT setval('reviews_id_seq', MAX(id)) FROM public.reviews;`));
        sequences.push(pool.query(`SELECT setval('characteristics_id_seq', MAX(id)) FROM public.characteristics;`));
        sequences.push(pool.query(`SELECT setval('photos_id_seq', MAX(id)) FROM public.photos;`));
        sequences.push(pool.query(`SELECT setval('characteristics_reviews_id_seq', MAX(id)) FROM public.characteristics_reviews;`));

        console.log('Successfully reset PK sequences');

        Promise.all(sequences)
          .then(() => {
/*SET UP FOREIGN KEYS========================================================================*/
            let foreignKeys = [];

            foreignKeys.push(pool.query(`
              ALTER TABLE public.photos
                ADD CONSTRAINT fk_photos_review_id
                  FOREIGN KEY (review_id)
                    REFERENCES public.reviews(id);
            `));
            foreignKeys.push(pool.query(`
              ALTER TABLE public.characteristics_reviews
                ADD CONSTRAINT fk_characteristics_reviews_review_id
                  FOREIGN KEY (review_id)
                    REFERENCES public.reviews(id);
            `));
            foreignKeys.push(pool.query(`
              ALTER TABLE public.characteristics_reviews
                ADD CONSTRAINT fk_characteristics_reviews_char_id
                  FOREIGN KEY (characteristic_id)
                    REFERENCES public.characteristics(id);
            `));

            console.log('Successfully created foreign keys');

            Promise.all(foreignKeys)
              .then(() => {
/*SET UP INDEXES=============================================================================*/
                let indexes = [];

                indexes.push(pool.query(`CREATE INDEX reviews_product_id_index ON public.reviews(product_id);`));
                indexes.push(pool.query(`CREATE INDEX photos_review_id_index ON public.photos(review_id);`));
                indexes.push(pool.query(`CREATE INDEX characteristics_reviews_review_id_index ON public.characteristics_reviews(review_id);`));
                indexes.push(pool.query(`CREATE INDEX characteristics_reviews_characteristic_id_index ON public.characteristics_reviews(characteristic_id);`));

                console.log('Successfully created indexes');
              })
          })
      })
  })
  .catch((err) => {
    console.log('Failed to load data: ', err);
    pool.end();
  });