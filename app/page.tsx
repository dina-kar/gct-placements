"use client"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Building2, Users, TrendingUp, CheckCircle, ArrowRight, Star, Award, Target } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

export default function LandingPage() {
  const { isAuthenticated, isAdmin, hasStudentAccess } = useAuth()

  const getDashboardLink = () => {
    if (isAdmin) return "/admin/dashboard"
    if (hasStudentAccess) return "/dashboard"
    return "/dashboard"
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.08),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.08),transparent_40%)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center pulse-ring" style={{ backgroundImage: "linear-gradient(90deg, hsl(var(--grad-from)), hsl(var(--grad-to)))" }}>
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">GCT Placement Portal</h1>
              <p className="text-xs text-muted-foreground">Government College of Technology</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#stats" className="hover:text-foreground transition-colors">Stats</a>
            <a href="#recruiters" className="hover:text-foreground transition-colors">Recruiters</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link href={getDashboardLink()}>
                <Button size="sm" className="btn-primary">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button size="sm" variant="ghost">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="btn-primary">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20"
               style={{ backgroundImage: "linear-gradient(90deg, hsl(var(--grad-from)), hsl(var(--grad-to)))" }} />
          <div className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-20"
               style={{ backgroundImage: "linear-gradient(90deg, hsl(var(--grad-to)), hsl(var(--grad-from)))" }} />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-6 bg-accent text-accent-foreground border border-border/70">
              <Star className="w-4 h-4 mr-2 text-primary" />
              Build Your Future with GCT Placement Cell
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Your Gateway to <span className="gradient-text">Dream Careers</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Connect with top recruiters, showcase your skills, and land your perfect job. A comprehensive placement
              platform designed for student success.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link href={getDashboardLink()}>
                  <Button size="lg" className="btn-primary">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/signup">
                    <Button size="lg" className="btn-primary">
                      Start Your Journey
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/admin/login">
                    <Button size="lg" variant="outline" className="btn-outline-strong">
                      Placement Representative Access
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Create Profile", desc: "Build a standout resume & profile" },
                { label: "Apply Fast", desc: "1-click applications to jobs" },
                { label: "Track Offers", desc: "Stay on top of interview rounds" },
              ].map((item) => (
                <div key={item.label} className="card-soft card-hover p-4 text-left">
                  <div className="text-sm font-semibold">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Users, color: "text-primary", bg: "bg-primary/10", value: "10,000+", label: "Active Students" },
              { icon: Building2, color: "text-green-600", bg: "bg-green-600/10", value: "500+", label: "Partner Companies" },
              { icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-600/10", value: "95%", label: "Placement Rate" },
              { icon: Award, color: "text-amber-600", bg: "bg-amber-500/10", value: "₹12L", label: "Average Package" },
            ].map((s) => (
              <div key={s.label} className="glass rounded-xl p-6 text-center card-hover">
                <div className={`w-14 h-14 ${s.bg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <s.icon className={`w-7 h-7 ${s.color}`} />
                </div>
                <div className="text-3xl font-bold">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-3">Everything You Need for Successful Placements</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and features designed to streamline the placement process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Smart Job Matching", desc: "AI-powered recommendations based on your skills, CGPA, and preferences", tint: "from-primary/15 to-primary/5", color: "text-primary" },
              { icon: CheckCircle, title: "Easy Application Process", desc: "One-click applications with automatic resume and profile submission", tint: "from-emerald-500/15 to-emerald-500/5", color: "text-emerald-600" },
              { icon: Users, title: "Recruiter Dashboard", desc: "Admin panel for placement officers to manage jobs and students", tint: "from-purple-500/15 to-purple-500/5", color: "text-purple-600" },
              { icon: GraduationCap, title: "Profile Management", desc: "Complete student profiles with records, skills, and achievements", tint: "from-amber-500/15 to-amber-500/5", color: "text-amber-600" },
              { icon: TrendingUp, title: "Analytics & Reports", desc: "Detailed placement statistics and exportable student data", tint: "from-rose-500/15 to-rose-500/5", color: "text-rose-600" },
              { icon: Building2, title: "Company Integration", desc: "Seamless integration with top companies for direct recruitment", tint: "from-cyan-500/15 to-cyan-500/5", color: "text-cyan-600" },
            ].map((f) => (
              <Card key={f.title} className="card-soft card-hover relative overflow-hidden">
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${f.tint}`} />
                <CardHeader className="relative">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3" style={{ backgroundImage: "linear-gradient(90deg, hsl(var(--grad-from) / .12), hsl(var(--grad-to) /.12))" }}>
                    <f.icon className={`w-6 h-6 ${f.color}`} />
                  </div>
                  <CardTitle>{f.title}</CardTitle>
                  <CardDescription>{f.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recruiters strip */}
      <section id="recruiters" className="py-12">
        <div className="container mx-auto px-4">
          <div className="card-soft p-6">
            <p className="text-center text-sm text-muted-foreground mb-6">Trusted by recruiters from</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center">
              {["placeholder-logo.svg","placeholder-logo.png","placeholder.svg","placeholder.jpg","placeholder-user.jpg","placeholder-logo.svg"].map((src, i) => (
                <div key={i} className="opacity-60 hover:opacity-100 transition-opacity">
                  <img src={`/public/${src}`} alt="Recruiter logo" className="mx-auto h-8 object-contain invert dark:invert-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-2">Student Success Stories</h3>
            <p className="text-muted-foreground">Hear from our alumni who landed roles at top companies</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Thamarai", role: "SWE @ TopTech", quote: "The portal made applications effortless and interviews organized." },
              { name: "Manoj K", role: "Data Analyst @ Finlytics", quote: "Smart matching helped me find roles that fit my profile perfectly." },
              { name: "Meera V", role: "Product Engineer @ BuildCo", quote: "Loved the clean UI and real-time updates on every round." },
            ].map((t) => (
              <div key={t.name} className="card-soft card-hover p-6">
                <div className="flex items-center gap-3 mb-3">
                  <img src="/placeholder-user.jpg" alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">“{t.quote}”</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Split CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-6">
          <div className="card-soft p-8 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-20"
                 style={{ backgroundImage: "linear-gradient(90deg, hsl(var(--grad-from)), hsl(var(--grad-to)))" }} />
            <h4 className="text-2xl font-semibold mb-2">Students</h4>
            <p className="text-sm text-muted-foreground mb-5">Create your profile, apply faster and track every stage.</p>
            <Link href="/signup">
              <Button className="btn-primary">
                Create Student Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="card-soft p-8 relative overflow-hidden">
            <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full blur-3xl opacity-20"
                 style={{ backgroundImage: "linear-gradient(90deg, hsl(var(--grad-to)), hsl(var(--grad-from)))" }} />
            <h4 className="text-2xl font-semibold mb-2">Placement Reps</h4>
            <p className="text-sm text-muted-foreground mb-5">Post jobs, shortlist candidates and manage processes.</p>
            <Link href="/admin/login">
              <Button variant="outline" className="btn-outline-strong">
                Register as Placement Representative
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-2">Frequently Asked Questions</h3>
            <p className="text-muted-foreground">Quick answers about the platform</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { q: "How do I get access?", a: "Students can sign up using college email. Recruiters can request access via the admin portal." },
              { q: "Is my data secure?", a: "Yes. We use secure storage and follow best practices to protect your information." },
              { q: "Can I update my profile later?", a: "You can edit your profile, resume and links anytime from your dashboard." },
              { q: "Do recruiters see my CGPA?", a: "Only the fields you choose to share in applications are visible to recruiters." },
            ].map((f) => (
              <div key={f.q} className="card-soft p-6">
                <div className="font-semibold mb-1">{f.q}</div>
                <div className="text-sm text-muted-foreground">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/40 text-foreground py-12 mt-4 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                     style={{ backgroundImage: "linear-gradient(90deg, hsl(var(--grad-from)), hsl(var(--grad-to)))" }}>
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">GCT Placement Portal</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering students to achieve their career goals through innovative placement solutions.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">For Students</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/signup" className="hover:text-foreground">Create Profile</Link></li>
                <li><Link href="/jobs" className="hover:text-foreground">Browse Jobs</Link></li>
                <li><Link href="/applications" className="hover:text-foreground">My Applications</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">For Recruiters</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/admin/signup" className="hover:text-foreground">Register Company</Link></li>
                <li><Link href="/admin/jobs" className="hover:text-foreground">Post Jobs</Link></li>
                <li><Link href="/admin/students" className="hover:text-foreground">View Students</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Government College of Technology</li>
                <li>Coimbatore, Tamil Nadu</li>
                <li>placement@gct.ac.in</li>
                <li>+91 422 2573397</li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 GCT Placement Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
