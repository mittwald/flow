interface RemoteComponentGeneratorConfigComponent {
  ignore?: boolean;
  ignoreProps?: string[];
}

export interface RemoteComponentGeneratorConfig {
  components: Record<string, RemoteComponentGeneratorConfigComponent>;
  ignoreProps: string[];
}
