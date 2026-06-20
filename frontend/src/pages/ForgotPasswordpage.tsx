import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import Spinner from "@/components/custom/Spinner"
import toast from "react-hot-toast"
import { forgotPassword } from "@/services/auth.service"

const forgotPasswordSchema = z.object({
  email: z
    .string({
      error: () => "Email is required.",
    })
    .trim()
    .email({
      error: "Please provide a valid email address.",
    }),
})

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>

const ForgotPasswordpage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordData>({
    defaultValues: {
      email: "",
    },
    mode: "onChange",
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit: SubmitHandler<ForgotPasswordData> = async (data) => {
    try {
      const response = await forgotPassword(data)

      if (response.status === 200) {
        reset({
          email: "",
        })
        toast.success(response.data.message)
      }
    } catch (error) {
      console.log("Error in the forgot password page: ", error)
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your email to receive a reset link
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full cursor-pointer items-center gap-2"
            >
              {isSubmitting && <Spinner />}
              Send Reset Link
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPasswordpage
