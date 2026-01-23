"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Delivery } from "@/app/data"

interface PowerModeModalProps {
  visible: boolean
  onHide: () => void
  rowData: Delivery | null
  onSave: (mode: string | null) => void
}

export function PowerModeModal({ visible, onHide, rowData, onSave }: PowerModeModalProps) {
  const [selectedMode, setSelectedMode] = React.useState(rowData?.powerMode || null)
  const [tempSelectedMode, setTempSelectedMode] = React.useState(rowData?.powerMode || null)

  const powerModes = [
    { value: 'on', label: 'Power ON', icon: '⚡', description: 'Vending machine is powered on', color: '#22c55e' },
    { value: 'off', label: 'Power OFF', icon: '🔌', description: 'Vending machine is powered off', color: '#ef4444' },
    { value: null, label: 'Not Set', icon: '❓', description: 'Power mode not configured', color: '#94a3b8' },
  ]

  React.useEffect(() => {
    if (visible) {
      setTempSelectedMode(rowData?.powerMode || null)
    }
  }, [visible, rowData])

  const handleCancel = () => {
    setTempSelectedMode(selectedMode)
    onHide()
  }

  const handleApply = () => {
    setSelectedMode(tempSelectedMode)
    if (onSave) {
      onSave(tempSelectedMode)
    }
    onHide()
  }

  return (
    <Dialog open={visible} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Power Mode</DialogTitle>
          <DialogDescription className="text-xs">
            Select power mode for <strong>{rowData?.location || 'this location'}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-3">
            {powerModes.map((mode) => (
              <div
                key={mode.label}
                className="flex items-center justify-between p-4 rounded-lg border transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{mode.icon}</span>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm">{mode.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {mode.description}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setTempSelectedMode(mode.value as 'on' | 'off' | null)}
                  className="relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  style={{
                    backgroundColor: tempSelectedMode === mode.value ? mode.color : '#94a3b8'
                  }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 ease-in-out ${
                      tempSelectedMode === mode.value
                        ? 'translate-x-[18px]'
                        : 'translate-x-[2px]'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
