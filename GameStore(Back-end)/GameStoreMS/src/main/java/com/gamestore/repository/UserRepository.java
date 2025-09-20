package com.gamestore.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gamestore.model.User;

public interface UserRepository extends JpaRepository<User, Integer>  {
	Optional<User> findByEmail(String email);
	List<User> findByName(String name);
}
