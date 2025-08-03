const { Client, Databases } = require('node-appwrite');
const { writeFile } = require('fs/promises');

require('dotenv').config({ path: '.env.local' });

// --- Initialize Appwrite Client ---
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function exportSchema() {
    try {
        console.log('Fetching collections from database...');
        // The listCollections method fetches all collections with their attributes and indexes.
        const response = await databases.listCollections(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID);
        const collections = response.collections;

        // Save the schema to a file
        await writeFile('schema.json', JSON.stringify(collections, null, 2));
        console.log(`✅ Successfully exported ${collections.length} collections to schema.json`);

    } catch (error) {
        console.error('❌ Failed to export schema:', error);
    }
}

exportSchema();