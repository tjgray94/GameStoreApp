package com.gamestore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gamestore.model.Game;

public interface GameRepository extends JpaRepository<Game, Integer> {
	List<Game> findByName(String name);
	List<Game> findByUserId(int userId);
}
