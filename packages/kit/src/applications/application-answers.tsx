"use client";
import { QueryOpts } from "../api/types";
import { useApplicationById } from "../hooks/useApplications";
import { Markdown } from "../ui/markdown";

type Props = {
  applicationId: string;
  roundId: string;
  chainId: number;
  opts?: QueryOpts;
};

export function ApplicationAnswers({ applicationId, chainId, roundId }: Props) {
  const { data, isPending } = useApplicationById(applicationId, {
    roundId,
    chainId,
  });

  return (
    <ul className="list-decimal space-y-4 pl-4">
      {data?.answers?.map((answer) => (
        <li>
          <div className="font-semibold">{answer.question}</div>
          <Markdown>{answer.hidden ? "*<hidden>*" : answer.answer}</Markdown>
        </li>
      ))}
    </ul>
  );
}
