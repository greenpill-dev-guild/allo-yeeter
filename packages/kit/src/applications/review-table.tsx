/*



Deprecated - use applications/table instead

TODO:
- Move strategy addon logic to call reviewRecipients in ApplicationTable
- Delete this file

*/
"use client";
import { type ReactNode, useMemo } from "react";
import { Check } from "lucide-react";
import { ApplicationApprovalItem } from "../applications/approval-item";
import { useApplications } from "../hooks/useApplications";
import type { Application } from "../api/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useRoundById } from "../hooks/useRounds";
import { useRoundStrategyAddonCall } from "../strategies";
import { EmptyState } from "../ui/empty-state";
import { Button } from "../ui/button";
import { Form, FormField, useForm, useFormContext } from "../ui/form";

const actionMap: Partial<Record<Application["status"], string>> = {
  APPROVED: "Reject",
  PENDING: "Approve",
  REJECTED: "Approve",
};

function createApplicationByStatus(applications: Application[] = []) {
  return useMemo(() => {
    const initialState = {
      APPROVED: [],
      PENDING: [],
      REJECTED: [],
      CANCELLED: [],
      IN_REVIEW: [],
    } as Record<Application["status"], Application[]>;

    return (applications ?? [])?.reduce(
      (acc, x) => ({ ...acc, [x.status]: (acc[x.status] || []).concat(x) }),
      initialState,
    );
  }, [applications]);
}

export function ApplicationReviewTable({
  roundId,
  chainId,
  renderAction,
  initialTab = "PENDING",
  visibleTabs = ["APPROVED", "PENDING", "REJECTED"],
}: {
  roundId: string;
  chainId: number;
  initialTab?: Application["status"];
  visibleTabs?: Application["status"][];
  renderAction?: (application: Application) => ReactNode;
}) {
  const { data: round } = useRoundById(roundId, { chainId });
  const { data: applications, isPending } = useApplications({
    where: { roundId: { equalTo: roundId } },
  });

  const form = useForm();

  const call = useRoundStrategyAddonCall("reviewRecipients", round);
  const applicationByStatus = createApplicationByStatus(applications);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(({ selected }) => {
          call?.mutate([
            applications?.map((appl) => appl.id),
            selected,
            round?.strategy,
            BigInt(2), // TODO: map to approved, pending, rejected
          ]);
        })}
      >
        <Tabs
          defaultValue={initialTab}
          className=""
          onValueChange={() => form.setValue("selected", [])}
        >
          <TabsList>
            {visibleTabs.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          {visibleTabs.map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="-mt-12 flex justify-end gap-4">
                <SelectAllButton applications={applicationByStatus[tab]} />
                <ApproveButton
                  label={actionMap[tab]}
                  isLoading={call?.isPending}
                />
              </div>
              <ApplicationsList
                isLoading={isPending}
                renderAction={renderAction}
                applications={Object.values(applicationByStatus[tab])}
              />
            </TabsContent>
          ))}
        </Tabs>
      </form>
    </Form>
  );
}

function ApproveButton({ label = "", isLoading = false }) {
  const selected = useFormContext().watch("selected")?.length ?? 0;
  return (
    <Button
      type="submit"
      icon={Check}
      isLoading={isLoading}
      disabled={!selected || isLoading}
    >
      {label} {selected} applications
    </Button>
  );
}

function SelectAllButton({
  applications = [],
}: {
  applications: Application[];
}) {
  const form = useFormContext();
  const selected = form.watch("selected");
  const isAllSelected =
    selected?.length > 0 && selected?.length === applications?.length;
  return (
    <Button
      disabled={!applications.length}
      type="button"
      variant={"outline"}
      onClick={() => {
        const selectAll = isAllSelected ? [] : applications.map(({ id }) => id);
        form.setValue("selected", selectAll);
      }}
    >
      {isAllSelected ? "Deselect all" : "Select all"}
    </Button>
  );
}

function ApplicationsList({
  renderAction = () => null,
  applications = [],
  isLoading,
}: {
  renderAction?: (application: Application) => ReactNode;
  applications: Application[];
  isLoading?: boolean;
}) {
  const { control } = useFormContext();
  return (
    <div className="mt-1">
      <FormField
        control={control}
        name="selected"
        render={() => (
          <>
            {!isLoading && !applications?.length && <EmptyState />}
            {applications.map((application) => (
              <FormField
                key={application.id}
                control={control}
                name="selected"
                render={({ field }) => (
                  <ApplicationApprovalItem
                    key={application.id}
                    action={renderAction(application)}
                    checked={field.value?.includes(application.id)}
                    onCheckedChange={(checked) =>
                      checked
                        ? field.onChange([
                            ...(field.value ?? []),
                            application.id,
                          ])
                        : field.onChange(
                            field.value?.filter(
                              (value: string) => value !== application.id,
                            ),
                          )
                    }
                    {...application}
                  />
                )}
              />
            ))}
          </>
        )}
      />
    </div>
  );
}
