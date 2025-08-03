import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';

export interface TableColumn<T = any> {
  key: string;
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  description?: string;
  format?: (value: any) => string;
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  caption: string;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T, index: number) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onFilter?: (column: string, value: string) => void;
  selectable?: boolean;
  selectedRows?: Set<string>;
  onSelectionChange?: (selectedRows: Set<string>) => void;
  getRowId?: (row: T) => string;
  className?: string;
  stickyHeader?: boolean;
  maxHeight?: string;
  pageSize?: number;
  searchable?: boolean;
}

const AccessibleTable = <T extends Record<string, any>>({
  data,
  columns,
  caption,
  loading = false,
  emptyMessage = "No data available",
  onRowClick,
  onSort,
  onFilter,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  getRowId = (row, index) => row.id || index.toString(),
  className = "",
  stickyHeader = false,
  maxHeight = "600px",
  pageSize = 50,
  searchable = false
}: TableProps<T>) => {
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);
  
  const tableRef = useRef<HTMLTableElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Generate unique table ID for ARIA relationships
  const tableId = `table-${Math.random().toString(36).substr(2, 9)}`;
  const captionId = `${tableId}-caption`;
  const searchId = `${tableId}-search`;

  // Handle sorting
  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable) return;

    const newDirection = sortColumn === column.key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column.key);
    setSortDirection(newDirection);
    
    if (onSort) {
      onSort(column.key, newDirection);
    }

    // Announce sort change to screen readers
    const announcement = `Table sorted by ${column.header}, ${newDirection === 'asc' ? 'ascending' : 'descending'} order`;
    announceToScreenReader(announcement);
  };

  // Handle filtering
  const handleFilter = (columnKey: string, value: string) => {
    setFilters(prev => ({ ...prev, [columnKey]: value }));
    setCurrentPage(1);
    
    if (onFilter) {
      onFilter(columnKey, value);
    }
  };

  // Handle row selection
  const handleRowSelection = (rowId: string, selected: boolean) => {
    if (!onSelectionChange) return;

    const newSelection = new Set(selectedRows);
    if (selected) {
      newSelection.add(rowId);
    } else {
      newSelection.delete(rowId);
    }
    onSelectionChange(newSelection);
  };

  // Handle select all
  const handleSelectAll = (selected: boolean) => {
    if (!onSelectionChange) return;

    if (selected) {
      const allIds = new Set(filteredData.map((row, index) => getRowId(row, index)));
      onSelectionChange(allIds);
    } else {
      onSelectionChange(new Set());
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!focusedCell) return;

    const { row, col } = focusedCell;
    const maxRow = Math.min(filteredData.length - 1, (currentPage * pageSize) - 1);
    const maxCol = columns.length - 1 + (selectable ? 1 : 0);

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (row > 0) {
          setFocusedCell({ row: row - 1, col });
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (row < maxRow) {
          setFocusedCell({ row: row + 1, col });
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (col > 0) {
          setFocusedCell({ row, col: col - 1 });
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (col < maxCol) {
          setFocusedCell({ row, col: col + 1 });
        }
        break;
      case 'Home':
        e.preventDefault();
        setFocusedCell({ row: 0, col: 0 });
        break;
      case 'End':
        e.preventDefault();
        setFocusedCell({ row: maxRow, col: maxCol });
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (onRowClick && col > 0) {
          const dataRow = filteredData[row];
          if (dataRow) {
            onRowClick(dataRow, row);
          }
        }
        break;
    }
  };

  // Filter and search data
  const filteredData = React.useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchTerm) {
      result = result.filter(row =>
        columns.some(column => {
          const value = typeof column.accessor === 'function' 
            ? column.accessor(row)
            : row[column.accessor];
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([columnKey, filterValue]) => {
      if (filterValue) {
        result = result.filter(row => {
          const column = columns.find(col => col.key === columnKey);
          if (!column) return true;
          
          const value = typeof column.accessor === 'function' 
            ? column.accessor(row)
            : row[column.accessor];
          return String(value).toLowerCase().includes(filterValue.toLowerCase());
        });
      }
    });

    return result;
  }, [data, searchTerm, filters, columns]);

  // Paginate data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Screen reader announcements
  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  // Get cell value
  const getCellValue = (row: T, column: TableColumn<T>) => {
    const value = typeof column.accessor === 'function' 
      ? column.accessor(row)
      : row[column.accessor];
    
    if (column.format && typeof value !== 'object') {
      return column.format(value);
    }
    
    return value;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Controls */}
      {(searchable || columns.some(col => col.filterable)) && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {searchable && (
            <div className="relative flex-1 max-w-md">
              <label htmlFor={searchId} className="sr-only">
                Search table data
              </label>
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                ref={searchRef}
                id={searchId}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search table..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background text-foreground"
                aria-describedby={`${searchId}-description`}
              />
              <div id={`${searchId}-description`} className="sr-only">
                Search across all table columns. {filteredData.length} results found.
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>
              Showing {paginatedData.length} of {filteredData.length} items
            </span>
            {selectedRows.size > 0 && (
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
                {selectedRows.size} selected
              </span>
            )}
          </div>
        </div>
      )}

      {/* Table Container */}
      <div 
        className="overflow-auto border border-border rounded-xl bg-background"
        style={{ maxHeight: stickyHeader ? maxHeight : 'none' }}
        role="region"
        aria-labelledby={captionId}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <table
          ref={tableRef}
          id={tableId}
          className="w-full border-collapse"
          role="table"
          aria-describedby={`${tableId}-summary`}
        >
          {/* Caption */}
          <caption id={captionId} className="sr-only">
            {caption}. Use arrow keys to navigate, Enter to select rows, and Tab to move between interactive elements.
          </caption>

          {/* Header */}
          <thead className={`bg-muted/50 ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
            <tr role="row">
              {selectable && (
                <th
                  scope="col"
                  className="w-12 px-4 py-3 text-left"
                  role="columnheader"
                >
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-border focus:ring-primary"
                      aria-label="Select all rows"
                    />
                    <span className="sr-only">Select all rows</span>
                  </label>
                </th>
              )}
              
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-4 py-3 font-semibold text-foreground ${
                    column.align === 'center' ? 'text-center' :
                    column.align === 'right' ? 'text-right' : 'text-left'
                  } ${column.sortable ? 'cursor-pointer hover:bg-muted/70' : ''}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column)}
                  role="columnheader"
                  aria-sort={
                    sortColumn === column.key 
                      ? sortDirection === 'asc' ? 'ascending' : 'descending'
                      : column.sortable ? 'none' : undefined
                  }
                  tabIndex={column.sortable ? 0 : -1}
                  onKeyDown={(e) => {
                    if (column.sortable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleSort(column);
                    }
                  }}
                  aria-describedby={column.description ? `${tableId}-${column.key}-desc` : undefined}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        {sortColumn === column.key ? (
                          sortDirection === 'asc' ? (
                            <ChevronUpIcon className="w-4 h-4 text-primary" />
                          ) : (
                            <ChevronDownIcon className="w-4 h-4 text-primary" />
                          )
                        ) : (
                          <ArrowsUpDownIcon className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  {column.description && (
                    <div id={`${tableId}-${column.key}-desc`} className="sr-only">
                      {column.description}
                    </div>
                  )}
                </th>
              ))}
            </tr>

            {/* Filter Row */}
            {columns.some(col => col.filterable) && (
              <tr role="row" className="border-t border-border">
                {selectable && <th scope="col" className="px-4 py-2"></th>}
                {columns.map((column) => (
                  <th key={`filter-${column.key}`} scope="col" className="px-4 py-2">
                    {column.filterable && (
                      <div className="relative">
                        <label htmlFor={`filter-${column.key}`} className="sr-only">
                          Filter {column.header}
                        </label>
                        <FunnelIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                        <input
                          id={`filter-${column.key}`}
                          type="text"
                          value={filters[column.key] || ''}
                          onChange={(e) => handleFilter(column.key, e.target.value)}
                          placeholder={`Filter ${column.header.toLowerCase()}...`}
                          className="w-full pl-8 pr-2 py-1 text-xs border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/20 bg-background"
                        />
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            )}
          </thead>

          {/* Body */}
          <tbody>
            {loading ? (
              <tr role="row">
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-8 text-center text-muted-foreground"
                  role="cell"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    <span>Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr role="row">
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-8 text-center text-muted-foreground"
                  role="cell"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const rowId = getRowId(row, rowIndex);
                const isSelected = selectedRows.has(rowId);
                const actualRowIndex = (currentPage - 1) * pageSize + rowIndex;
                
                return (
                  <motion.tr
                    key={rowId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: rowIndex * 0.02 }}
                    role="row"
                    aria-selected={selectable ? isSelected : undefined}
                    className={`
                      border-t border-border transition-colors
                      ${onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                      ${isSelected ? 'bg-primary/10' : ''}
                      ${focusedCell?.row === actualRowIndex ? 'ring-2 ring-primary/20' : ''}
                    `}
                    onClick={() => onRowClick?.(row, actualRowIndex)}
                    tabIndex={onRowClick ? 0 : -1}
                    onKeyDown={(e) => {
                      if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        onRowClick(row, actualRowIndex);
                      }
                    }}
                    onFocus={() => setFocusedCell({ row: actualRowIndex, col: 0 })}
                  >
                    {selectable && (
                      <td className="px-4 py-3" role="cell">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleRowSelection(rowId, e.target.checked)}
                            className="rounded border-border focus:ring-primary"
                            aria-label={`Select row ${actualRowIndex + 1}`}
                          />
                          <span className="sr-only">
                            Select row {actualRowIndex + 1}
                          </span>
                        </label>
                      </td>
                    )}
                    
                    {columns.map((column, colIndex) => {
                      const cellValue = getCellValue(row, column);
                      const isFocused = focusedCell?.row === actualRowIndex && 
                                      focusedCell?.col === colIndex + (selectable ? 1 : 0);
                      
                      return (
                        <td
                          key={`${rowId}-${column.key}`}
                          className={`
                            px-4 py-3 text-foreground
                            ${column.align === 'center' ? 'text-center' :
                              column.align === 'right' ? 'text-right' : 'text-left'}
                            ${isFocused ? 'bg-primary/5 ring-2 ring-primary/20' : ''}
                          `}
                          role="cell"
                          tabIndex={-1}
                          onFocus={() => setFocusedCell({ 
                            row: actualRowIndex, 
                            col: colIndex + (selectable ? 1 : 0) 
                          })}
                        >
                          {React.isValidElement(cellValue) ? cellValue : String(cellValue || '')}
                        </td>
                      );
                    })}
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Summary for Screen Readers */}
      <div id={`${tableId}-summary`} className="sr-only">
        Table with {filteredData.length} rows and {columns.length} columns. 
        {sortColumn && `Sorted by ${columns.find(col => col.key === sortColumn)?.header} in ${sortDirection} order.`}
        {selectedRows.size > 0 && `${selectedRows.size} rows selected.`}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Go to previous page"
            >
              Previous
            </button>
            
            <span className="px-3 py-2 text-sm">
              {currentPage} / {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Go to next page"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Keyboard Navigation Help */}
      <details className="text-sm text-muted-foreground">
        <summary className="cursor-pointer hover:text-foreground transition-colors">
          Keyboard Navigation Help
        </summary>
        <div className="mt-2 p-3 bg-muted/30 rounded-lg space-y-1">
          <p><kbd className="px-1 py-0.5 bg-background border border-border rounded text-xs">↑↓←→</kbd> Navigate cells</p>
          <p><kbd className="px-1 py-0.5 bg-background border border-border rounded text-xs">Enter/Space</kbd> Select row or activate sort</p>
          <p><kbd className="px-1 py-0.5 bg-background border border-border rounded text-xs">Home/End</kbd> Jump to first/last cell</p>
          <p><kbd className="px-1 py-0.5 bg-background border border-border rounded text-xs">Tab</kbd> Move between interactive elements</p>
        </div>
      </details>

      {/* Live region for announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" />
    </div>
  );
};

export default AccessibleTable;