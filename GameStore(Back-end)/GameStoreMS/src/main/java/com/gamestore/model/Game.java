package com.gamestore.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "games")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Game {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer gameId;

	@Column(name = "userId")
	private int userId;

	@Column(name = "name")
	private String name;

	@Column(name = "image")
	private String image;

	@Column(name = "price")
	private double price;

	@Column(name = "releasedate")
	private String releaseDate;

	@Column(name = "rating")
	private double rating;
	
	public Game(int userId, String name, String image, double price, String releaseDate, double rating) {
		// omit gameId since it is auto generated within the database
		this.userId = userId;
		this.name = name;
		this.image = image;
		this.price = price;
		this.releaseDate = releaseDate;
		this.rating = rating;
	}
}
