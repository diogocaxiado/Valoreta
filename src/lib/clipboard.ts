export function buildRoomShareUrl(roomId: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : ""
  return `${origin}/room/${roomId}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fallback below
  }

  try {
    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.style.position = "fixed"
    textarea.style.left = "-999999px"
    textarea.style.top = "-999999px"
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    const ok = document.execCommand("copy")
    textarea.remove()
    return ok
  } catch {
    return false
  }
}
