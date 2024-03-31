import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '../ui/dialog'
import { Trash2 } from 'lucide-react'
import { Form } from '@remix-run/react'
import { Button } from '../ui/button'

interface ConfirmDeleteModalProps {
  id?: string,
    type?: "map" | "marker" | "collection"
}

const ConfirmDeleteModal = ({id, type = "map"}: ConfirmDeleteModalProps) => {
  return (

    <>
    <Dialog>
        <DialogTrigger asChild>
        <Trash2 /> Delete

        </DialogTrigger>
        <DialogContent>

        <DialogHeader>
            <DialogTitle>Are you sure</DialogTitle>
            <DialogDescription>Are you sure you want to delete this {type}</DialogDescription>
          </DialogHeader>
          <div>

          <p>This will delete all collections and markers for this map</p>

          <Form method='post' action={`/api/${type}/delete?id=${id}`} navigate={false}>
            

            <DialogClose>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>

            <DialogClose>
            <Button variant="destructive" type='submit'>Delete</Button>

            </DialogClose>
      
          </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
    
  )
}

export default ConfirmDeleteModal