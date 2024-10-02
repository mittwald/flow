import { useContext } from "react";
import { listContext } from "@/components/List/listContext";
import type List from "@/components/List/model/List";

export const useList = <T = never>() =>
  useContext(listContext).list as unknown as List<T>;
