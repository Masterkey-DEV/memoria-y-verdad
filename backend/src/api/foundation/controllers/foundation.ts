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

      const userId = ctx.state.user.id;
      console.log("Usuario autenticado:", userId);

      /* ------------------------------------------------ */
      /* 1. Verificar que el usuario no tenga fundación   */
      /* ------------------------------------------------ */

      const existing = await strapi.entityService.findMany(
        "api::foundation.foundation",
        {
          filters: {
            users_permissions_user: userId,
          },
        },
      );

      if (Array.isArray(existing) && existing.length > 0) {
        return ctx.badRequest("Ya tienes una fundación registrada");
      }

      /* ------------------------------------------------ */
      /* 2. Crear la fundación                            */
      /* ------------------------------------------------ */

      const foundation = await strapi.entityService.create(
        "api::foundation.foundation",
        {
          data: {
            ...ctx.request.body.data,
            users_permissions_user: userId,
          },
        },
      );

      /* ------------------------------------------------ */
      /* 3. Obtener rol foundation                        */
      /* ------------------------------------------------ */

      const foundationRole = await strapi
        .query("plugin::users-permissions.role")
        .findOne({
          where: {
            type: "foundation",
          },
        });

      if (!foundationRole) {
        return ctx.internalServerError(
          'Rol "foundation" no encontrado. Créalo en Settings → Roles.',
        );
      }

      /* ------------------------------------------------ */
      /* 4. Asignar rol al usuario                        */
      /* ------------------------------------------------ */

      await strapi.entityService.update(
        "plugin::users-permissions.user",
        userId,
        {
          data: {
            role: foundationRole.id,
          },
        },
      );

      /* ------------------------------------------------ */
      /* 5. Generar JWT nuevo con rol actualizado         */
      /* ------------------------------------------------ */

      const freshJwt = strapi.plugin("users-permissions").service("jwt").issue({
        id: userId,
      });

      /* ------------------------------------------------ */
      /* 6. Respuesta final corregida                     */
      /* ------------------------------------------------ */

      const sanitized = await this.sanitizeOutput(foundation, ctx);
      // Forzamos el cast a 'any' para evitar el error TS2698 de spread
      const transformed = this.transformResponse(sanitized) as any;

      return {
        ...transformed,
        jwt: freshJwt,
      };
    },

    async update(ctx) {
      if (!ctx.state.user) {
        return ctx.unauthorized("Debes estar autenticado");
      }

      const userId = ctx.state.user.id;
      const role = ctx.state.user.role;
      const { id } = ctx.params;

      if (role.type !== "foundation") {
        return ctx.forbidden("Solo fundaciones pueden editar su perfil");
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

      const userId = ctx.state.user.id;
      const role = ctx.state.user.role;
      const { id } = ctx.params;

      if (role.type !== "foundation") {
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
