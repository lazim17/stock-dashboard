'use client';

import { useState, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';

const dummyData = [
  {
    id: 1,
    particulars: 'Apple Inc.',
    purchasePrice: 145.50,
    quantity: 100,
    investment: 14550,
    portfolioPercent: 25.8,
    exchange: 'NSE',
    cmp: 150.25,
    presentValue: 15025,
    gainLoss: 475,
    peRatio: 24.5,
    latestEarnings: '6.15B'
  },
  {
    id: 2,
    particulars: 'Alphabet Inc.',
    purchasePrice: 2800.00,
    quantity: 5,
    investment: 14000,
    portfolioPercent: 24.8,
    exchange: 'BSE',
    cmp: 2750.80,
    presentValue: 13754,
    gainLoss: -246,
    peRatio: 22.8,
    latestEarnings: '13.9B'
  },
  {
    id: 3,
    particulars: 'Microsoft Corp.',
    purchasePrice: 295.00,
    quantity: 50,
    investment: 14750,
    portfolioPercent: 26.1,
    exchange: 'NSE',
    cmp: 305.15,
    presentValue: 15257.50,
    gainLoss: 507.50,
    peRatio: 28.2,
    latestEarnings: '11.05B'
  },
  {
    id: 4,
    particulars: 'Reliance Industries',
    purchasePrice: 2450.00,
    quantity: 25,
    investment: 61250,
    portfolioPercent: 23.3,
    exchange: 'BSE',
    cmp: 2520.30,
    presentValue: 63007.50,
    gainLoss: 1757.50,
    peRatio: 15.6,
    latestEarnings: '₹15,138 Cr'
  }
];

export default function PortfolioTable() {
  const [data, setData] = useState([]);

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

  useEffect(() => {
    setData(dummyData);
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });


  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Portfolio Table</h2>
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