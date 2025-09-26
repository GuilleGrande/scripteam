import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api';

const ApiTest = () => {
  const [healthStatus, setHealthStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [healthData, setHealthData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testApiHealth = async () => {
    setHealthStatus('loading');
    setError('');

    try {
      const response = await apiClient.healthCheck();
      setHealthData(response);
      setHealthStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setHealthStatus('error');
    }
  };

  const getStatusIcon = () => {
    switch (healthStatus) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    switch (healthStatus) {
      case 'loading':
        return <Badge variant="secondary">Testing...</Badge>;
      case 'success':
        return <Badge className="bg-green-500">Connected</Badge>;
      case 'error':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Not tested</Badge>;
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">API Connection Test</h1>
        <p className="text-muted-foreground">
          Test connection between web app and API backend
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            API Health Check
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Status:</span>
            {getStatusBadge()}
          </div>

          <Button
            onClick={testApiHealth}
            disabled={healthStatus === 'loading'}
            className="w-full"
          >
            {healthStatus === 'loading' ? 'Testing...' : 'Test API Connection'}
          </Button>

          {healthData && (
            <div className="mt-4 p-3 bg-green-50 rounded-md border">
              <h4 className="font-semibold text-sm mb-2">Success Response:</h4>
              <pre className="text-xs text-green-800 whitespace-pre-wrap">
                {JSON.stringify(healthData, null, 2)}
              </pre>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 rounded-md border border-red-200">
              <h4 className="font-semibold text-sm mb-2 text-red-800">Error:</h4>
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            <p>API URL: {import.meta.env.VITE_API_URL || 'http://localhost:3001'}</p>
            <p>Environment: {import.meta.env.NODE_ENV}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiTest;