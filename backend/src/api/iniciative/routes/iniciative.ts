// backend/src/api/iniciative/routes/iniciative.ts

export default {
  routes: [
    // ─── Custom routes primero ─────────────────────────────────────────────
    {
      method: "POST",
      path: "/iniciatives/:id/join",
      handler: "iniciative.join",
      config: { policies: [], middlewares: [] },
    },
    {
      method: "DELETE",
      path: "/iniciatives/:id/leave",
      handler: "iniciative.leave",
      config: { policies: [], middlewares: [] },
    },
    // ─── CRUD estándar ─────────────────────────────────────────────────────
    {
      method: "GET",
      path: "/iniciatives",
      handler: "iniciative.find",
      config: { policies: [], middlewares: [] },
    },
    {
      method: "GET",
      path: "/iniciatives/:id",
      handler: "iniciative.findOne",
      config: { policies: [], middlewares: [] },
    },
    {
      method: "POST",
      path: "/iniciatives",
      handler: "iniciative.create",
      config: { policies: [], middlewares: [] },
    },
    {
      method: "PUT",
      path: "/iniciatives/:id",
      handler: "iniciative.update",
      config: { policies: [], middlewares: [] },
    },
    {
      method: "DELETE",
      path: "/iniciatives/:id",
      handler: "iniciative.delete",
      config: { policies: [], middlewares: [] },
    },{
  method: "GET",
  path: "/iniciatives/:id/member-count",
  handler: "iniciative.memberCount",
  config: { policies: [], middlewares: [] },
},
  ],
};