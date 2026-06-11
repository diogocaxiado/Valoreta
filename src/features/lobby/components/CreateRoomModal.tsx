import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../common/components/ui/dialog"
import { Button } from "../../../common/components/ui/button"
import { Input } from "../../../common/components/ui/input"
import { getPlayerName } from "../../../services/playerSession"

interface CreateRoomModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (name: string, password: string) => void
  loading?: boolean
}

export function CreateRoomModal({
  open,
  onOpenChange,
  onConfirm,
  loading,
}: CreateRoomModalProps) {
  const [name, setName] = useState(getPlayerName())
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (open) {
      setName(getPlayerName())
      setPassword("")
    }
  }, [open])

  function handleConfirm() {
    if (!name.trim()) return
    onConfirm(name.trim(), password)
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setPassword("")
    }
    onOpenChange(open)
  }

  const canSubmit = name.trim().length > 0 && !loading

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="border-cyan-400/50">
        <DialogHeader>
          <DialogTitle>Criar sala</DialogTitle>
          <DialogDescription>
            Escolha seu nome e defina uma senha para proteger a sala (opcional).
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="room-name"
              className="text-sm text-muted-foreground font-prompt uppercase tracking-wider"
            >
              Seu nome
            </label>
            <Input
              id="room-name"
              type="text"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              maxLength={24}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="room-password"
              className="text-sm text-muted-foreground font-prompt uppercase tracking-wider"
            >
              Senha da sala
            </label>
            <Input
              id="room-password"
              type="password"
              placeholder="Deixe em branco para sala pública"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              size="default"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              size="default"
              onClick={handleConfirm}
              disabled={!canSubmit}
              loading={loading}
            >
              Criar sala
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
