export const table = {
  name: "table",
  dependencies: [
  "clsx",
  "tailwind-merge",
  "class-variance-authority",
  "framer-motion"
],
  
  fileName: "table.tsx",
  content: `"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion"
import { cn } from "../utils/cn"

interface TableContextProps {
  variant: "default" | "glass" | "neon" | "minimal" | "cyberpunk" | "aurora" | "gradient"
  density: "compact" | "normal" | "spacious"
  hoverable: boolean
  striped: boolean
  bordered: boolean
  animateRows?: boolean
}

const TableContext = React.createContext<TableContextProps>({
  variant: "default",
  density: "normal",
  hoverable: true,
  striped: false,
  bordered: false,
  animateRows: false,
})

const tableContainerVariants = cva(
  "w-full overflow-x-auto relative transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "bg-card border border-border text-card-foreground rounded-xl shadow-xs",
        glass: "backdrop-blur-md bg-card/75 border border-border text-card-foreground rounded-xl shadow-xs",
        neon: "bg-card border border-border text-card-foreground rounded-xl shadow-xs",
        minimal: "bg-transparent border-0 border-b border-border text-foreground rounded-none shadow-none",
        cyberpunk: "bg-card border border-border text-foreground font-mono rounded-lg shadow-xs",
        aurora: "bg-card/70 backdrop-blur-md border border-border text-card-foreground rounded-xl shadow-xs",
        gradient: "bg-card border border-border text-foreground rounded-xl shadow-xs",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableContainerVariants> {
  density?: "compact" | "normal" | "spacious"
  hoverable?: boolean
  striped?: boolean
  bordered?: boolean
  animateRows?: boolean
  containerClassName?: string
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      containerClassName,
      variant = "default",
      density = "normal",
      hoverable = true,
      striped = false,
      bordered = false,
      animateRows = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <TableContext.Provider
        value={{
          variant: variant ?? "default",
          density: density ?? "normal",
          hoverable,
          striped,
          bordered,
          animateRows,
        }}
      >
        <div className={cn(tableContainerVariants({ variant }), containerClassName)}>
          <table
            ref={ref}
            className={cn("w-full border-collapse text-left text-sm align-middle tabular-nums", className)}
            {...props}
          >
            {children}
          </table>
        </div>
      </TableContext.Provider>
    )
  }
)
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => {
  const { variant } = React.useContext(TableContext)

  const headerClass = cn(
    "border-b border-border font-medium text-muted-foreground select-none bg-muted/30",
    variant === "minimal" && "bg-transparent",
    variant === "cyberpunk" && "font-mono uppercase tracking-wider text-foreground",
    className
  )

  return (
    <thead ref={ref} className={headerClass} {...props}>
      {children}
    </thead>
  )
})
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => {
  const bodyClass = cn("divide-y divide-border/70", className)

  return (
    <tbody ref={ref} className={bodyClass} {...props}>
      {children}
    </tbody>
  )
})
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  const { variant } = React.useContext(TableContext)
  return (
    <tfoot
      ref={ref}
      className={cn(
        "border-t border-border bg-muted/40 font-medium text-muted-foreground",
        variant === "cyberpunk" && "font-mono text-foreground",
        className
      )}
      {...props}
    />
  )
})
TableFooter.displayName = "TableFooter"

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  index?: number
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, index = 0, ...props }, ref) => {
    const { variant, hoverable, striped, animateRows } = React.useContext(TableContext)
    const shouldReduceMotion = useReducedMotion()

    const rowClass = cn(
      "transition-colors duration-150",
      striped && "even:bg-muted/25",
      hoverable && "hover:bg-muted/40",
      variant === "minimal" && hoverable && "hover:bg-muted/25",
      className
    )

    if (animateRows && !shouldReduceMotion) {
      return (
        <motion.tr
          ref={ref}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
            delay: Math.min(index * 0.04, 0.24),
          }}
          className={rowClass}
          {...(props as HTMLMotionProps<"tr">)}
        />
      )
    }

    return <tr ref={ref} className={rowClass} {...props} />
  }
)
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const { density, bordered, variant } = React.useContext(TableContext)

  const headClass = cn(
    "font-semibold select-none align-middle text-muted-foreground whitespace-nowrap",
    {
      "px-3 py-2 text-xs": density === "compact",
      "px-4 py-3 text-xs": density === "normal",
      "px-5 py-4 text-sm": density === "spacious",
      "border-r border-border last:border-r-0": bordered,
    },
    variant === "cyberpunk" && "text-foreground font-mono tracking-wider",
    className
  )

  return <th ref={ref} className={headClass} {...props} />
})
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const { density, bordered, variant } = React.useContext(TableContext)

  const cellClass = cn(
    "align-middle transition-colors text-foreground",
    {
      "px-3 py-2 text-xs": density === "compact",
      "px-4 py-3 text-sm": density === "normal",
      "px-5 py-4 text-sm": density === "spacious",
      "border-r border-border last:border-r-0": bordered,
    },
    variant === "cyberpunk" && "font-mono",
    className
  )

  return <td ref={ref} className={cellClass} {...props} />
})
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => {
  return (
    <caption
      ref={ref}
      className={cn(
        "py-3 px-4 text-xs text-muted-foreground text-center border-t border-border/60 caption-bottom",
        className
      )}
      {...props}
    />
  )
})
TableCaption.displayName = "TableCaption"

export interface CustomizableTableProps extends TableProps {
  headers: string[]
  rows: React.ReactNode[][]
  caption?: string
}

export const CustomizableTable = ({
  headers,
  rows,
  caption,
  ...props
}: CustomizableTableProps) => {
  return (
    <Table {...props}>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {headers.map((header, i) => (
            <TableHead key={i}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, rowIndex) => (
          <TableRow key={rowIndex} index={rowIndex}>
            {headers.map((_, colIndex) => (
              <TableCell key={colIndex}>
                {row[colIndex] !== undefined && row[colIndex] !== null && row[colIndex] !== "" ? (
                  row[colIndex]
                ) : (
                  <span className="text-muted-foreground/50 font-mono text-xs">-</span>
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export interface DataTableColumn<T = Record<string, unknown>> {
  header: React.ReactNode
  accessorKey?: keyof T | string
  cell?: (item: T, index: number) => React.ReactNode
  className?: string
}

export interface DataTableProps<T = Record<string, unknown>> extends TableProps {
  data?: T[]
  columns?: DataTableColumn<T>[]
  searchable?: boolean
  searchPlaceholder?: string
  searchKey?: keyof T | string
  pagination?: boolean
  pageSize?: number
  emptyMessage?: string
  children?: React.ReactNode
}

export function DataTable<T extends Record<string, unknown> = Record<string, unknown>>({
  data,
  columns,
  searchable = false,
  searchPlaceholder = "Filter rows...",
  searchKey,
  pagination = false,
  pageSize = 5,
  emptyMessage = "No matching rows.",
  children,
  ...tableProps
}: DataTableProps<T>) {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)

  if (children) {
    return <Table {...tableProps}>{children}</Table>
  }

  const items = data || []
  const filtered = items.filter((item) => {
    if (!search.trim()) return true
    if (searchKey && item[searchKey as keyof T] !== undefined) {
      return String(item[searchKey as keyof T])
        .toLowerCase()
        .includes(search.toLowerCase())
    }
    return Object.values(item).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const displayed = pagination
    ? filtered.slice((safePage - 1) * pageSize, safePage * pageSize)
    : filtered

  return (
    <div className="w-full space-y-3">
      {searchable && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <input
            type="text"
            value={search}
            aria-label={searchPlaceholder}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder={searchPlaceholder}
            className="h-9 px-3 py-1 rounded-lg border border-input bg-background text-xs text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full sm:w-64 shadow-xs"
          />
          <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
            {filtered.length} {filtered.length === 1 ? "result" : "results"}
          </span>
        </div>
      )}

      <Table {...tableProps}>
        {columns && (
          <TableHeader>
            <TableRow>
              {columns.map((col, idx) => (
                <TableHead key={idx} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {displayed.length > 0 ? (
            displayed.map((item, rowIdx) => (
              <TableRow key={rowIdx} index={rowIdx}>
                {columns?.map((col, colIdx) => (
                  <TableCell key={colIdx} className={col.className}>
                    {col.cell
                      ? col.cell(item, rowIdx)
                      : col.accessorKey
                      ? String(item[col.accessorKey as keyof T] ?? "")
                      : null}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns?.length || 1}
                className="text-center py-8 text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {pagination && totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-1 text-xs text-muted-foreground tabular-nums">
          <span className="font-mono text-[11px]">
            Page {safePage} of {totalPages}
          </span>
          <div className="flex gap-1.5">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded-md border border-border bg-card hover:bg-muted text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded-md border border-border bg-card hover:bg-muted text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export const TableCompound = Object.assign(Table, {
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Caption: TableCaption,
})

Object.assign(DataTable, {
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Caption: TableCaption,
})

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
}
`
};
