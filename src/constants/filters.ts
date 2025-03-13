export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export const STATUS_CODES = [
  { value: '200', label: '200 OK' },
  { value: '201', label: '201 Created' },
  { value: '400', label: '400 Bad Request' },
  { value: '401', label: '401 Unauthorized' },
  { value: '403', label: '403 Forbidden' },
  { value: '404', label: '404 Not Found' },
  { value: '500', label: '500 Internal Server Error' },
];

export const LIMIT_SIZES = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '50', label: '50' },
];

export const REFRESH_INTERVALS = [
  { value: 'disabled', label: 'Refresh' },
  { value: '5000', label: '5s' },
  { value: '10000', label: '10s' },
  { value: '30000', label: '30s' },
  { value: '60000', label: '1m' },
  { value: '300000', label: '5m' },
  { value: '900000', label: '15m' },
  { value: '1800000', label: '30m' },
  { value: '3600000', label: '1h' },
  { value: '7200000', label: '2h' },
  { value: '86400000', label: '1d' },
];
