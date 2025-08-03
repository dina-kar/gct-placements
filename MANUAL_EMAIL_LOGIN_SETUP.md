# Manual Email Login Setup Guide

## Overview

This document explains the implementation that allows students without GCT email addresses to login using manually added unverified emails in Appwrite.

## What Was Changed

### 1. Authentication Service (`lib/auth.ts`)

**Modified `sendOTP` method:**
- **SECURITY FIX**: Now exclusively uses users collection for email validation
- Only emails that exist in the users collection can receive OTP codes
- For emails not in collection:
  - GCT domain emails: directed to registration page
  - Non-GCT emails: told to contact placement office
- Reliable and simple validation process
- Handles rate limiting and database errors gracefully
- No complex auth checks - just direct users collection lookup

**Modified `verifyOTP` method:**
- **PROFILE LOOKUP FIX**: Now searches for user profile by both document ID and email
- Handles manually added users whose profile document ID might not match auth user ID
- Falls back to email-based lookup if direct ID lookup fails
- Creates basic profile only if no existing profile found
- Ensures manually added users can access protected routes after login

**Enhanced `hasStudentAccess` method:**
- **ACCESS FIX**: Now grants student access to authenticated users without complete profiles
- Prevents redirect loops for manually added users accessing profile page
- Maintains security while allowing profile completion

**Added `isProfileIncomplete` method:**
- Checks if a user profile needs completion
- Used to redirect users to profile completion page

### 2. Login Page (`app/login/page.tsx`)

**Updated user experience:**
- More inclusive placeholder text (`your.email@example.com` instead of `your.email@gct.ac.in`)
- Updated helper text to mention contacting placement office for non-GCT emails
- Smart redirect logic after login:
  - If profile is incomplete → redirects to profile completion
  - If profile is complete → redirects to dashboard

### 3. Profile Page (`app/profile/page.tsx`)

**Added profile completion mode:**
- Detects `?complete=true` URL parameter
- Shows completion-focused UI:
  - Different header text ("Complete Your Profile")
  - No back button (prevents skipping completion)
  - "Complete Profile" button instead of "Save Changes"
  - Automatic redirect to dashboard after completion

### 4. Auth Context (`contexts/AuthContext.tsx`)

**Updated interface:**
- Added `user` property to `verifyOTP` return type
- Added `isProfileIncomplete` method to context

## How to Use This Feature

### For Placement Officers:

1. **Add Student Email to Users Collection:**
   - **Method 1: Through Application**
     - Use the admin panel to create a user record
     - Add student's email, name, and basic information
     - Set appropriate role and department
   
   - **Method 2: Manually in Appwrite Console**
     - Go to Appwrite Console → Databases → Users Collection
     - Create new document with student's information
     - Ensure `collegeEmail` field contains the student's email
   
   - **Method 3: Add through Appwrite Auth (for OTP functionality)**
     - Go to Appwrite Console → Auth → Users
     - Click "Create User"
     - Enter student's email address
     - Set name (can be temporary)
     - Do NOT verify the email
     - Save the user

2. **Inform Student:**
   - Tell the student their email has been added to the system
   - They can now login using the placement portal
   - They will need to complete their profile if it's incomplete

### For Students with Manually Added Emails:

1. **Login Process:**
   - Go to login page
   - Enter your email address (the one added to the system)
   - Click "Send OTP"
   - Check email for OTP code
   - Enter OTP and verify

2. **Profile Completion (if needed):**
   - After first login, you may be redirected to complete your profile
   - Fill in any missing required information:
     - Full Name
     - Roll Number
     - Department
     - Batch
   - Click "Complete Profile"
   - You'll be redirected to the dashboard

## Technical Notes

### Security Considerations:
- **Users collection validation**: Only emails that exist in the users collection can login
- **Simple and reliable**: No complex auth checks, just direct database lookup
- **Permission requirement**: Users collection must have read permissions for any user
- **Clear separation**: GCT emails → registration page, others → contact placement office
- New registrations still require GCT email domain validation
- Rate limiting protection included
- Database error handling for robust operation

### Database Behavior:
- **Flexible profile lookup**: Searches by both document ID and email for maximum compatibility
- Basic user profiles are created automatically with default values only if no existing profile found
- Users can update their profiles anytime after completion
- All placement portal features work normally after profile completion
- **No redirect loops**: Authenticated users can access profile page even with incomplete profiles

### Error Handling:
- Clear error messages for different scenarios
- Helpful guidance for users who need assistance
- Graceful fallbacks for edge cases

## Benefits

1. **Inclusion:** Students without GCT emails can access the placement portal
2. **Control:** Placement officers control who gets access
3. **User Experience:** Smooth onboarding with guided profile completion
4. **Security:** Maintains security while being more inclusive
5. **Flexibility:** Works alongside existing GCT email authentication

## Troubleshooting

### Common Issues:

1. **"Email not found in our system" error:**
   - Email not found in the users collection
   - For non-GCT emails: Contact placement office to add your email to the users collection
   - For GCT emails: Use the registration page instead

2. **"Email not found. Please sign up first" error:**
   - This appears for GCT domain emails that should use normal registration
   - Use the "Sign up here" link on the login page

3. **"Unable to verify email" error:**
   - Database connection issue or permission problem
   - Check that users collection has read permissions for any user
   - Try again after a moment

4. **"Failed to send OTP" error:**
   - Email exists in users collection but OTP sending failed
   - Contact placement office to ensure email is also added to Appwrite Auth

5. **"Too many requests" error:**
   - Rate limiting is active to prevent spam
   - Wait a few minutes and try again

6. **"Redirected to login when accessing profile page" error:**
   - Usually caused by authentication/profile lookup issues
   - Fixed: System now properly handles manually added users with flexible profile lookup
   - Should work after the latest updates

7. **Profile not found after login:**
   - System will try multiple lookup methods (ID and email)
   - Creates basic profile automatically if none found
   - Contact placement office if issues persist

2. **Profile completion loop:**
   - Essential fields (name, roll no, department, batch) must be filled
   - Check for validation errors in the form

3. **OTP not received:**
   - Check spam folder
   - Verify email address is correct
   - Contact placement office if issue persists

## Future Enhancements

- Bulk email import functionality for placement officers
- Email notification templates for manually added users
- Analytics for manual email usage
- Integration with existing student management systems
