"use client";
import { createMapAction } from "@/actions/map/create-map";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Map, UserMap } from "@buzztrip/db/types";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Plus } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export interface MapModalProps {
  mode?: "create" | "edit";
  map?: Map | null;
  setMap: (map: Map | null) => void;
}

export default function MapModal({
  mode = "create",
  map = null,
  setMap,
}: MapModalProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus /> {mode == "create" ? "Create" : "Edit"} Map
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {mode == "create" ? "Create" : "Edit"} Map
            </DialogTitle>
            <DialogDescription>Start your travel plans here</DialogDescription>
          </DialogHeader>
          <MapForm mode={mode} map={map} setMap={setMap} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Plus /> {mode == "create" ? "Create" : "Edit"} Map
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{mode == "create" ? "Create" : "Edit"} Map</DrawerTitle>
          <DrawerDescription>Start your travel plans here</DrawerDescription>
        </DrawerHeader>
        <MapForm mode={mode} map={map} setMap={setMap} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function MapForm({ mode, map, setMap }: MapModalProps) {
  // const places = useMapsLibrary("places");
  // const [searchValue, setSearchValue] = useState("");
  // const locationInputRef = useRef<HTMLInputElement>(null);

  // const [placeAutocomplete, setPlaceAutocomplete] =
  //   useState<google.maps.places.Autocomplete | null>(null);

  // const [fetchingData, setFetchingData] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<Map>({
    defaultValues: {
      title: map?.title || undefined,
      description: map?.description || undefined,
    },
  });

  React.useEffect(() => {
    console.log("Errors: ", {
      errors,
      values: getValues(),
    });
  }, [errors]);

  const onSubmit: SubmitHandler<Map> = async (data) => {
    try {
      if (mode === "create") {
        const create = createMapAction(data);

        toast.promise(create, {
          loading: "Creating map...",
          success: (data) => {
            if (data?.data?.map) {
              setMap(data.data.map);
            }
            return "Map created successfully!";
          },
          error: "Failed to create map",
        });

      }

      // if (mode === "edit" && map) {
      //   const edit = fetch(`/api/map/${map.uid}`, {
      //     method: "PUT",
      //     body: JSON.stringify(data),
      //   });

      //   toast.promise(edit, {
      //     loading: "Updating map...",
      //     success: "Map updated successfully",
      //     error: "Failed to update map",
      //   });
      // }
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   if (!places || !locationInputRef.current) return;

  //   const options: google.maps.places.AutocompleteOptions = {
  //     fields: ["formatted_address", "geometry/viewport", "name", "type"],
  //     types: ["country", "continent", "(regions)"],
  //   };

  //   setPlaceAutocomplete(
  //     new places.Autocomplete(locationInputRef.current, options)
  //   );
  // }, [places]);

  // useEffect(() => {
  //   if (!placeAutocomplete) return;

  //   placeAutocomplete.addListener("place_changed", () => {
  //     const place = placeAutocomplete.getPlace();
  //     if (!place.geometry || !place.geometry.location) {
  //       console.log("Returned place contains no geometry");
  //       return;
  //     }
  //     console.log("Places: ", place);
  //   });
  // }, [placeAutocomplete]);

  return (
    <form
      className={cn("grid items-start gap-4")}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input type="text" placeholder="Roadtrip" {...register("title")} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea placeholder="epic roadtrip!!" {...register("description")} />
      </div>

      {/* <div>
        <Label htmlFor="location">Location</Label>
        <Input
          className="mt-2 rounded-full outline-none"
          placeholder="Search location"
          type="search"
          id="search"
          ref={locationInputRef}
        />
      </div> */}

      <DialogClose asChild>
        <DrawerClose asChild>
          <Button aria-label="create map" type="submit">
            Create Map
          </Button>
        </DrawerClose>
      </DialogClose>
    </form>
  );
}
