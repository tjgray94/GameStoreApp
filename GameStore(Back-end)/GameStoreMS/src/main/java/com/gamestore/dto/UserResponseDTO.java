package com.gamestore.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponseDTO {
    private int userId;
    private String name;
    private String email;

    public UserResponseDTO(int userId, String name, String email) {
        this.userId = userId;
        this.name = name;
        this.email = email;
    }
}
