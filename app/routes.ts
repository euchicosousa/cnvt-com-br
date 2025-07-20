import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("ferramentas", "./routes/ferramentas.tsx"),
] satisfies RouteConfig;
