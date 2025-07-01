import { LeaderboardTable } from "@/components/leaderboard-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Trophy } from "lucide-react";

const focusChampionsData = [
    { rank: 1, user: "Alex", value: "342 hours" },
    { rank: 2, user: "Sam", value: "298 hours" },
    { rank: 3, user: "Jordan", value: "251 hours" },
    { rank: 4, user: "Casey", value: "249 hours" },
    { rank: 5, user: "Morgan", value: "215 hours" },
];

const bettingWinnersData = [
    { rank: 1, user: "Jamie", value: "$10,540" },
    { rank: 2, user: "Riley", value: "$9,800" },
    { rank: 3, user: "Alex", value: "$8,750" },
    { rank: 4, user: "Taylor", value: "$8,120" },
    { rank: 5, user: "Pat", value: "$7,660" },
];

export default function LeaderboardPage() {
    return (
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
    );
}
