interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Loading({ 
  message = 'Loading...', 
  size = 'md',
  className = '' 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-navy mx-auto mb-4 ${sizeClasses[size]}`}></div>
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
    </div>
  );
} 