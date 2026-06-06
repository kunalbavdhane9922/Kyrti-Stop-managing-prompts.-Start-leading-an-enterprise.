#!/bin/bash
set -e

# Create all necessary SAEP databases
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE saep_company;
    CREATE DATABASE saep_marketplace;
    CREATE DATABASE saep_governance;
    CREATE DATABASE saep_workforce;
    CREATE DATABASE saep_memory;
    CREATE DATABASE saep_audit;
EOSQL
