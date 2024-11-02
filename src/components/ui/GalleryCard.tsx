import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';


export default function GalleryCard({
}) {

    

    return (
        <div className="overflow-x-auto p-4 bg-white rounded-lg shadow-md border border-gray-200 flex-1 min-h-[300] flex justify-start gap-y-8 relative mt-4">
            <div className="flex gap-x-2">
            <Card className="min-w-[300]">
                <CardHeader>
                    <CardTitle>Gallery</CardTitle>
                </CardHeader>
            </Card>
            <Card className="min-w-[300] just">
                <CardHeader>
                    <CardTitle>Gallery</CardTitle>
                </CardHeader>
            </Card><Card className="min-w-[300] just">
                <CardHeader>
                    <CardTitle>Gallery</CardTitle>
                </CardHeader>
            </Card>
            <Card className="min-w-[300] just">
                <CardHeader>
                    <CardTitle>Gallery</CardTitle>
                </CardHeader>
            </Card>
            <Card className="min-w-[300] just">
                <CardHeader>
                    <CardTitle>Gallery</CardTitle>
                </CardHeader>
            </Card>
            </div>
        </div>
    );
}