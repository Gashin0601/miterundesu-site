#!/usr/bin/env node

/**
 * Run Supabase Migration Script
 * Executes SQL migration files using the Supabase SDK
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration(migrationFile) {
  console.log(`\n📄 Running migration: ${path.basename(migrationFile)}`);

  try {
    // Read the migration file
    const sql = fs.readFileSync(migrationFile, 'utf8');

    console.log('📝 SQL to execute:');
    console.log('---');
    console.log(sql);
    console.log('---\n');

    // Execute the SQL using rpc call to execute raw SQL
    // Note: This requires a custom function in Supabase or direct postgres connection
    // For now, we'll use the REST API approach

    const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql }).catch(async () => {
      // If rpc doesn't work, try direct approach with fetch
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({ sql_string: sql })
      });

      if (!response.ok) {
        // If that doesn't work either, we need to execute SQL directly
        // This requires using the postgres connection
        throw new Error('Cannot execute SQL via RPC. Need to use postgres connection.');
      }

      return { data: await response.json(), error: null };
    });

    if (error) {
      console.error('❌ Migration failed:', error.message);
      return false;
    }

    console.log('✅ Migration completed successfully!');
    return true;

  } catch (error) {
    console.error('❌ Error running migration:', error.message);
    console.log('\n💡 Note: SQL migrations require direct database access.');
    console.log('Please run this migration manually using one of these methods:');
    console.log('  1. Supabase Studio (https://supabase.com/dashboard/project/saohpkchezarbhkuernf/editor)');
    console.log('  2. Supabase CLI: supabase db push');
    console.log('  3. Direct postgres connection');
    return false;
  }
}

async function main() {
  const migrationFile = process.argv[2];

  if (!migrationFile) {
    console.error('Usage: node run-migration.js <migration-file.sql>');
    process.exit(1);
  }

  if (!fs.existsSync(migrationFile)) {
    console.error(`❌ Migration file not found: ${migrationFile}`);
    process.exit(1);
  }

  const success = await runMigration(migrationFile);
  process.exit(success ? 0 : 1);
}

main();
