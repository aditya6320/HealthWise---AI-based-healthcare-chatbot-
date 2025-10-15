import { toast } from "sonner"

export { toast }

export function useToast() {
  return {
    toasts: [],
    toast,
    dismiss: (toastId?: string) => toast.dismiss(toastId),
  }
}
