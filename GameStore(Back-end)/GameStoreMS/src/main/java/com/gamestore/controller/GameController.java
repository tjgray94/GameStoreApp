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
	
//	@GetMapping("/games/{gameId}") // 'id' gets passed from the url to this method
//	public Game get(@PathVariable("gameId") int gameId) {
//		return gameRepository.getById(gameId);
//	}
//	
	@GetMapping("/games/{gameId}") // 'id' gets passed from the url to this method
	public ResponseEntity<Game> getGameById(@PathVariable("gameId") int gameId) {
		Optional<Game> gameData = gameRepository.findById(gameId);
		if (gameData.isPresent()) {
			return new ResponseEntity<>(gameData.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@PostMapping("/games")
	public ResponseEntity<Game> createGame(@RequestBody Game game) {
		try {
			Game _game = gameRepository.save(new Game(game.getName(), game.getImage(), game.getPrice(), game.getReleaseDate(), game.getRating())); // persists object
			return new ResponseEntity<>(_game, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PutMapping("/games/{gameId}")
	public ResponseEntity<Game> updateGame(@PathVariable("gameId") int gameId, @RequestBody Game game) {
		Optional<Game> gameData = gameRepository.findById(gameId);
		
		if (gameData.isPresent()) {
			Game _game = gameData.get();
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
//	@DeleteMapping("/{gameId}")
//	public void delete(@PathVariable("gameId") int gameId) {
//		gameRepository.deleteById(gameId);
//	}
	@DeleteMapping("/games/{gameId}")
	public ResponseEntity<HttpStatus> deleteGame(@PathVariable("gameId") int gameId) {
		try {
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
