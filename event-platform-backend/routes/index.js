const { requestLogger, errorLogger } = require('../middleware/loggerMiddleware');

class RouterController {
    constructor(app) {
        this.app = app;
        this.init();
    }
    init() {
        this.app.use(requestLogger);
        // this.app.use('/api/auth', authRoutes);
        // регистрация роутеров

        this.descructor();
    }
    descructor(){
        this.app.use(errorLogger);
    }
}

module.exports = RouterController;