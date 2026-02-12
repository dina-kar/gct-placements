# GCT Placement Portal

A comprehensive placement management system for Government College of Technology (GCT) built with Next.js and Appwrite.

## Features

### 🔐 Authentication
- **Email OTP Authentication**: Secure login using Appwrite's email OTP system
- **Domain Validation**: Only `@gct.ac.in` email addresses are allowed
- **Collection-based Admin Management**: Admin roles are managed through a dedicated collection
- **Role-based Access Control**: Support for multiple user roles:
  - **Students**: Standard user access with job browsing and application features
  - **Placement Representatives**: Dual access to both student and admin features
  - **Placement Officers**: Admin-only access for managing jobs and applications
  - **Placement Coordinators**: Full administrative access including user management

### 👥 User Management
- **Student Profiles**: Comprehensive profile management with:
  - Personal information
  - Academic details (CGPA, backlogs, etc.)
  - Skills and projects
  - Resume and profile picture upload
- **Role-based Dashboards**: Different interfaces for students and administrators
- **Placement Rep System**: Students can register as department placement representatives

### 💼 Job Management
- **Job Posting**: Admins can create detailed job postings with:
  - Company information and logos
  - Job requirements and descriptions
  - Department and CGPA eligibility criteria
  - Application deadlines and placement drive dates
- **Application System**: Students can apply for jobs with automatic eligibility checking
- **Application Tracking**: Track application status (applied, shortlisted, selected, rejected)

### 📊 Placement Tracking
- **Placement Records**: Maintain records of successful placements
- **Analytics Dashboard**: View placement statistics and trends
- **Company Management**: Track visiting companies and their job postings

### 📁 File Management
- **Resume Storage**: Secure storage and retrieval of student resumes
- **Profile Pictures**: Upload and managepwrite's real-time database capabilities
File Management: Integrated storage for resumes and documents
Mobile-Ready: Responsive design with modern UI components
Type-Safe: Full TypeScript coverage for better development experience
The system is now ready for production u profile images
- **Company Logos**: Store company logos and additional documents
- **Document Security**: Role-based access to uploaded files

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Appwrite (Database, Authentication, Storage)
- **UI Components**: shadcn/ui, Tailwind CSS
- **Authentication**: Appwrite Email OTP
- **File Storage**: Appwrite Storage
- **Deployment**: Vercel-ready

## Prerequisites

- Node.js 18+ and pnpm
- Appwrite account (Cloud or self-hosted)
- GCT email domain access for testing

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd placement-app
pnpm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Update `.env.local` with your Appwrite project details:

```env
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
NEXT_PUBLIC_APPWRITE_ADMIN_ROLES_COLLECTION_ID=admin_roles

# Email Domain
NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN=gct.ac.in
```

### 3. Appwrite Setup

Follow the detailed setup guide in `scripts/setup-appwrite.md` to:
- Create Appwrite project
- Set up database collections
- Configure storage buckets
- Set permissions and security rules
Docker command to run appwrite locally

For linux and Mac os:
```bash
docker run -it --rm \
    --volume /var/run/docker.sock:/var/run/docker.sock \
    --volume "$(pwd)"/appwrite:/usr/src/code/appwrite:rw \
    --entrypoint="install" \
    appwrite/appwrite:1.7.4
```

For Windows:
In Command prompt,
```bash
docker run -it --rm ^
    --volume //var/run/docker.sock:/var/run/docker.sock ^
    --volume "%cd%"/appwrite:/usr/src/code/appwrite:rw ^
    --entrypoint="install" ^
    appwrite/appwrite:1.7.4
```
In powershell
```bash
docker run -it --rm `
    --volume /var/run/docker.sock:/var/run/docker.sock `
    --volume ${pwd}/appwrite:/usr/src/code/appwrite:rw `
    --entrypoint="install" `
    appwrite/appwrite:1.7.4
```

### 4. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
placement-app/
├── app/                          # Next.js app directory
│   ├── admin/                    # Admin pages (protected)
│   │   ├── add-job/             # Job creation form
│   │   ├── add-placement/       # Placement records
│   │   ├── dashboard/           # Admin dashboard
│   │   └── login/               # Admin login
│   ├── dashboard/               # Student dashboard
│   ├── jobs/                    # Job listings
│   ├── login/                   # Student login
│   ├── placed-students/         # Placement records
│   ├── profile/                 # User profile management
│   └── signup/                  # User registration
├── components/                   # Reusable components
│   ├── ui/                      # shadcn/ui components
│   ├── ProtectedRoute.tsx       # Route protection
│   └── theme-provider.tsx       # Theme management
├── contexts/                    # React contexts
│   └── AuthContext.tsx          # Authentication context
├── lib/                         # Utility libraries
│   ├── appwrite.ts              # Appwrite configuration
│   ├── auth.ts                  # Authentication services
│   ├── database.ts              # Database operations
│   └── utils.ts                 # Utility functions
├── scripts/                     # Setup scripts and guides
│   └── setup-appwrite.md        # Appwrite setup guide
└── hooks/                       # Custom React hooks
```

## User Roles and Permissions

### Students
- Create and manage profiles
- Browse and apply for jobs
- Track application status
- Upload resumes and documents
- View placement statistics

### Placement Representatives
- All student permissions (dual access)
- Can switch between student and admin portals
- Access to basic admin features
- Assist in placement coordination

### Placement Officers
- Admin-only access (no student portal)
- Manage job postings
- Review applications
- Update application status
- Create placement records
- View analytics and reports

### Placement Coordinators
- Full administrative access
- All officer permissions
- Admin role management through dedicated interface
- System administration
- Advanced analytics and reporting

## Key Features Implementation

### Email OTP Authentication
```typescript
// lib/auth.ts
export class AuthService {
  static async sendOTP(email: string): Promise<{success: boolean, message: string}>
  static async verifyOTP(userId: string, otp: string): Promise<{success: boolean, user?: any}>
}
```

### Protected Routes
```typescript
// components/ProtectedRoute.tsx
<ProtectedRoute requireAuth adminOnly>
  <AdminDashboard />
</ProtectedRoute>
```

### Database Operations
```typescript
// lib/database.ts
export class DatabaseService {
  static async createJob(data: JobData): Promise<{success: boolean, job?: Job}>
  static async applyForJob(jobId: string, userId: string): Promise<{success: boolean}>
}
```

## Development Guidelines

### Adding New Features
1. Create appropriate database collections in Appwrite
2. Add TypeScript interfaces in `lib/appwrite.ts`
3. Implement database operations in `lib/database.ts`
4. Create UI components with proper protection
5. Add proper error handling and loading states

### Security Considerations
- All routes are protected by default
- Role-based access control is enforced
- File uploads are validated and secured
- Email domain validation prevents unauthorized access

## Deployment

### Vercel Deployment
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy with automatic builds on push

### Environment Variables for Production
- Use production Appwrite project ID
- Configure proper domain allowlists
- Set up monitoring and error tracking
- Configure backup strategies

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify Appwrite project configuration
   - Check email domain settings
   - Ensure proper CORS settings

2. **Permission Errors**
   - Review collection permissions in Appwrite
   - Check user role assignments
   - Verify route protection implementation

3. **File Upload Issues**
   - Check storage bucket configuration
   - Verify file size limits
   - Ensure proper file type restrictions

### Support
- Check the detailed setup guide in `scripts/setup-appwrite.md`
- Review Appwrite documentation for advanced configuration
- Ensure all environment variables are properly set

## Initial Setup

After running the setup scripts and deploying the application:

1. **Create Initial Admin**: Use the Appwrite console to manually add the first placement coordinator record to the `admin_roles` collection
2. **Admin Role Structure**:
   ```json
   {
     "email": "coordinator@gct.ac.in",
     "role": "placement_coordinator", 
     "name": "Coordinator Name",
     "department": "Computer Science and Engineering",
     "isActive": true
   }
   ```
3. **Role Management**: Placement coordinators can then use the admin interface to manage other admin roles

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes with proper testing
4. Update documentation as needed
5. Submit a pull request

## License

This project is licensed under the MIT License. See LICENSE file for details.

---

**Built with ❤️ for Government College of Technology** 
\n+## UI / Loading Enhancements (Sep 2025)

The portal now has a unified loading and skeleton system for smoother perceived performance and visual polish.

Highlights:
- Reusable loaders: `components/LoadingScreen.tsx` (full + subtle inline variants) and `components/Skeletons.tsx` (card, list, profile header, text).
- Route-level streaming loading states via new `loading.tsx` files for: root, dashboard, jobs, placements, profile, auth (login/signup), and all admin subsections (add/edit job, placements, manage admins, etc.).
- Suspense-based fallbacks added inside heavy data pages (`dashboard`, `jobs`, `placements`) to show skeletons while lists resolve.
- Global gradient + noise background and utility design tokens (`--grad-from`, `--grad-to`) added in `styles/globals.css`.
- New utility component classes: `btn-primary`, `btn-outline-strong`, `card-soft`, `glass`, `gradient-text`, `pulse-ring`.

Example usage:
```tsx
import { Suspense } from 'react'
import { LoadingScreen } from '@/components/LoadingScreen'
import { CardSkeleton } from '@/components/Skeletons'

<Suspense fallback={<CardSkeleton count={3} />}> 
  <JobsSection />
</Suspense>

<LoadingScreen message="Fetching profile" />
<LoadingScreen subtle fullscreen={false} message="Refreshing" />
```

Customize gradient branding by editing `--grad-from` / `--grad-to` in `styles/globals.css`.