"use client";

import { useState, useEffect, useCallback } from "react";
import { BrainCircuit, Coins, Play, Pause, X } from "lucide-react";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { VirtualTree } from "@/components/virtual-tree";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/context/auth-context";

export default function Home() {
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isDeepFocus, setIsDeepFocus] = useState(false);
  
  const [betAmount, setBetAmount] = useState(10);
  const [currentBet, setCurrentBet] = useState(0);

  const [showBetModal, setShowBetModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryMessage, setSummaryMessage] = useState({ title: "", description: "" });
  const [sessionSuccess, setSessionSuccess] = useState(false);
  
  const { toast } = useToast();
  const { user, updateUser } = useAuth();

  const handleSessionEnd = useCallback((success: boolean) => {
    setIsRunning(false);
    setSessionSuccess(success);

    if (!user || !updateUser) return;

    let newCash = user.cash;
    let newTotalFocusTime = user.totalFocusTime;
    const newForest = [...user.forest];

    if (currentBet > 0) {
      if (success) {
        newCash += currentBet;
        setSummaryMessage({
          title: "Session Complete!",
          description: `You've grown a new tree and earned $${currentBet}. Great work!`,
        });
      } else {
        newCash -= currentBet;
        setSummaryMessage({
          title: "Tree Withered",
          description: `You've lost your bet of $${currentBet}. Don't give up!`,
        });
      }
    } else {
       setSummaryMessage({
          title: success ? "Session Complete!" : "Session Incomplete",
          description: success ? "You've successfully grown a new tree. Keep it up!" : "Your tree withered. Stay focused next time!",
        });
    }

    if (success) {
      newTotalFocusTime += duration / 60; // Add duration in hours
      const treeTypes = ["Oak", "Pine", "Maple", "Cherry Blossom", "Willow", "Birch"];
      const randomTree = treeTypes[Math.floor(Math.random() * treeTypes.length)];
      newForest.push({
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        duration: duration,
        treeType: randomTree,
        hint: `${randomTree.toLowerCase()} tree`,
      });
    }

    updateUser({
      cash: newCash,
      totalFocusTime: newTotalFocusTime,
      forest: newForest,
    });

    if (!success && isDeepFocus) {
        toast({
            variant: "destructive",
            title: "Deep Focus Failed",
            description: "You navigated away during a deep focus session.",
        });
    }
    setShowSummaryModal(true);
    setCurrentBet(0);
    setTimeLeft(duration * 60);
  }, [currentBet, duration, toast, isDeepFocus, user, updateUser]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      handleSessionEnd(true);
    }
    return () => clearInterval(timerId);
  }, [isRunning, timeLeft, handleSessionEnd]);
  
  useEffect(() => {
    if (isRunning && isDeepFocus) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = ''; // This is required for compatibility.
      };
      
      const handleVisibilityChange = () => {
        if (document.hidden) {
          handleSessionEnd(false);
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [isRunning, isDeepFocus, handleSessionEnd]);
  
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(duration * 60);
    }
  }, [duration, isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minutes`;
  };

  const handleStartAttempt = () => {
    if (user && user.cash > 0) {
      setShowBetModal(true);
    } else {
      handleStart(0);
    }
  };

  const handleStart = (bet: number) => {
    if (!user) return;
    if (bet > user.cash) {
      toast({ variant: "destructive", title: "Not enough cash!", description: `You can't bet more than you have.` });
      return;
    }
    setCurrentBet(bet);
    setIsRunning(true);
    setShowBetModal(false);
  };
  
  const handlePause = () => setIsRunning(false);
  const handleResume = () => setIsRunning(true);
  
  const handleCancel = () => {
    setIsRunning(false);
    handleSessionEnd(false);
  };

  const progress = isRunning ? ((duration * 60 - timeLeft) / (duration * 60)) * 100 : 0;
  const treeProgress = isRunning || timeLeft < duration * 60 ? progress : -1; // -1 to show seed before start

  return (
    <AuthGuard>
      <div className="flex-1 flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md mx-auto shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">Focus Session</CardTitle>
            <CardDescription>Stay focused to grow your tree.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-8">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0">
                  <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                          cx="50%"
                          cy="50%"
                          innerRadius="80%"
                          outerRadius="100%"
                          barSize={15}
                          data={[{ name: 'progress', value: progress, fill: 'hsl(var(--primary))' }]}
                          startAngle={90}
                          endAngle={-270}
                      >
                          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                          <RadialBar background={{ fill: 'hsl(var(--muted))' }} dataKey="value" cornerRadius={7} />
                      </RadialBarChart>
                  </ResponsiveContainer>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                   <VirtualTree progress={treeProgress} />
              </div>
              <h2 className="absolute bottom-5 text-5xl font-bold font-mono text-primary bg-background/80 backdrop-blur-sm px-4 py-1 rounded-lg">
                  {formatTime(timeLeft)}
              </h2>
            </div>
            <div className="w-full space-y-6">
              <div className="space-y-2">
                <Label htmlFor="duration">Session Length: {formatDuration(duration)}</Label>
                <Slider
                  id="duration"
                  min={5}
                  max={1440}
                  step={5}
                  value={[duration]}
                  onValueChange={(value) => setDuration(value[0])}
                  disabled={isRunning}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <BrainCircuit className="text-primary" />
                  <Label htmlFor="deep-focus">Deep Focus Mode</Label>
                </div>
                <Switch
                  id="deep-focus"
                  checked={isDeepFocus}
                  onCheckedChange={setIsDeepFocus}
                  disabled={isRunning}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border bg-secondary/50">
                  <div className="flex items-center space-x-2">
                      <Coins className="text-amber-500" />
                      <Label>Your Cash: ${user?.cash || 0}</Label>
                  </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            {!isRunning && timeLeft === duration * 60 ? (
              <Button size="lg" onClick={handleStartAttempt} className="w-32 bg-primary hover:bg-primary/90">
                <Play className="mr-2 h-5 w-5" /> Start
              </Button>
            ) : null}
            {isRunning ? (
              <>
                <Button size="lg" variant="outline" onClick={handlePause} className="w-32">
                  <Pause className="mr-2 h-5 w-5" /> Pause
                </Button>
                <Button size="lg" variant="destructive" onClick={handleCancel} className="w-32">
                  <X className="mr-2 h-5 w-5" /> Cancel
                </Button>
              </>
            ) : null}
            {!isRunning && timeLeft < duration * 60 ? (
               <Button size="lg" onClick={handleResume} className="w-32 bg-primary hover:bg-primary/90">
                <Play className="mr-2 h-5 w-5" /> Resume
              </Button>
            ) : null}
          </CardFooter>
        </Card>
        
        <Dialog open={showBetModal} onOpenChange={setShowBetModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-accent">Place Your Bet!</DialogTitle>
              <DialogDescription>
                Bet your virtual cash on completing this session. Win and you double your bet!
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
               <div className="flex items-center space-x-2">
                  <Label htmlFor="bet" className="whitespace-nowrap">Bet Amount:</Label>
                  <Input
                      id="bet"
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(Math.min(user?.cash || 0, Math.max(0, parseInt(e.target.value) || 0)))}
                      max={user?.cash || 0}
                      min={0}
                  />
               </div>
               <Slider
                  value={[betAmount]}
                  onValueChange={(value) => setBetAmount(value[0])}
                  max={user?.cash || 0}
                  step={1}
              />
            </div>
            <DialogFooter className="sm:justify-between">
               <Button variant="ghost" onClick={() => handleStart(0)}>No, thanks</Button>
              <Button style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} onClick={() => handleStart(betAmount)}>
                  <Coins className="mr-2 h-4 w-4" /> Bet ${betAmount}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showSummaryModal} onOpenChange={setShowSummaryModal}>
            <DialogContent className="flex flex-col items-center text-center">
                <DialogHeader>
                    <DialogTitle>{summaryMessage.title}</DialogTitle>
                    <DialogDescription>{summaryMessage.description}</DialogDescription>
                </DialogHeader>
                <VirtualTree progress={sessionSuccess ? 100 : 0} isWithered={!sessionSuccess} size={150} />
                <DialogFooter>
                    <Button onClick={() => setShowSummaryModal(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

      </div>
    </AuthGuard>
  );
}
