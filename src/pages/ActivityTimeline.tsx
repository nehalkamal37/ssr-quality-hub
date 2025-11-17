import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Activity, FileUp, FileX, Edit, Upload, ArrowUpDown } from "lucide-react";

interface ActivityLog {
  id: string;
  activity_type: string;
  description: string;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
  qa_item_id: string | null;
  project_id: string | null;
  user: {
    full_name: string;
    email: string;
  } | null;
  qa_item: {
    item_number: string;
    title: string;
  } | null;
  project: {
    name: string;
  } | null;
}

const activityIcons: Record<string, any> = {
  status_change: ArrowUpDown,
  review_added: Activity,
  attachment_uploaded: FileUp,
  attachment_deleted: FileX,
  item_edited: Edit,
  import_performed: Upload,
};

const activityColors: Record<string, string> = {
  status_change: "bg-blue-500/10 text-blue-500",
  review_added: "bg-green-500/10 text-green-500",
  attachment_uploaded: "bg-purple-500/10 text-purple-500",
  attachment_deleted: "bg-red-500/10 text-red-500",
  item_edited: "bg-yellow-500/10 text-yellow-500",
  import_performed: "bg-indigo-500/10 text-indigo-500",
};

export default function ActivityTimeline() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('activity-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_log'
        },
        () => {
          fetchActivities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchActivities = async () => {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching activities:', error);
      setLoading(false);
      return;
    }

    // Fetch related data separately
    const enrichedActivities = await Promise.all((data || []).map(async (activity) => {
      const enriched: any = { ...activity };

      if (activity.user_id) {
        const { data: userData } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', activity.user_id)
          .single();
        enriched.user = userData;
      }

      if (activity.qa_item_id) {
        const { data: qaData } = await supabase
          .from('qa_items')
          .select('item_number, title')
          .eq('id', activity.qa_item_id)
          .single();
        enriched.qa_item = qaData;
      }

      if (activity.project_id) {
        const { data: projectData } = await supabase
          .from('projects')
          .select('name')
          .eq('id', activity.project_id)
          .single();
        enriched.project = projectData;
      }

      return enriched;
    }));

    setActivities(enrichedActivities);
    setLoading(false);
  };

  const handleActivityClick = (activity: ActivityLog) => {
    if (activity.qa_item_id) {
      navigate(`/qa-items?highlight=${activity.qa_item_id}`);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Activity Timeline</h1>
          <p className="text-muted-foreground mt-2">
            Complete history of all actions and changes across projects
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : activities.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No activities recorded yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activityIcons[activity.activity_type] || Activity;
              const colorClass = activityColors[activity.activity_type] || "bg-gray-500/10 text-gray-500";

              return (
                <Card 
                  key={activity.id} 
                  className={`${activity.qa_item_id ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
                  onClick={() => handleActivityClick(activity)}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className={`h-10 w-10 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-medium">{activity.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {activity.qa_item && (
                                <Badge variant="outline">
                                  Item: {activity.qa_item.item_number}
                                </Badge>
                              )}
                              {activity.project && (
                                <Badge variant="outline">
                                  {activity.project.name}
                                </Badge>
                              )}
                              {activity.old_value && activity.new_value && (
                                <Badge variant="secondary">
                                  {activity.old_value} → {activity.new_value}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        {activity.user && (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {getInitials(activity.user.full_name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">
                              {activity.user.full_name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
