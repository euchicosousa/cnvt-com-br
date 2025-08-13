import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("ferramentas", "./routes/ferramentas.tsx"),
  route("pct", "./routes/pct.tsx"),
] satisfies RouteConfig;
