'use client';

import { useState, useEffect, useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import { getPortfolio, PortfolioItem } from '../../lib/api';

export default function PortfolioTable() {
  const [data, setData] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSector, setSelectedSector] = useState<string>('all');

  const filteredData = useMemo(() => {
    if (selectedSector === 'all') {
      return data;
    }
    const filtered = data.filter(item => {
      return item.sector === selectedSector;
    });
    return filtered;
  }, [data, selectedSector]);

  const uniqueSectors = useMemo(() => {
    const sectors = Array.from(new Set(data.map(item => item.sector))).sort();
    return sectors;
  }, [data]);

  const totalInvestment = filteredData.reduce((sum, item) => sum + item.investment, 0);
  const totalPresentValue = filteredData.reduce((sum, item) => sum + item.presentValue, 0);
  const totalGainLoss = totalPresentValue - totalInvestment;

  const columns: ColumnDef<PortfolioItem>[] = [
    {
      accessorKey: 'particulars',
      header: 'Particulars (Stock Name)',
    },
    {
      accessorKey: 'purchasePrice',
      header: 'Purchase Price',
      cell: ({ getValue }) => {
        const price = getValue() as number;
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
        const investment = getValue() as number;
        return typeof investment === 'number' ? `₹${investment.toLocaleString('en-IN')}` : investment;
      },
    },
    {
      accessorKey: 'portfolioPercent',
      header: '(%)',
      cell: ({ getValue }) => {
        const percent = getValue() as number;
        return typeof percent === 'number' ? `${percent.toFixed(1)}%` : percent;
      },
    },
    {
      accessorKey: 'exchange',
      header: 'NSE/BSE',
      cell: ({ getValue }) => {
        const exchange = getValue() as string;
        const colorClass = exchange === 'NSE' ? 'text-blue-600' : 'text-orange-600';
        return <span className={`font-medium ${colorClass}`}>{exchange}</span>;
      },
    },
    {
      accessorKey: 'sector',
      header: 'Sector',
    },
    {
      accessorKey: 'cmp',
      header: 'CMP',
      cell: ({ getValue }) => {
        const cmp = getValue() as number;
        return typeof cmp === 'number' ? `₹${cmp.toFixed(2)}` : cmp;
      },
    },
    {
      accessorKey: 'presentValue',
      header: 'Present Value',
      cell: ({ getValue }) => {
        const presentValue = getValue() as number;
        return typeof presentValue === 'number' ? `₹${presentValue.toLocaleString('en-IN')}` : presentValue;
      },
    },
    {
      accessorKey: 'gainLoss',
      header: 'Gain/Loss',
      cell: ({ getValue }) => {
        const gainLoss = getValue() as number;
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
        const peRatio = getValue() as number;
        return typeof peRatio === 'number' ? peRatio.toFixed(1) : peRatio;
      },
    },
    {
      accessorKey: 'latestEarnings',
      header: 'Latest Earnings',
    },
  ];

  const table = useReactTable({
    data: filteredData,
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
        console.error('Failed to load portfolio data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    const interval = setInterval(() => {
      fetchData();
    }, 15000);

    return () => clearInterval(interval);
  }, []);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading portfolio data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Investment</div>
            <div className="text-2xl font-bold text-gray-900">₹{totalInvestment.toLocaleString('en-IN')}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Present Value</div>
            <div className="text-2xl font-bold text-gray-900">₹{totalPresentValue.toLocaleString('en-IN')}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Gain/Loss</div>
            <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalGainLoss >= 0 ? '+' : ''}₹{totalGainLoss.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Portfolio Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Portfolio Holdings</h2>
              <div className="flex items-center space-x-2">
                <label htmlFor="sector-filter" className="text-sm font-medium text-gray-700">
                  Filter by Sector:
                </label>
                <select
                  id="sector-filter"
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Sectors</option>
                  {uniqueSectors.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-auto max-h-120">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
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
      </div>
  );
}