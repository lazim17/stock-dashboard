'use client';

import { useState, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { getPortfolio } from '../../lib/api';

export default function PortfolioTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    {
      accessorKey: 'particulars',
      header: 'Particulars (Stock Name)',
    },
    {
      accessorKey: 'purchasePrice',
      header: 'Purchase Price',
      cell: ({ getValue }) => {
        const price = getValue();
        return typeof price === 'number' ? `₹${price.toFixed(2)}` : price;
      },
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity (Qty)',
    },
    {
      accessorKey: 'investment',
      header: 'Investment',
      cell: ({ getValue }) => {
        const investment = getValue();
        return typeof investment === 'number' ? `₹${investment.toLocaleString('en-IN')}` : investment;
      },
    },
    {
      accessorKey: 'portfolioPercent',
      header: 'Portfolio (%)',
      cell: ({ getValue }) => {
        const percent = getValue();
        return typeof percent === 'number' ? `${percent.toFixed(1)}%` : percent;
      },
    },
    {
      accessorKey: 'exchange',
      header: 'NSE/BSE',
      cell: ({ getValue }) => {
        const exchange = getValue();
        const colorClass = exchange === 'NSE' ? 'text-blue-600' : 'text-orange-600';
        return <span className={`font-medium ${colorClass}`}>{exchange}</span>;
      },
    },
    {
      accessorKey: 'cmp',
      header: 'CMP',
      cell: ({ getValue }) => {
        const cmp = getValue();
        return typeof cmp === 'number' ? `₹${cmp.toFixed(2)}` : cmp;
      },
    },
    {
      accessorKey: 'presentValue',
      header: 'Present Value',
      cell: ({ getValue }) => {
        const presentValue = getValue();
        return typeof presentValue === 'number' ? `₹${presentValue.toLocaleString('en-IN')}` : presentValue;
      },
    },
    {
      accessorKey: 'gainLoss',
      header: 'Gain/Loss',
      cell: ({ getValue }) => {
        const gainLoss = getValue();
        if (typeof gainLoss === 'number') {
          const color = gainLoss >= 0 ? 'text-green-600' : 'text-red-600';
          const sign = gainLoss >= 0 ? '+' : '';
          return <span className={`font-medium ${color}`}>{sign}₹{gainLoss.toLocaleString('en-IN')}</span>;
        }
        return gainLoss;
      },
    },
    {
      accessorKey: 'peRatio',
      header: 'P/E Ratio',
      cell: ({ getValue }) => {
        const peRatio = getValue();
        return typeof peRatio === 'number' ? peRatio.toFixed(1) : peRatio;
      },
    },
    {
      accessorKey: 'latestEarnings',
      header: 'Latest Earnings',
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const portfolioData = await getPortfolio();
        setData(portfolioData);
      } catch (err) {
        setError('Failed to load portfolio data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading portfolio data...</span>
      </div>
    );
  }


  return (
    <div className="w-full">
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}