'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

// Define Table styling context to propagate values to children (th, td, tr)
interface TableContextProps {
  variant: 'default' | 'glass' | 'neon' | 'minimal' | 'cyberpunk' | 'aurora' | 'gradient';
  density: 'compact' | 'normal' | 'spacious';
  hoverable: boolean;
  striped: boolean;
  bordered: boolean;
  animateRows?: boolean;
}

const TableContext = React.createContext<TableContextProps>({
  variant: 'default',
  density: 'normal',
  hoverable: true,
  striped: false,
  bordered: false,
  animateRows: false,
});

const tableContainerVariants = cva(
  "w-full overflow-auto relative transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-card border border-border text-card-foreground rounded-2xl shadow-sm",
        glass: "glass bg-white/[0.01] dark:bg-black/10 border border-white/10 dark:border-white/5 rounded-2xl shadow-xl",
        neon: "bg-black/40 border border-purple-500/30 text-white rounded-2xl shadow-[0_0_25px_rgba(139,92,246,0.15)]",
        minimal: "bg-transparent border-0 border-b border-border/50 text-foreground rounded-none shadow-none",
        cyberpunk: "bg-black border-2 border-green-500/50 text-green-400 font-mono rounded-none shadow-[0_0_15px_rgba(34,197,94,0.15)]",
        aurora: "bg-card/25 backdrop-blur-xl border border-pink-500/10 text-card-foreground rounded-2xl shadow-xl",
        gradient: "bg-gradient-to-b from-card to-muted/20 border border-border/80 text-foreground rounded-2xl shadow-md",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableContainerVariants> {
  density?: 'compact' | 'normal' | 'spacious';
  hoverable?: boolean;
  striped?: boolean;
  bordered?: boolean;
  animateRows?: boolean;
  containerClassName?: string;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      containerClassName,
      variant = 'default',
      density = 'normal',
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
      <TableContext.Provider value={{ 
        variant: (variant === null || variant === undefined) ? 'default' : variant, 
        density: (density === null || density === undefined) ? 'normal' : density, 
        hoverable, 
        striped, 
        bordered, 
        animateRows 
      }}>
        <div className={cn(tableContainerVariants({ variant }), containerClassName)}>
          {/* Cyberpunk corner accents */}
          {variant === 'cyberpunk' && (
            <>
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-green-500" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-green-500" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-green-500" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-green-500" />
            </>
          )}
          <table
            ref={ref}
            className={cn("w-full border-collapse text-left text-sm align-middle", className)}
            {...props}
          >
            {children}
          </table>
        </div>
      </TableContext.Provider>
    );
  }
);
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => {
  const { variant } = React.useContext(TableContext);

  const headerClass = cn(
    "border-b border-border/80 font-medium text-muted-foreground/95 select-none",
    variant === 'cyberpunk' && "bg-green-950/40 border-b-2 border-green-500/60 text-green-300 font-bold uppercase tracking-wider",
    variant === 'neon' && "bg-purple-950/20 border-b border-purple-500/40 text-purple-200 tracking-wide",
    variant === 'glass' && "bg-white/5 dark:bg-white/3 border-b border-white/10 text-foreground/80",
    variant === 'aurora' && "bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border-b border-purple-500/20 text-purple-300",
    variant === 'gradient' && "bg-gradient-to-r from-primary/10 to-indigo-500/5 border-b border-border/80 text-foreground/90",
    className
  );

  return (
    <thead ref={ref} className={headerClass} {...props}>
      {children}
    </thead>
  );
});
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => {
  const { variant } = React.useContext(TableContext);

  const bodyClass = cn(
    "divide-y divide-border/40",
    variant === 'minimal' && "divide-y divide-border/20",
    variant === 'cyberpunk' && "divide-y divide-green-500/30",
    className
  );

  return (
    <tbody ref={ref} className={bodyClass} {...props}>
      {children}
    </tbody>
  );
});
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  const { variant } = React.useContext(TableContext);
  return (
    <tfoot
      ref={ref}
      className={cn(
        "border-t bg-muted/50 font-medium text-muted-foreground",
        variant === 'cyberpunk' && "bg-green-950/20 border-t-2 border-green-500/40 text-green-300 font-mono",
        className
      )}
      {...props}
    />
  );
});
TableFooter.displayName = 'TableFooter';

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  index?: number;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, index = 0, ...props }, ref) => {
    const { variant, hoverable, striped, animateRows } = React.useContext(TableContext);

    const rowClass = cn(
      "transition-all duration-200 border-b border-border/10 last:border-b-0",
      // Striped logic
      striped && {
        "odd:bg-muted/15": ['default', 'gradient', 'minimal', 'aurora'].includes(variant),
        "odd:bg-white/[0.02] dark:odd:bg-white/[0.01]": variant === 'glass',
        "odd:bg-purple-500/2": variant === 'neon',
        "odd:bg-green-950/20": variant === 'cyberpunk',
      },
      // Hover logic
      hoverable && {
        "hover:bg-muted/40": ['default', 'minimal'].includes(variant),
        "hover:bg-white/5 dark:hover:bg-white/5 hover:backdrop-blur-md": variant === 'glass',
        "hover:bg-purple-500/5 hover:shadow-[inset_0_0_10px_rgba(139,92,246,0.05)]": variant === 'neon',
        "hover:bg-green-500/10 hover:text-green-300": variant === 'cyberpunk',
        "hover:bg-pink-500/5 hover:backdrop-blur-md": variant === 'aurora',
        "hover:bg-indigo-500/5": variant === 'gradient',
      },
      className
    );

    if (animateRows) {
      return (
        <motion.tr
          ref={ref as any}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 24,
            delay: index * 0.05,
          }}
          className={rowClass}
          {...(props as any)}
        />
      );
    }

    return <tr ref={ref} className={rowClass} {...props} />;
  }
);
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const { density, bordered, variant } = React.useContext(TableContext);

  const headClass = cn(
    "font-semibold select-none align-middle text-muted-foreground/80",
    {
      "px-3 py-2 text-xs": density === 'compact',
      "px-4 py-3.5 text-sm": density === 'normal',
      "px-6 py-5 text-base": density === 'spacious',
      "border-r border-border/40 last:border-r-0": bordered,
      "border-r border-green-500/30 last:border-r-0": bordered && variant === 'cyberpunk',
      "border-r border-purple-500/20 last:border-r-0": bordered && variant === 'neon',
    },
    variant === 'cyberpunk' && "text-green-300 font-mono tracking-wider",
    className
  );

  return <th ref={ref} className={headClass} {...props} />;
});
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const { density, bordered, variant } = React.useContext(TableContext);

  const cellClass = cn(
    "align-middle transition-colors",
    {
      "px-3 py-2 text-xs": density === 'compact',
      "px-4 py-3 text-sm": density === 'normal',
      "px-6 py-4.5 text-base": density === 'spacious',
      "border-r border-border/40 last:border-r-0": bordered,
      "border-r border-green-500/20 last:border-r-0": bordered && variant === 'cyberpunk',
      "border-r border-purple-500/20 last:border-r-0": bordered && variant === 'neon',
    },
    variant === 'cyberpunk' && "border-green-500/20 text-green-400 font-mono",
    className
  );

  return <td ref={ref} className={cellClass} {...props} />;
});
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => {
  const { variant } = React.useContext(TableContext);
  return (
    <caption
      ref={ref}
      className={cn(
        "mt-4 text-xs text-muted-foreground/60 italic text-center pb-3",
        variant === 'cyberpunk' && "text-green-500/50 font-mono uppercase tracking-widest",
        className
      )}
      {...props}
    />
  );
});
TableCaption.displayName = 'TableCaption';

// ━━━ High-Level Customizable Table Component ━━━
export interface CustomizableTableProps extends TableProps {
  headers: string[];
  rows: React.ReactNode[][];
  caption?: string;
}

export const CustomizableTable: React.FC<CustomizableTableProps> = ({
  headers,
  rows,
  caption,
  ...props
}) => {
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
            {row.map((cell, colIndex) => (
              <TableCell key={colIndex}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
