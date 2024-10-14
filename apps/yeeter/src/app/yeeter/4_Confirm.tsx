import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { YeetFormData } from './useLocalStorageForm';
import { Avatar } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface ConfirmProps {
  form: UseFormReturn<YeetFormData>;
}

const Confirm: React.FC<ConfirmProps> = ({ form }) => {
  const { getValues } = form;
  const values = getValues();
  const totalAmount = parseFloat(values.amount);
  const amountPerAddress = totalAmount / values.addresses.length;

  return (
    <div className="w-full max-w-sm">
      <h3 className="text-lg font-semibold mb-4">Confirm Your Yeet</h3>
      <ul className="space-y-2">
        {values.addresses.map((addressObj, index) => (
          <li key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <User className="h-4 w-4" />
              </Avatar>
              <span className="text-sm">
                {addressObj.address.slice(0, 6)}...
                {addressObj.address.slice(-4)}
              </span>
            </div>
            <span className="text-sm font-medium">
              {amountPerAddress.toFixed(6)}{' '}
              {values.customToken ? values.customToken.symbol : values.token}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Confirm;
