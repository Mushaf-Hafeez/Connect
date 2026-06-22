import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { userStore } from "@/zustand/userStore"
import { useStore } from "zustand"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useNavigate, useSearchParams } from "react-router-dom"
import Spinner from "@/components/custom/Spinner"
import toast from "react-hot-toast"
import { verifyEmail } from "@/services/auth.service"

const VerifyEmailSchema = z.object({
  email: z
    .string({
      error: () => "Email is required.",
    })
    .trim()
    .email({
      error: "Please provide a valid email address.",
    }),
  emailVerificationToken: z.uuid({
    error: () => "Invalid email verification token.",
  }),
})

type VerifyEmailData = z.infer<typeof VerifyEmailSchema>

const VerifyEmailpage = () => {
  const { setUser } = useStore(userStore)
  const [searchParams] = useSearchParams()

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<VerifyEmailData>({
    defaultValues: {
      email: searchParams.get("email") || "",
      emailVerificationToken: searchParams.get("emailVerificationToken") || "",
    },
    mode: "onChange",
    resolver: zodResolver(VerifyEmailSchema),
  })
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<VerifyEmailData> = async (data) => {
    try {
      const response = await verifyEmail(data)

      if (response.status === 200) {
        // set user in zustand
        setUser(response.data.user)

        reset({
          email: "",
          emailVerificationToken: "",
        })

        toast.success(response.data.message)
        navigate("/")
      }
    } catch (error) {
      console.log("Error in verify email page: ", error)
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Verify Your Email
          </CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">
            Click the button below to verify your email address
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full cursor-pointer items-center gap-2"
            >
              {isSubmitting && <Spinner />}
              Verify Email
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifyEmailpage
