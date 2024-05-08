// vite.build.config.ts
import { defineConfig as defineConfig2, mergeConfig } from "file:///Users/mfullriede/PhpstormProjects/frontend/flow-next/.yarn/__virtual__/vite-virtual-3011555480/0/cache/vite-npm-5.2.11-fa468e8533-664b8d68e4.zip/node_modules/vite/dist/node/index.js";
import banner from "file:///Users/mfullriede/PhpstormProjects/frontend/flow-next/.yarn/cache/vite-plugin-banner-npm-0.7.1-d34e69a97b-b638585503.zip/node_modules/vite-plugin-banner/dist/index.mjs";
import dts from "file:///Users/mfullriede/PhpstormProjects/frontend/flow-next/.yarn/__virtual__/vite-plugin-dts-virtual-456a011dbf/0/cache/vite-plugin-dts-npm-3.9.0-ba62e1150c-6f0e0d0262.zip/node_modules/vite-plugin-dts/dist/index.mjs";

// vite.config.ts
import { defineConfig } from "file:///Users/mfullriede/PhpstormProjects/frontend/flow-next/.yarn/__virtual__/vite-virtual-3011555480/0/cache/vite-npm-5.2.11-fa468e8533-664b8d68e4.zip/node_modules/vite/dist/node/index.js";
import path from "path";
var __vite_injected_original_dirname = "/Users/mfullriede/PhpstormProjects/frontend/flow-next/packages/react-tunnel";
var vite_config_default = defineConfig({
  resolve: {
    alias: [
      {
        find: /@\//,
        replacement: path.resolve(__vite_injected_original_dirname) + "/src/"
      }
    ]
  }
});

// vite.build.config.ts
import { externalizeDeps } from "file:///Users/mfullriede/PhpstormProjects/frontend/flow-next/.yarn/__virtual__/vite-plugin-externalize-deps-virtual-c3c2e780d1/0/cache/vite-plugin-externalize-deps-npm-0.8.0-e8f6177f06-0ed0d2a85f.zip/node_modules/vite-plugin-externalize-deps/dist/index.js";
var vite_build_config_default = defineConfig2(
  mergeConfig(vite_config_default, {
    plugins: [
      banner(
        (filename) => filename.endsWith(".js") ? '"use client"\r\n/* */' : ""
      ),
      externalizeDeps(),
      dts({
        include: ["src"],
        outDir: "dist/types"
      })
    ],
    build: {
      lib: {
        entry: {
          index: "./src/index.ts"
        },
        formats: ["es"]
      }
    }
  })
);
export {
  vite_build_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5idWlsZC5jb25maWcudHMiLCAidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWZ1bGxyaWVkZS9QaHBzdG9ybVByb2plY3RzL2Zyb250ZW5kL2Zsb3ctbmV4dC9wYWNrYWdlcy9yZWFjdC10dW5uZWxcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9tZnVsbHJpZWRlL1BocHN0b3JtUHJvamVjdHMvZnJvbnRlbmQvZmxvdy1uZXh0L3BhY2thZ2VzL3JlYWN0LXR1bm5lbC92aXRlLmJ1aWxkLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbWZ1bGxyaWVkZS9QaHBzdG9ybVByb2plY3RzL2Zyb250ZW5kL2Zsb3ctbmV4dC9wYWNrYWdlcy9yZWFjdC10dW5uZWwvdml0ZS5idWlsZC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIG1lcmdlQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCBiYW5uZXIgZnJvbSBcInZpdGUtcGx1Z2luLWJhbm5lclwiO1xuaW1wb3J0IGR0cyBmcm9tIFwidml0ZS1wbHVnaW4tZHRzXCI7XG5pbXBvcnQgYmFzZUNvbmZpZyBmcm9tIFwiLi92aXRlLmNvbmZpZ1wiO1xuaW1wb3J0IHsgZXh0ZXJuYWxpemVEZXBzIH0gZnJvbSBcInZpdGUtcGx1Z2luLWV4dGVybmFsaXplLWRlcHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKFxuICBtZXJnZUNvbmZpZyhiYXNlQ29uZmlnLCB7XG4gICAgcGx1Z2luczogW1xuICAgICAgYmFubmVyKChmaWxlbmFtZSkgPT5cbiAgICAgICAgZmlsZW5hbWUuZW5kc1dpdGgoXCIuanNcIikgPyAnXCJ1c2UgY2xpZW50XCJcXHJcXG4vKiAqLycgOiBcIlwiLFxuICAgICAgKSxcbiAgICAgIGV4dGVybmFsaXplRGVwcygpLFxuICAgICAgZHRzKHtcbiAgICAgICAgaW5jbHVkZTogW1wic3JjXCJdLFxuICAgICAgICBvdXREaXI6IFwiZGlzdC90eXBlc1wiLFxuICAgICAgfSksXG4gICAgXSxcbiAgICBidWlsZDoge1xuICAgICAgbGliOiB7XG4gICAgICAgIGVudHJ5OiB7XG4gICAgICAgICAgaW5kZXg6IFwiLi9zcmMvaW5kZXgudHNcIixcbiAgICAgICAgfSxcbiAgICAgICAgZm9ybWF0czogW1wiZXNcIl0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pLFxuKTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL21mdWxscmllZGUvUGhwc3Rvcm1Qcm9qZWN0cy9mcm9udGVuZC9mbG93LW5leHQvcGFja2FnZXMvcmVhY3QtdHVubmVsXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbWZ1bGxyaWVkZS9QaHBzdG9ybVByb2plY3RzL2Zyb250ZW5kL2Zsb3ctbmV4dC9wYWNrYWdlcy9yZWFjdC10dW5uZWwvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL21mdWxscmllZGUvUGhwc3Rvcm1Qcm9qZWN0cy9mcm9udGVuZC9mbG93LW5leHQvcGFja2FnZXMvcmVhY3QtdHVubmVsL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczogW1xuICAgICAge1xuICAgICAgICBmaW5kOiAvQFxcLy8sXG4gICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lKSArIFwiL3NyYy9cIixcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUErWixTQUFTLGdCQUFBQSxlQUFjLG1CQUFtQjtBQUN6YyxPQUFPLFlBQVk7QUFDbkIsT0FBTyxTQUFTOzs7QUNGbVksU0FBUyxvQkFBb0I7QUFDaGIsT0FBTyxVQUFVO0FBRGpCLElBQU0sbUNBQW1DO0FBR3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixhQUFhLEtBQUssUUFBUSxnQ0FBUyxJQUFJO0FBQUEsTUFDekM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7OztBRFJELFNBQVMsdUJBQXVCO0FBRWhDLElBQU8sNEJBQVFDO0FBQUEsRUFDYixZQUFZLHFCQUFZO0FBQUEsSUFDdEIsU0FBUztBQUFBLE1BQ1A7QUFBQSxRQUFPLENBQUMsYUFDTixTQUFTLFNBQVMsS0FBSyxJQUFJLDBCQUEwQjtBQUFBLE1BQ3ZEO0FBQUEsTUFDQSxnQkFBZ0I7QUFBQSxNQUNoQixJQUFJO0FBQUEsUUFDRixTQUFTLENBQUMsS0FBSztBQUFBLFFBQ2YsUUFBUTtBQUFBLE1BQ1YsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLEtBQUs7QUFBQSxRQUNILE9BQU87QUFBQSxVQUNMLE9BQU87QUFBQSxRQUNUO0FBQUEsUUFDQSxTQUFTLENBQUMsSUFBSTtBQUFBLE1BQ2hCO0FBQUEsSUFDRjtBQUFBLEVBQ0YsQ0FBQztBQUNIOyIsCiAgIm5hbWVzIjogWyJkZWZpbmVDb25maWciLCAiZGVmaW5lQ29uZmlnIl0KfQo=
