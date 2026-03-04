/**
 * product-category controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::product-category.product-category",
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
        return ctx.forbidden(
          "Solo administradores pueden crear categorías de producto",
        );
      }

      const category = await strapi.entityService.create(
        "api::product-category.product-category",
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
        return ctx.forbidden(
          "Solo administradores pueden editar categorías de producto",
        );
      }

      const updated = await strapi.entityService.update(
        "api::product-category.product-category",
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
        return ctx.forbidden(
          "Solo administradores pueden eliminar categorías de producto",
        );
      }

      const deleted = await strapi.entityService.delete(
        "api::product-category.product-category",
        ctx.params.id,
      );

      const sanitized = await this.sanitizeOutput(deleted, ctx);
      return this.transformResponse(sanitized);
    },
  }),
);
