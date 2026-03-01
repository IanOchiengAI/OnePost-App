-- Enable pgsodium for encryption if not already enabled
CREATE EXTENSION IF NOT EXISTS pgsodium;
-- Update social_accounts table to use Vault for tokens (conceptually)
-- In Supabase, the recommended way is to use the `vault` schema or `pgsodium` directly.
-- For this Phase, we will add columns that specify if the token is encrypted.
ALTER TABLE social_accounts
ADD COLUMN IF NOT EXISTS is_encrypted BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS key_id UUID;
-- Note for The API Whisperer: 
-- Use `pgsodium.crypto_aead_det_encrypt` and `pgsodium.crypto_aead_det_decrypt` 
-- to handle the access_token and refresh_token if is_encrypted is true.
-- You can also use the Supabase Vault UI/API to store these keys.