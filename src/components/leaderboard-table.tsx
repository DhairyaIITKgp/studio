import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface LeaderboardTableProps {
    headers: string[];
    data: {
        rank: number;
        user: string;
        value: string;
    }[];
}

export function LeaderboardTable({ headers, data }: LeaderboardTableProps) {
    const getBadgeVariant = (rank: number) => {
        if (rank === 1) return "default";
        if (rank === 2) return "secondary";
        return "outline";
    };
    
    const getRankColor = (rank: number) => {
        if (rank === 1) return "text-amber-500 font-bold";
        if (rank === 2) return "text-slate-400 font-semibold";
        if (rank === 3) return "text-orange-600 font-medium";
        return "text-muted-foreground";
    };


    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {headers.map((header) => (
                        <TableHead key={header}>{header}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((row) => (
                    <TableRow key={row.rank}>
                        <TableCell className={getRankColor(row.rank)}>{row.rank}</TableCell>
                        <TableCell>{row.user}</TableCell>
                        <TableCell className="font-medium">{row.value}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
