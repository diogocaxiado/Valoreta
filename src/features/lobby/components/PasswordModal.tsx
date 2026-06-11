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

interface PasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (name: string, password: string) => void
  error?: string
  loading?: boolean
}

export function PasswordModal({
  open,
  onOpenChange,
  onConfirm,
  error,
  loading,
}: PasswordModalProps) {
  const [name, setName] = useState(getPlayerName())
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (open) {
      setName(getPlayerName())
      setPassword("")
    }
  }, [open])

  function handleConfirm() {
    if (!name.trim() || !password) return
    onConfirm(name.trim(), password)
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setPassword("")
    }
    onOpenChange(open)
  }

  const canSubmit = name.trim().length > 0 && password.length > 0 && !loading

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sala protegida</DialogTitle>
          <DialogDescription>
            Esta sala é protegida por senha. Informe seu nome e a senha para entrar.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="join-name"
              className="text-sm text-muted-foreground font-prompt uppercase tracking-wider"
            >
              Seu nome
            </label>
            <Input
              id="join-name"
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
              htmlFor="access-password"
              className="text-sm text-muted-foreground font-prompt uppercase tracking-wider"
            >
              Senha
            </label>
            <Input
              id="access-password"
              type="password"
              placeholder="Digite a senha da sala"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive font-prompt">{error}</p>
          )}

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
              Entrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
