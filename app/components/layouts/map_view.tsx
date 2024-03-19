// "use client";
// import { Tables } from "database.types";
// import { PlusIcon } from "lucide-react";
// import Map from "../map";

// interface MainLayoutProps {
//   markers: Tables<"marker">[];
//   collections: Tables<"collection">[];
// }

// const MapView = ({collections, markers}: MainLayoutProps) => {


//   return (
//     <>
//       <Map  />

//       <MainDrawer>
//         {activeLocation === null && (
//           <>
//             <Main />
//             <EditCollectionDialog
//               Trigger={
//                 <>
//                   <PlusIcon />
//                 </>
//               }
//             />
//           </>
//         )}

//         {activeLocation !== null && !addCollectionOpen && <ActiveLocation />}

//         {addCollectionOpen && <AddToCollection />}
//       </MainDrawer>
//     </>
//   );
// };

// export default MapView;
