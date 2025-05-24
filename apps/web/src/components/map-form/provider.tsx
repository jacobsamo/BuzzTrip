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
    user: RefinedUserWithPermission
  ) => void;
  addLabel: (label: NewLabel) => void;
  removeLabel: (labelId: string) => void;
  updateLabel: (labelId: string, label: NewLabel) => void;
};

type MapFormUserEvents =
  | { event: "user:added"; payload: RefinedUserWithPermission }
  | { event: "user:removed"; payload: string }
  | {
      event: "user:updated";
      payload: { userId: string; user: RefinedUserWithPermission };
    };

type MapFormLabelEvents =
  | { event: "label:added"; payload: NewLabel }
  | { event: "label:removed"; payload: string }
  | {
      event: "label:updated";
      payload: { labelId: string; label: NewLabel };
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
  initialMapData?: NewMap;
  initialUsers?: RefinedUserWithPermission[] | null;
  initialLabels?: NewLabel[] | null;
  setExternalUsers?: (users: RefinedUserWithPermission[] | null) => void;
  setExternalLabels?: (labels: NewLabel[] | null) => void;
  onUserChange?: (e: MapFormUserEvents) => void;
  onLabelChange?: (e: MapFormLabelEvents) => void;
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
      owner_id: userId || "",
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
  }, [users, setExternalUsers]);

  useEffect(() => {
    if (setExternalLabels) {
      setExternalLabels(labels);
    }
  }, [labels, setExternalLabels]);

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
      onUserChange?.({ event: "user:added", payload: user });
    },
    [onUserChange]
  );

  const removeUser = useCallback(
    (userId: string) => {
      setUsers((prev) => {
        if (!prev) return null;
        return prev.filter((u) => u.id !== userId);
      });
      onUserChange?.({ event: "user:removed", payload: userId });
    },
    [onUserChange]
  );

  const updateUser = useCallback(
    (userId: string, user: RefinedUserWithPermission) => {
      setUsers((prev) => {
        if (!prev) return null;
        return prev.map((u) => {
          if (u.id === userId) {
            const updated = { ...u, ...user };
            onUserChange?.({
              event: "user:updated",
              payload: { userId, user },
            });
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
      onLabelChange?.({ event: "label:added", payload: label });
    },
    [onLabelChange]
  );

  const removeLabel = useCallback(
    (labelId: string) => {
      setLabels((prev) => {
        if (!prev) return null;
        return prev.filter((l) => l.label_id !== labelId);
      });
      onLabelChange?.({ event: "label:removed", payload: labelId });
    },
    [onLabelChange]
  );

  const updateLabel = useCallback(
    (labelId: string, label: NewLabel) => {
      setLabels((prev) => {
        if (!prev) return null;
        return prev.map((l) => {
          if (l.label_id === labelId) {
            const updated = { ...l, ...label };
            onLabelChange?.({
              event: "label:updated",
              payload: { labelId, label },
            });
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
