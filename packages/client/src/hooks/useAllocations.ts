import { useYeetStore } from "@/store/yeet";

const useAllocations = () => {
  const { amount, recipients, amountSplitType } = useYeetStore(
    (state) => state
  );

  const amountPerAddress = amount / recipients.length;

  return amountSplitType === "equal" ?
      recipients.map(({ address }) => ({
        address,
        amount: amountPerAddress,
      }))
    : recipients;
};

export default useAllocations;
