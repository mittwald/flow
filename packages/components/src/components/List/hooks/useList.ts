import { useContext } from "react";
import { listContext } from "@/components/List/listContext";

export const useList = () => useContext(listContext).list;
