import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeClosed } from "lucide-react"

import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { useNavigate, useSearchParams } from "react-router-dom"
import toast from "react-hot-toast"
import Spinner from "@/components/custom/Spinner"
import { resetPassword } from "@/services/auth.service"
import { userStore } from "@/zustand/userStore"
import { useStore } from "zustand"

const resetPasswordSchema = z
  .object({
    email: z
      .string({
        error: () => "Email is required.",
      })
      .trim()
      .email({
        error: "Please provide a valid email address.",
      }),
    resetPasswordToken: z.uuid({
      error: () => "Invalid reset password token.",
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

type ResetPasswordData = z.infer<typeof resetPasswordSchema>

const ResetPasswordpage = () => {
  const { clearUser } = useStore(userStore)
  const [searchParams] = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<ResetPasswordData>({
    defaultValues: {
      email: searchParams.get("email") || "",
      resetPasswordToken: searchParams.get("resetPasswordToken") || "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
    resolver: zodResolver(resetPasswordSchema),
  })
  const navigate = useNavigate()

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

  const onSubmit: SubmitHandler<ResetPasswordData> = async (data) => {
    try {
      const response = await resetPassword(data)

      if (response.status === 200) {
        clearUser()

        reset({
          email: "",
          resetPasswordToken: "",
          password: "",
          confirmPassword: "",
        })

        navigate("/login")
      }
    } catch (error) {
      console.log("Error in the reset password page: ", error)
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your new password below
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative flex items-center">
                <Input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-lg"
                  className="absolute right-0 flex-center"
                  onClick={handleShowPassword}
                >
                  {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative flex items-center">
                <Input
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-lg"
                  className="absolute right-0 flex-center"
                  onClick={handleShowConfirmPassword}
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
              className="flex w-full items-center gap-2"
            >
              {isSubmitting && <Spinner />}
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPasswordpage
