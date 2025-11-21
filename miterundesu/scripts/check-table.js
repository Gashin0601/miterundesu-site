#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: 'public' }
});

async function checkTable() {
  console.log('🔍 Checking if press_accounts table exists...\n');

  try {
    // Try to query the table
    const { data, error, count } = await supabase
      .from('press_accounts')
      .select('*', { count: 'exact', head: false });

    if (error) {
      console.error('❌ Error accessing table:', error);
      console.log('\n💡 Table might not exist yet or RLS is blocking access');
      console.log('Error code:', error.code);
      console.log('Error details:', error.details);
      return false;
    }

    console.log('✅ Table exists!');
    console.log(`📊 Found ${count} records`);
    console.log('Data:', JSON.stringify(data, null, 2));
    return true;

  } catch (err) {
    console.error('❌ Exception:', err.message);
    return false;
  }
}

checkTable();
