import React, { useState } from 'react';
import { X, Download, FileText, FileSpreadsheet } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'pdf' | 'excel', filters: any) => void;
  loading: boolean;
  totalOrders: number;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  loading,
  totalOrders
}) => {
  const [format, setFormat] = useState<'pdf' | 'excel'>('excel');
  const [includeFilters, setIncludeFilters] = useState(true);
  const [dateRange, setDateRange] = useState('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filters = includeFilters ? { dateRange } : {};
    onExport(format, filters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Export Orders</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">
              Export <span className="font-medium">{totalOrders}</span> orders
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('excel')}
                className={`p-4 border rounded-lg flex flex-col items-center transition-colors ${
                  format === 'excel' 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <FileSpreadsheet className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">Excel</span>
                <span className="text-xs text-gray-500">.xlsx</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`p-4 border rounded-lg flex flex-col items-center transition-colors ${
                  format === 'pdf' 
                    ? 'border-red-500 bg-red-50 text-red-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <FileText className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">PDF</span>
                <span className="text-xs text-gray-500">.pdf</span>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="includeFilters"
                checked={includeFilters}
                onChange={(e) => setIncludeFilters(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="includeFilters" className="ml-2 text-sm font-medium text-gray-700">
                Include current filters
              </label>
            </div>

            {includeFilters && (
              <div className="ml-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Download className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Export includes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Order details and customer information</li>
                  <li>Product items and pricing</li>
                  <li>Shipping and payment status</li>
                  <li>Timeline and tracking information</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export {format.toUpperCase()}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExportModal; 