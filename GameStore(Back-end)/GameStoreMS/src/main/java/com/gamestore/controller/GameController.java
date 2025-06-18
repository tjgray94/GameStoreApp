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
					String uploadDir = "/Users/tevingray/GameStoreHome/GameStoreApp/GameStore/src/assets/";
					String fileName = StringUtils.cleanPath(imageFile.getOriginalFilename());

					// Save file
					File directory = new File(uploadDir);
					if (!directory.exists()) {
						directory.mkdirs();
					}

					Path filePath = Paths.get(uploadDir + fileName);
					Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

					// Set the image filename (not full path)
					_game.setImage(fileName);

					System.out.println("Updated image saved to: " + filePath.toAbsolutePath());
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
