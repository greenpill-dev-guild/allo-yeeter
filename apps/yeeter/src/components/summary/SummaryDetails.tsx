import React from 'react';
import { Separator } from '@/components/ui/separator';
import { useFormStore } from '@/store/form';
import { useNetwork } from '@allo-team/kit';
import { RiInfoI, RiInformationFill } from '@remixicon/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

const SummaryDetails = () => {
  const totalAmount = useFormStore(state => state.amount);
  const addresses = useFormStore(state => state.addresses);
  const network = useNetwork();
  const alloFee = totalAmount / 100;
  const subtotal = totalAmount - alloFee;
  const amountPerRecipient = subtotal / addresses.length;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex justify-between text-muted-foreground text-sm items-center">
          <div className="inline-flex items-center gap-1">
            <div>Allo Fee (1%)</div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <RiInformationFill className="w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Allo protocol usage fee.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Separator className="w-auto flex-1 mx-4" dashed />
          <div>{alloFee.toLocaleString()}</div>
        </div>
        <div className="flex justify-between text-muted-foreground text-sm items-center">
          <div>Total amount to be distributed</div>
          <Separator className="w-auto flex-1 mx-4" dashed />
          <div>{subtotal.toLocaleString()}</div>
        </div>
        <div className="flex justify-between text-muted-foreground text-sm items-center">
          <div>Amount per recipient</div>
          <Separator className="w-auto flex-1 mx-4" dashed />
          <div>{amountPerRecipient.toLocaleString()}</div>
        </div>
        <div className="flex justify-between text-muted-foreground text-sm items-center">
          <div>Network</div>
          <Separator className="w-auto flex-1 mx-4" dashed />
          <div>{network?.name}</div>
        </div>
      </div>
    </div>
  );
};

export default SummaryDetails;
