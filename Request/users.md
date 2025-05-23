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
```
ALTER TABLE users
ADD COLUMN purchase_story TEXT DEFAULT NULL,
ADD CONSTRAINT purchase_story_check CHECK (
  is_shop = FALSE OR purchase_story IS NULL
);
```
