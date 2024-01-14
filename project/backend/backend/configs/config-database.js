const environment = process.env;

const env = environment.NODE_ENV; // 'dev' or 'test'

module.exports = function () {
    // console.log('environment => ', environment);
    switch (environment.NODE_ENV) {
        case 'development':
            return {
                app: {
                    port: parseInt(environment.DEV_APP_PORT) || 1000,
                    port_socket: parseInt(environment.DEV_SIO_PORT) || 1001
                },
                db: {
                    host: environment.DEV_DB_HOST || '"dev-common-maria',
                    port: parseInt(environment.DEV_DB_PORT) || 3306,
                    user: environment.DEV_DB_USER || 'tasana',
                    password: environment.DEV_DB_PASSWORD || 'ai9.co.th',
                    database: environment.DEV_DB_DATABASE || 'tasana',
                }
            };

        case 'production':
            return {
                app: {
                    port: parseInt(environment.PROD_APP_PORT) || 1000,
                    port_socket: parseInt(environment.PROD_SIO_PORT) || 1001
                },
                db: {
                    host: environment.PROD_DB_HOST || 'common-maria',
                    port: parseInt(environment.PROD_DB_PORT) || 3306,
                    user: environment.PROD_DB_USER || 'tasana',
                    password: environment.PROD_DB_PASSWORD || 'ai9.co.th',
                    database: environment.PROD_DB_DATABASE || 'tasana',
                }
            };
        default:
            return {
                app: {
                    port: parseInt(environment.TEST_APP_PORT) || 1000,
                    port_socket: parseInt(environment.TEST_SIO_PORT) || 1001
                },
                db: {
                    host: environment.TEST_DB_HOST || 'localhost',
                    port: parseInt(environment.TEST_DB_PORT) || 3306,
                    user: environment.TEST_DB_USER || 'root',
                    password: environment.TEST_DB_PASSWORD || 'root',
                    database: environment.TEST_DB_DATABASE || 'tasana',
                }
            };
    }
};
