import { Loader2 } from 'lucide-react';

const LoaderComponent = () => {
  return (
    <div className="w-full min-h-svh flex flex-col justify-center items-center h-64 gap-3">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm">Loading, please wait...</p>
    </div>
  );
};

export default LoaderComponent;
