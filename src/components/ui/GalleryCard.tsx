import React from "react";
import { Card, CardHeader } from "@/components/ui/card";

export default function GalleryCard() {
  return (
    <div className="overflow-x-auto p-4 bg-white rounded-lg shadow-md border border-gray-200 flex-1 min-h-[300] flex justify-start gap-y-8 relative mt-4">
      <div className="flex gap-x-2">
        <Card className="min-w-[300]">
          <CardHeader className="p-0">
            <img
              src="/gallery1.png"
              alt="Gallery Image 1"
              className="w-full h-full object-cover rounded-lg"
            />
          </CardHeader>
        </Card>
        <Card className="min-w-[300]">
          <CardHeader className="p-0">
            <img
              src="/gallery2.png"
              alt="Gallery Image 2"
              className="w-full h-full object-cover rounded-lg"
            />
          </CardHeader>
        </Card>
        <Card className="min-w-[300]">
          <CardHeader className="p-0">
            <img
              src="/gallery3.png"
              alt="Gallery Image 3"
              className="w-full h-full object-cover rounded-lg"
            />
          </CardHeader>
        </Card>
        <Card className="min-w-[300]">
          <CardHeader className="p-0">
            <img
              src="/gallery4.png"
              alt="Gallery Image 4"
              className="w-full h-full object-cover rounded-lg"
            />
          </CardHeader>
        </Card>
        <Card className="min-w-[300]">
          <CardHeader className="p-0">
            <img
              src="/gallery5.png"
              alt="Gallery Image 5"
              className="w-full h-full object-cover rounded-lg"
            />
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
