package com.avaliacao.clientes.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.avaliacao.clientes.model.Login;
import com.avaliacao.clientes.model.ApiRetorno;

@CrossOrigin
@RestController
@RequestMapping("/login")
public class LoginController {
	
	@PostMapping
	public  ResponseEntity<ApiRetorno> login(@RequestBody Login login) {
		
		String usuario = login.getUsuario();
		String senha = login.getSenha();
		
		
		ApiRetorno retorno = new ApiRetorno();
		
		if (usuario.equals("admin") || usuario.equals("comum")) {
			
			if (senha.equals("123456")) {
				Login r = new Login();
				r.setUsuario(login.getUsuario());
				
				if (usuario.equals("admin")) {
					r.setToken("a1b2c3d4"); // token admin
				} else { 
					r.setToken("d4c3b2a1"); // token comum
				}
				
				retorno.setErro(false);
				retorno.setMensagem("Login efetuado com sucesso");
				retorno.setDados(r);
				return ResponseEntity.ok().body(retorno);
			} else {
				retorno.setErro(true);
				retorno.setMensagem("Login inválido");
				retorno.setDados(null);
				return ResponseEntity.ok().body(retorno);
			}
		
		} else {
			retorno.setErro(true);
			retorno.setMensagem("Login inválido");
			retorno.setDados(null);
			return ResponseEntity.ok().body(retorno);
		}		
	}
}
