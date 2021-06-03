package com.avaliacao.clientes.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.avaliacao.clientes.model.ApiRetorno;
import com.avaliacao.clientes.model.Email;
import com.avaliacao.clientes.repository.EmailRepository;

@CrossOrigin
@RestController
@RequestMapping("/emails")
public class EmailController {

	@Autowired
	private EmailRepository emailRepository;
	
	
	@GetMapping(value="/{id_cliente}")
	public List<Email> listar(@PathVariable("id_cliente") long idCliente) {
		
		List<Email> r = new ArrayList<>();
		for (Email e : emailRepository.findAll()) {
			if (e.getId_cliente() == idCliente) {
				r.add(e);
			}
		}
		return r;
	}
	
	@PostMapping
	public Email adicionar(@RequestBody Email email) {
		return emailRepository.save(email);
	}
	
	@Transactional
	@CrossOrigin
	@PostMapping("/varios/{id_cliente}")
	public ResponseEntity<ApiRetorno> adicionarVarios(
			@PathVariable("id_cliente") long idCliente, 
			@RequestBody List<Email> emails) {
		
		ApiRetorno ret = new ApiRetorno();
		
		if (!emails.isEmpty()) {
			
			// remover os emails já salvo se houver, para não duplicar com a lista atualizada
			
			for (Email e : emailRepository.findAll()) {
				if (e.getId_cliente() == idCliente) {
					emailRepository.delete(e);
				}
			}
			
			emails.forEach(tel -> {
				emailRepository.save(tel);
			});
			
			ret.setErro(false);
			ret.setMensagem("Emails salvo com sucesso");
			ret.setDados(null);
			return ResponseEntity.ok().body(ret);
		} else {
			ret.setErro(true);
			ret.setMensagem("Não há emails para salvar");
			ret.setDados(null);
			return ResponseEntity.ok().body(ret);
		}
	}
	
	@PutMapping(value="/{id}")
	public ResponseEntity<Email> editar(@PathVariable("id") long id, @RequestBody Email email) {
		
		return emailRepository.findById(id)
				.map(registro -> {
					registro.setEmail(email.getEmail());
					Email atualizado = emailRepository.save(registro);
					return ResponseEntity.ok().body(atualizado);
				}).orElse(ResponseEntity.notFound().build());
	}
	
	@DeleteMapping(path ={"/{id}"})	
	public ResponseEntity <?> delete(@PathVariable long id) {
		
	   return emailRepository.findById(id)
	           .map(record -> {
	        	   emailRepository.deleteById(id);
	               return ResponseEntity.ok().build();
	           }).orElse(ResponseEntity.notFound().build());
	} 
}
