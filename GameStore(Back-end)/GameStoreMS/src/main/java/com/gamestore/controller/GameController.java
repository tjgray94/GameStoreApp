package com.gamestore.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gamestore.model.Game;
import com.gamestore.repository.GameRepository;

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
	public ResponseEntity<Game> createGame(@RequestBody Game game) {
		try {
			Game _game = gameRepository.save(new Game(game.getUserId(), game.getName(), game.getImage(), game.getPrice(), game.getReleaseDate(), game.getRating())); // persists object
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
