import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../common/components/ui/dialog"
import { Button } from "../../../common/components/ui/button"
import { Input } from "../../../common/components/ui/input"
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/solid"
import { buildRoomShareUrl, copyToClipboard } from "../../../lib/clipboard"
import { toast } from "sonner"

interface ShareRoomModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roomId: string | null
  onGoToRoom: () => void
  loading?: boolean
}

export function ShareRoomModal({ open, onOpenChange, roomId, onGoToRoom, loading }: ShareRoomModalProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = roomId ? buildRoomShareUrl(roomId) : ""

  useEffect(() => {
    if (open) setCopied(false)
  }, [open, roomId])

  async function handleCopy() {
    if (!shareUrl) return
    const ok = await copyToClipboard(shareUrl)
    if (ok) {
      setCopied(true)
      toast.success("Link copiado!", { description: shareUrl, duration: 4000 })
    } else {
      toast.error("Não foi possível copiar. Copie manualmente.", { description: shareUrl, duration: 6000 })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-cyan-400/50">
        <DialogHeader>
          <DialogTitle>Sala criada</DialogTitle>
          <DialogDescription>Compartilhe o link abaixo para convidar seus amigos.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              value={shareUrl}
              readOnly
              onFocus={(e) => e.target.select()}
              aria-label="Link da sala"
              className="font-mono text-sm tracking-wider"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopy}
              disabled={!shareUrl}
              aria-label={copied ? "Link copiado" : "Copiar link"}
              title={copied ? "Copiado" : "Copiar link"}
            >
              {copied ? <CheckIcon className="w-5 h-5" /> : <ClipboardDocumentIcon className="w-5 h-5" />}
            </Button>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" size="default" onClick={() => onOpenChange(false)} disabled={loading}>
              Fechar
            </Button>
            <Button variant="default" size="default" onClick={onGoToRoom} disabled={loading} loading={loading}>
              Ir para sala
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
