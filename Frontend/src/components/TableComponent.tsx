import React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';

export interface TableColumn {
  key: string;
  label: string;
  icon?: LucideIcon;
  className?: string;
  render?: (row: any) => React.ReactNode;
}

interface UniversalTableProps {
  columns: TableColumn[];
  data: any[];
  emptyMessage?: string;
  actions?: (row: any) => React.ReactNode;
}

const UniversalTable: React.FC<UniversalTableProps> = ({
  columns,
  data,
  emptyMessage = 'No records found',
  actions,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key} className={col.className}>
              <div className="flex items-center gap-2">
                {col.icon && <col.icon className="size-4" />}
                {col.label}
              </div>
            </TableHead>
          ))}

          {actions && (
            <TableHead className="text-right">
              <div className="flex justify-end items-center gap-2">Actions</div>
            </TableHead>
          )}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length + 1}
              className="text-center py-6 text-muted-foreground"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          data.map((row: any) => (
            <TableRow key={row.id}>
              {columns.map((col) => (
                <TableCell key={col.key}>{col.render ? col.render(row) : row[col.key]}</TableCell>
              ))}

              {actions && <TableCell className="text-right">{actions(row)}</TableCell>}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default UniversalTable;
