CREATE TABLE t_p67477362_next_gen_web.warranties (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  purchase_date DATE NOT NULL,
  model VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);