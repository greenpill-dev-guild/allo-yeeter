import React from 'react';
import { Button } from '@/components/ui/button';

const Success: React.FC = () => {
  return (
    <div className="text-center">
      <p className="mb-4">Your Yeet has been successfully sent!</p>
      <Button>Back to Home</Button>
    </div>
  );
};

export default Success;
