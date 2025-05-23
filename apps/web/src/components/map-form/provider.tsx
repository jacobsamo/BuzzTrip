import { Form } from "@/components/ui/form";
import { useSession } from "@/lib/auth-client";
import { NewLabel, NewMap } from "@buzztrip/db/types";
import {
  mapsEditSchema,
  permissionEnumSchema,
  refinedUserSchema,
} from "@buzztrip/db/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, {
  createContext,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  SubmitHandler,
  useForm,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";

const userSchema = refinedUserSchema.extend({
  permission: permissionEnumSchema,
});

export type RefinedUserWithPermission = z.infer<typeof userSchema>;

type MapFormContextType = {
  form: UseFormReturn<z.infer<typeof mapsEditSchema>>;
  onSubmit: () => void;
  users: RefinedUserWithPermission[] | null;
  labels: NewLabel[] | null;
  addUser: (user: RefinedUserWithPermission) => void;
  removeUser: (userId: string) => void;
  updateUser: (
    userId: string,
    user: Partial<RefinedUserWithPermission>
  ) => void;
  addLabel: (label: NewLabel) => void;
  removeLabel: (labelId: string) => void;
  updateLabel: (labelId: string, label: Partial<NewLabel>) => void;
};

type MapFormUserEvents = {
  "user:added": RefinedUserWithPermission;
  "user:removed": string;
  "user:updated": { userId: string; user: Partial<RefinedUserWithPermission> };
};

type MapFormLabelEvents = {
  "label:added": NewLabel;
  "label:removed": string;
  "label:updated": { labelId: string; label: Partial<NewLabel> };
};

const MapFormContext = createContext<MapFormContextType | undefined>(undefined);

export const useMapFormContext = () => {
  const context = use(MapFormContext);
  if (!context)
    throw new Error("useMapFormContext must be used within MapFormProvider");
  return context;
};

type MapFormProviderProps = {
  children: React.ReactNode;
  formProps?: Exclude<UseFormProps<z.infer<typeof mapsEditSchema>>, "resolver">;
  onSubmit: SubmitHandler<z.infer<typeof mapsEditSchema>>;
  initialMapData?: Partial<NewMap>;
  initialUsers?: RefinedUserWithPermission[] | null;
  initialLabels?: NewLabel[] | null;
  setExternalUsers?: (users: RefinedUserWithPermission[] | null) => void;
  setExternalLabels?: (labels: NewLabel[] | null) => void;
  onUserChange?: (
    event: keyof MapFormUserEvents,
    payload: MapFormUserEvents[keyof MapFormUserEvents]
  ) => void;
  onLabelChange?: (
    event: keyof MapFormLabelEvents,
    payload: MapFormLabelEvents[keyof MapFormLabelEvents]
  ) => void;
};

export const MapFormProvider = ({
  children,
  formProps,
  onSubmit,
  initialUsers = null,
  initialLabels = null,
  setExternalUsers,
  setExternalLabels,
  onLabelChange,
  onUserChange,
}: MapFormProviderProps) => {
  const { data } = useSession();
  const userId = data?.session.userId;
  const form = useForm<z.infer<typeof mapsEditSchema>>({
    resolver: zodResolver(mapsEditSchema),
    defaultValues: formProps?.defaultValues ?? {
      icon: "Map",
      owner_id: userId!,
    },
    ...formProps,
  });
  const {
    formState: { errors },
  } = form;

  const [users, setUsers] = useState<RefinedUserWithPermission[] | null>(
    initialUsers
  );
  const [labels, setLabels] = useState<NewLabel[] | null>(initialLabels);

  useEffect(() => {
    if (setExternalUsers) {
      setExternalUsers(users);
    }
  }, [users]);

  useEffect(() => {
    if (setExternalLabels) {
      setExternalLabels(labels);
    }
  }, [labels]);

  useEffect(() => {
    console.error("Form Errors", errors);
  }, [errors]);

  // === RefinedUserWithPermission handlers ===
  const addUser = useCallback(
    (user: RefinedUserWithPermission) => {
      setUsers((prev) => {
        if (!prev) return [user];
        const exists = prev.find((u) => u.id === user.id);
        if (exists) return prev;
        return [...prev, user];
      });
      onUserChange?.("user:added", user);
    },
    [onUserChange]
  );

  const removeUser = useCallback(
    (userId: string) => {
      setUsers((prev) => {
        if (!prev) return null;
        return prev.filter((u) => u.id !== userId);
      });
      onUserChange?.("user:removed", userId);
    },
    [onUserChange]
  );

  const updateUser = useCallback(
    (userId: string, user: Partial<RefinedUserWithPermission>) => {
      setUsers((prev) => {
        if (!prev) return null;
        return prev.map((u) => {
          if (u.id === userId) {
            const updated = { ...u, ...user };
            onUserChange?.("user:updated", { userId, user });
            return updated;
          }
          return u;
        });
      });
    },
    [onUserChange]
  );

  // === NewLabel handlers ===
  const addLabel = useCallback(
    (label: NewLabel) => {
      setLabels((prev) => {
        if (!prev) return [label];
        return [...prev, label];
      });
      onLabelChange?.("label:added", label);
    },
    [onLabelChange]
  );

  const removeLabel = useCallback(
    (labelId: string) => {
      setLabels((prev) => {
        if (!prev) return null;
        return prev.filter((l) => l.label_id !== labelId);
      });
      onLabelChange?.("label:removed", labelId);
    },
    [onLabelChange]
  );

  const updateLabel = useCallback(
    (labelId: string, label: Partial<NewLabel>) => {
      setLabels((prev) => {
        if (!prev) return null;
        return prev.map((l) => {
          if (l.label_id === labelId) {
            const updated = { ...l, ...label };
            onLabelChange?.("label:updated", { labelId, label });
            return updated;
          }
          return l;
        });
      });
    },
    [onLabelChange]
  );

  return (
    <MapFormContext.Provider
      value={{
        form,
        onSubmit: form.handleSubmit(onSubmit),
        users,
        labels,
        addUser,
        removeUser,
        updateUser,
        addLabel,
        removeLabel,
        updateLabel,
      }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
      </Form>
    </MapFormContext.Provider>
  );
};
