"use client";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { ImageIcon } from "lucide-react";
import { type ComponentProps, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Button } from "..";
import { useUpload } from "../hooks/useUpload";

type Props = { name: string; maxSize?: number } & ComponentProps<"img">;

export function ImageUpload({
  name,
  maxSize = 1024 * 1024, // 1 MB
  className,
}: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const { control } = useFormContext();

  const upload = useUpload();
  const select = useMutation({
    mutationFn: async (file: File) => {
      if (file?.size >= maxSize) {
        // toast.error("Image too large", {
        //   description: `The image to selected is: ${(file.size / 1024).toFixed(
        //     2,
        //   )} / ${(maxSize / 1024).toFixed(2)} kb`,
        // });
        throw new Error("IMAGE_TOO_LARGE");
      }

      return URL.createObjectURL(file);
    },
  });

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: "Required" }}
      render={({ field: { value, onChange, ...field } }) => {
        return (
          <div
            className={clsx(
              "group relative h-32 cursor-pointer overflow-hidden",
              className,
            )}
            onClick={() => ref.current?.click()}
          >
            <Button
              size="icon"
              variant={"ghost"}
              isLoading={upload.isPending}
              icon={ImageIcon}
              className="absolute bottom-1 right-1 rounded-full"
            />

            <div
              className={clsx(
                "h-full rounded-xl bg-gray-100 bg-cover bg-center bg-no-repeat transition-colors group-hover:bg-gray-50",
                { ["animate-pulse opacity-50"]: upload.isPending },
              )}
              style={{
                backgroundImage: `url("${select.data ?? value}")`,
              }}
            />
            <input
              {...field}
              ref={ref}
              className="hidden"
              accept="image/png, image/jpeg"
              // value={value?.[name]}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  select.mutate(file, {
                    onSuccess: () => {
                      console.log("Uploading image...");
                      upload.mutate(file, {
                        onSuccess: (url) => {
                          console.log("Image uploaded", url);
                          onChange(url);
                        },
                        onError: (err) => {
                          console.log("Image upload error", err);
                        },
                      });
                    },
                  });
                }
              }}
              type="file"
            />
          </div>
        );
      }}
    />
  );
}
