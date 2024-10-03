"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAPI } from "..";

// function useCheckout() {
//   const api = useAPI();
//   return useQuery({
//     queryKey: ["checkout"],
//     queryFn: async () => api.checkout(),
//   });
// }
// function useAddToCheckout() {
//   const api = useAPI();
//   const client = useQueryClient();
//   return useMutation({
//     mutationFn: async (params: { id: string; amount?: number }) => {
//       const checkout = await api.addToCheckout(params);
//       client.invalidateQueries({ queryKey: ["checkout"] });
//       return checkout;
//     },
//   });
// }

export function AddToCheckout({ id = "" }) {
  // const { data: checkout } = useCheckout();
  // const { data, mutate, isPending } = useAddToCheckout();
  // console.log(data, checkout, isPending);
  // const isAdded = checkout[id];
  const isAdded = false;
  return (
    <div className="flex gap-2">
      <button
        // disabled={isPending}
        className="px-3 py-2 border border-gray-100 rounded"
        // onClick={() => mutate({ id })}
      >
        {isAdded ? "In cart" : "Add to checkout"}
      </button>
    </div>
  );
}
