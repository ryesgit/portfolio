import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("admin", "routes/admin.tsx"),
  route("post/:slug", "routes/post.$slug.tsx"),
  route("sitemap.xml", "routes/sitemap[.]xml.ts"),
] satisfies RouteConfig;
