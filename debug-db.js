const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

async function diagnose() {
  const url = process.env.DATABASE_URL;
  console.log("Testing connection to:", url.split('@')[1]);
  
  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const start = Date.now();
    await client.connect();
    console.log(`✅ SUCCESS: Connected to PostgreSQL in ${Date.now() - start}ms`);
    
    const res = await client.query("SELECT current_database(), current_schema(), current_user");
    console.log("Context:", res.rows[0]);

    const tables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log("Current Tables:", tables.rows.map(r => r.table_name).join(', '));
    
    await client.end();
  } catch (err) {
    console.error("❌ FAILURE: Could not connect to PostgreSQL.");
    console.error("Error Code:", err.code);
    console.error("Message:", err.message);
    if (err.code === 'ENOTFOUND' || err.code === 'EAI_AGAIN') {
        console.error("Suggestion: DNS issue. Try using the IP address or check connectivity.");
    }
  }
}

diagnose();
