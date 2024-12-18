import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel";



  export const AppCarousel: React.FC = () =>  {
    return (
        <div className="w-full h-[50vh] overflow-hidden">
        <Carousel className="relative w-full max-w-s">
          <CarouselContent>
              {Array.from({ length: 3 }).map((_, index) => (
                  <CarouselItem key={index} className="w-full h-full justify-center items-center">
                      <div className="p-1">
                          <Card>
                              <CardContent className="flex aspect-square items-center justify-center p-6">
                                  <span className="text-4xl font-semibold">{index + 1}</span>
                              </CardContent>
                          </Card>
                      </div>
                  </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
      </Carousel>
      </div>
    );
  }