import { Button } from "@/components/ui/button";
import { api } from "@buzztrip/backend/api";
import { Id } from "@buzztrip/backend/dataModel";
import { useQuery } from "convex/react";
import { Plus } from "lucide-react";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import LabelForm from "./label-form";
import { useMapFormContext } from "./provider";

const MapLabelsForm = () => {
  const {
    form: { watch },
    labels,
    addLabel,
    removeLabel,
  } = useMapFormContext();
  const mapId = watch("_id");
  const userStatus = useQuery(api.users.userLoginStatus);

  if (
    !mapId ||
    !userStatus ||
    userStatus.message !== "Logged In" ||
    !userStatus.user
  )
    return null;

  return (
    <>
      <div className="flex justify-between items-center">
        <Label className="text-base font-medium">
          Map Labels ({labels?.length ?? 0})
        </Label>
        <Button
          type="button"
          onClick={() =>
            addLabel({
              icon: "MapPin",
              title: "",
              map_id: mapId as Id<"maps">,
              _id: "",
              _creationTime: 0,
              created_by: userStatus.user._id,
              description: "",
            })
          }
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Label
        </Button>
      </div>
      <ScrollArea className="h-[250px] w-full">
        {labels &&
          labels.map((label, index) => (
            <LabelForm
              key={label._id}
              label={{
                _id: label._id!,
                description: label?.description ?? undefined,
                map_id: label.map_id!,
                title: label.title ?? undefined,
                color: label?.color ?? undefined,
                icon: label?.icon ?? undefined,
                _creationTime: label._creationTime ?? 0,
                created_by: label.created_by ?? undefined,
              }}
            />
          ))}
      </ScrollArea>
    </>
  );
};

export default MapLabelsForm;
