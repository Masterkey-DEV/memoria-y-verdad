/**
 * success-story controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::success-story.success-story",
  ({ strapi }) => ({
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
          "Solo administradores pueden crear success stories",
        );
      }

      const story = await strapi.entityService.create(
        "api::success-story.success-story",
        {
          data: ctx.request.body.data,
        },
      );

      const sanitized = await this.sanitizeOutput(story, ctx);
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
          "Solo administradores pueden editar success stories",
        );
      }

      const { id } = ctx.params;

      const story = await strapi.entityService.findOne(
        "api::success-story.success-story",
        id,
      );

      if (!story) {
        return ctx.notFound("Success story no encontrada");
      }

      const updated = await strapi.entityService.update(
        "api::success-story.success-story",
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

      const { role } = ctx.state.user;

      if (
        role.name !== "strapi-super-admin" &&
        role.type !== "superadmin" &&
        role.name !== "admin"
      ) {
        return ctx.forbidden(
          "Solo administradores pueden eliminar success stories",
        );
      }

      const { id } = ctx.params;

      const story = await strapi.entityService.findOne(
        "api::success-story.success-story",
        id,
      );

      if (!story) {
        return ctx.notFound("Success story no encontrada");
      }

      const deleted = await strapi.entityService.delete(
        "api::success-story.success-story",
        id,
      );

      const sanitized = await this.sanitizeOutput(deleted, ctx);
      return this.transformResponse(sanitized);
    },
  }),
);
