"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

interface SyncResult {
  message: string
  imported?: string[]
  errors?: string[]
  total_on_finn?: number
  already_existed?: number
  error?: string
}

export function FinnSyncButton() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [result, setResult] = useState<SyncResult | null>(null)

  async function handleSync() {
    setIsSyncing(true)
    setResult(null)

    try {
      const response = await fetch("/api/finn-sync", {
        method: "POST",
      })
      const data = await response.json()
      setResult(data)
    } catch {
      setResult({ message: "Feil ved synkronisering", error: "Kunne ikke koble til serveren" })
    }

    setIsSyncing(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        onClick={handleSync}
        disabled={isSyncing}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
        {isSyncing ? "Synkroniserer..." : "Synk fra Finn.no"}
      </Button>

      {result && (
        <div className={`text-sm rounded-lg p-3 ${result.error ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent-foreground"}`}>
          <div className="flex items-center gap-2">
            {result.error ? (
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
            ) : (
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
            )}
            <span className="font-medium">{result.message}</span>
          </div>
          {result.imported && result.imported.length > 0 && (
            <ul className="mt-2 ml-6 list-disc">
              {result.imported.map((car) => (
                <li key={car}>{car}</li>
              ))}
            </ul>
          )}
          {result.errors && result.errors.length > 0 && (
            <ul className="mt-2 ml-6 list-disc text-destructive">
              {result.errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
