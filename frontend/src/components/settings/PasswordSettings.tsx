import { Eye, EyeClosed, EyeOff } from "lucide-react"
import { useState } from "react"

import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { SubmitHandler } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import { changePassword } from "@/services/auth.service"
import Spinner from "../custom/Spinner"
import { useStore } from "zustand"
import { userStore } from "@/zustand/userStore"
import { useNavigate } from "react-router-dom"

const ChangePasswordSchema = z
  .object({
    password: z.string({
      error: (iss) => iss.input === undefined && "Password is required.",
    }),
    newPassword: z
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
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  })

type ChangePasswordData = z.infer<typeof ChangePasswordSchema>

const PasswordSettings = () => {
  const { clearUser } = useStore(userStore)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<ChangePasswordData>({
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: zodResolver(ChangePasswordSchema),
    mode: "onChange",
  })

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const navigate = useNavigate()

  const onSubmit: SubmitHandler<ChangePasswordData> = async (data) => {
    try {
      const response = await changePassword(data)

      if (response.status === 200) {
        toast.success(response.data.message)
        clearUser()
        reset({
          password: "",
          newPassword: "",
          confirmPassword: "",
        })
        navigate("/")
      }
    } catch (error) {
      console.log("Error while changing the password: ", error)
      toast.error(error.response.data.message || "Something went wrong.")
    }
  }

  return (
    <Card>
      <CardContent className="space-y-8 p-6">
        <div>
          <h2 className="text-xl font-semibold">Change Password</h2>

          <p className="text-sm text-muted-foreground">
            Keep your account secure.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* current password */}
          <div className="space-y-2">
            <div className="relative h-full items-center space-y-2">
              <Label>Current Password</Label>
              <Input
                {...register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
              />
              <Button
                onClick={() => setShowPassword((prev) => !prev)}
                variant={"ghost"}
                size={"icon-lg"}
                type="button"
                className="absolute right-0 flex-center cursor-pointer"
              >
                {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
              </Button>
            </div>
            {errors.password && (
              <p className="text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* new password */}
          <div className="space-y-2">
            <div className="relative h-full items-center space-y-2">
              <Label>New Password</Label>
              <Input
                {...register("newPassword")}
                id="password"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter your new password"
              />
              <Button
                onClick={() => setShowNewPassword((prev) => !prev)}
                variant={"ghost"}
                size={"icon-lg"}
                type="button"
                className="absolute right-0 flex-center cursor-pointer"
              >
                {showNewPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
              </Button>
            </div>
            {errors.newPassword && (
              <p className="text-red-400">{errors.newPassword.message}</p>
            )}
          </div>

          {/* confirm password */}
          <div className="space-y-2">
            <div className="relative h-full items-center space-y-2">
              <Label>Confirm Password</Label>
              <Input
                {...register("confirmPassword")}
                id="password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Enter your confirm password"
              />
              <Button
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                variant={"ghost"}
                size={"icon-lg"}
                type="button"
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
            className="cursor-pointer"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Spinner />
                Updating
              </div>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default PasswordSettings
