# GCT Placement Portal

A comprehensive placement management system for Government College of Technology (GCT) built with Next.js and Appwrite.

## Features

### 🔐 Authentication
- **Email OTP Authentication**: Secure login using Appwrite's email OTP system
- **Domain Validation**: Only `@gct.ac.in` email addresses are allowed
- **Role-based Access Control**: Support for multiple user roles:
  - Students
  - Placement Representatives
  - Placement Officers
  - Placement Coordinators

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

# Email Domain
NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN=gct.ac.in
```

### 3. Appwrite Setup

Follow the detailed setup guide in `scripts/setup-appwrite.md` to:
- Create Appwrite project
- Set up database collections
- Configure storage buckets
- Set permissions and security rules

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
- All student permissions
- Assist in placement coordination
- View department-specific data

### Placement Officers
- Manage job postings
- Review applications
- Update application status
- Create placement records
- View analytics and reports

### Placement Coordinators
- All officer permissions
- System administration
- User role management
- Advanced analytics

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