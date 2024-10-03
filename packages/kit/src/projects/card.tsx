import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { Project } from "../api/types";
import { BackgroundImage } from "../ui/background-image";
import { Card, CardContent } from "../ui/card";
import { cn } from "..";

export type ProjectCard = Project & {
  // components?: ProjectComponent[];
  isLoading?: boolean;
};

export function ProjectCard({
  name,
  description,
  chainId,
  avatarUrl,
  bannerUrl,
  isLoading,
}: ProjectCard) {
  return (
    <Card
      className={cn("relative overflow-hidden rounded-3xl shadow-xl", {
        ["animate-pulse"]: isLoading,
      })}
    >
      <div className="">
        <BackgroundImage className="h-32 bg-gray-800" src={bannerUrl} />
      </div>
      <div className="-mt-12 ml-2 inline-flex rounded-full bg-white p-0.5">
        <Avatar className="size-8">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback></AvatarFallback>
        </Avatar>
      </div>
      <CardContent className="space-y-2 p-4">
        <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
        <p className="line-clamp-3 text-xs leading-6">{description}</p>
      </CardContent>
    </Card>
  );
}

/*
TODO: Export ProjectTitle and ProjectDescription components

See: rounds/card.tsx
*/
