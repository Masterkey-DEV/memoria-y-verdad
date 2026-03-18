import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::iniciative.iniciative",
  ({ strapi }) => ({

    async memberCount(ctx) {
  const { id: documentId } = ctx.params;

  const initiative = await strapi
    .documents("api::iniciative.iniciative")
    .findOne({
      documentId,
      populate: { users: { fields: ["id"] } },
    });

  if (!initiative) return ctx.notFound("Iniciativa no encontrada");

  const count = ((initiative as any).users ?? []).length;

  return ctx.send({ count });
},

    async create(ctx) {
      if (!ctx.state.user) return ctx.unauthorized("Debes estar autenticado");
      const { id: userId, role } = ctx.state.user;

      if (role.name !== "foundation")
        return ctx.forbidden("Solo fundaciones pueden crear iniciativas");

      const foundations = await strapi
        .documents("api::foundation.foundation")
        .findMany({ filters: { usuario: userId } as any });

      if (!foundations.length)
        return ctx.badRequest("No tienes una fundación registrada");

      const created = await strapi
        .documents("api::iniciative.iniciative")
        .create({
          data: {
            ...(ctx.request.body as any).data,
            foundation: foundations[0].documentId,
          },
          status: 'published', // ✅ Esto hace que se cree y publique de inmediato
        });

      const sanitized = await this.sanitizeOutput(created, ctx);
      return this.transformResponse(sanitized);
    },

    async join(ctx) {
      if (!ctx.state.user) return ctx.unauthorized("Debes estar autenticado");
      const { id: userId, role } = ctx.state.user;
      const { id: documentId } = ctx.params;

      if (role.name !== "member")
        return ctx.forbidden('Solo usuarios con rol "member" pueden unirse');

      const initiative = await strapi
        .documents("api::iniciative.iniciative")
        .findOne({ documentId, populate: { users: { fields: ["id"] } } });

      if (!initiative) return ctx.notFound("Iniciativa no encontrada");

      const currentUsers: { id: number }[] = (initiative as any).users ?? [];

      if (currentUsers.some((u) => u.id === userId))
        return ctx.badRequest("Ya eres miembro de esta iniciativa");

      // 1. Actualizamos la relación
      await strapi
        .documents("api::iniciative.iniciative")
        .update({
          documentId,
          data: {
            users: [...currentUsers.map((u) => u.id), userId],
          } as any,
        });

      // 2. ✅ Forzamos la publicación para que pase de "Modified" a "Published"
      const updated = await strapi
        .documents("api::iniciative.iniciative")
        .publish({ documentId });

      const sanitized = await this.sanitizeOutput(updated, ctx);
      return this.transformResponse(sanitized);
    },

    async leave(ctx) {
      if (!ctx.state.user) return ctx.unauthorized("Debes estar autenticado");
      
      const { id: userId } = ctx.state.user;
      const { id: documentId } = ctx.params; // Strapi 5 usa documentId en la URL

      // 1. Buscamos la iniciativa y poblamos SOLO los IDs de los usuarios vinculados
      const initiative = await strapi
        .documents("api::iniciative.iniciative")
        .findOne({ 
          documentId, 
          populate: { users: { fields: ["id"] } } 
        });

      if (!initiative) return ctx.notFound("Iniciativa no encontrada");

      const currentUsers: { id: number }[] = (initiative as any).users ?? [];

      // 2. Verificamos si realmente el usuario es miembro antes de intentar salir
      const isMember = currentUsers.some((u) => u.id === userId);
      if (!isMember) {
        return ctx.badRequest("No eres miembro de esta iniciativa");
      }

      // 3. Filtramos el array para eliminar al usuario actual
      const updatedUsersIds = currentUsers
        .filter((u) => u.id !== userId)
        .map((u) => u.id);

      // 4. Actualizamos el documento
      await strapi
        .documents("api::iniciative.iniciative")
        .update({
          documentId,
          data: {
            users: updatedUsersIds,
          } as any,
        });

      // 5. ✅ Publicamos el cambio inmediatamente
      // Esto evita que quede en estado "Modified" y no se vea en el frontend
      const updated = await strapi
        .documents("api::iniciative.iniciative")
        .publish({ documentId });

      const sanitized = await this.sanitizeOutput(updated, ctx);
      return this.transformResponse(sanitized);
    },

    async update(ctx) {
      if (!ctx.state.user) return ctx.unauthorized("Debes estar autenticado");
      const { id: userId, role } = ctx.state.user;
      const { id: documentId } = ctx.params;

      if (role.name !== "foundation")
        return ctx.forbidden("Solo fundaciones pueden editar iniciativas");

      const initiative = await strapi
        .documents("api::iniciative.iniciative")
        .findOne({
          documentId,
          populate: { foundation: { populate: { usuario: { fields: ["id"] } } } },
        });

      if (!initiative) return ctx.notFound("Iniciativa no encontrada");

      const foundationOwner = (initiative as any).foundation?.usuario?.id;
      if (foundationOwner !== userId)
        return ctx.forbidden("No tienes permiso para editar esta iniciativa");

      // Actualizamos y publicamos en una sola acción si es posible, 
      // o usamos update + publish
      const updated = await strapi
        .documents("api::iniciative.iniciative")
        .update({ 
          documentId, 
          data: (ctx.request.body as any).data,
          status: 'published' // ✅ Actualiza y publica al mismo tiempo
        });

      const sanitized = await this.sanitizeOutput(updated, ctx);
      return this.transformResponse(sanitized);
    },

    // El delete no necesita publish porque desaparece el documento
    async delete(ctx) {
      if (!ctx.state.user) return ctx.unauthorized("Debes estar autenticado");
      const { id: userId, role } = ctx.state.user;
      const { id: documentId } = ctx.params;

      if (role.name !== "foundation")
        return ctx.forbidden("Solo fundaciones pueden eliminar iniciativas");

      const initiative = await strapi
        .documents("api::iniciative.iniciative")
        .findOne({
          documentId,
          populate: { foundation: { populate: { usuario: { fields: ["id"] } } } },
        });

      if (!initiative) return ctx.notFound("Iniciativa no encontrada");

      const foundationOwner = (initiative as any).foundation?.usuario?.id;
      if (foundationOwner !== userId)
        return ctx.forbidden("No tienes permiso para eliminar esta iniciativa");

      const deleted = await strapi
        .documents("api::iniciative.iniciative")
        .delete({ documentId });

      const sanitized = await this.sanitizeOutput(deleted, ctx);
      return this.transformResponse(sanitized);
    },
  }),
);