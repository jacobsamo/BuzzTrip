import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  type?: "map" | "marker" | "collection";
  handleDelete: (event: React.FormEvent<HTMLFormElement> | any) => void;
}

const ConfirmDeleteModal = ({
  type = "map",
  handleDelete,
}: ConfirmDeleteModalProps) => {
  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({
          variant: "destructive",
          className: "w-11/12",
        })}
      >
        <Trash2 className="text-white" /> Delete
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this {type}
          </DialogDescription>
        </DialogHeader>
        <div>
          {type === "map" && (
            <p>This will delete all collections and markers for this map</p>
          )}

          {type === "collection" && (
            <p>This will delete all markers in this collection</p>
          )}

          <div className="inline-flex w-full items-end justify-end gap-2">
            <DialogClose>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <form method="delete" onSubmit={handleDelete}>
              <DialogClose>
                <Button variant="destructive" type="submit">
                  Delete
                </Button>
              </DialogClose>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteModal;
