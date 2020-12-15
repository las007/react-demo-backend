module.exports = app => ({
    '/comment, post': () => {
        app.$act.articles.addComment(app.ctx);
    },
    '/commentlike, post': () => {
        app.$act.articles.isLikeComment(app.ctx);
    }
});
