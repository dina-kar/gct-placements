#!/usr/bin/env node

/**
 * Appwrite Collections Setup Script
 * 
 * This script automatically creates all the required collections, attributes, 
 * and indexes for the GCT Placement Portal based on the setup guide.
 * 
 * Prerequisites:
 * 1. Install appwrite: npm install node-appwrite
 * 2. Set up your .env.local file with Appwrite credentials
 * 3. Create an API key in Appwrite console with proper permissions
 * 
 * Required API Key Permissions:
 * - databases.read, databases.write
 * - collections.read, collections.write  
 * - attributes.read, attributes.write
 * - indexes.read, indexes.write
 * - buckets.read, buckets.write
 * 
 * Usage: node scripts/setup-collections.js
 */

const { Client, Databases, Storage, Users } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

// Appwrite configuration
const client = new Client();
const databases = new Databases(client);
const storage = new Storage(client);

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY); // You need to add this to your .env.local

const config = {
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'placement-db',
  storageId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || 'placement-files',
  collections: {
    users: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users',
    jobs: process.env.NEXT_PUBLIC_APPWRITE_JOBS_COLLECTION_ID || 'jobs',
    applications: process.env.NEXT_PUBLIC_APPWRITE_APPLICATIONS_COLLECTION_ID || 'applications',
    placements: process.env.NEXT_PUBLIC_APPWRITE_PLACEMENTS_COLLECTION_ID || 'placements',
    companies: process.env.NEXT_PUBLIC_APPWRITE_COMPANIES_COLLECTION_ID || 'companies',
    admin_roles: process.env.NEXT_PUBLIC_APPWRITE_ADMIN_ROLES_COLLECTION_ID || 'admin_roles',
  }
};

// Schema definition
const schema = {
  storage: {
    bucketId: 'placement-files',
    name: 'Placement Files',
    permissions: [
      'read("users")',
      'create("users")',
      'update("users")',
      'delete("users")'
    ],
    fileSizeLimit: 10485760, // 10MB
    allowedFileExtensions: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx']
  },
  collections: {
    users: {
      name: 'Users',
      permissions: [
        'read("users")',
        'create("users")',
        'update("users")',
        'delete("users")'
      ],
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
        { key: 'isPlacementRep', type: 'boolean', required: false, default: false },
        { key: 'role', type: 'string', size: 50, required: false, default: 'student' },
        { key: 'createdAt', type: 'datetime', required: true },
        { key: 'updatedAt', type: 'datetime', required: true }
      ],
      indexes: [
        { key: 'userId_index', type: 'key', attributes: ['userId'], orders: ['ASC'] },
        { key: 'email_index', type: 'key', attributes: ['email'], orders: ['ASC'] },
        { key: 'role_index', type: 'key', attributes: ['role'], orders: ['ASC'] }
      ]
    },
    admin_roles: {
      name: 'Admin Roles',
      permissions: [
        'read("users")',
        'create("users")',
        'update("users")',
        'delete("users")'
      ],
      attributes: [
        { key: 'email', type: 'email', size: 255, required: true },
        { key: 'role', type: 'string', size: 50, required: true },
        { key: 'name', type: 'string', size: 255, required: true },
        { key: 'department', type: 'string', size: 255, required: false },
        { key: 'isActive', type: 'boolean', required: true, default: true },
        { key: 'createdAt', type: 'datetime', required: true },
        { key: 'updatedAt', type: 'datetime', required: true }
      ],
      indexes: [
        { key: 'email_index', type: 'key', attributes: ['email'], orders: ['ASC'] },
        { key: 'role_index', type: 'key', attributes: ['role'], orders: ['ASC'] },
        { key: 'active_index', type: 'key', attributes: ['isActive'], orders: ['ASC'] }
      ]
    },
    jobs: {
      name: 'Jobs',
      permissions: [
        'read("users")',
        'create("users")',
        'update("users")',
        'delete("users")'
      ],
      attributes: [
        { key: 'title', type: 'string', size: 255, required: true },
        { key: 'company', type: 'string', size: 255, required: true },
        { key: 'location', type: 'string', size: 255, required: true },
        { key: 'jobType', type: 'string', size: 50, required: true },
        { key: 'package', type: 'string', size: 100, required: true },
        { key: 'description', type: 'string', size: 5000, required: true },
        { key: 'minCGPA', type: 'string', size: 10, required: true },
        { key: 'noBacklogs', type: 'boolean', required: true },
        { key: 'departments', type: 'string', size: 2000, required: true },
        { key: 'applicationDeadline', type: 'string', size: 50, required: true },
        { key: 'driveDate', type: 'string', size: 50, required: false },
        { key: 'logo', type: 'string', size: 255, required: false },
        { key: 'additionalDocuments', type: 'string', size: 255, required: false },
        { key: 'status', type: 'string', size: 20, required: true, default: 'active' },
        { key: 'createdBy', type: 'string', size: 255, required: true },
        { key: 'createdAt', type: 'datetime', required: true },
        { key: 'updatedAt', type: 'datetime', required: true }
      ],
      indexes: [
        { key: 'company_index', type: 'key', attributes: ['company'], orders: ['ASC'] },
        { key: 'status_index', type: 'key', attributes: ['status'], orders: ['ASC'] },
        { key: 'deadline_index', type: 'key', attributes: ['applicationDeadline'], orders: ['ASC'] },
        { key: 'created_index', type: 'key', attributes: ['createdAt'], orders: ['DESC'] }
      ]
    },
    applications: {
      name: 'Applications',
      permissions: [
        'read("users")',
        'create("users")',
        'update("users")',
        'delete("users")'
      ],
      attributes: [
        { key: 'jobId', type: 'string', size: 255, required: true },
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'jobTitle', type: 'string', size: 255, required: true },
        { key: 'company', type: 'string', size: 255, required: true },
        { key: 'status', type: 'string', size: 50, required: true, default: 'applied' },
        { key: 'coverLetter', type: 'string', size: 2000, required: false },
        { key: 'additionalInfo', type: 'string', size: 1000, required: false },
        { key: 'appliedAt', type: 'datetime', required: true },
        { key: 'userName', type: 'string', size: 255, required: false },
        { key: 'userEmail', type: 'email', size: 255, required: false },
        { key: 'userRollNumber', type: 'string', size: 50, required: false },
        { key: 'userDepartment', type: 'string', size: 255, required: false },
        { key: 'userCGPA', type: 'string', size: 10, required: false },
        { key: 'userResume', type: 'string', size: 255, required: false },
        { key: 'createdAt', type: 'datetime', required: true },
        { key: 'updatedAt', type: 'datetime', required: true }
      ],
      indexes: [
        { key: 'job_index', type: 'key', attributes: ['jobId'], orders: ['ASC'] },
        { key: 'user_index', type: 'key', attributes: ['userId'], orders: ['ASC'] },
        { key: 'status_index', type: 'key', attributes: ['status'], orders: ['ASC'] },
        { key: 'applied_index', type: 'key', attributes: ['appliedAt'], orders: ['DESC'] }
      ]
    },
    placements: {
      name: 'Placements',
      permissions: [
        'read("users")',
        'create("users")',
        'update("users")',
        'delete("users")'
      ],
      attributes: [
        { key: 'studentName', type: 'string', size: 255, required: true },
        { key: 'studentId', type: 'string', size: 100, required: true },
        { key: 'department', type: 'string', size: 255, required: true },
        { key: 'batch', type: 'string', size: 20, required: true },
        { key: 'company', type: 'string', size: 255, required: true },
        { key: 'position', type: 'string', size: 255, required: true },
        { key: 'package', type: 'string', size: 100, required: true },
        { key: 'location', type: 'string', size: 255, required: false },
        { key: 'joiningDate', type: 'string', size: 50, required: false },
        { key: 'offerLetterDate', type: 'string', size: 50, required: true },
        { key: 'testimonial', type: 'string', size: 2000, required: false },
        { key: 'photo', type: 'string', size: 255, required: false },
        { key: 'offerLetter', type: 'string', size: 255, required: false },
        { key: 'createdAt', type: 'datetime', required: true },
        { key: 'updatedAt', type: 'datetime', required: true }
      ],
      indexes: [
        { key: 'student_index', type: 'key', attributes: ['studentId'], orders: ['ASC'] },
        { key: 'company_index', type: 'key', attributes: ['company'], orders: ['ASC'] },
        { key: 'batch_index', type: 'key', attributes: ['batch'], orders: ['ASC'] },
        { key: 'department_index', type: 'key', attributes: ['department'], orders: ['ASC'] }
      ]
    },
    companies: {
      name: 'Companies',
      permissions: [
        'read("users")',
        'create("users")',
        'update("users")',
        'delete("users")'
      ],
      attributes: [
        { key: 'name', type: 'string', size: 255, required: true },
        { key: 'description', type: 'string', size: 2000, required: false },
        { key: 'website', type: 'url', size: 255, required: false },
        { key: 'logo', type: 'string', size: 255, required: false },
        { key: 'location', type: 'string', size: 255, required: false },
        { key: 'industry', type: 'string', size: 255, required: false },
        { key: 'createdAt', type: 'datetime', required: true },
        { key: 'updatedAt', type: 'datetime', required: true }
      ],
      indexes: [
        { key: 'name_index', type: 'key', attributes: ['name'], orders: ['ASC'] },
        { key: 'industry_index', type: 'key', attributes: ['industry'], orders: ['ASC'] }
      ]
    }
  }
}

// Helper functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function createCollection(collectionId, schema) {
  try {
    console.log(`\n📁 Creating collection: ${schema.name} (${collectionId})`);
    
    await databases.createCollection(
      config.databaseId,
      collectionId,
      schema.name,
      ['read("users")', 'read("any")'], // Read permissions
      ['create("users")', 'update("users")', 'delete("users")'], // Write permissions
      true // Document security enabled
    );
    
    console.log(`✅ Collection ${schema.name} created successfully`);
    
    // Wait a bit before adding attributes
    await sleep(1000);
    
    return true;
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log(`⚠️  Collection ${schema.name} already exists, skipping creation`);
      return true;
    } else {
      console.error(`❌ Error creating collection ${schema.name}:`, error.message);
      return false;
    }
  }
}

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

async function createStorageBucket() {
  try {
    console.log(`\n💾 Creating storage bucket: ${config.storageId}`);
    
    await storage.createBucket(
      config.storageId,
      'Placement Files',
      ['read("users")', 'read("any")'], // Read permissions
      ['create("users")', 'update("users")', 'delete("users")'], // Write permissions
      true, // Enabled
      10000000, // 10MB max file size
      ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'], // Allowed extensions
      'none', // Compression
      false, // Encryption
      false, // Antivirus
      true // File security enabled
    );
    
    console.log(`✅ Storage bucket created successfully`);
    return true;
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log(`⚠️  Storage bucket already exists, skipping creation`);
      return true;
    } else {
      console.error(`❌ Error creating storage bucket:`, error.message);
      return false;
    }
  }
}

async function setupCollections() {
  console.log('🚀 Starting Appwrite Collections Setup...\n');
  
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
    // Create storage bucket first
    await createStorageBucket();
    
    // Process each collection
    for (const [collectionId, collectionSchema] of Object.entries(schema.collections)) {
      const actualCollectionId = config.collections[collectionId];
      
      // Create collection
      const collectionCreated = await createCollection(actualCollectionId, collectionSchema);
      if (!collectionCreated) continue;
      
      console.log(`\n📝 Adding attributes to ${collectionSchema.name}...`);
      
      // Create attributes
      for (const attribute of collectionSchema.attributes) {
        await createAttribute(actualCollectionId, attribute);
      }
      
      // Wait for attributes to be ready before creating indexes
      console.log(`⏳ Waiting for attributes to be ready...`);
      await sleep(3000);
      
      console.log(`\n🔍 Creating indexes for ${collectionSchema.name}...`);
      
      // Create indexes
      for (const index of collectionSchema.indexes) {
        await createIndex(actualCollectionId, index);
      }
      
      console.log(`✅ Completed setup for ${collectionSchema.name}`);
    }
    
    console.log('\n🎉 All collections have been set up successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Verify collections in your Appwrite console');
    console.log('2. Test the application with: pnpm dev');
    console.log('3. Create your first user account');
    console.log('4. Update user roles in the database as needed');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Handle command line usage
if (require.main === module) {
  setupCollections();
}

module.exports = { setupCollections }; 