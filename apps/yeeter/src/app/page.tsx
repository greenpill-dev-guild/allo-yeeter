'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useLocalStorageForm } from './useLocalStorageForm';
import { slideDefinitions } from './slideDefinitions';
import { FormProvider } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { CreateProfileButton } from '@allo-team/kit';
import { Card } from '@/components/ui/card';

const YeeterPage: React.FC = () => {
  const form = useLocalStorageForm();
  const [swiper, setSwiper] = useState<typeof Swiper | null>(null);
  const { toast } = useToast();

  return (
    <Card className="h-full w-full flex flex-col max-w-screen-sm mx-auto overflow-y-scroll px-12 py-8">
      <FormProvider {...form}>
        <CreateProfileButton />
        <div className="w-full max-w-3xl">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={50}
            slidesPerView={1}
            onSwiper={setSwiper}
            allowTouchMove={false}
          >
            {slideDefinitions.map((slide, index) => (
              <SwiperSlide key={index}>
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
  );
};

export default YeeterPage;
