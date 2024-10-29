import { useFormStore } from "@/store/form";

const useAllocations = () => {
  const { amount, addresses } = useFormStore(state => state);
  const onePercent = amount / 100;
  const remainingAmount = amount - onePercent;
  const amountPerAddress = remainingAmount / addresses.length;
  return addresses.map(address => ({ address, amount: amountPerAddress }));
};

export default useAllocations;