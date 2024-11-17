"use client";
// import * as Accordion from "@radix-ui/react-accordion";
// import CollectionCard from "../collection_card";
import MainView from "./main-view";
import { Sidebar } from "@/components/ui/sidebar";

const MapSideBar = () => {
  return (
    <div className="h-vh flex w-96 flex-col bg-background">
      <MainView />
    </div>
  );
};

export default MapSideBar;
