package com.gamestore.repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.gamestore.model.Game;

public interface GameRepository extends JpaRepository<Game, Integer> {
	List<Game> findByName(String name);
	Page<Game> findByUserId(int userId, Pageable pageable);
	Page<Game> findAll(Pageable pageable);
}
