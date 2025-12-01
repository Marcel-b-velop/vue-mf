import type { DefineComponent } from "vue";

export interface FooDialogProps {
  /** Sichtbarkeit des Dialogs (v-model:visible) */
  visible: boolean;
  /** Vorselektierte Filialnummern (v-model) */
  modelValue?: string[];
}

export interface FooDialogEmits {
  /** Wird beim Schließen des Dialogs emittiert */
  (e: "onClose"): void;
  /** Wird beim Hinzufügen der Auswahl emittiert, enthält die ausgewählten Filialnummern */
  (e: "onAdd", payload: string[]): void;
  /** v-model:visible Update */
  (e: "update:visible", value: boolean): void;
  /** v-model Update für Selection */
  (e: "update:modelValue", value: string[]): void;
}

declare const FooDialog: DefineComponent<FooDialogProps, object, object, object, object, object, object, FooDialogEmits>;

export default FooDialog;

