```
CREATE TABLE images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  img TEXT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```
