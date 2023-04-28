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

import com.gamestore.model.User;
import com.gamestore.repository.UserRepository;

@CrossOrigin("*")
@RestController
@RequestMapping("/api")
public class UserController {
	
	@Autowired
	private UserRepository userRepository;
	
	@GetMapping("/users")
	public ResponseEntity<List<User>> getAllUsers() {
		return new ResponseEntity<>(userRepository.findAll(), HttpStatus.OK);
	}
	
	@GetMapping("/users/{userId}")
	public ResponseEntity<User> getUserById(@PathVariable("userId") int userId) {
		Optional<User> userData = userRepository.findById(userId);
		if (userData.isPresent()) {
			return new ResponseEntity<>(userData.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@PostMapping("/users")
	public ResponseEntity<User> createUser(@RequestBody User user) {
		try {
			User _user = userRepository.save(new User(user.getName(), user.getEmail(), user.getPassword())); // persists object
			return new ResponseEntity<>(_user, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PutMapping("/users/{userId}")
	public ResponseEntity<User> updateUser(@PathVariable("userId") int userId, @RequestBody User user) {
		Optional<User> userData = userRepository.findById(userId);
		
		if (userData.isPresent()) {
			User _user = userData.get();
			_user.setName(user.getName());
			_user.setEmail(user.getEmail());
			_user.setPassword(user.getPassword());
			return new ResponseEntity<>(userRepository.save(_user), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@DeleteMapping("/users/{userId}")
	public ResponseEntity<HttpStatus> deleteUser(@PathVariable("userId") int userId) {
		try {
			userRepository.deleteById(userId);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@DeleteMapping("/users")
	public ResponseEntity<HttpStatus> deleteAllUsers() {
		try {
			userRepository.deleteAll();
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
