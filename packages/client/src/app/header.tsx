import Image from "next/image";
import Link from "next/link";

import { ConnectButton } from "@/components/connect-button";
import StepBreadcrumb from "@/components/form/step-breadcrumb";

export function Header() {
  return (
    <header className="max-w-screen-lg mx-auto w-full">
      <div className="flex flex-col min-[940px]:flex-row items-center">
        <div className="w-full flex justify-between items-center min-[940px]:w-auto">
          <Link href="/" className="h-16 block w-60 relative">
            <Image
              src="/YeeterLogo.svg"
              alt="Yeeter Logo"
              className="object-contain object-left py-2"
              fill
              priority
            />
          </Link>
        </div>
        <div className="w-full min-[940px]:flex-1 my-4 min-[940px]:my-0 min-[940px]:mx-4">
          <StepBreadcrumb />
        </div>
        <div className="max-[940px]:absolute max-[940px]:right-4 max-[940px]:top-14">
        {/* <FormField
            control={form.control}
            name="network"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Network</FormLabel>
                <Select
                  onValueChange={(value) => {
                    formState.setNetwork(Number(value));
                    field.onChange(Number(value));
                  }}
                  defaultValue={`${field.value}`}
                >
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      {!selectedNetwork && <RiGlobalLine className="w-4 h-4" />}
                      <SelectValue placeholder="Select network" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {supportedChains?.map((network) => (
                      <SelectItem key={network.id} value={String(network.id)}>
                        <div className="flex items-center gap-2">
                          <TokenIcon icon={network.icon} />
                          {network.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
