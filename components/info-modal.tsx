"use client"

import * as React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Delivery } from "@/app/data"
import { Trash2, Plus, Pencil } from "lucide-react"
import { useEditMode } from "@/contexts/edit-mode-context"

interface InfoModalProps {
  visible: boolean
  onHide: () => void
  rowData: Delivery | null
  onSave: (descriptions: Record<string, string>) => void
  isEditMode?: boolean
}

export function InfoModal({ visible, onHide, rowData, onSave, isEditMode = false }: InfoModalProps) {
  const { isEditMode: contextEditMode } = useEditMode()
  const actualEditMode = isEditMode || contextEditMode
  const [descriptions, setDescriptions] = React.useState<Record<string, string>>({})
  const [isEditing, setIsEditing] = React.useState(false)
  const [newKey, setNewKey] = React.useState("")
  const [newValue, setNewValue] = React.useState("")
  
  // Shortcut dialog states
  const [showFamilyMartDialog, setShowFamilyMartDialog] = React.useState(false)
  const [showWebsiteDialog, setShowWebsiteDialog] = React.useState(false)
  const [showQRDialog, setShowQRDialog] = React.useState(false)
  const [showGoogleMapsDialog, setShowGoogleMapsDialog] = React.useState(false)
  const [showWazeDialog, setShowWazeDialog] = React.useState(false)
  const [websiteLink, setWebsiteLink] = React.useState("")
  const [qrCodeImageUrl, setQRCodeImageUrl] = React.useState("")
  const [qrCodeDestinationUrl, setQRCodeDestinationUrl] = React.useState("")
  const [googleMapsLink, setGoogleMapsLink] = React.useState("")
  const [wazeLink, setWazeLink] = React.useState("")

  React.useEffect(() => {
    if (visible && rowData) {
      const desc = rowData.descriptionsObj || {}
      setDescriptions(desc)
      setWebsiteLink(desc.websiteLink || "")
      setQRCodeImageUrl(desc.qrCodeImageUrl || "")
      setQRCodeDestinationUrl(desc.qrCodeDestinationUrl || "")
      setGoogleMapsLink(desc.googleMapsLink || "")
      setWazeLink(desc.wazeLink || "")
      setIsEditing(false)
      setNewKey("")
      setNewValue("")
    }
  }, [visible, rowData])

  const handleAddDescription = () => {
    if (newKey.trim() && newValue.trim()) {
      setDescriptions({
        ...descriptions,
        [newKey.trim()]: newValue.trim()
      })
      setNewKey("")
      setNewValue("")
    }
  }

  const handleDeleteDescription = (key: string) => {
    const updated = { ...descriptions }
    delete updated[key]
    setDescriptions(updated)
  }

  const handleUpdateDescription = (key: string, value: string) => {
    setDescriptions({
      ...descriptions,
      [key]: value
    })
  }

  const handleSave = () => {
    if (onSave) {
      const updatedDescriptions = {
        ...descriptions,
        websiteLink,
        qrCodeImageUrl,
        qrCodeDestinationUrl,
        googleMapsLink,
        wazeLink
      }
      onSave(updatedDescriptions)
    }
    onHide()
  }
  
  const handleShortcutClick = (type: string) => {
    if (!actualEditMode) {
      // Show confirmation dialog before opening link
      if (type === 'familymart') {
        setShowFamilyMartDialog(true)
      } else if (type === 'googlemaps') {
        setShowGoogleMapsDialog(true)
      } else if (type === 'waze') {
        setShowWazeDialog(true)
      } else if (type === 'website') {
        setShowWebsiteDialog(true)
      } else if (type === 'qrcode') {
        setShowQRDialog(true)
      }
    } else {
      // Open edit dialog if in edit mode
      if (type === 'familymart') {
        setShowFamilyMartDialog(true)
      } else if (type === 'googlemaps') {
        setShowGoogleMapsDialog(true)
      } else if (type === 'waze') {
        setShowWazeDialog(true)
      } else if (type === 'website') {
        setShowWebsiteDialog(true)
      } else if (type === 'qrcode') {
        setShowQRDialog(true)
      }
    }
  }

  const confirmAndOpenLink = (type: string) => {
    if (type === 'familymart' && rowData?.code && !isNaN(Number(rowData.code))) {
      const formattedCode = rowData.code.toString().padStart(4, '0')
      window.open(`https://fmvending.web.app/refill-service/M${formattedCode}`, '_blank')
      setShowFamilyMartDialog(false)
    } else if (type === 'googlemaps') {
      // Use custom link if available, otherwise use coordinates
      let url = googleMapsLink
      if (!url && rowData?.lat && rowData?.lng) {
        url = `https://www.google.com/maps/search/?api=1&query=${rowData.lat},${rowData.lng}`
      }
      if (url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url
        }
        window.open(url, '_blank')
      }
      setShowGoogleMapsDialog(false)
    } else if (type === 'waze') {
      // Use custom link if available, otherwise use coordinates
      let url = wazeLink
      if (!url && rowData?.lat && rowData?.lng) {
        url = `https://www.waze.com/ul?ll=${rowData.lat},${rowData.lng}&navigate=yes`
      }
      if (url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url
        }
        window.open(url, '_blank')
      }
      setShowWazeDialog(false)
    } else if (type === 'website' && websiteLink) {
      let url = websiteLink
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
      }
      window.open(url, '_blank')
      setShowWebsiteDialog(false)
    } else if (type === 'qrcode' && qrCodeDestinationUrl) {
      window.open(qrCodeDestinationUrl, '_blank')
      setShowQRDialog(false)
    }
  }

  const handleCancel = () => {
    setDescriptions(rowData?.descriptionsObj || {})
    setNewKey("")
    setNewValue("")
    setIsEditing(false)
    onHide()
  }

  return (
    <Dialog open={visible} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Location Information</DialogTitle>
          <DialogDescription className="text-xs">
            <strong>{rowData?.code}</strong> - {rowData?.location || 'this location'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Descriptions Section */}
          <div className="space-y-3 p-4 rounded-lg border bg-card">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <span className="text-primary">ℹ️</span>
                Location Information
              </Label>
              {!isEditing && actualEditMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Description Items */}
            <div className="space-y-2">
              {Object.keys(descriptions).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No information yet. {isEditing && "Add one below."}
                </p>
              ) : (
                Object.entries(descriptions).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-3 border-b last:border-b-0"
                  >
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">
                        {key}:
                      </span>
                      {isEditing ? (
                        <Input
                          value={value}
                          onChange={(e) => handleUpdateDescription(key, e.target.value)}
                          className="text-sm h-8"
                        />
                      ) : (
                        <span className="text-sm font-medium text-right">
                          {value}
                        </span>
                      )}
                    </div>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDescription(key)}
                        className="ml-2 h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Add New Description */}
            {isEditing && (
              <div className="pt-3 space-y-2 border-t">
                <Label className="text-xs">Add New Information</Label>
                <div className="flex gap-2">
                  <Input
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="Label (e.g., Operating Hours)"
                    className="flex-1"
                  />
                  <Input
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Value (e.g., 24/7)"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddDescription()
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAddDescription}
                    disabled={!newKey.trim() || !newValue.trim()}
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Shortcuts Section */}
          <div className="space-y-3 mt-6 pt-4 border-t">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground text-center">
              Shortcuts
            </h3>
            <div className="flex flex-wrap gap-3 justify-center p-2">
              {/* FamilyMart Button - only show if code is numeric */}
              {rowData?.code && !isNaN(Number(rowData.code)) && (
                <Button
                  onClick={() => handleShortcutClick('familymart')}
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 hover:bg-transparent"
                  title="FamilyMart"
                >
                  <Image 
                    src="/FamilyMart.png" 
                    alt="FamilyMart" 
                    width={44}
                    height={44}
                    className="h-11 w-11 hover:scale-110 transition-transform"
                  />
                </Button>
              )}

              {/* Google Maps Button - show if custom link exists OR (lat/lng exists and in edit mode) */}
              {(googleMapsLink || (actualEditMode && rowData?.lat && rowData?.lng)) && (
                <Button
                  onClick={() => handleShortcutClick('googlemaps')}
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 hover:bg-transparent"
                  title="Google Maps"
                >
                  <Image 
                    src="/Gmaps.png" 
                    alt="Google Maps" 
                    width={44}
                    height={44}
                    className="h-11 w-11 hover:scale-110 transition-transform"
                  />
                </Button>
              )}

              {/* Waze Button - show if custom link exists OR (lat/lng exists and in edit mode) */}
              {(wazeLink || (actualEditMode && rowData?.lat && rowData?.lng)) && (
                <Button
                  onClick={() => handleShortcutClick('waze')}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 hover:bg-transparent"
                  title="Waze"
                >
                  <Image 
                    src="/waze_app_icon-logo_brandlogos.net_l82da.png" 
                    alt="Waze" 
                    width={32}
                    height={32}
                    className="h-8 w-8 hover:scale-110 transition-transform"
                  />
                </Button>
              )}

              {/* Website Button - show if websiteLink exists OR in edit mode */}
              {(websiteLink || actualEditMode) && (
                <Button
                  onClick={() => handleShortcutClick('website')}
                  variant="ghost"
                  size="icon"
                  className={`h-12 w-12 hover:bg-transparent ${!websiteLink && actualEditMode ? 'opacity-50 hover:opacity-100' : ''}`}
                  title={websiteLink ? "Website" : "Add Website Link"}
                >
                  <svg className="h-10 w-10 hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm5 16H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7z"/>
                  </svg>
                  {!websiteLink && actualEditMode && (
                    <Plus className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground rounded-full" />
                  )}
                </Button>
              )}

              {/* QR Code Button - show if qrCodeImageUrl exists OR in edit mode */}
              {(qrCodeImageUrl || actualEditMode) && (
                <Button
                  onClick={() => handleShortcutClick('qrcode')}
                  variant="ghost"
                  size="icon"
                  className={`h-12 w-12 hover:bg-transparent ${!qrCodeImageUrl && actualEditMode ? 'opacity-50 hover:opacity-100' : ''}`}
                  title={qrCodeImageUrl ? "QR Code" : "Add QR Code"}
                >
                  <Image 
                    src="/QRcodewoi.png" 
                    alt="QR Code" 
                    width={40}
                    height={40}
                    className="h-10 w-10 hover:scale-110 transition-transform"
                  />
                  {!qrCodeImageUrl && actualEditMode && (
                    <Plus className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground rounded-full" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Shortcut Edit Dialogs */}
          {/* FamilyMart Dialog */}
          <Dialog open={showFamilyMartDialog} onOpenChange={setShowFamilyMartDialog}>
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>{actualEditMode ? 'FamilyMart Link' : 'Open FamilyMart Link?'}</DialogTitle>
                {!actualEditMode && (
                  <DialogDescription>
                    Do you want to open the FamilyMart refill service page?
                  </DialogDescription>
                )}
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Code</Label>
                  <Input value={rowData?.code || ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Generated Link</Label>
                  <Input 
                    value={`https://fmvending.web.app/refill-service/M${rowData?.code?.toString().padStart(4, '0')}`}
                    disabled 
                  />
                </div>
                {actualEditMode && (
                  <p className="text-xs text-muted-foreground">
                    This link is automatically generated based on the machine code and cannot be edited.
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowFamilyMartDialog(false)}>
                  {actualEditMode ? 'Close' : 'Cancel'}
                </Button>
                {!actualEditMode && (
                  <Button onClick={() => confirmAndOpenLink('familymart')}>
                    Open Link
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Website Dialog */}
          <Dialog open={showWebsiteDialog} onOpenChange={setShowWebsiteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{actualEditMode ? 'Website Link' : 'Open Website?'}</DialogTitle>
                {!actualEditMode && (
                  <DialogDescription>
                    Do you want to open this website?
                  </DialogDescription>
                )}
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website-url">Website URL</Label>
                  <Input 
                    id="website-url"
                    value={websiteLink} 
                    onChange={(e) => setWebsiteLink(e.target.value)}
                    placeholder="https://example.com"
                    disabled={!actualEditMode}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowWebsiteDialog(false)}>
                  Cancel
                </Button>
                {actualEditMode ? (
                  <Button onClick={() => {
                    setDescriptions(prev => ({ ...prev, websiteLink }))
                    setShowWebsiteDialog(false)
                  }}>
                    Save
                  </Button>
                ) : (
                  <Button onClick={() => confirmAndOpenLink('website')}>
                    Open Link
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* QR Code Dialog */}
          <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{actualEditMode ? 'QR Code Settings' : 'Open QR Code Link?'}</DialogTitle>
                {!actualEditMode && (
                  <DialogDescription>
                    Do you want to open the QR code destination?
                  </DialogDescription>
                )}
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="qr-image-url">QR Code Image URL</Label>
                  <Input 
                    id="qr-image-url"
                    value={qrCodeImageUrl} 
                    onChange={(e) => setQRCodeImageUrl(e.target.value)}
                    placeholder="https://example.com/qrcode.png"
                    disabled={!actualEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qr-dest-url">Destination URL (when scanned)</Label>
                  <Input 
                    id="qr-dest-url"
                    value={qrCodeDestinationUrl} 
                    onChange={(e) => setQRCodeDestinationUrl(e.target.value)}
                    placeholder="https://example.com/destination"
                    disabled={!actualEditMode}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowQRDialog(false)}>
                  Cancel
                </Button>
                {actualEditMode ? (
                  <Button onClick={() => {
                    setDescriptions(prev => ({ 
                      ...prev, 
                      qrCodeImageUrl, 
                      qrCodeDestinationUrl 
                    }))
                    setShowQRDialog(false)
                  }}>
                    Save
                  </Button>
                ) : (
                  <Button onClick={() => confirmAndOpenLink('qrcode')}>
                    Open Link
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Google Maps Dialog */}
          <Dialog open={showGoogleMapsDialog} onOpenChange={setShowGoogleMapsDialog}>
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>{actualEditMode ? 'Google Maps Direction Link' : 'Open in Google Maps?'}</DialogTitle>
                <DialogDescription>
                  {actualEditMode ? 'Add a custom direction link or use auto-generated coordinates' : 'Do you want to open this location in Google Maps?'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={rowData?.location || ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input value={rowData?.lat || ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input value={rowData?.lng || ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="googlemaps-link">Custom Direction Link (Optional)</Label>
                  <Input 
                    id="googlemaps-link"
                    value={googleMapsLink} 
                    onChange={(e) => setGoogleMapsLink(e.target.value)}
                    placeholder="https://maps.app.goo.gl/..."
                    disabled={!actualEditMode}
                  />
                  <p className="text-xs text-muted-foreground">
                    {googleMapsLink ? 'Custom link will be used' : 'Auto-generated from coordinates if left empty'}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowGoogleMapsDialog(false)}>
                  Cancel
                </Button>
                {actualEditMode ? (
                  <Button onClick={() => {
                    setDescriptions(prev => ({ ...prev, googleMapsLink }))
                    setShowGoogleMapsDialog(false)
                  }}>
                    Save
                  </Button>
                ) : (
                  <Button onClick={() => confirmAndOpenLink('googlemaps')}>
                    Open in Google Maps
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Waze Dialog */}
          <Dialog open={showWazeDialog} onOpenChange={setShowWazeDialog}>
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>{actualEditMode ? 'Waze Direction Link' : 'Open in Waze?'}</DialogTitle>
                <DialogDescription>
                  {actualEditMode ? 'Add a custom direction link or use auto-generated coordinates' : 'Do you want to navigate to this location using Waze?'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={rowData?.location || ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input value={rowData?.lat || ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input value={rowData?.lng || ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waze-link">Custom Direction Link (Optional)</Label>
                  <Input 
                    id="waze-link"
                    value={wazeLink} 
                    onChange={(e) => setWazeLink(e.target.value)}
                    placeholder="https://waze.com/ul?ll=..."
                    disabled={!actualEditMode}
                  />
                  <p className="text-xs text-muted-foreground">
                    {wazeLink ? 'Custom link will be used' : 'Auto-generated from coordinates if left empty'}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowWazeDialog(false)}>
                  Cancel
                </Button>
                {actualEditMode ? (
                  <Button onClick={() => {
                    setDescriptions(prev => ({ ...prev, wazeLink }))
                    setShowWazeDialog(false)
                  }}>
                    Save
                  </Button>
                ) : (
                  <Button onClick={() => confirmAndOpenLink('waze')}>
                    Open in Waze
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          {isEditing && (
            <Button onClick={handleSave}>Save Changes</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
