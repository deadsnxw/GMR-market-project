```
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  amount INT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT NOT NULL,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```
