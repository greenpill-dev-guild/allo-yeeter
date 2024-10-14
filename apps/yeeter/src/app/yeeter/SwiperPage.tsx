import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { YeetFormData } from './useLocalStorageForm';

interface SwiperPageProps {
  component: React.ComponentType<{ form: UseFormReturn<YeetFormData> }>;
  title: string;
  form: UseFormReturn<YeetFormData>;
}

const SwiperPage: React.FC<SwiperPageProps> = ({
  component: Component,
  title,
  form,
}) => {
  return (
    <Card className="h-full">
      <CardContent className="flex flex-col items-center justify-center h-full p-6">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <Component form={form} />
      </CardContent>
    </Card>
  );
};

export default SwiperPage;
