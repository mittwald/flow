// vite.build.config.ts
import { defineConfig as defineConfig2, mergeConfig } from "file:///Users/marcofalkenberg/dev/flow-next/.yarn/__virtual__/vite-virtual-1c5278e3ce/0/cache/vite-npm-5.4.11-9da365ef2b-d536bb7af5.zip/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/marcofalkenberg/dev/flow-next/.yarn/__virtual__/vite-plugin-dts-virtual-e02c8004e9/0/cache/vite-plugin-dts-npm-4.3.0-1dfd079f3c-e200fa54b9.zip/node_modules/vite-plugin-dts/dist/index.mjs";

// vite.config.ts
import path from "path";
import { defineConfig } from "file:///Users/marcofalkenberg/dev/flow-next/.yarn/__virtual__/vite-virtual-1c5278e3ce/0/cache/vite-npm-5.4.11-9da365ef2b-d536bb7af5.zip/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "/Users/marcofalkenberg/dev/flow-next/packages/remote-react-components";
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
import { externalizeDeps } from "file:///Users/marcofalkenberg/dev/flow-next/.yarn/__virtual__/vite-plugin-externalize-deps-virtual-d8384806c1/0/cache/vite-plugin-externalize-deps-npm-0.8.0-e8f6177f06-0ed0d2a85f.zip/node_modules/vite-plugin-externalize-deps/dist/index.js";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5idWlsZC5jb25maWcudHMiLCAidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWFyY29mYWxrZW5iZXJnL2Rldi9mbG93LW5leHQvcGFja2FnZXMvcmVtb3RlLXJlYWN0LWNvbXBvbmVudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9tYXJjb2ZhbGtlbmJlcmcvZGV2L2Zsb3ctbmV4dC9wYWNrYWdlcy9yZW1vdGUtcmVhY3QtY29tcG9uZW50cy92aXRlLmJ1aWxkLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbWFyY29mYWxrZW5iZXJnL2Rldi9mbG93LW5leHQvcGFja2FnZXMvcmVtb3RlLXJlYWN0LWNvbXBvbmVudHMvdml0ZS5idWlsZC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIG1lcmdlQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCBkdHMgZnJvbSBcInZpdGUtcGx1Z2luLWR0c1wiO1xuaW1wb3J0IGJhc2VDb25maWcgZnJvbSBcIi4vdml0ZS5jb25maWdcIjtcbmltcG9ydCB7IGV4dGVybmFsaXplRGVwcyB9IGZyb20gXCJ2aXRlLXBsdWdpbi1leHRlcm5hbGl6ZS1kZXBzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyhcbiAgLy8gQHRvZG86IGZpeCB0aGlzIHR5cGUgY2FzdFxuICBtZXJnZUNvbmZpZyhiYXNlQ29uZmlnLCB7XG4gICAgcGx1Z2luczogW1xuICAgICAgZXh0ZXJuYWxpemVEZXBzKCksXG4gICAgICBkdHMoe1xuICAgICAgICBpbmNsdWRlOiBbXCJzcmNcIl0sXG4gICAgICAgIG91dERpcjogXCJkaXN0L3R5cGVzXCIsXG4gICAgICB9KSxcbiAgICBdLFxuICAgIGJ1aWxkOiB7XG4gICAgICBsaWI6IHtcbiAgICAgICAgZW50cnk6IHtcbiAgICAgICAgICBpbmRleDogXCIuL3NyYy9pbmRleC50c1wiLFxuICAgICAgICAgIFwicmVhY3QtaG9vay1mb3JtXCI6IFwiLi9zcmMvaW50ZWdyYXRpb25zL3JlYWN0LWhvb2stZm9ybS9pbmRleC50c1wiLFxuICAgICAgICB9LFxuICAgICAgICBmb3JtYXRzOiBbXCJlc1wiXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSksXG4pO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWFyY29mYWxrZW5iZXJnL2Rldi9mbG93LW5leHQvcGFja2FnZXMvcmVtb3RlLXJlYWN0LWNvbXBvbmVudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9tYXJjb2ZhbGtlbmJlcmcvZGV2L2Zsb3ctbmV4dC9wYWNrYWdlcy9yZW1vdGUtcmVhY3QtY29tcG9uZW50cy92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbWFyY29mYWxrZW5iZXJnL2Rldi9mbG93LW5leHQvcGFja2FnZXMvcmVtb3RlLXJlYWN0LWNvbXBvbmVudHMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiBbXG4gICAgICB7XG4gICAgICAgIGZpbmQ6IC9AXFwvLyxcbiAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUpICsgXCIvc3JjL1wiLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZZLFNBQVMsZ0JBQUFBLGVBQWMsbUJBQW1CO0FBQ3ZiLE9BQU8sU0FBUzs7O0FDRGlYLE9BQU8sVUFBVTtBQUNsWixTQUFTLG9CQUFvQjtBQUQ3QixJQUFNLG1DQUFtQztBQUd6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTDtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sYUFBYSxLQUFLLFFBQVEsZ0NBQVMsSUFBSTtBQUFBLE1BQ3pDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOzs7QURURCxTQUFTLHVCQUF1QjtBQUVoQyxJQUFPLDRCQUFRQztBQUFBO0FBQUEsRUFFYixZQUFZLHFCQUFZO0FBQUEsSUFDdEIsU0FBUztBQUFBLE1BQ1AsZ0JBQWdCO0FBQUEsTUFDaEIsSUFBSTtBQUFBLFFBQ0YsU0FBUyxDQUFDLEtBQUs7QUFBQSxRQUNmLFFBQVE7QUFBQSxNQUNWLENBQUM7QUFBQSxJQUNIO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxLQUFLO0FBQUEsUUFDSCxPQUFPO0FBQUEsVUFDTCxPQUFPO0FBQUEsVUFDUCxtQkFBbUI7QUFBQSxRQUNyQjtBQUFBLFFBQ0EsU0FBUyxDQUFDLElBQUk7QUFBQSxNQUNoQjtBQUFBLElBQ0Y7QUFBQSxFQUNGLENBQUM7QUFDSDsiLAogICJuYW1lcyI6IFsiZGVmaW5lQ29uZmlnIiwgImRlZmluZUNvbmZpZyJdCn0K
