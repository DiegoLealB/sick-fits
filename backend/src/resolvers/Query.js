const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");

const Query = {
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  me(parent, args, ctx, info) {
    // Check if there is a current userId
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      info
    );
  },
  async users(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error("Please log in");
    }

    hasPermission(ctx.request.user, ["ADMIN"]);

    return ctx.db.query.users({}, info);
  },
  async order(parent, args, ctx, info) {
    // 1. Make sure user is logged in
    const userId = ctx.request.userId;
    if (!userId) {
      throw new Error("You are not logged in");
    }
    // 2. Query the current order
    const order = await ctx.db.query.order(
      {
        where: {
          id: args.id,
        },
      },
      info
    );
    // 3. Check if they have permissions to see this order
    const onwsOrder = order.user.id === ctx.request.userId;
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes(
      "ADMIN"
    );
    if (!onwsOrder || !hasPermissionToSeeOrder) {
      throw new Error("You can't see this buddy");
    }
    // 4. Return the order
    return order;
  },
};

module.exports = Query;
