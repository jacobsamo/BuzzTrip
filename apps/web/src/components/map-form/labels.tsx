//TODO: Create a component to create, update and delete labels
import { useMapFormContext } from "./provider";

const MapLabelsForm = () => {
  const { form: control } = useMapFormContext();
  // const { fields, append, remove, move } = useFieldArray({
  //   control: control,
  //   name: "labels",
  // });

  // const handleDelete = useCallback(
  //   (index: number) => {
  //     remove(index);
  //   },
  //   [remove]
  // );

  // const handleAddClick = useCallback(() => {
  //   append({ title: "", icon: "MapPin", map_id: "" });
  // }, [append]);

  // return (
  //   <div className="space-y-4">
  //     <Button type="button" onClick={handleAddClick}>
  //       <Plus className="mr-2 h-4 w-4" /> Add Label
  //     </Button>
  //     {fields.map((field, index: number) => {
  //       return (
  //         <div key={field.id}>
  //           <FormField
  //             control={control}
  //             name={`labels.${index}.title`}
  //             rules={{ required: true }}
  //             render={({ field }) => (
  //               <FormItem>
  //                 <FormLabel>Title</FormLabel>
  //                 <FormControl>
  //                   <Input placeholder="Enter map title" {...field} />
  //                 </FormControl>
  //                 <FormMessage />
  //               </FormItem>
  //             )}
  //           />

  //           <Button
  //             onClick={() => handleDelete(index)}
  //             variant="destructive"
  //             size="icon"
  //           >
  //             <Trash className="h-4 w-4" />
  //           </Button>
  //         </div>
  //       );
  //     })}
  //   </div>
  // );
  return <h1>MapLabelsForm</h1>;
};

export default MapLabelsForm;
