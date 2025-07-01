import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Leaf } from 'lucide-react';

// Mock data for trees grown. In a real app, this would come from a database or local storage.
const forestData = [
  { id: 1, date: "2024-07-20", duration: 45, treeType: "Oak", hint: "large oak" },
  { id: 2, date: "2024-07-20", duration: 25, treeType: "Pine", hint: "pine tree" },
  { id: 3, date: "2024-07-19", duration: 60, treeType: "Maple", hint: "maple tree" },
  { id: 4, date: "2024-07-18", duration: 30, treeType: "Cherry Blossom", hint: "cherry blossom" },
  { id: 5, date: "2024-07-17", duration: 50, treeType: "Willow", hint: "willow tree" },
  { id: 6, date: "2024-07-16", duration: 25, treeType: "Oak", hint: "large oak" },
];

export default function MyForestPage() {
  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">My Forest</h1>
        <p className="text-muted-foreground mt-2">A collection of all your successfully grown trees. Well done!</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {forestData.map((tree) => (
          <Card key={tree.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
               <Image
                  src={`https://placehold.co/400x300.png`}
                  alt={`A grown ${tree.treeType} tree`}
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover"
                  data-ai-hint={tree.hint}
                />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Leaf className="text-primary" size={20} />
                {tree.treeType}
              </CardTitle>
              <CardDescription className="mt-2">
                Grown on {tree.date}<br/>
                {tree.duration} min session
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
