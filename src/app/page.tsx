import Image from "next/image";
import Navbar from "../components/ui/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export default function Home() {
  return (
    <div className="">
      <Navbar />
      <div className="w-full flex-auto content-center items-start justify-center flex p-20 space-x-8">
        <div className="w-[15%]">
          <Card className="">
            <CardHeader>Hello</CardHeader>
          </Card>
        </div>
        <div className="w-[40%] space-y-8">
          <Card className="">
            <CardHeader>Hello</CardHeader>
          </Card>
          <Card className="">
            <CardHeader>Hello</CardHeader>
          </Card>
          <Card className="">
            <CardHeader>Hello</CardHeader>
          </Card>
          <Card className="">
            <CardHeader>Hello</CardHeader>
          </Card>
        </div>
        <div className="w-[18%]">
          <Card className="">
            <CardHeader>
              <CardTitle className="text-lg">Connect with others</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-rows-3 grid-flow-col gap-1">
                <div className="row-span-3">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <div className="col-span-2">Pablo Picasso</div>
                <div className="row-span-2 col-span-2 text-sm">Aspiring artist</div>
              </div>
              <div className="grid grid-rows-3 grid-flow-col gap-1">
                <div className="row-span-3">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <div className="col-span-2 ">Frida Kahlo</div>
                <div className="row-span-2 col-span-2 text-sm">Watercolor painter</div>
              </div>
              <div className="grid grid-rows-3 grid-flow-col gap-1">
                <div className="row-span-3">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <div className="col-span-2">Diego the Artist</div>
                <div className="row-span-2 col-span-2 text-sm"> Pottery Enthusiast</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
