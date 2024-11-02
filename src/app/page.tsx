import Image from "next/image";
import Navbar from "../components/ui/Navbar";
import SearchForm from "@/components/ui/SearchForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export default function Home() {
  return (
    <div className="">
      <Navbar />
      <div className="w-full flex-auto content-center items-start justify-center flex p-20 space-x-8">
        <div className="w-[25%]">
          <Card className="">
            <div className="flex items-center justify-center pt-4">
              <Avatar className="items-center justify-center align-center w-16 h-16">
                <AvatarImage src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png" className="rounded-full object-cover"/>
                <AvatarFallback>PFP</AvatarFallback>
              </Avatar>
            </div>
            <div className="text-center align-center gap-0">
              <CardHeader>
                <CardTitle className="text-lg">Mia Thompson</CardTitle>
                <CardDescription> Mia Thompson is a passionate visual artist and illustrator based in Manhattan, New York. </CardDescription>
              </CardHeader>
            </div>

          </Card>
        </div>
        <div className="w-[40%] space-y-8">
          <Card className="">
            <CardHeader>
              <SearchForm message="Create a post" />
            </CardHeader>
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
        <div className="w-[25%]">
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
