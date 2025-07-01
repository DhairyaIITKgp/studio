"use client";

import { AuthGuard } from "@/components/auth-guard";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { Crown, Trophy } from "lucide-react";

const baseFocusChampionsData = [
    { user: "Alex", value: 342 },
    { user: "Sam", value: 298 },
    { user: "Jordan", value: 251 },
    { user: "Casey", value: 249 },
    { user: "Morgan", value: 215 },
];

const baseBettingWinnersData = [
    { user: "Jamie", value: 10540 },
    { user: "Riley", value: 9800 },
    { user: "Alex", value: 8750 },
    { user: "Taylor", value: 8120 },
    { user: "Pat", value: 7660 },
];

export default function LeaderboardPage() {
    const { user } = useAuth();

    const getLeaderboardData = (
        baseData: { user: string; value: number }[], 
        currentUserData: { user: string; value: number } | null, 
        formatValue: (value: number) => string
    ) => {
        let combinedData = [...baseData];
        if (currentUserData) {
            const userIndex = combinedData.findIndex(u => u.user === currentUserData.user);
            if (userIndex > -1) {
                if (combinedData[userIndex].value < currentUserData.value) {
                    combinedData[userIndex] = currentUserData;
                }
            } else {
                combinedData.push(currentUserData);
            }
        }
        
        return combinedData
            .sort((a, b) => b.value - a.value)
            .map((item, index) => ({
                rank: index + 1,
                user: item.user,
                value: formatValue(item.value),
            }));
    };

    const focusChampionsData = getLeaderboardData(
        baseFocusChampionsData,
        user ? { user: user.displayName, value: user.totalFocusTime } : null,
        (value) => `${value.toFixed(1)} hours`
    );

    const bettingWinnersData = getLeaderboardData(
        baseBettingWinnersData,
        user ? { user: user.displayName, value: user.cash } : null,
        (value) => `$${value.toLocaleString()}`
    );

    return (
        <AuthGuard>
            <div className="container py-8">
                <h1 className="text-4xl font-bold mb-8 text-center">Leaderboards</h1>
                <div className="grid md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Crown className="text-amber-400" />
                                Top Focus Champions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LeaderboardTable
                                headers={["Rank", "User", "Total Focus Time"]}
                                data={focusChampionsData}
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="text-orange-500" />
                                Top Betting Winners
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LeaderboardTable
                                headers={["Rank", "User", "Cash Won"]}
                                data={bettingWinnersData}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthGuard>
    );
}