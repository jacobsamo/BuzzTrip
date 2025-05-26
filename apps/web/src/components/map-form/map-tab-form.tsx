import { FileText, Loader2, MapPin, Save, Tag, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import MapDetailsForm from "./details";
import MapLabelsForm from "./labels";
import MapLocationForm from "./location";
import { useMapFormContext } from "./provider";
import MapShareForm from "./share";

const tabs = [
  {
    id: "details",
    label: "Details",
    icon: FileText,
    component: MapDetailsForm,
  },
  {
    id: "location",
    label: "Location",
    icon: MapPin,
    component: MapLocationForm,
  },
  {
    id: "share",
    label: "Share",
    icon: Users,
    component: MapShareForm,
  },
  {
    id: "labels",
    label: "Labels",
    icon: Tag,
    component: MapLabelsForm,
  },
] as const;

type Tab = (typeof tabs)[number]["id"];

interface MapTabFormProps {
  defaultTab?: Tab;
}

const MapTabForm = ({ defaultTab }: MapTabFormProps) => {
  const { form, onSubmit } = useMapFormContext();
  const [currentTab, setCurrentTab] = useState(defaultTab || "details");
  const { dirtyFields, isDirty, isSubmitting, isValid, errors } =
    form.formState;

  return (
    <Tabs
      value={currentTab}
      onValueChange={(value) => setCurrentTab(value as Tab)}
      className="flex-1 flex flex-col"
    >
      <TabsList className="grid w-full grid-cols-4 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-2"
              type="button"
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      <div className="flex-1 min-h-0">
        {tabs.map((tab) => {
          const Component = tab.component;
          return (
            <TabsContent key={tab.id} value={tab.id} className="h-full mt-0">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <Component />
              </motion.div>
            </TabsContent>
          );
        })}
      </div>

      {/* Save Button */}

      <Button
        type="button"
        onClick={form.handleSubmit(onSubmit)}
        disabled={isSubmitting || !isDirty}
        className="min-w-[120px] mt-6 ml-auto"
      >
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4 mr-2" />
        )}
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </Tabs>
  );
};

export default MapTabForm;
