//TODO: Create a component to create, update and delete labels
import { Button } from "@/components/ui/button";
import { generateId } from "@buzztrip/db/helpers";
import { Plus } from "lucide-react";
import { Label } from "../ui/label";
import LabelForm from "./label-form";
import { useMapFormContext } from "./provider";

const MapLabelsForm = () => {
  const { form: {watch}, labels, addLabel, removeLabel } = useMapFormContext();
  const mapId = watch("map_id");

  if (!mapId) return null

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
              map_id: mapId,
              label_id: generateId("generic"),
            })
          }
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Label
        </Button>
      </div>
      {labels &&
        labels.map((label, index) => (
          <LabelForm key={label.label_id} label={{
            label_id: label.label_id!,
            description: label?.description ?? null,
            map_id: label.map_id!,
            title: label.title!,
            color: label?.color ?? null,
            icon: label?.icon ?? null,
            created_at: label?.created_at,
            updated_at: label?.updated_at,
          }} />
        ))}
    </>
  );
};

export default MapLabelsForm;
