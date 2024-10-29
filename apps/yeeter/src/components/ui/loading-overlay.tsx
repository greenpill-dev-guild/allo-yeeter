'use client';

import React, { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RiLoader4Line, RiCheckFill, RiCloseFill } from '@remixicon/react';

interface LoadingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'loading' | 'success' | 'error';
  message: string;
}

export function LoadingOverlay({
  isOpen,
  onClose,
  status,
  message,
}: LoadingOverlayProps) {
  const [progress, setProgress] = useState(0);
  const [internalStatus, setInternalStatus] = useState(status);
  const [showProgress, setShowProgress] = useState(true);

  useEffect(() => {
    if (status === 'loading' && isOpen) {
      setProgress(0);
      setShowProgress(true);
      setInternalStatus('loading');

      let startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        // Logarithmic progress calculation
        // Will reach ~25% in about 2 seconds, then slow down significantly
        const newProgress = Math.min(25, Math.log10(1 + elapsed / 200) * 12);

        setProgress(newProgress);
        if (status === 'loading') {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
      return () => {
        startTime = Date.now(); // Reset time if effect re-runs
      };
    } else if (status === 'success') {
      // Animate to 100% before showing success
      const startValue = progress;
      const startTime = Date.now();
      const duration = 500; // 500ms animation

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / duration);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);

        setProgress(startValue + (100 - startValue) * eased);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setShowProgress(false);
          setInternalStatus('success');
        }
      };

      requestAnimationFrame(animate);
    } else if (status === 'error') {
      setShowProgress(false);
      setInternalStatus('error');
    }
  }, [status, isOpen]);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="flex flex-col items-center gap-4">
        <div className="p-4">
          {internalStatus === 'loading' && (
            <RiLoader4Line className="w-16 h-16 animate-spin text-primary" />
          )}
          {internalStatus === 'success' && (
            <RiCheckFill className="w-16 h-16 text-green-500" />
          )}
          {internalStatus === 'error' && (
            <RiCloseFill className="w-16 h-16 text-red-500" />
          )}
        </div>
        <div className="text-lg font-medium text-center">{message}</div>
        {showProgress && <Progress value={progress} className="w-full" />}
        <AlertDialogFooter>
          {(internalStatus === 'success' || internalStatus === 'error') && (
            <Button onClick={onClose}>OK</Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
