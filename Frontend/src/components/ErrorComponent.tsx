import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ErrorComponentProps = {
  message: string;
  onRetry?: () => void;
};

const ErrorComponent = ({ message, onRetry }: ErrorComponentProps) => {
  return (
    <div className="flex flex-col justify-center items-center h-64 gap-3">
      <AlertTriangle className="w-10 h-10 text-red-500" />

      <p className="text-red-600 font-medium">{message}</p>

      {onRetry && (
        <Button variant="default" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
};

export default ErrorComponent;
