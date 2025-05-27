-- Create user if not exists
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'testsage') THEN
      CREATE USER testsage WITH PASSWORD 'hackathon2025';
   END IF;
END
$do$;

-- Create database if not exists
SELECT 'CREATE DATABASE testsage'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'testsage')
\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE testsage TO testsage;
