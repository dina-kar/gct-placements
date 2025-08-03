const { Client, Databases } = require('node-appwrite');
const { readFile } = require('fs/promises');
require('dotenv').config({ path: '.env.local' });

// --- ⚙️ CONFIGURATION ---
// It's highly recommended to use environment variables for security.
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;
// The ID of the database where you want to create the collections.
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const SCHEMA_FILE_PATH = 'schema.json';
const OPERATION_DELAY_SECONDS = 1; // The 1-second interval you requested.

// A simple helper function for delays
const sleep = (seconds) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

/**
 * Helper function to call the correct Appwrite SDK method based on attribute type.
 * @param {Databases} databases - The Databases service instance.
 * @param {string} collectionId - The ID of the collection.
 * @param {object} attr - The attribute object from the schema.
 */
async function createAttribute(databases, collectionId, attr) {
    const key = attr.key;
    const required = attr.required;
    const isArray = attr.array || false;
    const defaultValue = attr.default;

    try {
        switch (attr.type) {
            case 'string':
                if (attr.format === 'enum') {
                    await databases.createEnumAttribute(DATABASE_ID, collectionId, key, attr.elements, required, defaultValue, isArray);
                } else if (attr.format === 'email') {
                    await databases.createEmailAttribute(DATABASE_ID, collectionId, key, required, defaultValue, isArray);
                } else {
                    // Handles regular strings
                    await databases.createStringAttribute(DATABASE_ID, collectionId, key, attr.size, required, defaultValue, isArray);
                }
                break;
            case 'boolean':
                await databases.createBooleanAttribute(DATABASE_ID, collectionId, key, required, defaultValue, isArray);
                break;
            case 'datetime':
                await databases.createDatetimeAttribute(DATABASE_ID, collectionId, key, required, defaultValue, isArray);
                break;
            // Add other types like integer, float, relationship here if needed
            // case 'integer':
            //     await databases.createIntegerAttribute(...);
            //     break;
            default:
                console.warn(`    ⚠️ Warning: Unsupported attribute type '${attr.type}' for key '${key}'. Skipping.`);
                return; // Return early to avoid logging success for a skipped attribute
        }
        console.log(`    -> ✅ Attribute '${key}' created.`);
    } catch (e) {
        console.error(`    -> ❌ Failed to create attribute '${key}': ${e.message}`);
    }
}

/**
 * Main function to read the schema and create collections, attributes, and indexes.
 */
async function main() {
    // Check for required environment variables
    if (!APPWRITE_PROJECT_ID || !APPWRITE_API_KEY || !DATABASE_ID) {
        console.error("❌ Error: Please set APPWRITE_PROJECT_ID, APPWRITE_API_KEY, and DATABASE_ID environment variables.");
        process.exit(1);
    }

    // --- Initialize Appwrite Client ---
    const client = new Client()
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT_ID)
        .setKey(APPWRITE_API_KEY);

    const databases = new Databases(client);
    console.log("✅ Successfully configured Appwrite client.");

    // --- Load Schema from File ---
    let collections;
    try {
        const schemaRaw = await readFile(SCHEMA_FILE_PATH, 'utf8');
        collections = JSON.parse(schemaRaw);
        console.log(`📄 Found ${collections.length} collections in '${SCHEMA_FILE_PATH}'.`);
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.error(`❌ Error: Schema file not found at '${SCHEMA_FILE_PATH}'.`);
        } else {
            console.error(`❌ Error: Could not parse '${SCHEMA_FILE_PATH}'. Make sure it's valid JSON.`, e);
        }
        process.exit(1);
    }

    // --- Process Each Collection ---
    for (const collection of collections) {
        try {
            console.log(`\nProcessing collection: ${collection.name} (${collection.$id})`);

            // 1. Create Collection
            console.log("  [1/3] Creating collection...");
            await databases.createCollection(
                DATABASE_ID,
                collection.$id, // Use original ID
                collection.name,
                collection.$permissions,
                collection.documentSecurity,
                collection.enabled
            );
            console.log(`  -> ✅ Collection '${collection.name}' created.`);
            await sleep(OPERATION_DELAY_SECONDS);

            // 2. Create Attributes
            console.log("  [2/3] Creating attributes...");
            for (const attribute of collection.attributes) {
                if (attribute.status !== 'available') continue;
                console.log(`    -> Creating attribute '${attribute.key}' (${attribute.type})...`);
                await createAttribute(databases, collection.$id, attribute);
                await sleep(OPERATION_DELAY_SECONDS);
            }

            console.log("  -> ✅ Attributes created. Waiting for processing before creating indexes...");
            await sleep(OPERATION_DELAY_SECONDS * 3); // Extra wait for attributes to be ready

            // 3. Create Indexes
            console.log("  [3/3] Creating indexes...");
            for (const index of collection.indexes) {
                if (index.status !== 'available') continue;
                console.log(`    -> Creating index '${index.key}'...`);
                await databases.createIndex(
                    DATABASE_ID,
                    collection.$id,
                    index.key,
                    index.type,
                    index.attributes,
                    index.orders
                );
                console.log(`    -> ✅ Index '${index.key}' created.`);
                await sleep(OPERATION_DELAY_SECONDS);
            }
        } catch (e) {
            console.error(`  ❌ An error occurred while processing collection '${collection.name}': ${e.message}`);
            console.error("  Skipping to next collection...");
            continue;
        }
    }
    console.log("\n🎉 All collections processed. Schema import complete!");
}

main();