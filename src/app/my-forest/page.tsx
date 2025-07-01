"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Leaf } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';
import { useAuth } from '@/context/auth-context';

export default function MyForestPage() {
  const { user } = useAuth();
  const forestData = user?.forest || [];

  return (
    <AuthGuard>
      <div className="container py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">My Forest</h1>
          <p className="text-muted-foreground mt-2">A collection of all your successfully grown trees. Well done!</p>
        </div>
        
        {forestData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {forestData.map((tree) => (
              <Card key={tree.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                   <Image
                      src={`https://placehold.co/400x300/0000/0000.png`}
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
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Your forest is empty. Start a focus session to grow your first tree!</p>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}