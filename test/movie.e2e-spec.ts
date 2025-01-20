import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MovieModule } from '../src/movie.module';
import { MovieController } from '../src/interfaces/controller/movie.controller';
import { MovieRepository } from '../src/domain/repository/movie.repository';
import { MovieService } from '../src/application/service/movie.service';

describe('MovieController (e2e)', () => {
    let app: INestApplication;

    const mockMovie1 = {
        id: 1,
        title: 'Movie 1',
        genre: 'Action',
        duration: 120,
        deletedAt: null,
    };

    const mockMovie2 = {
        id: 2,
        title: 'Movie 2',
        genre: 'Drama',
        duration: 150,
        deletedAt: null,
    };

    const mockMovieRepository = {
        findAllMovies: jest.fn(),
        findOneById: jest.fn(),
        createUser: jest.fn(),
        softDelete: jest.fn(),
        updateMovie: jest.fn(),
        hardDelete: jest.fn(),
        findbyGenre: jest.fn(),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [MovieController],
            providers: [
                MovieService,
                {
                    provide: MovieRepository,
                    useValue: mockMovieRepository,
                },
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/movies (GET)', async () => {
        mockMovieRepository.findAllMovies.mockResolvedValue([mockMovie1, mockMovie2]);

        const response = await request(app.getHttpServer())
            .get('/movies')
            .expect(200);

        expect(response.body).toEqual([mockMovie1, mockMovie2]);
    });

    it('/movies/:id (GET)', async () => {
        mockMovieRepository.findOneById.mockResolvedValue(mockMovie1);

        const response = await request(app.getHttpServer())
            .get('/movies/1')
            .expect(200);

        expect(response.body).toEqual(mockMovie1);
    });

    it('/movies (POST)', async () => {
        mockMovieRepository.createUser.mockResolvedValue(mockMovie2);

        const response = await request(app.getHttpServer())
            .post('/movies')
            .send({ title: 'Movie 2', genre: 'Drama', duration: 150 })
            .expect(201);

        expect(response.body).toEqual(mockMovie2);
    });

    it('/movies/:id/soft-delete (DELETE)', async () => {
        mockMovieRepository.softDelete.mockResolvedValue(null);

        await request(app.getHttpServer())
            .delete('/movies/1/soft-delete')
            .expect(200);
    });

    it('/movies/:id (PATCH)', async () => {
        const updatedMovie = { ...mockMovie1, title: 'Updated Movie 1' };

        mockMovieRepository.findOneById.mockResolvedValue(mockMovie1);
        mockMovieRepository.updateMovie = jest.fn().mockResolvedValue(updatedMovie);

        const response = await request(app.getHttpServer())
            .patch('/movies/1')
            .send({ title: 'Updated Movie 1' })
            .expect(200);

        expect(response.body).toEqual(updatedMovie);
    });

    it('/movies/genre (GET)', async () => {
        mockMovieRepository.findbyGenre.mockResolvedValue(mockMovie2);

        const response = await request(app.getHttpServer())
            .get('/movies/genre')
            .query({ genre: 'Drama' })
            .expect(200);

        expect(response.body).toEqual(mockMovie2);
    });

    it('/movies/:id/hard-delete (DELETE)', async () => {
        mockMovieRepository.hardDelete.mockResolvedValue(null);

        await request(app.getHttpServer())
            .delete('/movies/1/hard-delete')
            .expect(200);
    });
});
