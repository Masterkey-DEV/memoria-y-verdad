/**
 * initiatives-category controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::initiatives-category.initiatives-category",
  ({ strapi }) => ({
    // find y findOne heredados del core (cualquiera puede leer)

    async create(ctx) {
      if (!ctx.state.user) {
        return ctx.unauthorized("Debes estar autenticado");
      }

      const { role } = ctx.state.user;

      if (
        role.name !== "strapi-super-admin" &&
        role.type !== "superadmin" &&
        role.name !== "admin"
      ) {
        return ctx.forbidden("Solo administradores pueden crear categorías");
      }

      const category = await strapi.entityService.create(
        "api::initiatives-category.initiatives-category",
        { data: ctx.request.body.data },
      );

      const sanitized = await this.sanitizeOutput(category, ctx);
      return this.transformResponse(sanitized);
    },

    async update(ctx) {
      if (!ctx.state.user) {
        return ctx.unauthorized("Debes estar autenticado");
      }

      const { role } = ctx.state.user;

      if (
        role.name !== "strapi-super-admin" &&
        role.type !== "superadmin" &&
        role.name !== "admin"
      ) {
        return ctx.forbidden("Solo administradores pueden editar categorías");
      }

      const updated = await strapi.entityService.update(
        "api::initiatives-category.initiatives-category",
        ctx.params.id,
        { data: ctx.request.body.data },
      );

      const sanitized = await this.sanitizeOutput(updated, ctx);
      return this.transformResponse(sanitized);
    },

    async delete(ctx) {
      if (!ctx.state.user) {
        return ctx.unauthorized("Debes estar autenticado");
      }

      const { role } = ctx.state.user;

      if (
        role.name !== "strapi-super-admin" &&
        role.type !== "superadmin" &&
        role.name !== "admin"
      ) {
        return ctx.forbidden("Solo administradores pueden eliminar categorías");
      }

      const deleted = await strapi.entityService.delete(
        "api::initiatives-category.initiatives-category",
        ctx.params.id,
      );

      const sanitized = await this.sanitizeOutput(deleted, ctx);
      return this.transformResponse(sanitized);
    },
  }),
);
