'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import SwiperPage from './SwiperPage';
import { Button } from '@/components/ui/button';
import { useLocalStorageForm } from './useLocalStorageForm';
import { slideDefinitions } from './slideDefinitions';
import { FormProvider } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const YeeterPage: React.FC = () => {
  const form = useLocalStorageForm();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [swiper, setSwiper] = useState<any>(null);
  const { toast } = useToast();

  const handleNext = async () => {
    // Get all fields to validate up to and including the current slide
    const fieldsToValidate = slideDefinitions
      .slice(0, currentSlideIndex + 1)
      .flatMap(slide => slide.fieldsToValidate);

    // Validate the fields
    const result = await form.trigger(fieldsToValidate);
    console.log('Validation result:', result);

    if (result) {
      const currentDefinition = slideDefinitions[currentSlideIndex];
      if (currentDefinition.onNext) {
        currentDefinition.onNext(form);
      }
      if (currentSlideIndex < slideDefinitions.length - 1) {
        swiper.slideNext();
      }
    } else {
      // Log validation errors
      const errors = form.formState.errors;
      console.log('Validation errors:', errors);

      // Show a more detailed error message
      const errorMessages = Object.entries(errors)
        .map(([field, error]) => `${field}: ${error?.message}`)
        .join('\n');

      toast({
        title: 'Validation Error',
        description: errorMessages,
        variant: 'destructive',
      });
    }
  };

  const handlePrev = () => {
    swiper.slidePrev();
  };

  const renderErrorSummary = () => {
    const errors = form.formState.errors;
    if (Object.keys(errors).length === 0) return null;

    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
        role="alert"
      >
        <strong className="font-bold">Validation Errors:</strong>
        <ul className="list-disc list-inside">
          {Object.entries(errors).map(([key, error]) => (
            <li key={key}>{error.message}</li>
          ))}
        </ul>
      </div>
    );
  };

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
            onSlideChange={swiper => setCurrentSlideIndex(swiper.activeIndex)}
            allowTouchMove={false}
          >
            {slideDefinitions.map((slide, index) => (
              <SwiperSlide key={index}>
                <SwiperPage
                  title={slide.title}
                  component={slide.component}
                  form={form}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {renderErrorSummary()}
        <div className="flex justify-between w-full max-w-3xl mt-6">
          <Button onClick={handlePrev} disabled={currentSlideIndex === 0}>
            Back
          </Button>
          <Button onClick={handleNext}>
            {slideDefinitions[currentSlideIndex].nextButtonText}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};

export default YeeterPage;
