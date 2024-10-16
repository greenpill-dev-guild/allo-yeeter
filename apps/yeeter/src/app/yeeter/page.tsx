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

const YeeterPage: React.FC = () => {
  const form = useLocalStorageForm();
  const [swiper, setSwiper] = useState<typeof Swiper | null>(null);
  const { toast } = useToast();

  return (
    <FormProvider {...form}>
      <div className="mt-32 flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl flex-grow">
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
      </div>
    </FormProvider>
  );
};

export default YeeterPage;
