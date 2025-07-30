#!/usr/bin/env node

/**
 * Appwrite Attributes Setup Script
 * 
 * This script only creates attributes and indexes for existing collections.
 * Use this when you've already manually created the collections and storage bucket.
 * 
 * Prerequisites:
 * 1. Collections already exist in Appwrite
 * 2. Storage bucket already exists
 * 3. API key with attributes and indexes permissions
 * 
 * Usage: node scripts/setup-attributes-only.js
 */

const { Client, Databases } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

// Appwrite configuration
const client = new Client();
const databases = new Databases(client);

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const config = {
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'placement-db',
  collections: {
    users: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users',
    jobs: process.env.NEXT_PUBLIC_APPWRITE_JOBS_COLLECTION_ID || 'jobs',
    applications: process.env.NEXT_PUBLIC_APPWRITE_APPLICATIONS_COLLECTION_ID || 'applications',
    placements: process.env.NEXT_PUBLIC_APPWRITE_PLACEMENTS_COLLECTION_ID || 'placements',
    companies: process.env.NEXT_PUBLIC_APPWRITE_COMPANIES_COLLECTION_ID || 'companies',
  }
};

// Collection schemas (attributes and indexes only)
const collectionSchemas = {
  users: {
    name: 'Users',
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'email', type: 'email', size: 255, required: true },
      { key: 'firstName', type: 'string', size: 100, required: true },
      { key: 'lastName', type: 'string', size: 100, required: true },
      { key: 'phone', type: 'string', size: 20, required: false },
      { key: 'rollNumber', type: 'string', size: 50, required: false },
      { key: 'department', type: 'string', size: 255, required: false },
      { key: 'year', type: 'string', size: 20, required: false },
      { key: 'dateOfBirth', type: 'string', size: 20, required: false },
      { key: 'address', type: 'string', size: 500, required: false },
      { key: 'cgpa', type: 'string', size: 10, required: false },
      { key: 'backlogs', type: 'string', size: 10, required: false },
      { key: 'skills', type: 'string', size: 1000, required: false },
      { key: 'projects', type: 'string', size: 2000, required: false },
      { key: 'internships', type: 'string', size: 2000, required: false },
      { key: 'achievements', type: 'string', size: 2000, required: false },
      { key: 'bio', type: 'string', size: 1000, required: false },
      { key: 'profilePicture', type: 'string', size: 255, required: false },
      { key: 'resume', type: 'string', size: 255, required: false },
      { key: 'role', type: 'enum', elements: ['student', 'placement_rep', 'placement_officer', 'placement_coordinator'], required: false },
      { key: 'isPlacementRep', type: 'boolean', required: false, default: false },
      { key: 'createdAt', type: 'string', size: 50, required: true },
      { key: 'updatedAt', type: 'string', size: 50, required: true }
    ],
    indexes: [
      { key: 'userId', type: 'key', attributes: ['userId'], orders: ['ASC'] },
      { key: 'email', type: 'key', attributes: ['email'], orders: ['ASC'] },
      { key: 'role', type: 'key', attributes: ['role'], orders: ['ASC'] }
    ]
  },

  jobs: {
    name: 'Jobs',
    attributes: [
      { key: 'title', type: 'string', size: 255, required: true },
      { key: 'company', type: 'string', size: 255, required: true },
      { key: 'location', type: 'string', size: 255, required: true },
      { key: 'jobType', type: 'string', size: 50, required: true },
      { key: 'package', type: 'string', size: 100, required: true },
      { key: 'description', type: 'string', size: 5000, required: true },
      { key: 'responsibilities', type: 'string', size: 5000, required: true },
      { key: 'qualifications', type: 'string', size: 5000, required: true },
      { key: 'minCGPA', type: 'string', size: 10, required: true },
      { key: 'noBacklogs', type: 'boolean', required: false, default: true },
      { key: 'departments', type: 'string', size: 2000, required: true },
      { key: 'applicationDeadline', type: 'string', size: 50, required: true },
      { key: 'driveDate', type: 'string', size: 50, required: false },
      { key: 'logo', type: 'string', size: 255, required: false },
      { key: 'additionalDocuments', type: 'string', size: 255, required: false },
      { key: 'status', type: 'enum', elements: ['active', 'closed', 'draft'], required: false, default: 'active' },
      { key: 'createdBy', type: 'string', size: 255, required: true },
      { key: 'createdAt', type: 'string', size: 50, required: true },
      { key: 'updatedAt', type: 'string', size: 50, required: true }
    ],
    indexes: [
      { key: 'status', type: 'key', attributes: ['status'], orders: ['ASC'] },
      { key: 'company', type: 'key', attributes: ['company'], orders: ['ASC'] },
      { key: 'createdAt', type: 'key', attributes: ['createdAt'], orders: ['DESC'] }
    ]
  },

  applications: {
    name: 'Applications',
    attributes: [
      { key: 'jobId', type: 'string', size: 255, required: true },
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'status', type: 'enum', elements: ['applied', 'shortlisted', 'selected', 'rejected'], required: false, default: 'applied' },
      { key: 'appliedAt', type: 'string', size: 50, required: true },
      { key: 'updatedAt', type: 'string', size: 50, required: true }
    ],
    indexes: [
      { key: 'jobId', type: 'key', attributes: ['jobId'], orders: ['ASC'] },
      { key: 'userId', type: 'key', attributes: ['userId'], orders: ['ASC'] },
      { key: 'status', type: 'key', attributes: ['status'], orders: ['ASC'] },
      { key: 'appliedAt', type: 'key', attributes: ['appliedAt'], orders: ['DESC'] }
    ]
  },

  placements: {
    name: 'Placements',
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'jobId', type: 'string', size: 255, required: true },
      { key: 'company', type: 'string', size: 255, required: true },
      { key: 'package', type: 'string', size: 100, required: true },
      { key: 'placedAt', type: 'string', size: 50, required: true },
      { key: 'createdAt', type: 'string', size: 50, required: true }
    ],
    indexes: [
      { key: 'userId', type: 'key', attributes: ['userId'], orders: ['ASC'] },
      { key: 'company', type: 'key', attributes: ['company'], orders: ['ASC'] },
      { key: 'placedAt', type: 'key', attributes: ['placedAt'], orders: ['DESC'] }
    ]
  },

  companies: {
    name: 'Companies',
    attributes: [
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'description', type: 'string', size: 2000, required: false },
      { key: 'website', type: 'string', size: 255, required: false },
      { key: 'logo', type: 'string', size: 255, required: false },
      { key: 'location', type: 'string', size: 255, required: false },
      { key: 'industry', type: 'string', size: 255, required: false },
      { key: 'createdAt', type: 'string', size: 50, required: true },
      { key: 'updatedAt', type: 'string', size: 50, required: true }
    ],
    indexes: [
      { key: 'name', type: 'key', attributes: ['name'], orders: ['ASC'] }
    ]
  }
};

// Helper functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function createAttribute(collectionId, attribute) {
  try {
    let result;
    
    switch (attribute.type) {
      case 'string':
        result = await databases.createStringAttribute(
          config.databaseId,
          collectionId,
          attribute.key,
          attribute.size,
          attribute.required,
          attribute.default || null
        );
        break;
        
      case 'email':
        result = await databases.createEmailAttribute(
          config.databaseId,
          collectionId,
          attribute.key,
          attribute.required,
          attribute.default || null
        );
        break;
        
      case 'boolean':
        result = await databases.createBooleanAttribute(
          config.databaseId,
          collectionId,
          attribute.key,
          attribute.required,
          attribute.default
        );
        break;
        
      case 'enum':
        result = await databases.createEnumAttribute(
          config.databaseId,
          collectionId,
          attribute.key,
          attribute.elements,
          attribute.required,
          attribute.default || null
        );
        break;
        
      default:
        throw new Error(`Unsupported attribute type: ${attribute.type}`);
    }
    
    console.log(`  ✅ Created attribute: ${attribute.key} (${attribute.type})`);
    await sleep(500); // Wait between attribute creations
    return true;
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log(`  ⚠️  Attribute ${attribute.key} already exists, skipping`);
      return true;
    } else {
      console.error(`  ❌ Error creating attribute ${attribute.key}:`, error.message);
      return false;
    }
  }
}

async function createIndex(collectionId, index) {
  try {
    await databases.createIndex(
      config.databaseId,
      collectionId,
      index.key,
      index.type,
      index.attributes,
      index.orders
    );
    
    console.log(`  ✅ Created index: ${index.key}`);
    await sleep(500);
    return true;
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log(`  ⚠️  Index ${index.key} already exists, skipping`);
      return true;
    } else {
      console.error(`  ❌ Error creating index ${index.key}:`, error.message);
      return false;
    }
  }
}

async function setupAttributes() {
  console.log('🚀 Starting Appwrite Attributes Setup...\n');
  console.log('📋 This script will only create attributes and indexes for existing collections.\n');
  
  // Validate environment variables
  if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
    console.error('❌ Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID in .env.local');
    process.exit(1);
  }
  
  if (!process.env.APPWRITE_API_KEY) {
    console.error('❌ Missing APPWRITE_API_KEY in .env.local');
    console.log('💡 Please create an API key in your Appwrite console and add it to .env.local');
    process.exit(1);
  }
  
  try {
    // Process each collection
    for (const [collectionId, schema] of Object.entries(collectionSchemas)) {
      const actualCollectionId = config.collections[collectionId];
      
      console.log(`\n📁 Processing collection: ${schema.name} (${actualCollectionId})`);
      console.log(`📝 Adding attributes to ${schema.name}...`);
      
      // Create attributes
      for (const attribute of schema.attributes) {
        await createAttribute(actualCollectionId, attribute);
      }
      
      // Wait for attributes to be ready before creating indexes
      console.log(`⏳ Waiting for attributes to be ready...`);
      await sleep(3000);
      
      console.log(`🔍 Creating indexes for ${schema.name}...`);
      
      // Create indexes
      for (const index of schema.indexes) {
        await createIndex(actualCollectionId, index);
      }
      
      console.log(`✅ Completed setup for ${schema.name}`);
    }
    
    console.log('\n🎉 All attributes and indexes have been created successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Verify attributes and indexes in your Appwrite console');
    console.log('2. Test the application with: pnpm dev');
    console.log('3. Create your first user account');
    console.log('4. Test job creation and applications');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Handle command line usage
if (require.main === module) {
  setupAttributes();
}

module.exports = { setupAttributes }; 