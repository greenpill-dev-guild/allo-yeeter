'use client';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <section className="flex items-center justify-center h-full p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">
            Allo Yeeter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Yeet funds to multiple wallets easily and simply
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild size="lg">
            <Link href="/yeeter">Yeet!</Link>
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
