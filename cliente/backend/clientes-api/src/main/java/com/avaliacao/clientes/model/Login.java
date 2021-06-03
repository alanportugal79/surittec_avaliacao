package com.avaliacao.clientes.model;

import lombok.Data;

@Data
public class Login {
	
	private String usuario;
	private String senha;
	private String token;
	
}