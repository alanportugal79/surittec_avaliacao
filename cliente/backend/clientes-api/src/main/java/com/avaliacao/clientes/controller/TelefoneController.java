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
import com.avaliacao.clientes.model.Telefone;
import com.avaliacao.clientes.repository.TelefoneRepository;

@CrossOrigin
@RestController
@RequestMapping("/telefones")
public class TelefoneController {

	@Autowired
	private TelefoneRepository telefoneRepository;	
	
	
	@GetMapping(value="/{id_cliente}")
	public List<Telefone> listar(@PathVariable("id_cliente") long idCliente) {
		
		List<Telefone> r = new ArrayList<>();
		for (Telefone t : telefoneRepository.findAll()) {
			if (t.getId_cliente() == idCliente) {
				r.add(t);
			}
		}
		return r;
	}
	
	@PostMapping
	public Telefone adicionar(@RequestBody Telefone telefone) {		
		return telefoneRepository.save(telefone);
	}
	
	@Transactional
	@CrossOrigin
	@PostMapping("/varios/{id_cliente}")
	public ResponseEntity<ApiRetorno> adicionarVarios(
			@PathVariable("id_cliente") long idCliente, 
			@RequestBody List<Telefone> telefones) {
		
		ApiRetorno ret = new ApiRetorno();
		
		if (!telefones.isEmpty()) {
			
			// remover os telefones já salvo se houver, para não duplicar com a lista atualizada
			
			for (Telefone t : telefoneRepository.findAll()) {
				if (t.getId_cliente() == idCliente) {
					telefoneRepository.delete(t);
				}
			}
			
			telefones.forEach(tel -> {
				telefoneRepository.save(tel);
			});
			
			ret.setErro(false);
			ret.setMensagem("Telefoens salvo com sucesso");
			ret.setDados(null);
			return ResponseEntity.ok().body(ret);
		} else {
			ret.setErro(true);
			ret.setMensagem("Não há telefones para salvar");
			ret.setDados(null);
			return ResponseEntity.ok().body(ret);
		}
	}
	
	@PutMapping(value="/{id}")
	public ResponseEntity<Telefone> editar(@PathVariable("id") long id, @RequestBody Telefone telefone) {
		
		return telefoneRepository.findById(id)
				.map(registro -> {
					registro.setNumero(telefone.getNumero());
					registro.setTipo(telefone.getTipo());
					Telefone atualizado = telefoneRepository.save(registro);
					return ResponseEntity.ok().body(atualizado);
				}).orElse(ResponseEntity.notFound().build());
	}
	
	@DeleteMapping(path ={"/{id}"})
	public ResponseEntity <?> delete(@PathVariable long id) {
		
		return telefoneRepository.findById(id)
	           .map(record -> {
	        	   telefoneRepository.deleteById(id);
	               return ResponseEntity.ok().build();
	           }).orElse(ResponseEntity.notFound().build());
	} 
}
