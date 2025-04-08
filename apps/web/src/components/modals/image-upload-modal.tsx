import { Dropzone, DropzoneProps } from "@/components/dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface ImageUploadModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onClose?: () => void;
  dropZoneProps: DropzoneProps;
}

const ImageUploadModal = ({
  trigger,
  open,
  onClose,
  dropZoneProps,
}: ImageUploadModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined && onClose !== undefined;

  const currentOpen = isControlled ? open : internalOpen;
  const setCurrentOpen = isControlled ? onClose : setInternalOpen;

  useEffect(() => {
    if (isControlled) {
      setInternalOpen(open);
    }
  }, [open, isControlled]);

  return (
    <Dialog open={currentOpen} onOpenChange={setCurrentOpen}>
      <DialogTrigger asChild={trigger ? true : false}>
        {trigger ? trigger : <Button variant="outline">Upload an image</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload an image</DialogTitle>
        </DialogHeader>
        <Dropzone {...dropZoneProps} />
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadModal;
