import React from 'react';
import { Separator } from '@/components/ui/separator';
import { useFormStore } from '@/store/form';
import { useNetwork } from '@allo-team/kit';

const SummaryDetails = () => {
  const totalAmount = useFormStore(state => state.amount);
  const addresses = useFormStore(state => state.addresses);
  const network = useNetwork();
  // const alloFee = get allo fee somehow
  const subtotal = totalAmount;
  const amountPerRecipient = subtotal / addresses.length;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 mt-4">
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
