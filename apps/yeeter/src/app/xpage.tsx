'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useLocalStorageForm } from '../hooks/useYeetForm';
import { slideDefinitions } from './slideDefinitions';
import { FormProvider } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { CreateProfileButton } from '@allo-team/kit';
import { Card } from '@/components/ui/card';
import { Icon } from '@radix-ui/react-select';

const YeeterPage: React.FC = () => {
  const form = useLocalStorageForm();
  const [swiper, setSwiper] = useState<typeof Swiper | null>(null);
  const { toast } = useToast();

  return (
    <CreateProfileButton>
      <Card className="h-full w-full flex flex-col max-w-screen-sm mx-auto overflow-y-scroll px-12 py-8">
        <FormProvider {...form}>
          <div className="w-full max-w-3xl">
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={50}
              slidesPerView={1}
              onSwiper={setSwiper}
              allowTouchMove={false}
              autoHeight
            >
              {slideDefinitions.map((slide, index) => (
                <SwiperSlide key={index}>
                  <div className="flex flex-col gap-4 items-center">
                    <div
                      className="inset-0 bg-gradient-to-b from-primary/20 to-secondary/20 rounded-full "
                      style={{ padding: '1.5rem' }}
                    >
                      <div className="relative bg-background rounded-full p-4 border-1 border-foreground">
                        {slide.icon}
                      </div>
                    </div>
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                      {slide.title}
                    </h3>
                    <h5 className="scroll-m-20 text-xl font-semibold tracking-tight text-muted-foreground">
                      {slide.subtitle}
                    </h5>
                  </div>
                  <slide.component
                    form={form}
                    swiper={swiper}
                    toast={toast}
                    fieldsToValidate={slide.fieldsToValidate}
                    nextButtonText={slide.nextButtonText}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </FormProvider>
      </Card>
    </CreateProfileButton>
  );
};

export default YeeterPage;
