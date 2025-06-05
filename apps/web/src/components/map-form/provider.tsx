import { Form } from "@/components/ui/form";
import { useSession } from "@/lib/auth-client";
import { Label, NewLabel, NewMap } from "@buzztrip/backend/types";
import {
  mapsEditSchema,
  permissionEnumSchema,
  refinedUserSchema,
} from "@buzztrip/backend/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
  labels: Label[] | null;
  addUser: (user: RefinedUserWithPermission) => void;
  removeUser: (userId: string) => void;
  updateUser: (userId: string, user: RefinedUserWithPermission) => void;
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
  initialLabels?: Label[] | null;
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

  // Use refs to store callback functions to prevent unnecessary re-renders
  const onUserChangeRef = useRef(onUserChange);
  const onLabelChangeRef = useRef(onLabelChange);
  const setExternalUsersRef = useRef(setExternalUsers);
  const setExternalLabelsRef = useRef(setExternalLabels);

  // Update refs when callbacks change
  useEffect(() => {
    onUserChangeRef.current = onUserChange;
  }, [onUserChange]);

  useEffect(() => {
    onLabelChangeRef.current = onLabelChange;
  }, [onLabelChange]);

  useEffect(() => {
    setExternalUsersRef.current = setExternalUsers;
  }, [setExternalUsers]);

  useEffect(() => {
    setExternalLabelsRef.current = setExternalLabels;
  }, [setExternalLabels]);

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
  const [labels, setLabels] = useState<Label[] | null>(initialLabels);

  // Only update state when initialUsers actually changes (deep comparison)
  const initialUsersStringified = useMemo(
    () => JSON.stringify(initialUsers),
    [initialUsers]
  );

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsersStringified]);

  // Only update state when initialLabels actually changes (deep comparison)
  const initialLabelsStringified = useMemo(
    () => JSON.stringify(initialLabels),
    [initialLabels]
  );

  useEffect(() => {
    setLabels(initialLabels);
  }, [initialLabelsStringified]);

  // Notify external components of state changes using refs to prevent re-renders
  useEffect(() => {
    if (setExternalUsersRef.current) {
      setExternalUsersRef.current(users);
    }
  }, [users]);

  useEffect(() => {
    if (setExternalLabelsRef.current) {
      setExternalLabelsRef.current(labels);
    }
  }, [labels]);

  // Only log errors in development
  useEffect(() => {
    if (
      process.env.NODE_ENV === "development" &&
      Object.keys(errors).length > 0
    ) {
      console.error("Form Errors", errors);
    }
  }, [errors]);

  // Memoized user handlers to prevent unnecessary re-renders
  const addUser = useCallback((user: RefinedUserWithPermission) => {
    setUsers((prev) => {
      if (!prev) return [user];
      const exists = prev.find((u) => u._id === user._id);
      if (exists) return prev;
      return [...prev, user];
    });
    onUserChangeRef.current?.({ event: "user:added", payload: user });
  }, []);

  const removeUser = useCallback((userId: string) => {
    setUsers((prev) => {
      if (!prev) return null;
      const filtered = prev.filter((u) => u._id !== userId);
      return filtered.length === 0 ? null : filtered;
    });
    onUserChangeRef.current?.({ event: "user:removed", payload: userId });
  }, []);

  const updateUser = useCallback(
    (userId: string, user: RefinedUserWithPermission) => {
      setUsers((prev) => {
        if (!prev) return null;
        return prev.map((u) => {
          if (u._id === userId) {
            const updated = { ...u, ...user };
            return updated;
          }
          return u;
        });
      });
      onUserChangeRef.current?.({
        event: "user:updated",
        payload: { userId, user },
      });
    },
    []
  );

  // Memoized label handlers to prevent unnecessary re-renders
  const addLabel = useCallback((label: NewLabel) => {
    const newLabel: Label = {
      ...label,
      _id: "",
      _creationTime: 0,
      map_id: label.map_id!,
      title: label.title ?? "",
      color: label?.color ?? undefined,
      icon: label?.icon ?? null,
      description: label?.description ?? null,
    };

    setLabels((prev) => {
      if (!prev) return [newLabel];
      return [...prev, newLabel];
    });
    onLabelChangeRef.current?.({ event: "label:added", payload: label });
  }, []);

  const removeLabel = useCallback((labelId: string) => {
    setLabels((prev) => {
      if (!prev) return null;
      const filtered = prev.filter((l) => l._id !== labelId);
      return filtered.length === 0 ? null : filtered;
    });
    onLabelChangeRef.current?.({ event: "label:removed", payload: labelId });
  }, []);

  const updateLabel = useCallback((labelId: string, label: NewLabel) => {
    setLabels((prev) => {
      if (!prev) return null;
      return prev.map((l) => {
        if (l._id === labelId) {
          const updated = { ...l, ...label };
          return updated;
        }
        return l;
      });
    });
    onLabelChangeRef.current?.({
      event: "label:updated",
      payload: { labelId, label },
    });
  }, []);

  // Memoize the handleSubmit function to prevent re-creation
  const handleSubmit = useMemo(
    () => form.handleSubmit(onSubmit),
    [form, onSubmit]
  );

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      form,
      onSubmit: handleSubmit,
      users,
      labels,
      addUser,
      removeUser,
      updateUser,
      addLabel,
      removeLabel,
      updateLabel,
    }),
    [
      form,
      handleSubmit,
      users,
      labels,
      addUser,
      removeUser,
      updateUser,
      addLabel,
      removeLabel,
      updateLabel,
    ]
  );

  return (
    <MapFormContext.Provider value={contextValue}>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="size-full relative">
          {children}
        </form>
      </Form>
    </MapFormContext.Provider>
  );
};
