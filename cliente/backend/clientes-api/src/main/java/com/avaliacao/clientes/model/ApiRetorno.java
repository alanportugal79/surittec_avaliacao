package com.avaliacao.clientes.model;

import lombok.Data;

@Data
public class ApiRetorno {
	
	private String mensagem;
	private boolean erro;
	private Object dados;

}
