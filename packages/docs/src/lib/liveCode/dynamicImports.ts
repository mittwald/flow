/* eslint-disable */
/* auto-generated file */
import { ImportMapping } from "@/lib/liveCode/types";
import { lazy } from "react";
import { ExampleSvg as I0 } from "@/content/01-getting-started/stylesheet/examples/components/ExampleSvg";
import { Button as I1 } from "@mittwald/flow-react-components/Button";
import { IconHome as I2 } from "@mittwald/flow-react-components/Icons";
import { Text as I3 } from "@mittwald/flow-react-components/Text";
import { IconChevronDown as I4 } from "@mittwald/flow-react-components/Icons";
import { CopyButton as I5 } from "@mittwald/flow-react-components/CopyButton";
import { ButtonGroup as I6 } from "@mittwald/flow-react-components/ButtonGroup";
import { ColumnLayout as I7 } from "@mittwald/flow-react-components/ColumnLayout";
import { TextField as I8 } from "@mittwald/flow-react-components/TextField";
import { Label as I9 } from "@mittwald/flow-react-components/Label";
import { Avatar as I10 } from "@mittwald/flow-react-components/Avatar";
import { Initials as I11 } from "@mittwald/flow-react-components/Initials";
import { IconCustomer as I12 } from "@mittwald/flow-react-components/Icons";
import { Image as I13 } from "@mittwald/flow-react-components/Image";
import { Heading as I14 } from "@mittwald/flow-react-components/Heading";
import { IconMember as I15 } from "@mittwald/flow-react-components/Icons";
import { Icon as I16 } from "@mittwald/flow-react-components/Icon";
import { IconStar as I17 } from "@tabler/icons-react";
import { InlineCode as I18 } from "@mittwald/flow-react-components/InlineCode";
import { LabeledValue as I19 } from "@mittwald/flow-react-components/LabeledValue";
import { Content as I20 } from "@mittwald/flow-react-components/Content";
import { Link as I21 } from "@mittwald/flow-react-components/Link";
import { Checkbox as I22 } from "@mittwald/flow-react-components/Checkbox";
import { NumberField as I23 } from "@mittwald/flow-react-components/NumberField";
import { RadioGroup as I24 } from "@mittwald/flow-react-components/RadioGroup";
import { Radio as I25 } from "@mittwald/flow-react-components/RadioGroup";
import { Switch as I26 } from "@mittwald/flow-react-components/Switch";
import { FieldDescription as I27 } from "@mittwald/flow-react-components/FieldDescription";
import { TextArea as I28 } from "@mittwald/flow-react-components/TextArea";
import { Navigation as I29 } from "@mittwald/flow-react-components/Navigation";
import { NavigationItem as I30 } from "@mittwald/flow-react-components/Navigation";
import { IconProject as I31 } from "@mittwald/flow-react-components/Icons";
import { IconServer as I32 } from "@mittwald/flow-react-components/Icons";
import { Modal as I33 } from "@mittwald/flow-react-components/Modal";
import { ModalTrigger as I34 } from "@mittwald/flow-react-components/Modal";
import { Tooltip as I35 } from "@mittwald/flow-react-components/Tooltip";
import { TooltipTrigger as I36 } from "@mittwald/flow-react-components/Tooltip";
import { IconCopy as I37 } from "@mittwald/flow-react-components/Icons";
import { InlineAlert as I38 } from "@mittwald/flow-react-components/InlineAlert";
import { StatusBadge as I39 } from "@mittwald/flow-react-components/StatusBadge";
import { StatusIcon as I40 } from "@mittwald/flow-react-components/StatusIcon";
import { LayoutCard as I41 } from "@mittwald/flow-react-components/LayoutCard";
import { List as I42 } from "@mittwald/flow-react-components/List";
import { ListItemView as I43 } from "@mittwald/flow-react-components/List";
import { ListStaticData as I44 } from "@mittwald/flow-react-components/List";
import { users as I45 } from "@/content/02-components/structure/list/examples/userApi";
import { Section as I46 } from "@mittwald/flow-react-components/Section";
import { Header as I47 } from "@mittwald/flow-react-components/Header";

export const liveCodeEditorGlobalImports: ImportMapping = {
  "ExampleSvg:@/content/01-getting-started/stylesheet/examples/components/ExampleSvg": I0,
"Button:@mittwald/flow-react-components/Button": I1,
"IconHome:@mittwald/flow-react-components/Icons": I2,
"Text:@mittwald/flow-react-components/Text": I3,
"IconChevronDown:@mittwald/flow-react-components/Icons": I4,
"CopyButton:@mittwald/flow-react-components/CopyButton": I5,
"ButtonGroup:@mittwald/flow-react-components/ButtonGroup": I6,
"ColumnLayout:@mittwald/flow-react-components/ColumnLayout": I7,
"TextField:@mittwald/flow-react-components/TextField": I8,
"Label:@mittwald/flow-react-components/Label": I9,
"Avatar:@mittwald/flow-react-components/Avatar": I10,
"Initials:@mittwald/flow-react-components/Initials": I11,
"IconCustomer:@mittwald/flow-react-components/Icons": I12,
"Image:@mittwald/flow-react-components/Image": I13,
"Heading:@mittwald/flow-react-components/Heading": I14,
"IconMember:@mittwald/flow-react-components/Icons": I15,
"Icon:@mittwald/flow-react-components/Icon": I16,
"IconStar:@tabler/icons-react": I17,
"InlineCode:@mittwald/flow-react-components/InlineCode": I18,
"LabeledValue:@mittwald/flow-react-components/LabeledValue": I19,
"Content:@mittwald/flow-react-components/Content": I20,
"Link:@mittwald/flow-react-components/Link": I21,
"Checkbox:@mittwald/flow-react-components/Checkbox": I22,
"NumberField:@mittwald/flow-react-components/NumberField": I23,
"RadioGroup:@mittwald/flow-react-components/RadioGroup": I24,
"Radio:@mittwald/flow-react-components/RadioGroup": I25,
"Switch:@mittwald/flow-react-components/Switch": I26,
"FieldDescription:@mittwald/flow-react-components/FieldDescription": I27,
"TextArea:@mittwald/flow-react-components/TextArea": I28,
"Navigation:@mittwald/flow-react-components/Navigation": I29,
"NavigationItem:@mittwald/flow-react-components/Navigation": I30,
"IconProject:@mittwald/flow-react-components/Icons": I31,
"IconServer:@mittwald/flow-react-components/Icons": I32,
"Modal:@mittwald/flow-react-components/Modal": I33,
"ModalTrigger:@mittwald/flow-react-components/Modal": I34,
"Tooltip:@mittwald/flow-react-components/Tooltip": I35,
"TooltipTrigger:@mittwald/flow-react-components/Tooltip": I36,
"IconCopy:@mittwald/flow-react-components/Icons": I37,
"InlineAlert:@mittwald/flow-react-components/InlineAlert": I38,
"StatusBadge:@mittwald/flow-react-components/StatusBadge": I39,
"StatusIcon:@mittwald/flow-react-components/StatusIcon": I40,
"LayoutCard:@mittwald/flow-react-components/LayoutCard": I41,
"List:@mittwald/flow-react-components/List": I42,
"ListItemView:@mittwald/flow-react-components/List": I43,
"ListStaticData:@mittwald/flow-react-components/List": I44,
"users:@/content/02-components/structure/list/examples/userApi": I45,
"Section:@mittwald/flow-react-components/Section": I46,
"Header:@mittwald/flow-react-components/Header": I47,
};