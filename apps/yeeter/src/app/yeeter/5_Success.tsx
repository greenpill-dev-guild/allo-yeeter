import React from 'react';
import { SlideProps } from './slideDefinitions';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const Success: React.FC<SlideProps> = ({
  form,
  swiper,
  toast,
  fieldsToValidate,
  nextButtonText,
}) => {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Yeet Successful!</h2>
      <p>Your transaction has been successfully processed.</p>
      <Button onClick={handleBackToHome}>{nextButtonText}</Button>
    </div>
  );
};

export default Success;
