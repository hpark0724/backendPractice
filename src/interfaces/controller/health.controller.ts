import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, HealthCheck} from '@nestjs/terminus';
import { EntityManager } from '@mikro-orm/core';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private readonly em: EntityManager,
    ) { }

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            // () => this.db.pingCheck('database', { timeout: 3000 }),
            async () => {
                try {
                    await this.em.getConnection().execute('SELECT 1');
                    return {
                        database: {
                            status: 'up'
                        }
                    };
                } catch (error) {
                    return {
                        database: {
                            status: 'down',
                            message: error.message
                        }
                    };
                }
            },
            () =>
                this.http.responseCheck(
                    'movie-api',
                    'http://localhost:3000/movies',
                    (res) => res.status === 200,
                ),
        ]);
    }

}