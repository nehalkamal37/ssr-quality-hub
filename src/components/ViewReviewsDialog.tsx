import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare } from "lucide-react";

interface Review {
  id: string;
  comment: string;
  status: string;
  reviewerName: string;
  createdAt: string;
}

interface ViewReviewsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qaItemTitle: string;
  reviews: Review[];
}

const statusColors: Record<string, string> = {
  noted: "bg-muted text-muted-foreground",
  open: "bg-info/10 text-info border-info/20",
  resolved: "bg-success/10 text-success border-success/20",
  verified: "bg-accent/10 text-accent border-accent/20",
  closed: "bg-border text-foreground",
};

export default function ViewReviewsDialog({ 
  open, 
  onOpenChange, 
  qaItemTitle,
  reviews 
}: ViewReviewsDialogProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Reviews for: {qaItemTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No reviews yet</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {getInitials(review.reviewerName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{review.reviewerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={statusColors[review.status] || "bg-muted"}
                  >
                    {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
