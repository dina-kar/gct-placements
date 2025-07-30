# Appwrite Setup Guide for GCT Placement Portal

This guide will help you set up Appwrite for the GCT Placement Portal.

## Prerequisites

1. Create an account at [Appwrite Cloud](https://cloud.appwrite.io) or set up a self-hosted Appwrite instance
2. Create a new project in your Appwrite console

## Environment Configuration

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id-here
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=placement-db
   NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=placement-files
   
   NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
   NEXT_PUBLIC_APPWRITE_JOBS_COLLECTION_ID=jobs
   NEXT_PUBLIC_APPWRITE_APPLICATIONS_COLLECTION_ID=applications
   NEXT_PUBLIC_APPWRITE_PLACEMENTS_COLLECTION_ID=placements
   NEXT_PUBLIC_APPWRITE_COMPANIES_COLLECTION_ID=companies
   
   NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN=gct.ac.in
   ```

## Appwrite Console Setup

### 1. Authentication Settings

1. Go to **Auth** > **Settings** in your Appwrite console
2. Enable **Email/Password** authentication
3. Add `localhost:3000` and your production domain to **Allowed Origins**

### 2. Create Database

1. Go to **Databases** and create a new database with ID: `placement-db`

### 3. Create Collections

Create the following collections in your database:

#### Users Collection (`users`)

**Attributes:**
- `userId` (String, 255, Required)
- `email` (Email, 255, Required)
- `firstName` (String, 100, Required)
- `lastName` (String, 100, Required)
- `phone` (String, 20)
- `rollNumber` (String, 50)
- `department` (String, 255)
- `year` (String, 20)
- `dateOfBirth` (String, 20)
- `address` (String, 500)
- `cgpa` (String, 10)
- `backlogs` (String, 10)
- `skills` (String, 1000)
- `projects` (String, 2000)
- `internships` (String, 2000)
- `achievements` (String, 2000)
- `bio` (String, 1000)
- `profilePicture` (String, 255)
- `resume` (String, 255)
- `role` (Enum: ['student', 'placement_rep', 'placement_officer', 'placement_coordinator'])
- `isPlacementRep` (Boolean, default: false)
- `createdAt` (String, 50, Required)
- `updatedAt` (String, 50, Required)

**Indexes:**
- `userId` (ASC)
- `email` (ASC)
- `role` (ASC)

**Permissions:**
- Read: `users`
- Write: `users`
- Update: `users`
- Delete: `users`

#### Jobs Collection (`jobs`)

**Attributes:**
- `title` (String, 255, Required)
- `company` (String, 255, Required)
- `location` (String, 255, Required)
- `jobType` (String, 50, Required)
- `package` (String, 100, Required)
- `description` (String, 5000, Required)
- `minCGPA` (String, 10, Required)
- `noBacklogs` (Boolean, default: true)
- `departments` (String, 2000, Required) // JSON array as string
- `applicationDeadline` (String, 50, Required)
- `driveDate` (String, 50)
- `logo` (String, 255)
- `additionalDocuments` (String, 255)
- `status` (Enum: ['active', 'closed', 'draft'], default: 'active')
- `createdBy` (String, 255, Required)
- `createdAt` (String, 50, Required)
- `updatedAt` (String, 50, Required)

**Indexes:**
- `status` (ASC)
- `company` (ASC)
- `createdAt` (DESC)

**Permissions:**
- Read: `users`
- Write: `users` (with role-based restrictions in code)
- Update: `users` (with role-based restrictions in code)
- Delete: `users` (with role-based restrictions in code)

#### Applications Collection (`applications`)

**Attributes:**
- `jobId` (String, 255, Required)
- `userId` (String, 255, Required)
- `status` (Enum: ['applied', 'shortlisted', 'selected', 'rejected'], default: 'applied')
- `appliedAt` (String, 50, Required)
- `updatedAt` (String, 50, Required)

**Indexes:**
- `jobId` (ASC)
- `userId` (ASC)
- `status` (ASC)
- `appliedAt` (DESC)

**Permissions:**
- Read: `users`
- Write: `users`
- Update: `users` (with role-based restrictions in code)
- Delete: `users`

#### Placements Collection (`placements`)

**Attributes:**
- `userId` (String, 255, Required)
- `jobId` (String, 255, Required)
- `company` (String, 255, Required)
- `package` (String, 100, Required)
- `placedAt` (String, 50, Required)
- `createdAt` (String, 50, Required)

**Indexes:**
- `userId` (ASC)
- `company` (ASC)
- `placedAt` (DESC)

**Permissions:**
- Read: `users`
- Write: `users` (with role-based restrictions in code)
- Update: `users` (with role-based restrictions in code)
- Delete: `users` (with role-based restrictions in code)

#### Companies Collection (`companies`)

**Attributes:**
- `name` (String, 255, Required)
- `description` (String, 2000)
- `website` (String, 255)
- `logo` (String, 255)
- `location` (String, 255)
- `industry` (String, 255)
- `createdAt` (String, 50, Required)
- `updatedAt` (String, 50, Required)

**Indexes:**
- `name` (ASC)

**Permissions:**
- Read: `users`
- Write: `users` (with role-based restrictions in code)
- Update: `users` (with role-based restrictions in code)
- Delete: `users` (with role-based restrictions in code)

### 4. Create Storage Bucket

1. Go to **Storage** and create a new bucket with ID: `placement-files`
2. Set maximum file size to 10MB
3. Add allowed file extensions: `jpg,jpeg,png,gif,pdf,doc,docx`
4. Set permissions:
   - Read: `users`
   - Write: `users`
   - Update: `users`
   - Delete: `users`

### 5. Security Rules

For production, you should implement proper security rules. The current setup uses basic user-level permissions, but you should add server-side validation for role-based access control.

## Email Configuration (Optional)

If you want to customize the OTP email templates:

1. Go to **Auth** > **Templates**
2. Customize the email verification template
3. Set up SMTP settings if using custom email provider

## Testing the Setup

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Navigate to `http://localhost:3000/signup`
3. Try creating an account with a `@gct.ac.in` email address
4. Check that you receive the OTP email
5. Complete the registration process

## Troubleshooting

1. **CORS errors**: Make sure your domain is added to allowed origins in Appwrite console
2. **Permission errors**: Verify collection permissions are set correctly
3. **Email not received**: Check spam folder and email template settings
4. **Database errors**: Ensure all collections and attributes are created correctly

## Next Steps

After setup is complete, you can:

1. Create admin users by manually updating their role in the database
2. Set up proper backup procedures
3. Implement monitoring and logging
4. Configure production environment variables
5. Set up CI/CD pipelines

For production deployment, remember to:
- Use environment-specific project IDs
- Set up proper security rules
- Configure backup strategies
- Monitor usage and performance 


## 🗄️ Complete Appwrite Collection Attributes

### **📋 1. Applications Collection (`applications`)**

**Required Attributes:**
```
jobId - String, 255, Required
userId - String, 255, Required  
jobTitle - String, 255, Required
company - String, 255, Required
status - Enum (applied,under_review,interview_scheduled,selected,rejected), Required, Default: applied
appliedAt - String, 50, Required
createdAt - String, 50, Required
updatedAt - String, 50, Required
```

**Optional Attributes (for backward compatibility):**
```
coverLetter - String, 5000, Optional
additionalInfo - String, 2000, Optional
```

**User Details (populated when needed):**
```
userName - String, 255, Optional
userEmail - String, 255, Optional
userPhone - String, 20, Optional
userPersonalEmail - String, 255, Optional
userRollNumber - String, 50, Optional
userDepartment - String, 255, Optional
userCGPA - String, 10, Optional
userActiveBacklog - String, 10, Optional
userHistoryOfArrear - String, 10, Optional
userResume - String, 255, Optional
```

### **👥 2. Users Collection (`users`) - Profile Data**

**Required Attributes:**
```
userId - String, 255, Required
email - Email, 255, Required
firstName - String, 100, Required
lastName - String, 100, Required
createdAt - String, 50, Required
updatedAt - String, 50, Required
```

**Personal Information:**
```
phone - String, 20, Optional
personalEmail - String, 255, Optional
dateOfBirth - String, 20, Optional
address - String, 500, Optional
```

**Academic Information:**
```
rollNumber - String, 50, Optional
department - String, 255, Optional
year - String, 20, Optional
cgpa - String, 10, Optional
backlogs - String, 10, Optional (for backward compatibility)
historyOfArrear - Enum (Yes,No), Optional, Default: No
activeBacklog - Enum (Yes,No), Optional, Default: No
```

**Professional Information:**
```
skills - String, 1000, Optional
projects - String, 2000, Optional
internships - String, 2000, Optional
achievements - String, 2000, Optional
bio - String, 1000, Optional
```

**Files:**
```
profilePicture - String, 255, Optional
resume - String, 255, Optional
```

**Role Management:**
```
role - Enum (student,placement_rep,placement_officer,placement_coordinator), Optional, Default: student
isPlacementRep - Boolean, Optional, Default: false
```

### **💼 3. Jobs Collection (`jobs`)**

**Required Attributes:**
```
title - String, 255, Required
company - String, 255, Required
location - String, 255, Required
jobType - String, 50, Required
package - String, 100, Required
description - String, 5000, Required
minCGPA - String, 10, Required
noBacklogs - Boolean, Required, Default: true
departments - String, 2000, Required (JSON array as string)
applicationDeadline - String, 50, Required
status - Enum (active,closed,draft), Required, Default: active
createdBy - String, 255, Required
createdAt - String, 50, Required
updatedAt - String, 50, Required
```

**Optional Attributes:**
```
driveDate - String, 50, Optional
logo - String, 255, Optional
additionalDocuments - String, 255, Optional
```

### **🎓 4. Placements Collection (`placements`)**

**Required Attributes (minimum schema):**
```
userId - String, 255, Required
jobId - String, 255, Required
company - String, 255, Required
package - String, 100, Required
placedAt - String, 50, Required
createdAt - String, 50, Required
```

**Optional Attributes (for UI display):**
```
studentName - String, 255, Optional
studentId - String, 50, Optional
department - String, 255, Optional
batch - String, 20, Optional
position - String, 255, Optional
location - String, 255, Optional
joiningDate - String, 50, Optional
offerLetterDate - String, 50, Optional
testimonial - String, 2000, Optional
photo - String, 255, Optional
offerLetter - String, 255, Optional
updatedAt - String, 50, Optional
```

### **🏢 5. Companies Collection (`companies`)**

**Required Attributes:**
```
name - String, 255, Required
createdAt - String, 50, Required
updatedAt - String, 50, Required
```

**Optional Attributes:**
```
description - String, 2000, Optional
website - String, 255, Optional
logo - String, 255, Optional
location - String, 255, Optional
industry - String, 255, Optional
```

### **⚙️ 6. Admin Roles Collection (`admin_roles`)**

**Required Attributes:**
```
email - String, 255, Required
role - Enum (placement_rep,placement_officer,placement_coordinator), Required
name - String, 255, Required
isActive - Boolean, Required, Default: true
createdAt - String, 50, Required
updatedAt - String, 50, Required
```

**Optional Attributes:**
```
department - String, 255, Optional
```

## 🔧 **Quick Setup Summary**

### **Immediate Priority (for job applications to work):**
1. **Applications Collection**: Add `jobTitle`, `company`, `userPhone`, `userPersonalEmail`, `userActiveBacklog`, `userHistoryOfArrear`
2. **Users Collection**: Add `personalEmail`, `historyOfArrear`, `activeBacklog`

### **Recommended Indexes:**
```
Applications: jobId (ASC), userId (ASC), status (ASC), appliedAt (DESC)
Users: userId (ASC), email (ASC), role (ASC)
Jobs: status (ASC), company (ASC), createdAt (DESC)
Placements: userId (ASC), company (ASC), placedAt (DESC)
Companies: name (ASC)
AdminRoles: email (ASC), role (ASC)
```

### **Permissions (for all collections):**
```
Read: users
Write: users
Update: users (with role-based restrictions in code)
Delete: users (with role-based restrictions in code)
```

The application will now collect the new fields (personal email, history of arrear, active backlog) in the user profile and use them for eligibility checking, while the cover letter and additional information have been completely removed from the UI.

```plaintext
jobId - String, 255, Required
userId - String, 255, Required  
jobTitle - String, 255, Required
company - String, 255, Required
status - Enum (applied,under_review,interview_scheduled,selected,rejected), Required, Default: applied
appliedAt - String, 50, Required
createdAt - String, 50, Required
updatedAt - String, 50, Required
```

```plaintext
coverLetter - String, 5000, Optional
additionalInfo - String, 2000, Optional
```

```plaintext
userName - String, 255, Optional
userEmail - String, 255, Optional
userPhone - String, 20, Optional
userPersonalEmail - String, 255, Optional
userRollNumber - String, 50, Optional
userDepartment - String, 255, Optional
userCGPA - String, 10, Optional
userActiveBacklog - String, 10, Optional
userHistoryOfArrear - String, 10, Optional
userResume - String, 255, Optional
```

```plaintext
userId - String, 255, Required
email - Email, 255, Required
firstName - String, 100, Required
lastName - String, 100, Required
createdAt - String, 50, Required
updatedAt - String, 50, Required
```

```plaintext
phone - String, 20, Optional
personalEmail - String, 255, Optional
dateOfBirth - String, 20, Optional
address - String, 500, Optional
```

```plaintext
rollNumber - String, 50, Optional
department - String, 255, Optional
year - String, 20, Optional
cgpa - String, 10, Optional
backlogs - String, 10, Optional (for backward compatibility)
historyOfArrear - Enum (Yes,No), Optional, Default: No
activeBacklog - Enum (Yes,No), Optional, Default: No
```

```plaintext
skills - String, 1000, Optional
projects - String, 2000, Optional
internships - String, 2000, Optional
achievements - String, 2000, Optional
bio - String, 1000, Optional
```

```plaintext
profilePicture - String, 255, Optional
resume - String, 255, Optional
```

```plaintext
role - Enum (student,placement_rep,placement_officer,placement_coordinator), Optional, Default: student
isPlacementRep - Boolean, Optional, Default: false
```

```plaintext
title - String, 255, Required
company - String, 255, Required
location - String, 255, Required
jobType - String, 50, Required
package - String, 100, Required
description - String, 5000, Required
minCGPA - String, 10, Required
noBacklogs - Boolean, Required, Default: true
departments - String, 2000, Required (JSON array as string)
applicationDeadline - String, 50, Required
status - Enum (active,closed,draft), Required, Default: active
createdBy - String, 255, Required
createdAt - String, 50, Required
updatedAt - String, 50, Required
```

```plaintext
driveDate - String, 50, Optional
logo - String, 255, Optional
additionalDocuments - String, 255, Optional
```

```plaintext
userId - String, 255, Required
jobId - String, 255, Required
company - String, 255, Required
package - String, 100, Required
placedAt - String, 50, Required
createdAt - String, 50, Required
```

```plaintext
studentName - String, 255, Optional
studentId - String, 50, Optional
department - String, 255, Optional
batch - String, 20, Optional
position - String, 255, Optional
location - String, 255, Optional
joiningDate - String, 50, Optional
offerLetterDate - String, 50, Optional
testimonial - String, 2000, Optional
photo - String, 255, Optional
offerLetter - String, 255, Optional
updatedAt - String, 50, Optional
```

```plaintext
name - String, 255, Required
createdAt - String, 50, Required
updatedAt - String, 50, Required
```

```plaintext
description - String, 2000, Optional
website - String, 255, Optional
logo - String, 255, Optional
location - String, 255, Optional
industry - String, 255, Optional
```

```plaintext
email - String, 255, Required
role - Enum (placement_rep,placement_officer,placement_coordinator), Required
name - String, 255, Required
isActive - Boolean, Required, Default: true
createdAt - String, 50, Required
updatedAt - String, 50, Required
```

```plaintext
department - String, 255, Optional
```

```plaintext
Applications: jobId (ASC), userId (ASC), status (ASC), appliedAt (DESC)
Users: userId (ASC), email (ASC), role (ASC)
Jobs: status (ASC), company (ASC), createdAt (DESC)
Placements: userId (ASC), company (ASC), placedAt (DESC)
Companies: name (ASC)
AdminRoles: email (ASC), role (ASC)
```

```plaintext
Read: users
Write: users
Update: users (with role-based restrictions in code)
Delete: users (with role-based restrictions in code)
```
