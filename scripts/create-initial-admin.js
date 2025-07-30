#!/usr/bin/env node

const { Client, Databases, ID } = require('node-appwrite');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Configuration
const config = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  apiKey: process.env.APPWRITE_API_KEY,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'placement-db',
  adminRolesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_ADMIN_ROLES_COLLECTION_ID || 'admin_roles',
};

// Initialize Appwrite
const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.apiKey);

const databases = new Databases(client);

async function createInitialAdmin() {
  console.log('🚀 Creating Initial Admin Role...\n');
  
  // Validate environment variables
  if (!config.projectId) {
    console.error('❌ Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID in .env.local');
    process.exit(1);
  }
  
  if (!config.apiKey) {
    console.error('❌ Missing APPWRITE_API_KEY in .env.local');
    console.log('💡 Please create an API key in your Appwrite console and add it to .env.local');
    process.exit(1);
  }
  
  // Prompt for admin details
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const question = (query) => new Promise((resolve) => rl.question(query, resolve));
  
  try {
    console.log('Please provide details for the initial placement coordinator:\n');
    
    const email = await question('Email (must be @gct.ac.in): ');
    if (!email.endsWith('@gct.ac.in')) {
      throw new Error('Email must be from gct.ac.in domain');
    }
    
    const name = await question('Full Name: ');
    if (!name.trim()) {
      throw new Error('Name is required');
    }
    
    const department = await question('Department (optional): ');
    
    rl.close();
    
    // Create the admin role
    const adminData = {
      email: email.toLowerCase().trim(),
      role: 'placement_coordinator',
      name: name.trim(),
      department: department.trim() || undefined,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    console.log('\n📝 Creating admin role...');
    
    const result = await databases.createDocument(
      config.databaseId,
      config.adminRolesCollectionId,
      ID.unique(),
      adminData
    );
    
    console.log('✅ Initial admin role created successfully!');
    console.log('\n📋 Admin Details:');
    console.log(`   Email: ${result.email}`);
    console.log(`   Name: ${result.name}`);
    console.log(`   Role: ${result.role}`);
    if (result.department) {
      console.log(`   Department: ${result.department}`);
    }
    console.log(`   Created: ${new Date(result.createdAt).toLocaleString()}`);
    
    console.log('\n🎉 Setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. The admin can now log in using email OTP');
    console.log('2. Access the admin dashboard at /admin/dashboard');
    console.log('3. Use "Manage Admins" to create additional admin roles');
    console.log('4. Start managing jobs and placements!');
    
  } catch (error) {
    if (error.message && error.message.includes('already exists')) {
      console.log('⚠️  An admin role with this email already exists');
    } else {
      console.error('\n❌ Failed to create admin role:', error.message);
    }
    process.exit(1);
  }
}

// Handle command line usage
if (require.main === module) {
  createInitialAdmin();
}

module.exports = { createInitialAdmin }; 