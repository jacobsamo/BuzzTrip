
// import { MapUser, User } from "@buzztrip/db/types";
// import React, { useCallback, useState } from "react";
// import { Command } from "cmdk";
// import { SearchIcon, X } from "lucide-react";

// export interface SearchUsersInputProps {
//   searchValue?: string;
//   onSearchChange?: (searchValue: string) => void;
//   onSubmit: (users: User) => void;
// }

// const SearchUsersInput = ({
//   onSubmit,
//   onSearchChange,
//   searchValue,
// }: SearchUsersInputProps) => {
//   const [query, setQuery] = useState<string>(searchValue ?? "");
//   const [users, setUsers] = useState<User[] | null>(null);

//   const onSearchUsers = useCallback(async () => {
//     if (!query) return;
//     const res = await searchUsersAction({ query });
//     const data = (await res?.data) ?? null;
//     setUsers(data);
//   }, [query]);

//   const onInputChange = useCallback(
//     (value: string) => {
//       if (typeof value === "string") {
//         onSearchChange && onSearchChange(value);
//       }
//     },
//     [onSearchUsers, setQuery]
//   );

//   return (
//     <Command
//       loop
//       className="flex h-full w-full flex-col overflow-hidden rounded-md bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50"
//     >
//       <div className="flex items-center justify-center gap-2 px-3">
//         <SearchIcon className="mr-2 h-5 w-5 shrink-0" />

//         <Command.Input
//           className="flex h-10 w-full rounded-md bg-white py-2 text-base placeholder:text-slate-500 focus:outline-none dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
//           placeholder="Search locations"
//           id="search"
//           value={searchValue ?? ""}
//           onValueChange={onInputChange}
//         />

//         {searchValue && (
//           <button
//             aria-label="clear search results"
//             onClick={() => {
//               setQuery("");
//             }}
//           >
//             <X className="h-5 w-5" />
//           </button>
//         )}
//       </div>

//       <Command.List>
//         {/* {users.length != 0 && (
//               <Command.Empty>No users found</Command.Empty>
//             )}
//             {fetchingData == false &&
//               predictionResults.length != 0 &&
//               predictionResults.map((pred) => (
//                 <Command.Item
//                   key={pred.place_id}
//                   value={pred.description}
//                   onSelect={() => {
//                     onSelect(pred);
//                   }}
//                   // className="select-all pointer-events-auto cursor-pointer"
//                   className="pointer-events-auto relative cursor-pointer select-all items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-slate-100 aria-selected:text-slate-900 dark:aria-selected:bg-slate-800 dark:aria-selected:text-slate-50"
//                 >
//                   {pred.description}
//                 </Command.Item>
//               ))} */}
//       </Command.List>
//     </Command>
//   );
// };

// export default SearchUsersInput;
import React from "react";

const SearchUsers = () => {
  return <div>SearchUsers</div>;
};

export default SearchUsers;
