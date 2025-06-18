package com.gamestore.controller;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
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
	public ResponseEntity<List<Game>> getAllGames() {
		return new ResponseEntity<>(gameRepository.findAll(), HttpStatus.OK);
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
	public ResponseEntity<List<Game>> getGamesByUserId(@PathVariable("userId") int userId) {
		try {
			List<Game> games = gameRepository.findByUserId(userId);
			if (games.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(games, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/games")
	public ResponseEntity<Game> createGame(@RequestParam("file") MultipartFile imageFile,
										   @RequestParam("game") String gameJson) {
		try {
			// Convert game JSON string to Game object
			ObjectMapper mapper = new ObjectMapper();
			Game game = mapper.readValue(gameJson, Game.class);

			// Define the path to Angular assets folder
			Path uploadPath = Paths.get(System.getProperty("user.dir"))
					.resolve("../../GameStoreApp/GameStore/src/assets").normalize();

			System.out.println("Resolved upload path: " + uploadPath.toAbsolutePath());

			// Create directory if it doesn't exist
			File directory = uploadPath.toFile();
			if (!directory.exists()) {
				directory.mkdirs();
			}

			// Save the image file
			String fileName = StringUtils.cleanPath(imageFile.getOriginalFilename());
			Path path = uploadPath.resolve(fileName);
			Files.copy(imageFile.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

			// Update the game object with the image path
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
	public ResponseEntity<Game> updateGame(@PathVariable("userId") int userId, @PathVariable("gameId") int gameId, @RequestBody Game game) {
		Optional<Game> gameData = gameRepository.findById(gameId);
		
		if (gameData.isPresent()) {
			Game _game = gameData.get();

			if (_game.getUserId() != userId) {
				return new ResponseEntity<>(HttpStatus.FORBIDDEN);
			}

			_game.setName(game.getName());
			_game.setImage(game.getImage());
			_game.setPrice(game.getPrice());
			_game.setRating(game.getRating());
			_game.setReleaseDate(game.getReleaseDate());
			return new ResponseEntity<>(gameRepository.save(_game), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping("/games/{userId}/{gameId}")
	public ResponseEntity<HttpStatus> deleteGame(@PathVariable("userId") int userId, @PathVariable("gameId") int gameId) {
		try {
			Optional<Game> gameData = gameRepository.findById(gameId);
			Game _game = gameData.get();
			if (_game.getUserId() != userId) {
				return new ResponseEntity<>(HttpStatus.FORBIDDEN);
			}

			gameRepository.deleteById(gameId);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	@DeleteMapping("/games")
	public ResponseEntity<HttpStatus> deleteAllGames() {
		try {
			gameRepository.deleteAll();
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
