"use client";
import {
  ApplicationDetailsWithHook,
  BackButton,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Textarea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useRoundById,
  ApplicationAnswers,
} from "@allo-team/kit";
import Link from "next/link";

export default function ApplicationPage({
  params: { chainId = 0, applicationId = "", roundId = "" },
}) {
  const round = useRoundById(roundId, { chainId });
  return (
    <section className="space-y-8">
      <ApplicationDetailsWithHook
        id={applicationId}
        chainId={chainId}
        roundId={roundId}
        backAction={
          <Link href={`/admin/rounds/${chainId}/${roundId}`}>
            <BackButton />
          </Link>
        }
        primaryAction={
          <div>
            <Dialog>
              <DialogTrigger>
                <Button>Review</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Review Application</DialogTitle>
                  <DialogDescription>
                    TODO: The UX of opening a dialog hides the Application
                    description. Ideally we want to be able to read the
                    application and write the review simultaneously.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <h3 className="font-semibold">Round eligibility criteria</h3>
                  <ul className="list-decimal space-y-4 list-outside pl-4 text-sm">
                    {round.data?.eligibility.requirements?.map((req) => (
                      <li>{req.requirement}</li>
                    ))}
                  </ul>
                </div>
                <div className="">
                  <Textarea rows={10} placeholder="Write your review..." />
                </div>
                <div className="flex justify-end gap-4 items-center">
                  <Button variant="outline">
                    Automatic review with Checker
                  </Button>
                  <span>or</span>
                  <Button>Submit Review</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        }
      />
      <Tabs defaultValue="application">
        <TabsList>
          <TabsTrigger value="application">Application</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="application">
          <ApplicationAnswers
            applicationId={applicationId}
            roundId={roundId}
            chainId={chainId}
          />
        </TabsContent>
        <TabsContent value="reviews">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="py-8 bg-gray-100 rounded"></div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
