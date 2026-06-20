import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeClosed } from "lucide-react"
import Spinner from "@/components/custom/Spinner"

import { login } from "@/services/auth.service"

import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import toast from "react-hot-toast"
import { useStore } from "zustand"
import { userStore } from "@/zustand/userStore"

const loginSchema = z.object({
  email: z
    .string({
      error: () => "Email is required.",
    })
    .trim()
    .email({
      error: "Please provide a valid email address.",
    }),

  password: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "Password is required." : "Invalid password.",
    })
    .min(8, { error: "Password must be at least 8 characters" })
    .max(100, { error: "Password is too long" })
    .regex(/[a-z]/, { error: "Must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { error: "Must contain at least one uppercase letter" })
    .regex(/\d/, { error: "Must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Must contain at least one special character",
    }),
})

type LoginData = z.infer<typeof loginSchema>

const Login = () => {
  const { setUser } = useStore(userStore)

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
    resolver: zodResolver(loginSchema),
  })
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState<boolean>(false)

  // function to show/hide the password
  const handleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      const response = await login(data)

      if (response.status === 200) {
        // set the user in the zustand
        setUser(response.data.user)

        // reset the form
        reset({
          email: "",
          password: "",
        })

        toast.success("Login successful.")
        navigate("/")
      }
    } catch (error) {
      console.log("Error in login component: ", error)
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <p className="text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative flex h-full items-center">
                <Input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                />
                <Button
                  onClick={handleShowPassword}
                  variant={"ghost"}
                  size={"icon-lg"}
                  className="absolute right-0 flex-center cursor-pointer"
                >
                  {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
                </Button>
              </div>

              {errors.password && (
                <p className="text-red-400">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full cursor-pointer items-center gap-2"
            >
              {isSubmitting && <Spinner />}
              Login
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
