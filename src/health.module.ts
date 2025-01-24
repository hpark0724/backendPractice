import { Module } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, HealthCheck, TerminusModule} from '@nestjs/terminus';
import { HealthController } from './interfaces/controller/health.controller';


@Module({
    imports: [TerminusModule],
    controllers: [HealthController],
    providers: [HealthCheckService, HttpHealthIndicator],
})
export class HealthModule { }
