CREATE TABLE t_p67477362_next_gen_web.leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);