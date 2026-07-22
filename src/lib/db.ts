import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.join(process.cwd(), 'certs/supabase-ca.crt')).toString(),
  },
});

export default pool;