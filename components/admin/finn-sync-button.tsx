"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

interface SyncResult {
  message: string
  imported?: string[]
  updated?: string[]
  marked_sold?: string[]
  total_on_finn?: number
  errors?: string[]
  error?: string
}

export function FinnSyncButton() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [result, setResult] = useState<SyncResult | null>(null)

  async function handleSync() {
    setIsSyncing(true)
    setResult(null)

    try {
      const response = await fetch("/api/finn-sync", { method: "POST" })
      const data = await response.json()
      setResult(data)
    } catch {
      setResult({ message: "Feil ved synkronisering", error: "Kunne ikke koble til serveren" })
    }

    setIsSyncing(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" onClick={handleSync} disabled={isSyncing}>
        <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
        {isSyncing ? "Synkroniserer..." : "Synk fra Finn.no"}
      </Button>

      {result && (
        <div className={`text-sm rounded-lg p-3 ${result.error ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent-foreground"}`}>
          <div className="flex items-center gap-2 font-medium">
            {result.error ? (
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
            ) : (
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
            )}
            <span>{result.message}</span>
          </div>

          {result.total_on_finn !== undefined && (
            <p className="mt-1 text-xs opacity-70">{result.total_on_finn} biler funnet på Finn.no</p>
          )}

          {result.imported && result.imported.length > 0 && (
            <div className="mt-2">
              <p className="font-medium text-xs uppercase tracking-wide opacity-60 mb-1">Nye biler</p>
              <ul className="ml-4 list-disc space-y-0.5">
                {result.imported.map((car) => <li key={car}>{car}</li>)}
              </ul>
            </div>
          )}

          {result.updated && result.updated.length > 0 && (
            <div className="mt-2">
              <p className="font-medium text-xs uppercase tracking-wide opacity-60 mb-1">Oppdatert</p>
              <ul className="ml-4 list-disc space-y-0.5">
                {result.updated.map((car) => <li key={car}>{car}</li>)}
              </ul>
            </div>
          )}

          {result.marked_sold && result.marked_sold.length > 0 && (
            <div className="mt-2">
              <p className="font-medium text-xs uppercase tracking-wide opacity-60 mb-1">Markert som solgt</p>
              <ul className="ml-4 list-disc space-y-0.5">
                {result.marked_sold.map((code) => <li key={code}>Finnkode {code}</li>)}
              </ul>
            </div>
          )}

          {result.errors && result.errors.length > 0 && (
            <div className="mt-2">
              <p className="font-medium text-xs uppercase tracking-wide text-destructive mb-1">Feil</p>
              <ul className="ml-4 list-disc space-y-0.5 text-destructive">
                {result.errors.map((err) => <li key={err}>{err}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
