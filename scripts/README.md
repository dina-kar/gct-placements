# Automated Appwrite Setup Scripts

This directory contains automated setup scripts for configuring your Appwrite backend.

## Quick Setup Guide

### 1. Prerequisites

- Appwrite project created (either cloud or self-hosted)
- Environment variables configured in `.env.local`
- API key with proper permissions

### 2. Get Your API Key

1. Go to your Appwrite console
2. Navigate to **Settings** > **API Keys**
3. Click **Create API Key**
4. Set the following scopes:
   - `databases.read`
   - `databases.write`
   - `collections.read`
   - `collections.write`
   - `attributes.read`
   - `attributes.write`
   - `indexes.read`
   - `indexes.write`
   - `buckets.read`
   - `buckets.write`
5. Copy the generated API key

### 3. Update Environment Variables

Add the API key to your `.env.local` file:

```env
# Your existing variables...
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=placement-db
NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=placement-files

# Collection IDs
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
NEXT_PUBLIC_APPWRITE_JOBS_COLLECTION_ID=jobs
NEXT_PUBLIC_APPWRITE_APPLICATIONS_COLLECTION_ID=applications
NEXT_PUBLIC_APPWRITE_PLACEMENTS_COLLECTION_ID=placements
NEXT_PUBLIC_APPWRITE_COMPANIES_COLLECTION_ID=companies

# Email Domain
NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN=gct.ac.in

# Add this for the setup script
APPWRITE_API_KEY=your-api-key-here
```

### 4. Run the Setup Script

```bash
# Using npm script
pnpm run setup:appwrite

# Or directly
node scripts/setup-collections.js
```

### 5. What the Script Does

The automated setup script will:

✅ **Create Storage Bucket** (`placement-files`)
- 10MB file size limit
- Supports: jpg, jpeg, png, gif, pdf, doc, docx
- Proper user permissions

✅ **Create Collections:**

**Users Collection** (`users`)
- 23 attributes including profile data, academic info
- Indexes on userId, email, role
- User-level permissions

**Jobs Collection** (`jobs`)
- 19 attributes for job postings
- Indexes on status, company, createdAt
- User-level permissions

**Applications Collection** (`applications`)
- 5 attributes for tracking applications
- Indexes on jobId, userId, status, appliedAt
- User-level permissions

**Placements Collection** (`placements`)
- 6 attributes for placement records
- Indexes on userId, company, placedAt
- User-level permissions

**Companies Collection** (`companies`)
- 8 attributes for company information
- Index on company name
- User-level permissions

### 6. Verify Setup

After running the script:

1. Check your Appwrite console
2. Verify all collections are created with correct attributes
3. Confirm storage bucket exists
4. Test the application: `pnpm dev`

### 7. Troubleshooting

**Common Issues:**

1. **API Key Errors**: Ensure your API key has all required permissions
2. **Project Not Found**: Verify `NEXT_PUBLIC_APPWRITE_PROJECT_ID` is correct
3. **Permission Errors**: Check your API key permissions in Appwrite console
4. **Network Issues**: Ensure you can reach your Appwrite endpoint

**Script Output:**
- ✅ Success indicators
- ⚠️ Warnings for existing resources
- ❌ Error messages with details

### 8. Manual Verification

After setup, manually verify in Appwrite console:

1. **Database** > `placement-db` exists
2. **Collections** > All 5 collections present
3. **Attributes** > Each collection has correct attributes
4. **Indexes** > Performance indexes created
5. **Storage** > `placement-files` bucket exists
6. **Permissions** > All resources have `users` permissions

### 9. Next Steps

After successful setup:

1. Start development server: `pnpm dev`
2. Create your first test account
3. Test file uploads and job posting
4. Set initial admin user roles in the database

### 10. Security Notes

⚠️ **Important**: 
- Keep your API key secure and never commit it to version control
- The API key is only needed for initial setup
- Consider deleting the API key after setup is complete
- Use proper environment-specific projects for staging/production

For detailed manual setup instructions, see `setup-appwrite.md`. 