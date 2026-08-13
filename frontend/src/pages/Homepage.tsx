import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  CheckCheck,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  Users,
  Video,
  Zap,
} from "lucide-react"
import { Link } from "react-router-dom"

const features = [
  {
    icon: MessageCircle,
    title: "Real-time messaging",
    description:
      "Send messages instantly with live typing indicators, read receipts, and delivery status.",
  },
  {
    icon: Video,
    title: "Voice & video calls",
    description:
      "Jump from chat to a crystal-clear call in one click — no extra apps required.",
  },
  {
    icon: Users,
    title: "Friend management",
    description:
      "Search, add, and manage your connections with a simple pending-request flow.",
  },
  {
    icon: Zap,
    title: "Lightning fast",
    description:
      "Built on WebSockets for sub-second message delivery and online presence updates.",
  },
  {
    icon: Shield,
    title: "Secure by design",
    description:
      "Email verification, strong password rules, and protected routes keep your account safe.",
  },
  {
    icon: Sparkles,
    title: "Polished experience",
    description:
      "Dark mode, file attachments, and a clean interface designed for everyday use.",
  },
]

const steps = [
  {
    step: "01",
    title: "Create your account",
    description:
      "Sign up in seconds with your email. Verify once and you're ready to go.",
  },
  {
    step: "02",
    title: "Add your people",
    description:
      "Search by username, send friend requests, and build your network.",
  },
  {
    step: "03",
    title: "Start connecting",
    description:
      "Chat in real time, share files, and call — all from one place.",
  },
]

const stats = [
  { value: "Real-time", label: "Message delivery" },
  { value: "1-click", label: "Voice & video calls" },
  { value: "End-to-end", label: "Presence & typing" },
  { value: "Free", label: "To get started" },
]

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <MessageCircle className="size-4" />
          </span>
          <span className="text-base font-semibold tracking-tight">Connect</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#how-it-works" className="transition-colors hover:text-foreground">
            How it works
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link to="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild className="h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm">
            <Link to="/signup">
              Get started
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="absolute -inset-4 rounded-3xl bg-primary/20 blur-3xl" />
      <Card className="relative overflow-hidden shadow-2xl ring-1 ring-border/50">
        <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-destructive/60" />
            <span className="size-2.5 rounded-full bg-chart-2/60" />
            <span className="size-2.5 rounded-full bg-primary/60" />
          </div>
          <span className="ml-2 text-xs text-muted-foreground">Connect — Chat</span>
        </div>

        <CardContent className="space-y-4 p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-medium text-primary">
              A
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium">Alex Rivera</p>
              <div className="rounded-2xl rounded-tl-sm bg-muted px-3 py-2 text-xs text-foreground">
                Hey! Are we still on for the call tonight?
              </div>
            </div>
          </div>

          <div className="flex items-start justify-end gap-3">
            <div className="space-y-1 text-right">
              <p className="text-xs font-medium">You</p>
              <div className="rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-xs text-primary-foreground">
                Absolutely — I'll start a video call at 8.
              </div>
              <div className="flex items-center justify-end gap-1 text-[0.625rem] text-muted-foreground">
                <span>Delivered</span>
                <CheckCheck className="size-3 text-primary" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2">
            <div className="size-2 animate-pulse rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Alex is typing…</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 px-3 py-2">
            <span className="text-xs text-muted-foreground">Type a message…</span>
            <div className="flex items-center gap-1.5">
              <Phone className="size-3.5 text-muted-foreground" />
              <Video className="size-3.5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--primary)/0.18,transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-30" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div className="space-y-8 text-center lg:text-left">
          <Badge variant="secondary" className="mx-auto lg:mx-0">
            <Sparkles className="size-3" />
            Your conversations, elevated
          </Badge>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Stay close to the people{" "}
              <span className="text-primary">who matter most</span>
            </h1>
            <p className="mx-auto max-w-xl text-base text-muted-foreground text-pretty sm:text-lg lg:mx-0">
              Connect brings messaging, voice calls, and video together in one
              beautiful workspace — built for speed, clarity, and real
              relationships.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button asChild className="h-10 w-full px-6 text-sm sm:w-auto">
              <Link to="/signup">
                Create free account
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="h-10 w-full px-6 text-sm sm:w-auto"
            >
              <Link to="/login">I already have an account</Link>
            </Button>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground lg:justify-start">
            {["No credit card", "Free to start", "Works in your browser"].map(
              (item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <CheckCheck className="size-4 text-primary" />
                  {item}
                </li>
              )
            )}
          </ul>
        </div>

        <HeroMockup />
      </div>
    </section>
  )
}

function StatsSection() {
  return (
    <section className="border-y border-border/60 bg-muted/30">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-14 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to stay in sync
          </h2>
          <p className="mt-4 text-muted-foreground">
            From quick texts to long video calls, Connect keeps every
            conversation flowing without friction.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-primary/20"
            >
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="size-5" />
                </div>
                <CardTitle className="text-base font-semibold">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-14 border-t border-border/60 bg-muted/20 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">
            How it works
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Up and running in minutes
          </h2>
          <p className="mt-4 text-muted-foreground">
            Three simple steps from sign-up to your first conversation.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute top-8 left-[calc(50%+2rem)] hidden h-px w-[calc(100%-4rem)] bg-border md:block" />
              )}
              <Card className="h-full text-center">
                <CardContent className="space-y-4 pt-6">
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {item.step}
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="py-20 sm:py-28 ">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Card className="relative overflow-hidden border-0 bg-primary text-primary-foreground">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(1_0_0/0.12),transparent_50%)]" />
          <CardContent className="relative flex flex-col items-center gap-6 px-6 py-14 text-center sm:px-12 sm:py-16">
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to connect with your world?
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
              Join Connect today and experience messaging the way it should be —
              fast, reliable, and built around the people you care about.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                variant="secondary"
                className="h-10 px-6 text-sm text-foreground"
              >
                <Link to="/signup">
                  Get started for free
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className={cn(
                  "h-10 border-primary-foreground/30 bg-transparent px-6 text-sm text-primary-foreground",
                  "hover:bg-primary-foreground/10 hover:text-primary-foreground"
                )}
              >
                <Link to="/login">Sign in</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <MessageCircle className="size-3.5" />
          </span>
          <span className="text-sm font-semibold">Connect</span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a
            href="#how-it-works"
            className="transition-colors hover:text-foreground"
          >
            How it works
          </a>
          <Link to="/login" className="transition-colors hover:text-foreground">
            Log in
          </Link>
          <Link to="/signup" className="transition-colors hover:text-foreground">
            Sign up
          </Link>
        </nav>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Connect. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

const Homepage = () => {
  return (
    <div className="min-h-screen w-full bg-background">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection />
      <Footer />
    </div>
  )
}

export default Homepage
