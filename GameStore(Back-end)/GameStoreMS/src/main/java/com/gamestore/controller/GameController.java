package com.gamestore.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import com.gamestore.model.Game;
import com.gamestore.repository.GameRepository;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin("*")
@RestController
@RequestMapping("/api")
public class GameController {
	
	@Autowired
	private GameRepository gameRepository;
	
	@GetMapping("/games")
	public ResponseEntity<Map<String, Object>> getAllGames(@RequestParam(defaultValue = "0") int page,
														   @RequestParam(defaultValue = "10") int size) {

		try {
			List<Game> games;
			Pageable paging = PageRequest.of(page, size);

			Page<Game> pageGames = gameRepository.findAll(paging);
			games = pageGames.getContent();

			Map<String, Object> response = new HashMap<>();
			response.put("games", games);
			response.put("currentPage", pageGames.getNumber());
			response.put("totalItems", pageGames.getTotalElements());
			response.put("totalPages", pageGames.getTotalPages());

			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/games/{gameId}") // 'id' gets passed from the url to this method
	public ResponseEntity<Game> getGameById(@PathVariable("gameId") int gameId) {
		Optional<Game> gameData = gameRepository.findById(gameId);
		if (gameData.isPresent()) {
			return new ResponseEntity<>(gameData.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping("/games/user/{userId}") // 'id' gets passed from the url to this method
	public ResponseEntity<Map<String, Object>> getGamesByUserId(@PathVariable("userId") int userId,
																@RequestParam(defaultValue = "0") int page,
																@RequestParam(defaultValue = "10") int size,
																@RequestParam(required = false) String filter,
																@RequestParam(defaultValue = "id") String sortBy,
																@RequestParam(defaultValue = "asc") String sortDirection) {

		try {
			Sort sort = sortDirection.equalsIgnoreCase("desc") ?
					Sort.by(sortBy).descending() :
					Sort.by(sortBy).ascending();

			Pageable paging = PageRequest.of(page, size, sort);
			Page<Game> pageGames = gameRepository.findByUserId(userId, paging);

			if (filter != null && !filter.isEmpty()) {
				// Assuming you want to search by game name
				pageGames = gameRepository.findByUserIdAndNameContainingIgnoreCase(userId, filter, paging);
			} else {
				pageGames = gameRepository.findByUserId(userId, paging);
			}

			List<Game> games = pageGames.getContent();

			Map<String, Object> response = new HashMap<>();
			response.put("games", games);
			response.put("currentPage", pageGames.getNumber());
			response.put("totalItems", pageGames.getTotalElements());
			response.put("totalPages", pageGames.getTotalPages());

			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/games")
	public ResponseEntity<Game> createGame(@RequestParam("file") MultipartFile imageFile,
										   @RequestParam("game") String gameJson) {
		try {
			// Convert game JSON string to Game object
			ObjectMapper mapper = new ObjectMapper();
			Game game = mapper.readValue(gameJson, Game.class);

			Path uploadPath = Paths.get("uploads/images").toAbsolutePath();
			Files.createDirectories(uploadPath);

			String fileName = StringUtils.cleanPath(imageFile.getOriginalFilename());
			Files.copy(imageFile.getInputStream(), uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);

			game.setImage(fileName);

			// Save game to database
			Game _game = gameRepository.save(new Game(
					game.getUserId(),
					game.getName(),
					game.getImage(),
					game.getPrice(),
					game.getReleaseDate(),
					game.getRating()
			));

			return new ResponseEntity<>(_game, HttpStatus.CREATED);

		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PutMapping("/games/{userId}/{gameId}")
	public ResponseEntity<Game> updateGame(@PathVariable("userId") int userId,
										   @PathVariable("gameId") int gameId,
										   @RequestParam(value = "file", required = false) MultipartFile imageFile,
										   @RequestParam("game") String gameJson) {
		Optional<Game> gameData = gameRepository.findById(gameId);

		if (gameData.isPresent()) {
			Game _game = gameData.get();

			if (_game.getUserId() != userId) {
				return new ResponseEntity<>(HttpStatus.FORBIDDEN);
			}

			try {
				// Convert game JSON string to Game object
				ObjectMapper mapper = new ObjectMapper();
				Game updatedGame = mapper.readValue(gameJson, Game.class);

				// Update fields
				_game.setName(updatedGame.getName());
				_game.setPrice(updatedGame.getPrice());
				_game.setRating(updatedGame.getRating());
				_game.setReleaseDate(updatedGame.getReleaseDate());

				// Handle image file if provided
				if (imageFile != null && !imageFile.isEmpty()) {
					Path uploadPath = Paths.get("uploads/images").toAbsolutePath();
					Files.createDirectories(uploadPath);

					String fileName = StringUtils.cleanPath(imageFile.getOriginalFilename());
					Files.copy(imageFile.getInputStream(), uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);

					_game.setImage(fileName);
				}

				return new ResponseEntity<>(gameRepository.save(_game), HttpStatus.OK);
			} catch (Exception e) {
				e.printStackTrace();
				return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
			}
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping("/games/{userId}/{gameId}")
	public ResponseEntity<HttpStatus> deleteGame(@PathVariable("userId") int userId,
												 @PathVariable("gameId") int gameId) {
		try {
			Optional<Game> gameData = gameRepository.findById(gameId);
			Game _game = gameData.get();
			if (_game.getUserId() != userId) {
				return new ResponseEntity<>(HttpStatus.FORBIDDEN);
			}

			Path imagePath = Paths.get("uploads/images").toAbsolutePath().resolve(_game.getImage());
			Files.deleteIfExists(imagePath);

			gameRepository.deleteById(gameId);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/games")
	public ResponseEntity<HttpStatus> deleteAllGames() {
		try {
			List<Game> games = gameRepository.findAll();
			for (Game game : games) {
				Path imagePath = Paths.get("uploads/images").toAbsolutePath().resolve(game.getImage());
				Files.deleteIfExists(imagePath);
			}
			gameRepository.deleteAll();
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
