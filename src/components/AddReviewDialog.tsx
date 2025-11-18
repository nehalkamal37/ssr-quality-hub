import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  comment: string;
  status: string;
  reviewerName: string;
  createdAt: string;
}

interface AddReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qaItemId: string;
  qaItemTitle: string;
  onAddReview: (review: Omit<Review, "id" | "createdAt">) => void;
}

export default function AddReviewDialog({ 
  open, 
  onOpenChange, 
  qaItemId, 
  qaItemTitle,
  onAddReview 
}: AddReviewDialogProps) {
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<string>("");
  const [reviewerName, setReviewerName] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast({
        title: "Comment required",
        description: "Please enter a review comment",
        variant: "destructive",
      });
      return;
    }

    if (!status) {
      toast({
        title: "Status required",
        description: "Please select a status",
        variant: "destructive",
      });
      return;
    }

    if (!reviewerName.trim()) {
      toast({
        title: "Reviewer name required",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    onAddReview({
      comment: comment.trim(),
      status,
      reviewerName: reviewerName.trim(),
    });

    toast({
      title: "Review added",
      description: "Your review has been successfully added",
    });

    setComment("");
    setStatus("");
    setReviewerName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Review</DialogTitle>
            <DialogDescription>
              Add a review comment for: <span className="font-semibold">{qaItemTitle}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reviewer">Your Name</Label>
              <input
                id="reviewer"
                type="text"
                placeholder="Enter your name"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="noted">Noted</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                placeholder="Enter your review comments..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
