const Mutations = {
    createItem(parent, args, ctx, info) {
        const item = ctx.db.mutation.createItem({
            data: {
                ...args
            }
        }, info);
        console.log(item);

        return item;
    }
};

module.exports = Mutations;
