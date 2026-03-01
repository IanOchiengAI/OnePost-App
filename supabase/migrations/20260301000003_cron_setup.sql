-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;
-- Enable the 'net' extension to allow the database to make HTTP requests
CREATE EXTENSION IF NOT EXISTS "net";
-- Note: The following cron job expects the 'publisher' edge function to be deployed.
-- You will need to replace <PROJECT_REF> and <SERVICE_ROLE_KEY> with your actual values.
-- Alternatively, if using Supabase Vault, you can pull the service_role_key from there.
/*
 SELECT cron.schedule(
 'invoke-publisher-every-5-mins',
 '*/
5 * * * * ',
  $$
  SELECT
    net.http_post(
      url:=' https: // < PROJECT_REF >.supabase.co / functions / v1 / publisher ',
      headers:=jsonb_build_object(
        ' Content - Type ', ' application / json ',
        ' Authorization ', ' Bearer < SERVICE_ROLE_KEY > '
      ),
      body:=jsonb_build_object()
    )
  $$
);
*/

-- We provide the commented-out version above because it requires specific environment secrets.
-- The Architect has prepped the structure; deployment will require the CLI.