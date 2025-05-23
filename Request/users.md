```
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  password_hash TEXT NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  balance DECIMAL(10,2) DEFAULT NULL,
  is_shop BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT balance_shop_check CHECK (
    (is_shop = TRUE AND balance IS NULL)
    OR
    (is_shop = FALSE AND balance IS NOT NULL)
  )
);
```
