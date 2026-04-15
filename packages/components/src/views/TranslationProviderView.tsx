/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  TranslationProvider,
  type TranslationProviderProps,
} from "@/components/TranslationProvider/TranslationProvider";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TranslationProviderView: FC<TranslationProviderProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["TranslationProvider"] ??
    TranslationProvider;
  return <View {...props} />;
});
TranslationProviderView.displayName = "TranslationProviderView";

export default TranslationProviderView;
