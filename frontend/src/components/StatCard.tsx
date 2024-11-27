import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ChevronRight } from 'lucide-react'

export default function StatCard({ icon: Icon, title, value, detail }: { icon: React.ElementType, title: string, value: number, detail: React.ReactNode }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Card className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <CardContent className="flex flex-col items-center justify-center p-4">
                        <Icon className="w-8 h-8 mb-2 text-primary" />
                        <p className="text-sm text-center">{title}</p>
                        <p className="text-2xl font-bold">{value}</p>
                        <ChevronRight className="w-4 h-4 mt-2 text-gray-400" />
                    </CardContent>
                </Card>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{title} Details</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                    {detail}
                </div>
            </SheetContent>
        </Sheet>
    )
}