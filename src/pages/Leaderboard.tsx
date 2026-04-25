import { useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Medal, User as UserIcon } from 'lucide-react';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setIsLoading(true);
      // Fetch directly from the Supabase profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, total_pnl')
        .order('total_pnl', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Supabase fetch error:', error);
        // If the table doesn't exist yet, we fail gracefully
        setLeaderboard([]);
        return;
      }

      if (data) {
        setLeaderboard(data);
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6" style={{ paddingTop: '120px', minHeight: '100vh', backgroundColor: 'white' }}>
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-yellow-500" />
        <h1 className="text-3xl font-bold">Leaderboard</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Traders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">Loading...</p>
          ) : leaderboard.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No data available</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Portfolio Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((entry, index) => {
                  const isCurrentUser = user?.id === entry.id;
                  
                  return (
                    <TableRow 
                      key={entry.id || index}
                      className={isCurrentUser ? "bg-blue-50/70 border-l-4 border-blue-500 font-medium" : ""}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                          {index === 1 && <Medal className="h-5 w-5 text-gray-400" />}
                          {index === 2 && <Medal className="h-5 w-5 text-amber-600" />}
                          {index > 2 && <span className="w-5 text-center text-muted-foreground">{index + 1}</span>}
                          {index <= 2 && <span className="font-bold">{index + 1}</span>}
                        </div>
                      </TableCell>
                      <TableCell className={isCurrentUser ? "font-bold text-blue-700" : "font-semibold text-gray-700"}>
                        <div className="flex items-center gap-2">
                          {entry.username}
                          {isCurrentUser && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <UserIcon className="w-3 h-3" /> You
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-green-600">
                        ₹{(Number(entry.total_pnl) || 0).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
