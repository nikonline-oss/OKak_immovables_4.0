const { requestLogger, errorLogger } = require('../middleware/loggerMiddleware');

// Замените все импорты с деструктуризации на прямое использование
const userRoutes = require('../routes/user');
const developerRoutes = require('../routes/developer');
const apartmentRoutes = require('../routes/apartment');
const bookingRoutes = require('../routes/booking');
const favoriteRoutes = require('../routes/favorite');
const mediaRoutes = require('../routes/media');

class RouterController {
    constructor(app) {
        this.app = app;
        this.init();
    }
    init() {
        this.app.use(requestLogger);

        // Регистрация всех API роутеров
        this.app.use('/api/users', userRoutes);
        this.app.use('/api/developers', developerRoutes);
        this.app.use('/api/apartments', apartmentRoutes);
        this.app.use('/api/bookings', bookingRoutes);
        this.app.use('/api/favorites', favoriteRoutes);
        this.app.use('/api/media', mediaRoutes);

        this.descructor();
    }
    descructor(){
        this.app.use(errorLogger);
    }
}

module.exports = RouterController;