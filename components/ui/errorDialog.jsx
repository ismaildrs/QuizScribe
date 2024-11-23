import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

export default function ErrorDialog({message}) {
  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Error Occurred</DialogTitle>
        </DialogHeader>{" "}
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      </DialogContent>
    </Dialog>
  );
}
