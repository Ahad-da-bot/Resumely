'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { z } from 'zod'
import {
  loginSchema,
  signUpSchema,
  type LoginInput,
  type SignUpInput,
} from '@/lib/validations/auth'
import { toast } from 'sonner'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Sparkles,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  Loader2,
  FileText,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react'

function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login'
  const [activeTab, setActiveTab] = React.useState<'login' | 'signup'>(defaultTab)
  const [isLoading, setIsLoading] = React.useState(false)
  const [authError, setAuthError] = React.useState<string | null>(null)

  const supabase = React.useMemo(() => createClient(), [])

  // Login Form
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Sign Up Form
  const {
    register: registerSignUp,
    handleSubmit: handleSignUpSubmit,
    setValue: setSignUpValue,
    watch: watchSignUp,
    formState: { errors: signUpErrors },
  } = useForm<z.input<typeof signUpSchema>, unknown, SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      phone_number: '',
      marketing_opt_in: false,
    },
  })

  const marketingOptIn = watchSignUp('marketing_opt_in')

  const onLogin = async (data: LoginInput) => {
    setIsLoading(true)
    setAuthError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        setAuthError(error.message)
        toast.error('Authentication Failed', {
          description: error.message,
        })
        return
      }

      toast.success('Welcome back!', {
        description: 'Signed in successfully. Opening your dossier...',
      })

      router.push('/onboarding')
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setAuthError(message)
      toast.error('Login Error', { description: message })
    } finally {
      setIsLoading(false)
    }
  }

  const onSignUp = async (data: SignUpInput) => {
    setIsLoading(true)
    setAuthError(null)

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            phone_number: data.phone_number,
            marketing_opt_in: data.marketing_opt_in,
          },
        },
      })

      if (error) {
        setAuthError(error.message)
        toast.error('Registration Failed', {
          description: error.message,
        })
        return
      }

      if (authData.session) {
        toast.success('Dossier created!', {
          description: 'Welcome to Resumely. Setting up your Master Profile...',
        })
        router.push('/onboarding')
        router.refresh()
      } else {
        toast.success('Account created!', {
          description:
            'Please verify your email or sign in to continue.',
        })
        router.push('/onboarding')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setAuthError(message)
      toast.error('Sign Up Error', { description: message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      {/* Masking tape on top */}
      <div className="tape" />

      <Card className="border border-ink/15 bg-card text-ink shadow-[4px_6px_0_rgba(42,33,25,0.1)] rounded-md">
        <CardHeader className="space-y-1.5 text-center pb-3">
          <div className="mx-auto w-10 h-10 rounded border border-ink/20 bg-paper flex items-center justify-center text-oxblood mb-1 shadow-[1px_1px_0_rgba(42,33,25,0.15)]">
            <FileText className="w-5 h-5" />
          </div>
          <CardTitle className="font-serif text-2xl font-bold tracking-tight text-ink">
            Studio Access
          </CardTitle>
          <CardDescription className="text-pencil text-xs font-normal">
            Sign in to your career desk or open a new master profile
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {authError && (
            <div className="p-3 rounded bg-oxblood/10 border border-oxblood/30 text-oxblood text-xs font-medium">
              {authError}
            </div>
          )}

          <Tabs
            value={activeTab}
            onValueChange={(val) => {
              setActiveTab(val as 'login' | 'signup')
              setAuthError(null)
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-paper border border-ink/15 p-1 rounded">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-card data-[state=active]:text-ink data-[state=active]:shadow-sm font-serif text-xs font-medium transition-all"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-card data-[state=active]:text-ink data-[state=active]:shadow-sm font-serif text-xs font-medium transition-all"
              >
                Create Account
              </TabsTrigger>
            </TabsList>

            {/* LOGIN TAB */}
            <TabsContent value="login" className="space-y-3.5 pt-3">
              <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-3.5">
                <div className="space-y-1">
                  <Label htmlFor="login-email" className="text-xs text-pencil font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-pencil/60" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="alex@example.com"
                      className="pl-9 bg-paper/60 border-ink/15 text-ink placeholder:text-pencil/50 text-xs h-9 focus:border-oxblood focus:ring-oxblood"
                      {...registerLogin('email')}
                    />
                  </div>
                  {loginErrors.email && (
                    <p className="text-[11px] text-oxblood font-medium">
                      {loginErrors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="login-password" className="text-xs text-pencil font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-pencil/60" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-9 bg-paper/60 border-ink/15 text-ink placeholder:text-pencil/50 text-xs h-9 focus:border-oxblood focus:ring-oxblood"
                      {...registerLogin('password')}
                    />
                  </div>
                  {loginErrors.password && (
                    <p className="text-[11px] text-oxblood font-medium">
                      {loginErrors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-9 bg-oxblood hover:bg-oxblood/90 text-card font-medium text-xs shadow-[2px_2px_0_rgba(42,33,25,0.2)] border border-oxblood transition-all mt-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Opening Dossier...
                    </>
                  ) : (
                    <>
                      Sign In to Studio
                      <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* SIGN UP TAB */}
            <TabsContent value="signup" className="space-y-3 pt-3">
              <form onSubmit={handleSignUpSubmit(onSignUp)} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="signup-email" className="text-xs text-pencil font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-pencil/60" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="alex@example.com"
                      className="pl-9 bg-paper/60 border-ink/15 text-ink placeholder:text-pencil/50 text-xs h-9 focus:border-oxblood focus:ring-oxblood"
                      {...registerSignUp('email')}
                    />
                  </div>
                  {signUpErrors.email && (
                    <p className="text-[11px] text-oxblood font-medium">
                      {signUpErrors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="signup-phone" className="text-xs text-pencil font-medium">
                    Phone Number (Min 10 digits)
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-pencil/60" />
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+1 (555) 019-2834"
                      className="pl-9 bg-paper/60 border-ink/15 text-ink placeholder:text-pencil/50 text-xs h-9 focus:border-oxblood focus:ring-oxblood"
                      {...registerSignUp('phone_number')}
                    />
                  </div>
                  {signUpErrors.phone_number && (
                    <p className="text-[11px] text-oxblood font-medium">
                      {signUpErrors.phone_number.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="signup-password" className="text-xs text-pencil font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-pencil/60" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-9 bg-paper/60 border-ink/15 text-ink placeholder:text-pencil/50 text-xs h-9 focus:border-oxblood focus:ring-oxblood"
                        {...registerSignUp('password')}
                      />
                    </div>
                    {signUpErrors.password && (
                      <p className="text-[11px] text-oxblood font-medium">
                        {signUpErrors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="signup-confirm" className="text-xs text-pencil font-medium">
                      Confirm
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-pencil/60" />
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="••••••••"
                        className="pl-9 bg-paper/60 border-ink/15 text-ink placeholder:text-pencil/50 text-xs h-9 focus:border-oxblood focus:ring-oxblood"
                        {...registerSignUp('confirmPassword')}
                      />
                    </div>
                    {signUpErrors.confirmPassword && (
                      <p className="text-[11px] text-oxblood font-medium">
                        {signUpErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-2 pt-1">
                  <Checkbox
                    id="marketing-opt"
                    checked={marketingOptIn}
                    onCheckedChange={(checked) =>
                      setSignUpValue('marketing_opt_in', checked === true)
                    }
                    className="mt-0.5 border-ink/30 data-[state=checked]:bg-oxblood data-[state=checked]:border-oxblood"
                  />
                  <Label
                    htmlFor="marketing-opt"
                    className="text-[11px] text-pencil leading-tight cursor-pointer font-normal"
                  >
                    Receive curated AI resume optimization insights & career dispatch notes.
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-9 bg-oxblood hover:bg-oxblood/90 text-card font-medium text-xs shadow-[2px_2px_0_rgba(42,33,25,0.2)] border border-oxblood transition-all mt-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Opening Dossier...
                    </>
                  ) : (
                    <>
                      Create Master Profile
                      <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-dashed border-ink/15 py-3">
          <p className="hand text-xs text-pencil text-center">
            — your career data stays private, encrypted, and local-first
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function AuthPage() {
  return (
    <main className="min-h-screen w-full ruled-bg flex flex-col lg:flex-row items-center justify-center p-4 md:p-8 text-ink relative">
      <div className="w-full max-w-5xl flex flex-col lg:grid lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* --- MOBILE: Title & Note (First) --- */}
        <div className="lg:hidden space-y-4 text-center mt-4">
          <div className="inline-block">
            <span className="label-hand">a proposal, and honestly, a bit of a diary</span>
          </div>
          <h1 className="font-serif text-3xl font-semibold leading-[1.1] tracking-tight text-ink">
            Every career has a story. Most resumes lose it in the margins.
          </h1>
        </div>

        {/* --- DESKTOP: Full Editorial Vignette (Left Side) --- */}
        <div className="lg:col-span-6 space-y-6 text-left hidden lg:block pr-6">
          <div className="inline-block">
            <span className="label-hand">a proposal, and honestly, a bit of a diary</span>
          </div>

          <div className="space-y-3">
            <h1 className="font-serif text-3xl xl:text-4xl font-semibold leading-[1.1] tracking-tight text-ink">
              Every career has a story. Most resumes lose it in the margins.
            </h1>
            <p className="lede text-sm leading-relaxed text-pencil">
              Resumely brings craftsman typography, structured master profiles, and precision AI targeting together. You write your truth once; we build the bespoke resumes to match the room.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-pencil">
              <span className="text-oxblood font-bold">✎</span>
              <span>Single Master Dossier syncs directly across all resume variants</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-pencil">
              <span className="text-oxblood font-bold">✎</span>
              <span>Client-side PDF compiler with zero awkward layout shifts</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-pencil">
              <span className="text-oxblood font-bold">✎</span>
              <span>Supabase auth with seamless session refreshing & row-level security</span>
            </div>
          </div>
        </div>

        {/* Right Side / Mobile Middle: Auth Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <React.Suspense
            fallback={
              <Card className="border-ink/15 bg-card p-8 text-center text-pencil">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-oxblood" />
              </Card>
            }
          >
            <AuthForm />
          </React.Suspense>
        </div>

        {/* --- MOBILE: Overview Summary & Bullets (Last) --- */}
        <div className="lg:hidden space-y-4 text-left bg-card/60 border border-ink/10 rounded-md p-5 shadow-sm">
          <p className="lede text-sm leading-relaxed text-ink font-medium">
            Resumely brings craftsman typography, structured master profiles, and precision AI targeting together. You write your truth once; we build the bespoke resumes to match the room.
          </p>
          
          <div className="space-y-3 pt-2 border-t border-ink/10 mt-3">
            <div className="flex items-start gap-3 text-xs text-pencil">
              <span className="text-oxblood font-bold mt-0.5">✎</span>
              <span>Single Master Dossier syncs directly across all resume variants</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-pencil">
              <span className="text-oxblood font-bold mt-0.5">✎</span>
              <span>Client-side PDF compiler with zero awkward layout shifts</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-pencil">
              <span className="text-oxblood font-bold mt-0.5">✎</span>
              <span>Supabase auth with seamless session refreshing & row-level security</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
