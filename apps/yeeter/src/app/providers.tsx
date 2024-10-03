"use client";

import { ApiProvider, Web3Provider } from "@allo-team/kit";

export function AlloKitProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ApiProvider
      api={{
        upload: async (data) => {
          return fetch(`/api/ipfs`, { method: "POST", body: toFormData(data) })
            .then((r) => r.json())
            .then((r) => r.cid);
        },
      }}
    >
      <Web3Provider>{children}</Web3Provider>
    </ApiProvider>
  );
}

function toFormData(data: File | Record<string, unknown> | FormData) {
  const formData = new FormData();

  if (!(data instanceof File)) {
    const blob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    data = new File([blob], "metadata.json");
  }

  formData.append("file", data);
  return formData;
}
