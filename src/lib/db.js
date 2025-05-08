import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgres://neondb_owner:npg_QPGhIV8ax4AF@ep-tight-cloud-a1oku90l-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
});

export default pool;