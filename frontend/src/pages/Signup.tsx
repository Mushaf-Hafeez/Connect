import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeClosed } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import toast from "react-hot-toast"
import { signup } from "@/services/auth.service"
import Spinner from "@/components/custom/Spinner"

const SignupSchema = z
  .object({
    displayName: z
      .string({
        error: () => "Display name is required.",
      })
      .trim()
      .min(2, {
        error: "Display name must be at least 2 characters.",
      })
      .max(50, {
        error: "Display name cannot exceed 50 characters.",
      }),
    username: z
      .string({
        error: () => "Username is required.",
      })
      .trim()
      .min(3, {
        error: "Username must be at least 3 characters.",
      })
      .max(30, {
        error: "Username cannot exceed 30 characters.",
      })
      .regex(/^[a-zA-Z0-9_]+$/, {
        error: "Username can only contain letters, numbers and underscores.",
      }),
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
          iss.input === undefined
            ? "Password is required."
            : "Invalid password.",
      })
      .min(8, { error: "Password must be at least 8 characters" })
      .max(100, { error: "Password is too long" })
      .regex(/[a-z]/, { error: "Must contain at least one lowercase letter" })
      .regex(/[A-Z]/, { error: "Must contain at least one uppercase letter" })
      .regex(/\d/, { error: "Must contain at least one number" })
      .regex(/[^a-zA-Z0-9]/, {
        error: "Must contain at least one special character",
      }),
    confirmPassword: z
      .string({
        error: () => "Please confirm your password.",
      })
      .min(1, {
        error: "Please confirm your password.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  })

type SignupData = z.infer<typeof SignupSchema>

const Signup = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupData>({
    defaultValues: {
      displayName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
    resolver: zodResolver(SignupSchema),
  })

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  // function to show/hide the password
  const handleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  // function to show/hide the confirmPassword
  const handleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev)
  }

  const onSubmit: SubmitHandler<SignupData> = async (data) => {
    console.log(data)

    try {
      const response = await signup(data)

      if (response.status === 201 || response.status === 200) {
        // reset the form
        reset({
          displayName: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        })

        toast.success(response.data.message)
      }
    } catch (error) {
      console.log("Error in signup component: ", error)
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>

          <p className="text-sm text-muted-foreground">
            Enter your details to get started
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                {...register("displayName")}
                id="name"
                type="text"
                placeholder="John Doe"
              />
              {errors.displayName && (
                <p className="text-red-400">{errors.displayName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                {...register("username")}
                id="username"
                type="text"
                placeholder="johndoe"
              />
              {errors.username && (
                <p className="text-red-400">{errors.username.message}</p>
              )}
            </div>

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
              <Label htmlFor="password">Password</Label>
              <div className="relative flex items-center">
                <Input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                />
                <Button
                  type="button"
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative flex items-center">
                <Input
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                />
                <Button
                  type="button"
                  onClick={handleShowConfirmPassword}
                  variant={"ghost"}
                  size={"icon-lg"}
                  className="absolute right-0 flex-center cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeClosed size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full cursor-pointer items-center gap-2"
            >
              {isSubmitting && <Spinner />}
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Signup
