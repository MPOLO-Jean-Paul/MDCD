const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('ERREUR : DATABASE_URL non trouvée dans le fichier .env');
  process.exit(1);
}

const client = new Client({
  connectionString: connectionString,
});

const sql = `
-- Table pour les dossiers patients détaillés (Gestion Postgres)
CREATE TABLE IF NOT EXISTS "PatientDetail" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP,
    "gender" TEXT,
    "nationalId" TEXT UNIQUE,
    "address" TEXT,
    "occupation" TEXT,
    "medicalHistory" TEXT,
    "familyHistory" TEXT,
    "allergies" TEXT,
    "bloodGroup" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Table pour la facturation complexe
CREATE TABLE IF NOT EXISTS "Invoice" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "patientId" UUID REFERENCES "PatientDetail"("id"),
    "items" JSONB,
    "totalAmount" DECIMAL(10,2),
    "paidAmount" DECIMAL(10,2) DEFAULT 0,
    "status" TEXT DEFAULT 'UNPAID',
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Table pour l'archivage technique (Labo)
CREATE TABLE IF NOT EXISTS "LabReportArchive" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "patientId" TEXT,
    "consultationId" TEXT,
    "testResults" JSONB,
    "interpretations" TEXT,
    "archivedAt" TIMESTAMP DEFAULT NOW()
);
`;

async function migrate() {
  try {
    console.log('Connexion à Supabase...');
    await client.connect();
    console.log('Initialisation du schéma PostgreSQL...');
    await client.query(sql);
    console.log('✅ Base de données initialisée avec succès !');
  } catch (err) {
    console.error('❌ Erreur lors de la migration:', err);
  } finally {
    await client.end();
  }
}

migrate();
