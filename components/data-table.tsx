"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, ChevronUp, Info, Power, Minus, Plus, Settings, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { Delivery } from "@/app/data"
import { PowerModeModal } from "@/components/power-mode-modal"
import { InfoModal } from "@/components/info-modal"

interface DataTableProps {
  data: Delivery[]
  onLocationClick?: (locationName: string) => void
  onEditRow?: (rowId: number) => void
  showMap?: boolean
}

export function DataTable({ data, onLocationClick, onEditRow, showMap = true }: DataTableProps) {
  'use no memo'
  
  const [tableData, setTableData] = React.useState<Delivery[]>(data)
  const [columnDialogOpen, setColumnDialogOpen] = React.useState(false)
  const [rowDialogOpen, setRowDialogOpen] = React.useState(false)
  const [addRowDialogOpen, setAddRowDialogOpen] = React.useState(false)
  const [powerModalOpen, setPowerModalOpen] = React.useState(false)
  const [selectedPowerRow, setSelectedPowerRow] = React.useState<Delivery | null>(null)
  const [infoModalOpen, setInfoModalOpen] = React.useState(false)
  const [selectedInfoRow, setSelectedInfoRow] = React.useState<Delivery | null>(null)
  const [newRowData, setNewRowData] = React.useState({ code: "", location: "", delivery: "" })
  const [rowCount, setRowCount] = React.useState(data.length)
  const [tempRowData, setTempRowData] = React.useState<Delivery[]>([])
  const [orderInputs, setOrderInputs] = React.useState<{ [key: number]: string }>({})
  const [columnSettings, setColumnSettings] = React.useState([
    { id: "code", label: "Code", visible: true },
    { id: "location", label: "Location", visible: true },
    { id: "delivery", label: "Delivery", visible: true },
  ])

  React.useEffect(() => {
    setTableData(data)
    setRowCount(data.length)
  }, [data])

  const toggleColumnVisibility = (columnId: string) => {
    setColumnSettings(prev => 
      prev.map(col => 
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    )
  }

  const moveColumn = (index: number, direction: 'up' | 'down') => {
    const newSettings = [...columnSettings]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex >= 0 && targetIndex < columnSettings.length) {
      [newSettings[index], newSettings[targetIndex]] = [newSettings[targetIndex], newSettings[index]]
      setColumnSettings(newSettings)
    }
  }

  const adjustRowCount = (direction: 'up' | 'down') => {
    const newCount = direction === 'up' ? rowCount + 1 : Math.max(1, rowCount - 1)
    setRowCount(newCount)
  }

  const handleRowInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value > 0 && value <= 1000) {
      setRowCount(value)
    }
  }

  const openRowDialog = () => {
    setTempRowData([...tableData])
    setOrderInputs({})
    setRowDialogOpen(true)
  }

  const handleOrderChange = (rowIndex: number, value: string) => {
    setOrderInputs(prev => ({ ...prev, [rowIndex]: value }))
  }

  const handleOrderBlur = (rowIndex: number) => {
    const orderValue = orderInputs[rowIndex]
    if (!orderValue) return

    const orderNum = parseInt(orderValue)
    if (isNaN(orderNum) || orderNum < 1 || orderNum > tempRowData.length) {
      return
    }

    if (orderNum - 1 === rowIndex) {
      return
    }

    const newData = [...tempRowData]
    const item = newData[rowIndex]
    newData.splice(rowIndex, 1)
    newData.splice(orderNum - 1, 0, item)
    
    setTempRowData(newData)
    setOrderInputs({})
  }

  const applyRowOrder = () => {
    setTableData(tempRowData)
    setRowDialogOpen(false)
  }

  const handleAddNewRow = () => {
    const newId = Math.max(...tableData.map(row => row.id), 0) + 1
    const newRow: Delivery = {
      id: newId,
      code: parseInt(newRowData.code) || 0,
      location: newRowData.location,
      delivery: newRowData.delivery,
      lat: 0,
      lng: 0,
    }
    setTableData([...tableData, newRow])
    setNewRowData({ code: "", location: "", delivery: "" })
    setAddRowDialogOpen(false)
  }

  const columns: ColumnDef<Delivery>[] = [
    {
      id: "rowNumber",
      header: () => <div className="text-center font-bold">No</div>,
      cell: ({ table, ...context }) => {
        const pageIndex = table.getState().pagination.pageIndex
        const pageSize = table.getState().pagination.pageSize
        const visualRowIndex = (context as any).rowIndex ?? 0
        const sequentialNo = pageIndex * pageSize + visualRowIndex + 1
        return <div className="text-center font-bold text-primary">{sequentialNo}</div>
      },
      enableSorting: false,
      size: 60,
    },
    ...columnSettings.filter(col => col.visible).map((colSetting): ColumnDef<Delivery> => {
      if (colSetting.id === "code") {
        return {
          accessorKey: "code",
          header: () => <div className="text-center">Code</div>,
          cell: ({ row }) => {
            const value = row.getValue("code")
            return (
              <div className="text-center p-2">
                {value as number}
              </div>
            )
          },
        }
      } else if (colSetting.id === "location") {
        return {
          accessorKey: "location",
          header: () => <div className="text-center">Location</div>,
          cell: ({ row, table }) => {
            const locationName = row.getValue("location") as string
            const onLocationClick = (table.options.meta as any)?.onLocationClick
            const showMap = (table.options.meta as any)?.showMap
            
            return (
              <div 
                className={`text-center p-2 rounded ${showMap ? 'cursor-pointer hover:text-primary hover:underline' : ''} transition-colors`}
                onClick={() => {
                  if (showMap) {
                    onLocationClick?.(locationName)
                  }
                }}
              >
                {locationName}
              </div>
            )
          },
        }
      } else {
        return {
          accessorKey: "delivery",
          header: () => <div className="text-center">Delivery</div>,
          cell: ({ row }) => {
            const value = row.getValue("delivery")
            return (
              <div className="text-center p-2">
                {value as string}
              </div>
            )
          },
        }
      }
    }),
    {
      id: "actions",
      enableHiding: false,
      header: () => <div className="text-center">Action</div>,
      cell: ({ row, table }) => {
        const delivery = row.original
        const onEditRow = (table.options.meta as any)?.onEditRow

        return (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => onEditRow?.(delivery.id)}
              className="p-1 hover:text-primary transition-colors"
              title="Edit Row"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setSelectedInfoRow(delivery)
                setInfoModalOpen(true)
              }}
              className="p-1 hover:text-primary transition-colors"
              title="Info"
            >
              <Info className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setSelectedPowerRow(delivery)
                setPowerModalOpen(true)
              }}
              className="p-1 transition-colors"
              title={delivery.powerMode === 'on' ? 'Power ON' : delivery.powerMode === 'off' ? 'Power OFF' : 'Power Mode'}
              style={{
                color: delivery.powerMode === 'on' ? '#22c55e' : delivery.powerMode === 'off' ? '#ef4444' : '#94a3b8'
              }}
            >
              <Power className="h-4 w-4" />
            </button>
          </div>
        )
      },
    },
  ]

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data: tableData,
    columns,
    getRowId: (row) => String(row.id),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableSorting: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      onLocationClick,
      onEditRow,
      showMap,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-end py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              onSelect={() => setColumnDialogOpen(true)}
              className="text-center justify-center cursor-pointer"
            >
              Column Settings
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              onSelect={() => openRowDialog()}
              className="text-center justify-center cursor-pointer"
            >
              Row Settings
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              onSelect={() => setAddRowDialogOpen(true)}
              className="text-center justify-center cursor-pointer"
            >
              Add New Row
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="text-xs">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        { ...cell.getContext(), rowIndex }
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s) total.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Column Settings Dialog */}
      <Dialog open={columnDialogOpen} onOpenChange={setColumnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Column Settings</DialogTitle>
            <DialogDescription>
              Customize which columns to display and their order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {columnSettings.map((col, index) => (
              <div key={col.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/30 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <Checkbox 
                    id={col.id}
                    checked={col.visible}
                    onCheckedChange={() => toggleColumnVisibility(col.id)}
                  />
                  <Label htmlFor={col.id} className="cursor-pointer font-normal text-xs">
                    {col.label}
                  </Label>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveColumn(index, 'up')}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveColumn(index, 'down')}
                    disabled={index === columnSettings.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setColumnDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Row Dialog */}
      <Dialog open={addRowDialogOpen} onOpenChange={setAddRowDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Row</DialogTitle>
            <DialogDescription>
              Enter the details for the new row.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                type="number"
                value={newRowData.code}
                onChange={(e) => setNewRowData({ ...newRowData, code: e.target.value })}
                placeholder="Enter code"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={newRowData.location}
                onChange={(e) => setNewRowData({ ...newRowData, location: e.target.value })}
                placeholder="Enter location"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivery">Delivery</Label>
              <Input
                id="delivery"
                value={newRowData.delivery}
                onChange={(e) => setNewRowData({ ...newRowData, delivery: e.target.value })}
                placeholder="Enter delivery"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setAddRowDialogOpen(false)
              setNewRowData({ code: "", location: "", delivery: "" })
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddNewRow}
              disabled={!newRowData.code || !newRowData.location || !newRowData.delivery}
            >
              Add Row
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Row Settings Dialog */}
      <Dialog open={rowDialogOpen} onOpenChange={setRowDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Row Settings</DialogTitle>
            <DialogDescription>
              Adjust the number of rows and reorder them.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Row Reorder Preview */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Reorder Rows</Label>
              <p className="text-xs text-muted-foreground">
                Enter order number (1-{tempRowData.length}) to reorder rows. Changes will apply after clicking Apply button.
              </p>
              <div className="max-h-[400px] overflow-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center w-[120px] text-xs">Order</TableHead>
                      <TableHead className="text-center w-[150px] text-xs">Code</TableHead>
                      <TableHead className="text-center w-[300px] text-xs">Location</TableHead>
                      <TableHead className="text-center w-[250px] text-xs">Delivery</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tempRowData.map((row, index) => (
                      <TableRow key={row.id}>
                        <TableCell className="text-center w-[120px]">
                          <Input
                            type="number"
                            value={orderInputs[index] || ''}
                            onChange={(e) => handleOrderChange(index, e.target.value)}
                            onBlur={() => handleOrderBlur(index)}
                            placeholder={(index + 1).toString()}
                            className="w-[70px] text-center text-xs h-8"
                            min={1}
                            max={tempRowData.length}
                          />
                        </TableCell>
                        <TableCell className="text-center text-xs w-[150px]">{row.code}</TableCell>
                        <TableCell className="text-center text-xs w-[300px]">{row.location}</TableCell>
                        <TableCell className="text-center text-xs w-[250px]">{row.delivery}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="border-t" />

            {/* Row Count Control */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Number of Rows</Label>
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => adjustRowCount('down')}
                  disabled={rowCount <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={rowCount}
                  onChange={handleRowInputChange}
                  className="w-32 text-center"
                  min={1}
                  max={1000}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => adjustRowCount('up')}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRowDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyRowOrder}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Power Mode Modal */}
      <PowerModeModal
        visible={powerModalOpen}
        onHide={() => {
          setPowerModalOpen(false)
          setSelectedPowerRow(null)
        }}
        rowData={selectedPowerRow}
        onSave={(newMode) => {
          if (selectedPowerRow) {
            const updatedData = tableData.map((row) =>
              row.id === selectedPowerRow.id ? { ...row, powerMode: newMode as 'on' | 'off' | null } : row
            )
            setTableData(updatedData)
          }
        }}
      />

      {/* Info Modal */}
      <InfoModal
        visible={infoModalOpen}
        onHide={() => {
          setInfoModalOpen(false)
          setSelectedInfoRow(null)
        }}
        rowData={selectedInfoRow}
        onSave={(descriptionsObj) => {
          if (selectedInfoRow) {
            const updatedData = tableData.map((row) =>
              row.id === selectedInfoRow.id ? { ...row, descriptionsObj } : row
            )
            setTableData(updatedData)
          }
        }}
      />
    </div>
  )
}
