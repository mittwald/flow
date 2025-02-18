// vite.build.config.ts
import {
  defineConfig as defineConfig2,
  mergeConfig,
} from "file:///Users/marcofalkenberg/dev/flow-next/.yarn/__virtual__/vite-virtual-71f1df5a82/0/cache/vite-npm-6.0.7-8c24f1f180-ae81047b42.zip/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/marcofalkenberg/dev/flow-next/.yarn/__virtual__/vite-plugin-dts-virtual-6e20bcc181/0/cache/vite-plugin-dts-npm-4.5.0-8c6d8fc7b8-3ff9eef0d2.zip/node_modules/vite-plugin-dts/dist/index.mjs";

// vite.config.ts
import path from "path";
import { defineConfig } from "file:///Users/marcofalkenberg/dev/flow-next/.yarn/__virtual__/vite-virtual-71f1df5a82/0/cache/vite-npm-6.0.7-8c24f1f180-ae81047b42.zip/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname =
  "/Users/marcofalkenberg/dev/flow-next/packages/remote-react-renderer";
var vite_config_default = defineConfig({
  resolve: {
    alias: [
      {
        find: /@\//,
        replacement: path.resolve(__vite_injected_original_dirname) + "/src/",
      },
    ],
  },
});

// vite.build.config.ts
import { externalizeDeps } from "file:///Users/marcofalkenberg/dev/flow-next/.yarn/__virtual__/vite-plugin-externalize-deps-virtual-28ba0a0e0d/0/cache/vite-plugin-externalize-deps-npm-0.8.0-e8f6177f06-0ed0d2a85f.zip/node_modules/vite-plugin-externalize-deps/dist/index.js";
var vite_build_config_default = defineConfig2(
  // @todo: fix this type cast
  mergeConfig(vite_config_default, {
    plugins: [
      externalizeDeps(),
      dts({
        include: ["src"],
        outDir: "dist/types",
      }),
    ],
    build: {
      lib: {
        entry: {
          index: "./src/index.ts",
          polyfill: "./src/polyfill.ts",
        },
        formats: ["es"],
      },
    },
  }),
);
export { vite_build_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5idWlsZC5jb25maWcudHMiLCAidml0ZS5jb25maWcudHMiXSwKICAic291cmNlUm9vdCI6ICIvVXNlcnMvbWFyY29mYWxrZW5iZXJnL2Rldi9mbG93LW5leHQvcGFja2FnZXMvcmVtb3RlLXJlYWN0LXJlbmRlcmVyLyIsCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL21hcmNvZmFsa2VuYmVyZy9kZXYvZmxvdy1uZXh0L3BhY2thZ2VzL3JlbW90ZS1yZWFjdC1yZW5kZXJlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL21hcmNvZmFsa2VuYmVyZy9kZXYvZmxvdy1uZXh0L3BhY2thZ2VzL3JlbW90ZS1yZWFjdC1yZW5kZXJlci92aXRlLmJ1aWxkLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbWFyY29mYWxrZW5iZXJnL2Rldi9mbG93LW5leHQvcGFja2FnZXMvcmVtb3RlLXJlYWN0LXJlbmRlcmVyL3ZpdGUuYnVpbGQuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBtZXJnZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgZHRzIGZyb20gXCJ2aXRlLXBsdWdpbi1kdHNcIjtcbmltcG9ydCBiYXNlQ29uZmlnIGZyb20gXCIuL3ZpdGUuY29uZmlnXCI7XG5pbXBvcnQgeyBleHRlcm5hbGl6ZURlcHMgfSBmcm9tIFwidml0ZS1wbHVnaW4tZXh0ZXJuYWxpemUtZGVwc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoXG4gIC8vIEB0b2RvOiBmaXggdGhpcyB0eXBlIGNhc3RcbiAgbWVyZ2VDb25maWcoYmFzZUNvbmZpZywge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIGV4dGVybmFsaXplRGVwcygpLFxuICAgICAgZHRzKHtcbiAgICAgICAgaW5jbHVkZTogW1wic3JjXCJdLFxuICAgICAgICBvdXREaXI6IFwiZGlzdC90eXBlc1wiLFxuICAgICAgfSksXG4gICAgXSxcbiAgICBidWlsZDoge1xuICAgICAgbGliOiB7XG4gICAgICAgIGVudHJ5OiB7XG4gICAgICAgICAgaW5kZXg6IFwiLi9zcmMvaW5kZXgudHNcIixcbiAgICAgICAgICBwb2x5ZmlsbDogXCIuL3NyYy9wb2x5ZmlsbC50c1wiLFxuICAgICAgICB9LFxuICAgICAgICBmb3JtYXRzOiBbXCJlc1wiXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSksXG4pO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWFyY29mYWxrZW5iZXJnL2Rldi9mbG93LW5leHQvcGFja2FnZXMvcmVtb3RlLXJlYWN0LXJlbmRlcmVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbWFyY29mYWxrZW5iZXJnL2Rldi9mbG93LW5leHQvcGFja2FnZXMvcmVtb3RlLXJlYWN0LXJlbmRlcmVyL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tYXJjb2ZhbGtlbmJlcmcvZGV2L2Zsb3ctbmV4dC9wYWNrYWdlcy9yZW1vdGUtcmVhY3QtcmVuZGVyZXIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiBbXG4gICAgICB7XG4gICAgICAgIGZpbmQ6IC9AXFwvLyxcbiAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUpICsgXCIvc3JjL1wiLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVZLFNBQVMsZ0JBQUFBLGVBQWMsbUJBQW1CO0FBQ2piLE9BQU8sU0FBUzs7O0FDRDJXLE9BQU8sVUFBVTtBQUM1WSxTQUFTLG9CQUFvQjtBQUQ3QixJQUFNLG1DQUFtQztBQUd6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTDtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sYUFBYSxLQUFLLFFBQVEsZ0NBQVMsSUFBSTtBQUFBLE1BQ3pDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOzs7QURURCxTQUFTLHVCQUF1QjtBQUVoQyxJQUFPLDRCQUFRQztBQUFBO0FBQUEsRUFFYixZQUFZLHFCQUFZO0FBQUEsSUFDdEIsU0FBUztBQUFBLE1BQ1AsZ0JBQWdCO0FBQUEsTUFDaEIsSUFBSTtBQUFBLFFBQ0YsU0FBUyxDQUFDLEtBQUs7QUFBQSxRQUNmLFFBQVE7QUFBQSxNQUNWLENBQUM7QUFBQSxJQUNIO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxLQUFLO0FBQUEsUUFDSCxPQUFPO0FBQUEsVUFDTCxPQUFPO0FBQUEsVUFDUCxVQUFVO0FBQUEsUUFDWjtBQUFBLFFBQ0EsU0FBUyxDQUFDLElBQUk7QUFBQSxNQUNoQjtBQUFBLElBQ0Y7QUFBQSxFQUNGLENBQUM7QUFDSDsiLAogICJuYW1lcyI6IFsiZGVmaW5lQ29uZmlnIiwgImRlZmluZUNvbmZpZyJdCn0K
