"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError(""); setSuccess("")
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
  
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      })
  
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || "Registration failed")
        setLoading(false)
        return
      }
  
      setSuccess("Registration successful! Logging you in...")
  
      // Use redirect: false to get the result and handle navigation manually
      const signInResult = await signIn("credentials", {
        redirect: false,
        email,
        password
      })
  
      // signInResult might be undefined in some setups — guard it
      if (signInResult && "error" in signInResult && signInResult.error) {
        setError(signInResult.error || "Login failed after registration")
        setLoading(false)
        return
      }
  
      // If sign-in succeeded, navigate
      router.push("/")
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      console.error("Register client error:", errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  function loginWith(provider: string) {
    signIn(provider, { callbackUrl: "/" })
  }

  return (
    <div className="w-full max-w-lg mx-auto my-16 bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <h1 className="text-4xl font-bold mb-5 text-center">Register</h1>
      {error && <div className="bg-red-100 text-red-700 rounded p-2 mb-4 text-center">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 rounded p-2 mb-4 text-center">{success}</div>}
      <form className="space-y-6" onSubmit={handleRegister}>
        <div className="relative">
          <input type="text" id="register-name" value={name} onChange={e => setName(e.target.value)} required 
            className="peer w-full border rounded-lg px-4 py-4 text-base focus:outline-none focus:border-[#030e55] border-gray-300 placeholder-transparent transition-all" placeholder="Name" />
          <label htmlFor="register-name" className="absolute left-4 bg-white px-1 font-medium pointer-events-none transition-all duration-200
            text-gray-400 text-base top-4
            peer-focus:text-xs peer-focus:text-[#030e55] peer-focus:top-1 peer-focus:bg-white peer-focus:px-1
            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4
            peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-[#030e55] peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1"
          >Name</label>
        </div>
        <div className="relative">
          <input type="email" id="register-email" value={email} onChange={e => setEmail(e.target.value)} required 
            className="peer w-full border rounded-lg px-4 py-4 text-base focus:outline-none focus:border-[#030e55] border-gray-300 placeholder-transparent transition-all" placeholder="Email" />
          <label htmlFor="register-email" className="absolute left-4 bg-white px-1 font-medium pointer-events-none transition-all duration-200
            text-gray-400 text-base top-4
            peer-focus:text-xs peer-focus:text-[#030e55] peer-focus:top-1 peer-focus:bg-white peer-focus:px-1
            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4
            peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-[#030e55] peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1"
          >Email</label>
        </div>
        <div className="relative">
          <input type="password" id="register-password" value={password} onChange={e => setPassword(e.target.value)} required 
            className="peer w-full border rounded-lg px-4 py-4 text-base focus:outline-none focus:border-[#030e55] border-gray-300 placeholder-transparent transition-all" placeholder="Password" />
          <label htmlFor="register-password" className="absolute left-4 bg-white px-1 font-medium pointer-events-none transition-all duration-200
            text-gray-400 text-base top-4
            peer-focus:text-xs peer-focus:text-[#030e55] peer-focus:top-1 peer-focus:bg-white peer-focus:px-1
            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4
            peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-[#030e55] peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1"
          >Password</label>
        </div>
        <div className="relative">
          <input type="password" id="register-confirm" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required 
            className="peer w-full border rounded-lg px-4 py-4 text-base focus:outline-none focus:border-[#030e55] border-gray-300 placeholder-transparent transition-all" placeholder="Confirm Password" />
          <label htmlFor="register-confirm" className="absolute left-4 bg-white px-1 font-medium pointer-events-none transition-all duration-200
            text-gray-400 text-base top-4
            peer-focus:text-xs peer-focus:text-[#030e55] peer-focus:top-1 peer-focus:bg-white peer-focus:px-1
            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4
            peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-[#030e55] peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1"
          >Confirm Password</label>
        </div>
        <button type="submit" disabled={loading} className="w-full py-2 bg-[#030e55] text-white rounded font-bold cursor-pointer transition-colors">Sign up</button>
      </form>
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
        Already have an account? <Link href="/auth/login" className="text-[#030e55] underline">Log in</Link>
      </div>
    </div>
  )
}
