"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, Loader2, Lightbulb, TrendingUp } from "lucide-react";
import { getCoaching } from "@/app/actions";
import type { PersonalizedFocusCoachOutput } from "@/ai/flows/personalized-focus-coach";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const formSchema = z.object({
  focusSessionHistory: z.string().min(20, { message: "Please provide more details about your recent sessions." }),
  userPreferences: z.string().min(20, { message: "Please describe your ideal focus environment and preferences." }),
});

export function FocusCoachSheet() {
  const [result, setResult] = useState<PersonalizedFocusCoachOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      focusSessionHistory: "",
      userPreferences: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);
    const response = await getCoaching(values);
    setIsLoading(false);

    if ("error" in response) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.error,
      });
    } else {
      setResult(response);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
        form.reset();
        setResult(null);
        setIsLoading(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Sparkles className="mr-2 h-4 w-4" /> AI Coach
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Personalized Focus Coach</SheetTitle>
          <SheetDescription>
            Get AI-powered insights to improve your focus and productivity.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100%-120px)] pr-4">
        <div className="py-4 space-y-6">
          {!result && !isLoading && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="focusSessionHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Focus Session History</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'I tried focusing for 30 mins in the morning but got distracted by my phone. In the evening, I managed a 50-min session with lofi music.'"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userPreferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Preferences</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'I prefer working in a quiet room, usually in the late afternoon. I like having a clean desk and some natural light.'"
                           className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    <Sparkles className="mr-2 h-4 w-4" /> Get Advice
                </Button>
              </form>
            </Form>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Analyzing your habits...</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in-50">
              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Lightbulb className="text-amber-400" />Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm">{result.feedback}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp className="text-primary" />Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm">{result.suggestions}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        </ScrollArea>
        <SheetFooter className="mt-4">
            {result && (
                <Button variant="outline" onClick={() => {
                    setResult(null);
                    form.reset();
                }}>
                    Start Over
                </Button>
            )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
