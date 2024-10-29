import { RiUserFill } from '@remixicon/react';
import { Separator } from '@/components/ui/separator';
import { useSelectedToken } from '@/hooks/useSelectedToken';
import useAllocations from '@/hooks/useAllocations';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const RecipientItem = ({
  allocation,
  index,
  token,
}: {
  allocation: { address: string; amount: number };
  index: number;
  token?: { code: string; decimals: number; address: string };
}) => (
  <div className="inline-flex items-center justify-between">
    <div className="inline-flex items-center gap-4">
      <div className="rounded-full bg-accent p-4">
        <RiUserFill className="w-5 h-5 text-accent-foreground" />
      </div>
      <div className="flex flex-col gap-2 max-w-32">
        {`Recipient: ${index + 1}`}
        <div className="text-muted-foreground text-sm truncate">
          {allocation.address}
        </div>
      </div>
    </div>
    <div>
      {Number(allocation.amount).toLocaleString()} {token?.code}
    </div>
  </div>
);

const RecipientsList = () => {
  const token = useSelectedToken();
  const allocations = useAllocations();

  if (allocations.length <= 5) {
    return (
      <div className="flex flex-col gap-6">
        {allocations.map((allocation, index) => (
          <RecipientItem
            key={allocation.address}
            allocation={allocation}
            index={index}
            token={token}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {allocations.slice(0, 3).map((allocation, index) => (
        <RecipientItem
          key={allocation.address}
          allocation={allocation}
          index={index}
          token={token}
        />
      ))}

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="remaining-recipients">
          <AccordionTrigger className="text-sm">
            Show {allocations.length - 3} more recipients
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-6 pt-6">
              {allocations.slice(3).map((allocation, index) => (
                <RecipientItem
                  key={allocation.address}
                  allocation={allocation}
                  index={index + 3}
                  token={token}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default RecipientsList;
