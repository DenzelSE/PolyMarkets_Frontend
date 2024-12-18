import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel";

  const images = [
    {
      src: "public/Universel Markets.jpg",
      alt: "Slide 1",
      caption: "First Image"
    },
    {
      src: "public/PolyMarket-Website-Thumbnail.webp",
      alt: "Slide 2",
      caption: "Second Image"
    },
    {
      src: "/api/placeholder/800/400",
      alt: "Slide 3",
      caption: "Third Image"
    }
  ];



  export const AppCarousel: React.FC = () =>  {
    return (
        <div className="w-full h-[50vh] overflow-hidden">
        <Carousel className="relative w-full max-w-s">
          <CarouselContent>
              {images.map((image, index) => (
                  <CarouselItem key={index} className="w-full h-full justify-center items-center ">
                      <div className="p-1">
                          <Card>
                              <CardContent className="flex aspect-square items-center justify-center p-6">
                                  <img
                                  src={image.src}
                                  className="w-full h-64 object-cover rounded-lg"
                                  />
                                  <p className="text-lg font-medium">{image.caption}</p>
                                  
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