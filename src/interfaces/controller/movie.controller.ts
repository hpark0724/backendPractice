import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Patch,
    Param,
    Query,
} from '@nestjs/common';
import { MovieService } from 'src/application/service/movie.service';
import { Movie } from 'src/domain/entity/movie.entity';


@Controller('movies')
export class MovieController {
    constructor(private readonly movieService: MovieService) { }

    // @Get()
    // async findAll(@Query('includeDeleted') includeDeleted?: boolean) {
    //     return this.movieService.findAll(includeDeleted);
    // }
    @Get()
    async findAll(@Query('includeDeleted') includeDeleted?: boolean, @Query('genre') genre?: string,) {
        if (genre) {
            return this.getGenre(genre);
        }
        return this.movieService.findAll(includeDeleted);
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.movieService.findOne(id);
    }

    @Post()
    async create(
        @Body('title') title: string,
        @Body('genre') genre: string,
        @Body('duration') duration: number,
    ) {
        return this.movieService.create(title, genre, duration);
    }

    @Delete(':id/soft-delete')
    async softDelete(@Param('id') id: number) {
        return this.movieService.softDelete(id);
    }

    // TODO: implement update endpoint
    @Patch(':id')
    async update(@Param('id') id: number, @Body() updateData: Partial<Movie>) {
        return this.movieService.updateMovie(id, updateData);
    }
    // TODO: implement search endpoints
    @Get()
    async getGenre(@Query('genre') genre: string) {
        const result = await this.movieService.getGenre(genre);
        return result;
    }

    // TODO: implement admin-only hard delete endpoint
    @Delete(':id/hard-delete')
    async hardDelete(@Param('id') id: number) {
        return this.movieService.hardDelete(id);
    }
}
