"use client"
import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const params = useSearchParams()

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Helper to timeout signIn if it never resolves
    const signInWithTimeout = (opts: Parameters<typeof signIn>[1], ms = 10000) =>
      Promise.race([
        // Call NextAuth signIn (returns a Promise)
        signIn("credentials", { ...opts, redirect: false }),
        // Timeout fallback
        new Promise((_, reject) => setTimeout(() => reject(new Error("signIn timeout")), ms))
      ])

    try {
      console.log("client: calling signIn with", { email, password })
      const res = await signInWithTimeout({
        email,
        password,
        callbackUrl: params.get("callbackUrl") || "/",
      }, 10000) // 10s timeout

      console.log("client: signIn result", res)
      setLoading(false)

      // res can be undefined in some builds; guard it
      if (!res) {
        setError("Login failed: no response from auth")
        return
      }
      if (typeof res === "object" && "error" in res) {
        const errorValue = (res as { error?: string }).error
        if (errorValue) {
          setError(errorValue || "Invalid email or password")
          return
        }
      }

      // Navigate to returned url or fallback
      const url = typeof res === "object" && "url" in res ? (res as { url?: string }).url : undefined
      router.push(url || "/")
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Login failed"
      console.error("client signIn error:", errorMessage)
      setError(errorMessage)
      setLoading(false)
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await signIn("email", {
      redirect: false,
      email,
      callbackUrl: params.get("callbackUrl") || "/",
    })
    setLoading(false)
    if (res?.error) return setError("Failed to send magic link")
    setError("Check your email for a sign-in link.")
  }

  function loginWith(provider: string) {
    signIn(provider, { callbackUrl: params.get("callbackUrl") || "/" })
  }

  return (
    <div className="w-full max-w-lg mx-auto my-16 bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Log in to your account</h1>

      {error && <div className="bg-red-100 text-red-700 rounded p-2 mb-4 text-center">{error}</div>}

      <form className="space-y-6" onSubmit={handleCredentials}>
        <div className="relative">
          <input
            type="email"
            id="login-email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
            className="peer w-full border rounded-lg px-4 py-4 text-base focus:outline-none focus:border-[#030e55] border-gray-300 placeholder-transparent transition-all"
            placeholder="Email"
          />
          <label
            htmlFor="login-email"
            className="absolute left-4 bg-white px-1 font-medium pointer-events-none transition-all duration-200
              text-gray-400 text-base top-4
              peer-focus:text-xs peer-focus:text-[#030e55] peer-focus:top-1 peer-focus:bg-white peer-focus:px-1
              peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4
              peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-[#030e55] peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1"
          >
            Email
          </label>
        </div>
        <div className="relative">
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="peer w-full border rounded-lg px-4 py-4 text-base focus:outline-none focus:border-[#030e55] border-gray-300 placeholder-transparent transition-all"
            placeholder="Password"
          />
          <label
            htmlFor="login-password"
            className="absolute left-4 bg-white px-1 font-medium pointer-events-none transition-all duration-200
              text-gray-400 text-base top-4
              peer-focus:text-xs peer-focus:text-[#030e55] peer-focus:top-1 peer-focus:bg-white peer-focus:px-1
              peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4
              peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-[#030e55] peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1"
          >
            Password
          </label>
        </div>
        <button type="submit" disabled={loading} className="w-full py-2 bg-[#030e55] text-white rounded font-bold cursor-pointer transition-colors">Log in</button>
      </form>

      <div className="flex justify-between items-center my-4">
        <span className="text-gray-500 text-sm">or</span>
        <button className="text-[#030e55] text-sm underline cursor-pointer" onClick={handleMagicLink}>Sign in by Email (Magic Link)</button>
      </div>

      <div className="flex flex-col gap-2 my-4">
        <button onClick={() => loginWith("google")}
          className="w-full flex items-center justify-center bg-white border border-gray-300 rounded py-2 font-semibold hover:bg-gray-50">
          <Image src="/images/google.svg" alt="Google" width={20} height={20} className="mr-2" /> Continue with Google
        </button>
        <button onClick={() => loginWith("facebook")}
          className="w-full flex items-center justify-center bg-white border border-gray-300 rounded py-2 font-semibold hover:bg-gray-50">
          <Image src="/images/facebook.svg" alt="Facebook" width={20} height={20} className="mr-2" /> Continue with Facebook
        </button>
      </div>

      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account? <Link href="/auth/register" className="text-[#030e55] underline">Sign up</Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-lg mx-auto my-16 bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-4xl font-bold mb-8 text-center">Log in to your account</h1>
        <div className="text-center">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
