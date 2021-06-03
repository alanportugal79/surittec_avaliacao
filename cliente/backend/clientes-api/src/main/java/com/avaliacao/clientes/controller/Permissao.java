package com.avaliacao.clientes.controller;

public class Permissao {
	public static boolean validarToken(String token, String regra) {
		return (token.equals("a1b2c3d4") && regra.equals("admin")) ||
				(token.equals("d4c3b2a1") && regra.equals("comum"));
	}
	
	public static String usuarioLogado(String token) {
		return token.equals("a1b2c3d4") ? "admin" : "comum";		
	}
}
