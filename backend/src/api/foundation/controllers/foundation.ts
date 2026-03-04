/**
 * foundation controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::foundation.foundation",
  ({ strapi }) => ({
    async create(ctx) {
      if (!ctx.state.user) {
        return ctx.unauthorized("Debes estar autenticado");
      }

      const { id: userId } = ctx.state.user;

      // Verificar que el usuario no tenga ya una fundación
      const existing = await strapi.entityService.findMany(
        "api::foundation.foundation",
        {
          filters: { users_permissions_user: userId },
        },
      );

      if (existing.length > 0) {
        return ctx.badRequest("Ya tienes una fundación registrada");
      }

      const foundation = await strapi.entityService.create(
        "api::foundation.foundation",
        {
          data: {
            ...ctx.request.body.data,
            users_permissions_user: userId,
          },
        },
      );

      // Buscar el rol "foundation"
      const foundationRole = await strapi
        .query("plugin::users-permissions.role")
        .findOne({ where: { name: "foundation" } });

      if (!foundationRole) {
        return ctx.internalServerError('Rol "foundation" no encontrado');
      }

      // Asignar el rol al usuario
      await strapi.entityService.update(
        "plugin::users-permissions.user",
        userId,
        { data: { role: foundationRole.id } },
      );

      const sanitized = await this.sanitizeOutput(foundation, ctx);
      return this.transformResponse(sanitized);
    },

    async update(ctx) {
      if (!ctx.state.user) {
        return ctx.unauthorized("Debes estar autenticado");
      }

      const { id: userId, role } = ctx.state.user;
      const { id } = ctx.params;

      if (role.name !== "foundation") {
        return ctx.forbidden("Solo fundaciones pueden editar su perfil");
      }

      // Cast a "any" para acceder a relaciones populadas sin errores de TS
      const foundation = (await strapi.entityService.findOne(
        "api::foundation.foundation",
        id,
        {
          populate: ["users_permissions_user"],
        },
      )) as any;

      if (!foundation) {
        return ctx.notFound("Fundación no encontrada");
      }

      if (foundation.users_permissions_user?.id !== userId) {
        return ctx.forbidden("No tienes permiso para editar esta fundación");
      }

      const updated = await strapi.entityService.update(
        "api::foundation.foundation",
        id,
        {
          data: ctx.request.body.data,
        },
      );

      const sanitized = await this.sanitizeOutput(updated, ctx);
      return this.transformResponse(sanitized);
    },

    async delete(ctx) {
      if (!ctx.state.user) {
        return ctx.unauthorized("Debes estar autenticado");
      }

      const { id: userId, role } = ctx.state.user;
      const { id } = ctx.params;

      if (role.name !== "foundation") {
        return ctx.forbidden("Solo fundaciones pueden eliminar su perfil");
      }

      const foundation = (await strapi.entityService.findOne(
        "api::foundation.foundation",
        id,
        {
          populate: ["users_permissions_user"],
        },
      )) as any;

      if (!foundation) {
        return ctx.notFound("Fundación no encontrada");
      }

      if (foundation.users_permissions_user?.id !== userId) {
        return ctx.forbidden("No tienes permiso para eliminar esta fundación");
      }

      const deleted = await strapi.entityService.delete(
        "api::foundation.foundation",
        id,
      );

      const sanitized = await this.sanitizeOutput(deleted, ctx);
      return this.transformResponse(sanitized);
    },
  }),
);
