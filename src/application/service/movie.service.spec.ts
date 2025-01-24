import { Test } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { MovieRepository } from '../../domain/repository/movie.repository';

// 테스트용으로 사용할 더미 영화 데이터
const mockMovie = {
    id: 1,
    title: '테스트 영화',
    genre: '액션',
    duration: 120,
    deletedAt: null,
}

// MovieRepository의 메소드들을 mock처리한 객체 -> 실제 메소드를 실행하지 않고 각 메소드의 동작을 가짜로 만들기
const mockMovieRepository = {
    findAllMovies: jest.fn(),
    findOneById: jest.fn(),
    createUser: jest.fn(),
    softDelete: jest.fn(),
    hardDelete: jest.fn(),
    findbyGenre: jest.fn(),
}


describe('MovieService', () => {
    // 실제로 테스트할 서비스, 서비스 인스턴스를 사용
    let movieService: MovieService;

    // 각 테스트가 실행되기 전에 실행되는 설정 함수 -> 테스트가 독립적으로 실행될 수 있도록 환경을 초기화
    beforeEach(async () => {
        // await를 사용하여 비동기적으로 테스트 모듈을 생성 -> 테스트를 시작하기 전에 모든 설정이 완료되어야 하기 때문에 비동기 처리
        const testingModule = await Test.createTestingModule({
            providers: [
                MovieService,
                {
                    provide: MovieRepository,
                    useValue: mockMovieRepository
                },
            ],
        }).compile();

        // 실제로 MovieService 인스턴스를 가져옴
        movieService = testingModule.get<MovieService>(MovieService);
        // Jest의 모킹(mocking) 함수들을 초기화
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return all movies when includeDeleted is false', async () => {
            // 함수가 호출되었을 때 반환할 값 설정, DB와 연결되지 않고 모킹된 값인 [mockMovie] 배열을 반환하도록 설정
            mockMovieRepository.findAllMovies.mockResolvedValue([mockMovie]);
            // false를 인자로 전달, result는 findAll 메소드에서 mockMovie 배열 반환
            const result = await movieService.findAll(false);

            // movieService.findAll(false)가 mockMovieRepository.findAllMovies(false)를 호출했는지 검증
            expect(mockMovieRepository.findAllMovies).toHaveBeenCalledWith(false);
            expect(result).toEqual([mockMovie]);
        })
    })

    describe('findOne', () => {
        it('should return movie with the spicified id', async () => {
            mockMovieRepository.findOneById.mockResolvedValue(mockMovie)
            const result = await movieService.findOne(1);

            expect(mockMovieRepository.findOneById).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockMovie);
        })
    })


    describe('create', () => {
        it('should create and return movie with the specified title, genre and duration', async () => {
            const mockMovieData = {
                title: '테스트 영화',
                genre: '액션',
                duration: 120,
            }
            const newMovie = { id: 1, ...mockMovieData }

            // 반환값 설정
            mockMovieRepository.createUser.mockResolvedValue(newMovie);
            const result = await movieService.create(mockMovieData.title, mockMovieData.genre, mockMovieData.duration);
            expect(mockMovieRepository.createUser).toHaveBeenCalledWith(mockMovieData);
            expect(result).toEqual(newMovie);

        })
    })

    describe('softDelete', () => {

        it('should delete movie with the specified id', async () => {
            const mockMovieDeletedData = {
                id: 1,
                title: '테스트 영화',
                genre: '액션',
                duration: 120,
                deletedAt: new Date('2025-01-02'),
            }
            mockMovieRepository.softDelete.mockResolvedValue(false);
            const result_checkDeleted = await movieService.softDelete(mockMovieDeletedData.id);
            expect(mockMovieRepository.softDelete).toHaveBeenCalledWith(mockMovieDeletedData.id);
            expect(result_checkDeleted).toEqual(false)

            mockMovieRepository.softDelete.mockResolvedValue(true);
            const result2 = await movieService.softDelete(mockMovie.id);
            expect(mockMovieRepository.softDelete).toHaveBeenCalledWith(mockMovie.id);
            expect(result2).toEqual(true);
        })

    })

    describe('hardDelete', () => {
        it('should delete a movie with the specified id from database', async () => {
            mockMovieRepository.hardDelete.mockResolvedValue(true);
            const result = await movieService.hardDelete(mockMovie.id);
            expect(mockMovieRepository.hardDelete).toHaveBeenCalledWith(mockMovie.id);
            expect(result).toEqual(true);
        })
    })

    describe('findbyGenre', () => {
        it('should find a movie with the specified genre', async () => {
            mockMovieRepository.findbyGenre.mockResolvedValue([mockMovie]);
            const result = await movieService.getGenre('액션', false);
            expect(mockMovieRepository.findbyGenre).toHaveBeenCalledWith('액션', false);
            expect(result).toEqual([mockMovie]);
        })
    })
})