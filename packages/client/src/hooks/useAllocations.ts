import { useFormStore } from "@/store/form";

const useAllocations = () => {
  const { amount, addresses } = useFormStore(state => state);
  // TODO: in case allo fee is implemented
  // fee = getFeeSomehow
  // const remainingAmount = amount - fee;
  const amountPerAddress = amount / addresses.length;
  return addresses.map(address => ({ address, amount: amountPerAddress }));
};

export default useAllocations;