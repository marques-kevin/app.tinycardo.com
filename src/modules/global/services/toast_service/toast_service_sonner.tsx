import type { ToastService } from "@/modules/global/services/toast_service/toast_service"
import { GlobalToast } from "@/modules/global/components/global_toast/global_toast"
import { toast } from "sonner"

export class ToastServiceSonner implements ToastService {
  async toast(
    params: Parameters<ToastService["toast"]>[0],
  ): ReturnType<ToastService["toast"]> {
    toast.custom(() => (
      <GlobalToast
        title={params.title}
        description={params.description}
        type={params.type}
      />
    ))
  }
}
