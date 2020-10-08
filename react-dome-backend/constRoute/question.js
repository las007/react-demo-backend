module.exports = app => ({
    '/createQA, post': () => {
        app.$act.question.createQuestion(app.ctx);
    },
    '/findQA, post': () => {
        app.$act.question.findQuestion(app.ctx);
    },
    '/deleteQA, post': () => {
        app.$act.question.deleteQA(app.ctx);
    },
    '/editQA, post': () => {
        app.$act.question.editQA(app.ctx);
    },
    '/getMyQuestion, post': () => {
        app.$act.question.getMyQuestion(app.ctx);
    },
    '/praiseQuestion, post': () => {
        app.$act.question.praiseQuestion(app.ctx);
    },
    '/testConnect/QA, get': () => {
        app.$link.testConnection(app);
    }
});
