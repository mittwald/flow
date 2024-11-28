// vite.build.config.ts
import { defineConfig as defineConfig2, mergeConfig } from "file:///Users/marcofalkenberg/dev/flow-next/.yarn/__virtual__/vite-virtual-dec0fe7e1e/0/cache/vite-npm-5.4.11-9da365ef2b-d536bb7af5.zip/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/marcofalkenberg/dev/flow-next/.yarn/__virtual__/vite-plugin-dts-virtual-31111e1961/0/cache/vite-plugin-dts-npm-4.3.0-1dfd079f3c-e200fa54b9.zip/node_modules/vite-plugin-dts/dist/index.mjs";

// vite.config.ts
import path from "path";
import { defineConfig } from "file:///Users/marcofalkenberg/dev/flow-next/.yarn/__virtual__/vite-virtual-dec0fe7e1e/0/cache/vite-npm-5.4.11-9da365ef2b-d536bb7af5.zip/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "/Users/marcofalkenberg/dev/flow-next/packages/remote-react-renderer";
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
import { externalizeDeps } from "file:///Users/marcofalkenberg/dev/flow-next/.yarn/__virtual__/vite-plugin-externalize-deps-virtual-b7364a424e/0/cache/vite-plugin-externalize-deps-npm-0.8.0-e8f6177f06-0ed0d2a85f.zip/node_modules/vite-plugin-externalize-deps/dist/index.js";
var vite_build_config_default = defineConfig2(
  // @todo: fix this type cast
  mergeConfig(vite_config_default, {
    plugins: [
      externalizeDeps(),
      dts({
        include: ["src"],
        outDir: "dist/types"
      })
    ],
    build: {
      lib: {
        entry: {
          index: "./src/index.ts",
          polyfill: "./src/polyfill.ts",
          "react-hook-form": "./src/integrations/react-hook-form/index.ts"
        },
        formats: ["es"]
      }
    }
  })
);
export {
  vite_build_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5idWlsZC5jb25maWcudHMiLCAidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWFyY29mYWxrZW5iZXJnL2Rldi9mbG93LW5leHQvcGFja2FnZXMvcmVtb3RlLXJlYWN0LXJlbmRlcmVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbWFyY29mYWxrZW5iZXJnL2Rldi9mbG93LW5leHQvcGFja2FnZXMvcmVtb3RlLXJlYWN0LXJlbmRlcmVyL3ZpdGUuYnVpbGQuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tYXJjb2ZhbGtlbmJlcmcvZGV2L2Zsb3ctbmV4dC9wYWNrYWdlcy9yZW1vdGUtcmVhY3QtcmVuZGVyZXIvdml0ZS5idWlsZC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIG1lcmdlQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCBkdHMgZnJvbSBcInZpdGUtcGx1Z2luLWR0c1wiO1xuaW1wb3J0IGJhc2VDb25maWcgZnJvbSBcIi4vdml0ZS5jb25maWdcIjtcbmltcG9ydCB7IGV4dGVybmFsaXplRGVwcyB9IGZyb20gXCJ2aXRlLXBsdWdpbi1leHRlcm5hbGl6ZS1kZXBzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyhcbiAgLy8gQHRvZG86IGZpeCB0aGlzIHR5cGUgY2FzdFxuICBtZXJnZUNvbmZpZyhiYXNlQ29uZmlnLCB7XG4gICAgcGx1Z2luczogW1xuICAgICAgZXh0ZXJuYWxpemVEZXBzKCksXG4gICAgICBkdHMoe1xuICAgICAgICBpbmNsdWRlOiBbXCJzcmNcIl0sXG4gICAgICAgIG91dERpcjogXCJkaXN0L3R5cGVzXCIsXG4gICAgICB9KSxcbiAgICBdLFxuICAgIGJ1aWxkOiB7XG4gICAgICBsaWI6IHtcbiAgICAgICAgZW50cnk6IHtcbiAgICAgICAgICBpbmRleDogXCIuL3NyYy9pbmRleC50c1wiLFxuICAgICAgICAgIHBvbHlmaWxsOiBcIi4vc3JjL3BvbHlmaWxsLnRzXCIsXG4gICAgICAgICAgXCJyZWFjdC1ob29rLWZvcm1cIjogXCIuL3NyYy9pbnRlZ3JhdGlvbnMvcmVhY3QtaG9vay1mb3JtL2luZGV4LnRzXCIsXG4gICAgICAgIH0sXG4gICAgICAgIGZvcm1hdHM6IFtcImVzXCJdLFxuICAgICAgfSxcbiAgICB9LFxuICB9KSxcbik7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9tYXJjb2ZhbGtlbmJlcmcvZGV2L2Zsb3ctbmV4dC9wYWNrYWdlcy9yZW1vdGUtcmVhY3QtcmVuZGVyZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9tYXJjb2ZhbGtlbmJlcmcvZGV2L2Zsb3ctbmV4dC9wYWNrYWdlcy9yZW1vdGUtcmVhY3QtcmVuZGVyZXIvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL21hcmNvZmFsa2VuYmVyZy9kZXYvZmxvdy1uZXh0L3BhY2thZ2VzL3JlbW90ZS1yZWFjdC1yZW5kZXJlci92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IFtcbiAgICAgIHtcbiAgICAgICAgZmluZDogL0BcXC8vLFxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSkgKyBcIi9zcmMvXCIsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVksU0FBUyxnQkFBQUEsZUFBYyxtQkFBbUI7QUFDamIsT0FBTyxTQUFTOzs7QUNEMlcsT0FBTyxVQUFVO0FBQzVZLFNBQVMsb0JBQW9CO0FBRDdCLElBQU0sbUNBQW1DO0FBR3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixhQUFhLEtBQUssUUFBUSxnQ0FBUyxJQUFJO0FBQUEsTUFDekM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7OztBRFRELFNBQVMsdUJBQXVCO0FBRWhDLElBQU8sNEJBQVFDO0FBQUE7QUFBQSxFQUViLFlBQVkscUJBQVk7QUFBQSxJQUN0QixTQUFTO0FBQUEsTUFDUCxnQkFBZ0I7QUFBQSxNQUNoQixJQUFJO0FBQUEsUUFDRixTQUFTLENBQUMsS0FBSztBQUFBLFFBQ2YsUUFBUTtBQUFBLE1BQ1YsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLEtBQUs7QUFBQSxRQUNILE9BQU87QUFBQSxVQUNMLE9BQU87QUFBQSxVQUNQLFVBQVU7QUFBQSxVQUNWLG1CQUFtQjtBQUFBLFFBQ3JCO0FBQUEsUUFDQSxTQUFTLENBQUMsSUFBSTtBQUFBLE1BQ2hCO0FBQUEsSUFDRjtBQUFBLEVBQ0YsQ0FBQztBQUNIOyIsCiAgIm5hbWVzIjogWyJkZWZpbmVDb25maWciLCAiZGVmaW5lQ29uZmlnIl0KfQo=
