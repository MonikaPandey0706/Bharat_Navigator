import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { destinations } from "@/data/destinations";
import Image from "next/image";
import Link from "next/link";

export default function DestinationsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
          Explore India
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover detailed guides for cities and regions across India. From hidden gems to iconic landmarks, start your journey here.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {destinations.map((dest) => (
          <Link href={`/destinations/${dest.slug}`} key={dest.slug}>
            <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
              <CardHeader className="p-0">
                <div className="relative w-full h-48">
                  <Image
                    src={dest.imageUrl}
                    alt={`Image of ${dest.city}`}
                    data-ai-hint={dest.aiHint}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="font-headline text-xl mb-1">{dest.city}</CardTitle>
                <CardDescription>{dest.region}</CardDescription>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{dest.shortDescription}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
