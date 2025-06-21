import { destinations } from "@/data/destinations";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Landmark, UtensilsCrossed, Clock, MountainSnow, MapPin } from "lucide-react";
import WeatherWidget from "@/components/weather-widget";

// In a real app, this would be more comprehensive
const details = {
    delhi: {
      attractions: ["India Gate", "Qutub Minar", "Humayun's Tomb", "Red Fort"],
      food: ["Chole Bhature", "Parathas", "Chaat", "Butter Chicken"],
      bestTimeToVisit: "October to March",
    },
    mumbai: {
      attractions: ["Gateway of India", "Marine Drive", "Elephanta Caves", "Siddhivinayak Temple"],
      food: ["Vada Pav", "Pav Bhaji", "Bhelpuri", "Seafood"],
      bestTimeToVisit: "October to February",
    },
    jaipur: {
      attractions: ["Hawa Mahal", "Amer Fort", "City Palace", "Jantar Mantar"],
      food: ["Dal Baati Churma", "Ghewar", "Pyaaz Kachori", "Laal Maas"],
      bestTimeToVisit: "October to March",
    },
     agra: {
      attractions: ["Taj Mahal", "Agra Fort", "Fatehpur Sikri"],
      food: ["Petha", "Mughlai Cuisine", "Bedai & Jalebi"],
      bestTimeToVisit: "October to March",
    },
    goa: {
        attractions: ["Baga Beach", "Calangute Beach", "Old Goa Churches"],
        food: ["Seafood Curry", "Vindaloo", "Bebinca"],
        bestTimeToVisit: "November to February",
    },
     varanasi: {
        attractions: ["Ganges River Ghats", "Kashi Vishwanath Temple", "Sarnath"],
        food: ["Kachori Sabzi", "Lassi", "Malaiyyo"],
        bestTimeToVisit: "October to March",
    },
    'kerala-backwaters': {
        attractions: ["Alleppey (Alappuzha)", "Kumarakom", "Houseboat Cruise"],
        food: ["Karimeen Pollichathu", "Appam and Stew", "Sadya"],
        bestTimeToVisit: "September to March",
    },
    rishikesh: {
        attractions: ["Laxman Jhula", "Ram Jhula", "Triveni Ghat", "River Rafting"],
        food: ["Vegetarian Cuisine", "Thalis", "Herbal Teas"],
        bestTimeToVisit: "September to June",
    }
  };

export default function DestinationDetailPage({ params }: { params: { slug: string } }) {
  const destination = destinations.find((d) => d.slug === params.slug);
  const detailData = details[params.slug as keyof typeof details];

  if (!destination || !detailData) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
        <Image
          src={destination.imageUrl}
          alt={`Hero image for ${destination.city}`}
          data-ai-hint={destination.aiHint}
          layout="fill"
          objectFit="cover"
          className="bg-muted"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-end p-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold font-headline text-white">
              {destination.city}
            </h1>
            <p className="text-xl text-white/90 mt-2">{destination.region}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{destination.shortDescription}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <Landmark className="text-primary" /> Top Attractions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {detailData.attractions.map(item => (
                <Badge key={item} variant="outline" className="text-base px-3 py-1">{item}</Badge>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <UtensilsCrossed className="text-primary" /> Must-Try Foods
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {detailData.food.map(item => (
                <Badge key={item} variant="outline" className="text-base px-3 py-1">{item}</Badge>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-xl">
                <Clock className="text-primary" /> Best Time to Visit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{detailData.bestTimeToVisit}</p>
            </CardContent>
          </Card>
           <WeatherWidget city={destination.city} />
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
    return destinations.map((dest) => ({
      slug: dest.slug,
    }))
  }
